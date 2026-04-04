import { GoogleGenerativeAI } from '@google/generative-ai';
import { MasterBlock } from '../data/master-cv';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export async function analyzeJD(rawJDText: string, modelName: string = "gemini-3.1-flash-lite-preview") {
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { responseMimeType: "application/json" }
  });
  
  const prompt = `
Bạn là một chuyên gia tuyển dụng IT và Pháp lý hàng đầu.
Hãy đọc kỹ đoạn mô tả công việc (Job Description) thô sau đây và trích xuất thông tin quan trọng.

NHIỆM VỤ QUAN TRỌNG:
1. Phải xác định đúng "Domain" (Lĩnh vực chính). Nếu JD là Chăm sóc khách hàng (CS) nhưng có nhắc đến phần mềm, hãy vẫn ghi Domain là CUSTOMER_SERVICE.
2. Từ khóa IT chính: Mobile App, Software Development, Backend, Frontend, DevOps.

RAW JD TEXT:
"""
${rawJDText}
"""

Hãy trả về CHÍNH XÁC cấu trúc JSON theo schema sau (không thêm bất kỳ metadata nào khác):
{
  "requiredSkills": ["skill 1", "skill 2"],
  "niceToHaveSkills": ["skill 1"],
  "seniority": "Junior | Mid-level | Senior | Lead | Manager",
  "keyResponsibilities": ["task 1", "task 2"],
  "domain": "IT | LEGAL | CUSTOMER_SERVICE | SALES | OTHER",
  "languageRequirements": ["English", "Vietnamese"]
}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function matchAndSuggestJobs(jdAnalysisObj: any, masterBlocks: MasterBlock[], modelName: string = "gemini-3.1-flash-lite-preview") {
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Bạn là hệ thống Applicant Tracking System (ATS) phân tích CV cực kỳ khắt khe nhưng có tầm nhìn sâu rộng về Software Architecture.
Ứng viên của bạn có hồ sơ chuyên sâu về IT / Phần mềm / Mobile App (đặc biệt là Cross-platform).

JD YÊU CẦU: ${JSON.stringify(jdAnalysisObj, null, 2)}
DỮ LIỆU MASTER CV: ${JSON.stringify(masterBlocks, null, 2)}

LUẬT CHẤM ĐIỂM (STRICT RULES & TRANSFERABLE HEURISTICS):
1. Domain Match: Nếu JD Domain là IT/Software, điểm này có thể cao. Nếu JD Domain là CUSTOMER_SERVICE, SALES hoặc OTHER mà Master CV lại là IT, thì Domain Match PHẢI DƯỚI 20.
2. Tổng điểm Match Score: Nếu Domain Match thấp, tổng điểm KHÔNG ĐƯỢC VƯỢT QUÁ 40.
3. Cross-Platform to Native Equivalence (QUAN TRỌNG): 
   - Lập trình là tư duy giải quyết vấn đề, không phải rập khuôn syntax. 
   - Nếu JD yêu cầu Native (Android/Kotlin/Java hoặc iOS/Swift/Objective-C), nhưng Master CV thể hiện kinh nghiệm sâu sắc về Cross-Platform (React Native, Flutter, TypeScript) KÈM THEO tư duy nền tảng tốt (Clean Architecture, SOLID, Design Patterns, State Management, API/Network Integration, Mobile Performance Optimization), hãy ĐÁNH GIÁ CAO khả năng đáp ứng.
   - Không đánh trượt ứng viên chỉ vì thiếu keyword Native. Chỉ trừ một lượng điểm nhỏ (10-15%) ở mục Skills Match cho thời gian ramp-up (làm quen syntax), nhưng phải cho điểm cao ở mục Experience Match nếu tư duy và độ phức tạp của dự án tương đương.
4. Chuyên môn: Chỉ các job về Mobile App, Software Development mới được điểm cao (>75).

Phân tích toàn diện và trả về JSON chuẩn:
{
  "matchScore": 0, // Integer 0-100.
  "matchBreakdown": {
    "skillsMatch": 0,
    "experienceMatch": 0,
    "domainMatch": 0
  },
  "missingSkills": ["kỹ năng bắt buộc JD có mà Master CV chưa thể hiện rõ (ví dụ: cần học thêm Swift syntax)"],
  "strongPoints": ["điểm mạnh thực sự match hoặc các kỹ năng tư duy cốt lõi có thể transfer (chuyển đổi) sang JD này"],
  "recommendation": "Giải thích chi tiết (dưới 60 từ) tại sao match hay không match. Nhấn mạnh vào việc tư duy kiến trúc và kinh nghiệm xử lý logic của ứng viên có thể bù đắp cho việc thiếu framework specific như thế nào.",
  "shouldApply": false
}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function selectLegoBlocks(jdAnalysisObj: any, masterBlocks: MasterBlock[], modelName: string = "gemini-3.1-flash-lite-preview") {
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Bạn là một Technical Curator. Nhiệm vụ của bạn là chọn ra các "khối Lego" (Master Blocks) tốt nhất từ bộ sưu tập của ứng viên để ứng tuyển vào công việc này.

JD PHÂN TÍCH: ${JSON.stringify(jdAnalysisObj, null, 2)}
DANH SÁCH KHỐI LEGO: ${JSON.stringify(masterBlocks.map(b => ({ id: b.id, category: b.category, variant: b.variant, keywords: b.keywords, domain: b.domain })), null, 2)}

LUẬT CHỌN LỌC:
1. SUMMARY: Chọn duy nhất 1 khối Summary phù hợp nhất với Seniority và Domain.
2. SKILLS: Chọn khối Skills bao quát nhất.
3. PROJECTS: Chọn đúng 3-4 Project quan trọng nhất, có keywords trùng khớp nhiều nhất với JD. 
4. EDUCATION: Luôn luôn bao gồm khối có variant 'Education'.
5. PERSONAL_INFO & TITLE: Luôn luôn bao gồm các khối này để có thông tin liên hệ và tiêu đề.

Trả về JSON:
{
  "selectedBlockIds": ["id1", "id2", "id3", "id4"],
  "reasoning": "Giải thích ngắn gọn tại sao chọn bộ khung này."
}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function generateCV(jdAnalysisObj: any, masterBlocks: MasterBlock[], language: 'VI' | 'EN', modelName: string = "gemini-3.1-flash-lite-preview") {
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Bạn là một Chuyên gia Viết CV Cao cấp (Senior Resume Strategist).
Nhiệm vụ của bạn là lắp ráp một CV "Tailored" (May đo) dựa trên các "Khối Lego" (Master Blocks) có sẵn.

QUY TẮC BẮT BUỘC (FORBIDDEN RULES):
1. CẤM THAY ĐỔI CHỨC DANH (ROLE), TÊN CÔNG TY, TRƯỜNG HỌC, ĐỊA ĐIỂM, HOẶC NGÀY THÁNG. Các thông tin này phải được giữ nguyên 100% từ Master Blocks.
2. CẤM PHỊA (HALLUCINATE) BẤT KỲ THÔNG TIN NÀO KHÔNG CÓ TRONG MASTER BLOCKS.
3. TỐI ƯU CÂU CHỮ (ACHIEVEMENTS): Bạn chỉ được phép viết lại (Rephrase) các gạch đầu dòng (Bullet points) để lồng ghép khéo léo các từ khóa từ JD Analysis, nhưng không được làm mất đi bản chất của thành tựu gốc.
4. CHIỀU DÀI: Professional Summary phải súc tích (3-4 câu), Achievements phải tập trung vào kết quả (Result-oriented).
5. PERSONAL INFO: Trích xuất thông tin cá nhân từ các block có category 'PERSONAL_INFO'.

JD ANALYSIS (Mục tiêu): ${JSON.stringify(jdAnalysisObj)}
MASTER BLOCKS (Dữ liệu gốc): ${JSON.stringify(masterBlocks)}
NGÔN NGỮ ĐẦU RA: ${language === 'VI' ? 'Tiếng Việt' : 'English'}

Trả về JSON:
{
  "personalInfo": {
     "fullName": "Họ tên (GIỮ NGUYÊN)",
     "email": "Email (GIỮ NGUYÊN)",
     "phone": "Số điện thoại (GIỮ NGUYÊN)",
     "location": "Địa chỉ (GIỮ NGUYÊN)"
  },
  "targetJobTitle": "Chức danh công việc mục tiêu",
  "summary": "Đoạn giới thiệu bản thân 3-4 câu (Giữ nguyên phong cách của block Summary gốc nhưng tối ưu từ khóa JD)",
  "skills": ["Kỹ năng 1", "Kỹ năng 2"...],
  "experience": [
     {
        "companyOrProject": "Tên công ty (GIỮ NGUYÊN)",
        "role": "Vị trí (GIỮ NGUYÊN)",
        "achievements": ["Thành tựu 1 (Rephrased with keywords)", "Thành tựu 2"...]
     }
  ],
  "education": ["Thông tin học vấn (GIỮ NGUYÊN)"]
}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
