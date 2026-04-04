import { NextResponse } from 'next/server';
import { scrapeJobWithBrowser } from '@/lib/scraper/browser';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Vui lòng cung cấp URL.' }, { status: 400 });
    }

    console.log(`[API Browser Scrape] Initiating for: ${url}`);
    
    try {
      const data = await scrapeJobWithBrowser(url);
      return NextResponse.json({ success: true, data });
    } catch (scrapeError: any) {
      console.error("[API Browser Scrape] Failure:", scrapeError.message);
      return NextResponse.json({ 
        error: `Browser Scraper failed: ${scrapeError.message}` 
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: 'Định dạng request không hợp lệ.' }, { status: 400 });
  }
}
