"use client";

import { JobScrapeForm } from '@/components/jobs/JobScrapeForm';
import { JobAnalysis } from '@/components/jobs/JobAnalysis';

export default function JobsPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Job Scraper & AI Analysis</h1>
        <p className="text-gray-500 mt-2 text-base">Hệ thống hỗ trợ cào dữ liệu từ TopCV, ITviec, CareerViet, VNWorks và tự động đánh giá mức độ tương thích hồ sơ.</p>
      </div>

      <JobScrapeForm />
      <JobAnalysis />
    </div>
  );
}
