import { chromium } from 'playwright';

export async function scrapeJobWithBrowser(url: string) {
  console.log(`[Browser Scraper] Launching Chromium for: ${url}`);
  const browser = await chromium.launch({ 
    headless: true, // Use true for production-like hidden browsing
  });
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    
    // Set a decent timeout and go to URL
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for the main content to appear (TopCV typical selectors)
    await page.waitForSelector('.job-detail-content, #job-detail, .content-job-detail', { timeout: 10000 }).catch(() => {});
    
    // Check if it's a listing page
    const isListing = url.includes('/tim-viec-lam-') || url.includes('viec-lam');
    
    const data: any = {
      title: '',
      company: '',
      location: '',
      salary: '',
      rawContent: '',
      source: 'topcv', // Default
      url,
      isListing: false,
      urls: []
    };

    if (isListing) {
      data.isListing = true;
      // Extract job URLs (TopCV listing format)
      data.urls = await page.$$eval('.job-item-2 a.title, .job-item a.title, a.job-title', (links: any[]) => 
        links.map(a => a.href).slice(0, 15)
      );
    } else {
      // Extract detailed info using page evaluation
      const detail = await page.evaluate(() => {
        const title = document.querySelector('.job-detail-info .title, .job-item-title, h1')?.textContent?.trim() || '';
        const company = document.querySelector('.company-name, .job-company-name')?.textContent?.trim() || '';
        const content = document.querySelector('.job-description, #job-detail, .job-detail-content')?.textContent?.trim() || document.body.innerText;
        return { title, company, content };
      });
      
      data.title = detail.title;
      data.company = detail.company;
      data.rawContent = detail.content;
    }

    await browser.close();
    return data;

  } catch (error) {
    console.error("[Browser Scraper] Failed:", error);
    await browser.close();
    throw error;
  }
}
