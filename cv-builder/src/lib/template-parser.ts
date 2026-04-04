import { GoogleGenerativeAI } from '@google/generative-ai';

// XỬ LÝ LỖI DOMMatrix: Ta sẽ loại bỏ hoàn toàn pdf-parse vì nó gây lỗi ReferenceError trong môi trường Next.js Node runtime.
// Thay vào đó, ta sẽ sử dụng trực tiếp khả năng đọc PDF siêu hạng của Gemini 1.5 Flash.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function parsePdfTemplate(pdfBuffer: Buffer, modelName: string = 'gemini-2.5-flash') {
  // 1. Chuyển đổi buffer sang base64 để gửi cho Gemini
  const base64Pdf = pdfBuffer.toString('base64');
  
  // 2. Sử dụng model Flash (hỗ trợ multimodal - đọc được PDF trực tiếp)
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Phân tích file PDF CV này và trích xuất cấu trúc layout cùng toàn bộ nội dung văn bản.
    Bạn phải trả về một chuỗi JSON hợp lệ theo schema sau (không thêm markdown \`\`\`json):
    
    {
      "layoutConfig": {
        "columns": 1 | 2,
        "hasPhoto": boolean,
        "photoPosition": "top-left" | "top-right" | "top-center" | null,
        "hasSidebar": boolean,
        "sidebarPosition": "left" | "right" | null,
        "margins": { "top": 20, "right": 20, "bottom": 20, "left": 20 },
        "headerAlignment": "left" | "center" | "right",
        "sectionOrder": ["summary", "skills", "experience", "education", "achievements"],
        "sectionSeparator": "line" | "space" | "border" | "none",
        "colorScheme": { "primary": "#...", "secondary": "#...", "background": "#ffffff", "accent": "#..." },
        "typography": { "headingFont": "Arial", "bodyFont": "Arial", "nameSize": 24, "titleSize": 14, "sectionHeaderSize": 12, "bodySize": 10, "sectionHeaderStyle": "uppercase-bold" }
      },
      "rawText": "Toàn bộ nội dung văn bản tìm thấy trong file PDF"
    }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Pdf,
          mimeType: "application/pdf"
        }
      }
    ]);

    const textResp = result.response.text() || "{}";
    const jsonStr = textResp.replace(/^```json\n?/g, '').replace(/```$/g, '').trim();
    
    const parsedData = JSON.parse(jsonStr);

    return {
      rawText: parsedData.rawText || "",
      metadata: {},
      layoutConfig: parsedData.layoutConfig
    };
  } catch (error: any) {
    console.error("[Gemini PDF Parse] Failed:", error);
    throw new Error("AI không thể giải mã file PDF này: " + error.message);
  }
}
