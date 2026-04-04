import { NextResponse } from 'next/server';
import { generatePdfBuffer } from '@/lib/pdf-generator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cvData, layoutConfig } = body;

    if (!cvData) {
      return NextResponse.json({ error: 'Thiếu CV Data.' }, { status: 400 });
    }

    try {
      const pdfBuffer = await generatePdfBuffer(cvData, layoutConfig);

      // Clean string để dùng làm tên file
      const safeTitle = (cvData.targetJobTitle || 'Generated_CV').replace(/[^a-zA-Z0-9]/g, '_');

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          // Force file download, hoặc inline view
          'Content-Disposition': `inline; filename="CV_Nguyen_Cong_Hung_${safeTitle}.pdf"`
        }
      });
    } catch (renderError: any) {
      console.error("PDF Generate Error:", renderError);
      return NextResponse.json({ error: 'Không thể kết xuất PDF: ' + renderError.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Định dạng request không hợp lệ.' }, { status: 400 });
  }
}
