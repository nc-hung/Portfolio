"use client";

import React from 'react';
import { CVPdfTemplate } from './CVPdfTemplate';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Vì @react-pdf/renderer tương tác với window (Web API), chúng ta CẦN BẮT BUỘC bỏ qua quá trình SSR (Server-Side Rendering)
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[1100px] flex flex-col items-center justify-center bg-gray-50/50 text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-medium">Đang mount bản Preview PDF...</p>
      </div>
    ) 
  }
);

export function CVPreview({ cvData, layoutConfig }: { cvData: any, layoutConfig?: any }) {
  if (!cvData) {
    return (
      <div className="w-full h-[1100px] border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50/50">
        <p className="text-gray-400 font-medium">Bản xem trước CV (PDF) sẽ xuất hiện ở đây</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[1100px] border border-gray-200 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }} showToolbar={false}>
        <CVPdfTemplate cvData={cvData} layoutConfig={layoutConfig} />
      </PDFViewer>
    </div>
  );
}
