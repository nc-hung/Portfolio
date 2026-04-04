import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parsePdfTemplate } from '@/lib/template-parser';
import { prisma } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let rawText = '';
    let layoutConfig = null;
    let modelName = 'gemini-2.5-flash';
    let profileId = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const text = formData.get('text') as string;
      const requestedModel = formData.get('modelName') as string;
      const pid = formData.get('profileId') as string;
      if (requestedModel) modelName = requestedModel;
      if (pid) profileId = pid;

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await parsePdfTemplate(buffer, modelName);
        rawText = result.rawText || '';
        layoutConfig = result.layoutConfig;
      } else if (text) {
        rawText = text;
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      rawText = body.rawText || body.text || '';
      if (body.modelName) modelName = body.modelName;
      if (body.profileId) profileId = body.profileId;
    }

    if (!rawText) {
      return NextResponse.json({ error: 'Cung cấp ít nhất 1 file PDF hoặc đoạn văn bản.' }, { status: 400 });
    }

    // Use Gemini to structure the raw text into Lego Blocks
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Bạn là một chuyên gia phân tích dữ liệu CV. Hãy bóc tách đoạn văn bản sau thành các khối Master Blocks (Lego Blocks).
      TRẢ VỀ JSON hợp lệ theo schema (không có markdown \`\`\`json):
      {
        "blocks": [
          {
            "category": "TITLE" | "SUMMARY" | "SKILL" | "PROJECT" | "EDUCATION" | "PERSONAL_INFO" | "ACHIEVEMENT",
            "variant": "Tên gợi nhớ (vd: Resume Header, Tech Stack, Cloud Project...)",
            "content": "Nội dung cho khối này (Nếu là PERSONAL_INFO hãy trích xuất obj: {name, email, phone, address, github, linkedin, website})",
            "keywords": ["tag1", "tag2"],
            "language": "VI" | "EN"
          }
        ]
      }

      QUY TẮC QUAN TRỌNG:
      1. PERSONAL_INFO: Chứa thông tin cá nhân.
      2. PROJECT: Bóc tách từng mốc kinh nghiệm làm việc (Experience) thành một khối riêng.
      3. SKILL: Gom nhóm các kỹ năng theo loại (vd: Frontend, Backend, DevOps).
      4. ACHIEVEMENT: Các giải thưởng, chứng chỉ hoặc thành tích nổi bật.
      5. Giữ nguyên văn các thông tin kỹ thuật quan trọng.

      TEXT CV:
      """
      ${rawText}
      """
    `;

    const result = await model.generateContent(prompt);
    const textResp = result.response.text();

    // High-resilience JSON extraction: Find the outer-most curly braces
    const firstBrace = textResp.indexOf('{');
    const lastBrace = textResp.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("AI không trả về đúng định dạng JSON. Phản hồi: " + textResp.substring(0, 100));
    }

    const jsonStr = textResp.substring(firstBrace, lastBrace + 1);
    const structuredData = JSON.parse(jsonStr);

    let savedCount = 0;

    // Save blocks to DB
    if (structuredData.blocks && Array.isArray(structuredData.blocks)) {
      for (const block of structuredData.blocks) {
        try {
          // Special handling for PERSONAL_INFO: update underlying profile
          if (block.category === 'PERSONAL_INFO' && profileId) {
            const info = typeof block.content === 'object' ? block.content : {};
            await prisma.profile.update({
              where: { id: profileId },
              data: {
                email: info.email || undefined,
                phone: info.phone || undefined,
                address: info.address || undefined,
                github: info.github || undefined,
                linkedin: info.linkedin || undefined,
                website: info.website || undefined
              }
            });
            console.log(`[Extract] Updated profile metadata for ${profileId}`);
          }

          await prisma.masterCVBlock.create({
            data: {
              category: block.category,
              variant: block.variant,
              content: typeof block.content === 'string' ? block.content : JSON.stringify(block.content),
              keywords: Array.isArray(block.keywords) ? block.keywords.join(', ') : (block.keywords || ''),
              language: block.language || 'VI',
              profileId: profileId || undefined
            }
          });
          savedCount++;
          console.log(`[Extract] Saved block: ${block.category} - ${block.variant}`);
        } catch (e: any) {
          console.error(`[Extract] Failed to save block ${block.category}:`, e.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        savedCount,
        blocks: structuredData.blocks,
        layoutConfig
      }
    });

  } catch (error: any) {
    console.error("Extract Error:", error);
    return NextResponse.json({ 
      success: false,
      error: 'Lỗi khi giải mã CV: ' + error.message 
    }, { status: 500 });
  }
}
