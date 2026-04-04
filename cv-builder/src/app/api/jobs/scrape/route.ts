import { NextResponse } from 'next/server';
import { scrapeJob } from '@/lib/scraper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Vui lòng cung cấp URL.' }, { status: 400 });
    }

    try {
      const jobData = await scrapeJob(url);
      return NextResponse.json({ success: true, data: jobData });
    } catch (scrapeError: any) {
      return NextResponse.json({ error: scrapeError.message || 'Lỗi khi bóc tách dữ liệu.' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Định dạng request không hợp lệ.' }, { status: 400 });
  }
}
