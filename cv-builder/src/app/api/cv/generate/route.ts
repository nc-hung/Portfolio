import { NextResponse } from 'next/server';
import { generateCV } from '@/lib/gemini';
import { masterCVBlocks } from '@/data/master-cv';

export async function POST(req: Request) {
  try {
    const { jdAnalysis, language, modelName } = await req.json();

    if (!jdAnalysis) {
      return NextResponse.json({ error: 'Bắt buộc phải có jdAnalysis để generate CV.' }, { status: 400 });
    }

    const targetLang = language && ['VI', 'EN'].includes(language.toUpperCase()) ? language.toUpperCase() : 'VI';

    try {
      // MASTER CV SETTINGS: Lọc khối Lego theo Domain (Chủ đề)
      // Nếu JD là IT, chỉ lấy các khối IT + GENERAL
      // Nếu JD là LEGAL, chỉ lấy các khối LEGAL + GENERAL
      const jdDomain = jdAnalysis.domain || 'GENERAL';
      const filteredBlocks = masterCVBlocks.filter(block => 
        block.domain === jdDomain || block.domain === 'GENERAL'
      );

      // Nếu filter xong không còn khối nào (ví dụ user chưa soạn Legal), 
      // fallback về GENERAL để tránh crash hoặc thông báo cho AI biết
      const finalBlocks = filteredBlocks.length > 0 ? filteredBlocks : masterCVBlocks;

      // Gọi Gemini để lắp ráp CV từ MasterBlocks phù hợp nhất với jdAnalysis
      const cvData = await generateCV(jdAnalysis, finalBlocks, targetLang as 'VI' | 'EN', modelName);

      return NextResponse.json({
        success: true,
        data: cvData,
        message: 'Đã tạo xong CV theo yêu cầu JD!'
      });
    } catch (aiError: any) {
      console.error("AI Error generating CV:", aiError);
      return NextResponse.json({ error: 'Lỗi AI lắp ráp CV: ' + aiError.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Định dạng request không hợp lệ.' }, { status: 400 });
  }
}
