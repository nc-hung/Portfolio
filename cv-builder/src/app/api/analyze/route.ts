import { NextResponse } from 'next/server';
import { analyzeJD, matchAndSuggestJobs } from '@/lib/gemini';
import { masterCVBlocks } from '@/data/master-cv';

export async function POST(req: Request) {
  try {
    const { rawContent, modelName } = await req.json();

    if (!rawContent) {
      return NextResponse.json({ error: 'Cần cung cấp rawContent (Mô tả công việc).' }, { status: 400 });
    }

    // Tối ưu Quota: Chặt bớt ký tự thừa nếu JD quá dài (Limit 12k chars ~ 3k tokens)
    const optimizedContent = rawContent.length > 12000 
      ? rawContent.substring(0, 12000) + "... [Truncated for Quota Optimization]"
      : rawContent;

    try {
      // 1. Phân tích JD thành các requirements & skills
      const jdAnalysis = await analyzeJD(optimizedContent, modelName);

      // 2. MASTER CV FILTERING: Chấm điểm dựa trên "Khối Lego" cùng chủ đề
      const jdDomain = jdAnalysis.domain || 'GENERAL';
      const relevantBlocks = masterCVBlocks.filter(b => b.domain === jdDomain || b.domain === 'GENERAL');

      // 3. Chấm điểm Match Score với Master CV (chỉ dùng các blocks liên quan)
      const matchData = await matchAndSuggestJobs(jdAnalysis, relevantBlocks, modelName);

      return NextResponse.json({
        success: true,
        data: {
          jdAnalysis,
          matchData
        }
      });
    } catch (aiError: any) {
      console.error("AI Error:", aiError);
      return NextResponse.json({ error: 'Lỗi trong quá trình AI phân tích: ' + aiError.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Định dạng request không hợp lệ.' }, { status: 400 });
  }
}
