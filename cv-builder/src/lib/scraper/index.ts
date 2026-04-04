import * as cheerio from 'cheerio';
import { fetchHtml, cleanText } from './utils';
import { BLOCKED_SITES } from '../constants';

export async function scrapeJob(url: string) {
  // Check blacklist
  if (BLOCKED_SITES.some(site => url.includes(site))) {
    throw new Error("Trang web này không được hỗ trợ (bị cấm theo request của bạn).");
  }

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  // GLOBAL CLEANUP: Remove noise before parsing
  $('script, style, link, meta, noscript, iframe, .banner-marketing-fixed-sidebar').remove();

  // Detect if it's a listing/search page
  const isListing = 
    url.includes('tim-viec-lam') || 
    url.includes('/it-jobs') || 
    url.includes('/tim-viec-lam-') ||
    url.includes('/?ref=') || // User's home page URL example
    $('a[href*="/viec-lam/"]').length > 8 ||
    $('.job-item').length > 5;

  if (isListing) {
    const jobLinks: string[] = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      if (
        (href.includes('/viec-lam/')) ||
        (href.includes('/it-jobs/'))
      ) {
         try {
           const fullUrl = new URL(href, url).href;
           if (!jobLinks.includes(fullUrl) && !fullUrl.includes('/tim-viec-lam')) {
             jobLinks.push(fullUrl);
           }
         } catch(e) {}
      }
    });

    return { 
      isListing: true, 
      urls: jobLinks.slice(0, 15), // Reduced limit for better quality/speed
      source: url.includes('topcv') ? 'topcv' : 'listing'
    };
  }

  // Site-specific detail scraping
  try {
    let result: any;
    if (url.includes('itviec.com')) result = await scrapeItViecFromHtml(url, $);
    else if (url.includes('careerviet.vn')) result = await scrapeCareerVietFromHtml(url, $);
    else if (url.includes('topcv.vn')) result = await scrapeTopCVFromHtml(url, $);
    else if (url.includes('vietnamworks.com')) result = await scrapeVietnamWorksFromHtml(url, $);
    else result = await scrapeGenericFromHtml(url, $);

    return { ...result, isListing: false };
  } catch (error: any) {
    console.error("Scrape error:", error);
    throw new Error(`Scraping failed: ${error.message}`);
  }
}

/**
 * Generates Topic-based search URLs for TopCV & others
 */
export function getTopicSearchUrl(topicId: string): string {
  const TOPIC_URLS: Record<string, string> = {
    'it': 'https://www.topcv.vn/tim-viec-lam-it-phan-mem-c10131',
    'mobile': 'https://www.topcv.vn/tim-viec-lam-it-phu-hop-mobile-v9',
    'legal': 'https://www.topcv.vn/tim-viec-lam-phap-ly-c10111',
    'sales': 'https://www.topcv.vn/tim-viec-lam-nhan-vien-kinh-doanh-c10101',
    'customer_service': 'https://www.topcv.vn/tim-viec-lam-cham-soc-khach-hang-c10102'
  };
  return TOPIC_URLS[topicId] || 'https://www.topcv.vn/viec-lam-moi-nhat';
}

// ---------------------------------------------------------
// SITE PARSERS
// Tạm thời dùng selector cơ bản, nếu fail sẽ fallback
// ---------------------------------------------------------

// ---------------------------------------------------------
// SITE PARSERS (Accepting Cheerio instance to avoid re-fetch)
// ---------------------------------------------------------

export async function scrapeItViecFromHtml(url: string, $: cheerio.CheerioAPI) {
  return {
    source: 'itviec',
    url,
    title: cleanText($('h1').first()) || cleanText($('.job-details__title')),
    company: cleanText($('.job-details__company-name')) || cleanText($('.employer-name')),
    location: cleanText($('.job-details__location')) || cleanText($('.location')),
    salary: cleanText($('.job-details__salary-info')) || cleanText($('.salary')),
    rawContent: cleanText($('.job-details__paragraph').first()) || cleanText($('.job-description')) || cleanText($('body'))
  };
}

export async function scrapeCareerVietFromHtml(url: string, $: cheerio.CheerioAPI) {
  return {
    source: 'careerviet',
    url,
    title: cleanText($('h1.job-title').first()) || cleanText($('h1')),
    company: cleanText($('.employer-name').first()),
    location: cleanText($('.location-name').first()),
    salary: cleanText($('.salary').first()),
    rawContent: cleanText($('.job-detail-content').first()) || cleanText($('body'))
  };
}

export async function scrapeTopCVFromHtml(url: string, $: cheerio.CheerioAPI) {
  return {
    source: 'topcv',
    url,
    title: cleanText($('h1.job-title')) || cleanText($('h1')) || cleanText($('.title')),
    company: cleanText($('.company-name')) || cleanText($('.title-company')),
    location: cleanText($('.box-address')) || cleanText($('.location')),
    salary: cleanText($('.salary')) || cleanText($('.title-salary')),
    rawContent: cleanText($('.job-description')) || cleanText($('.job-data')) || cleanText($('.job-detail-content')) || cleanText($('body'))
  };
}

export async function scrapeVietnamWorksFromHtml(url: string, $: cheerio.CheerioAPI) {
  return {
    source: 'vietnamworks',
    url,
    title: cleanText($('h1.job-title').first()) || cleanText($('h1')),
    company: cleanText($('.company-name').first()),
    location: cleanText($('.location').first()),
    salary: cleanText($('.salary').first()),
    rawContent: cleanText($('.job-description').first()) || cleanText($('body'))
  };
}

async function scrapeGenericFromHtml(url: string, $: cheerio.CheerioAPI) {
  $('script, style, link, meta, noscript').remove();
  return {
    source: 'manual',
    url,
    title: cleanText($('h1').first()) || 'Unknown Title',
    company: 'Unknown Company',
    location: 'Unknown Location',
    salary: 'Unknown',
    rawContent: cleanText($('body'))
  };
}

// Deprecated: Internal legacy wrappers
export async function scrapeJobDetailOnly(url: string) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  if (url.includes('topcv')) return scrapeTopCVFromHtml(url, $);
  return scrapeGenericFromHtml(url, $);
}
