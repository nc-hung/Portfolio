import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { CVPdfTemplate } from '@/components/cv/CVPdfTemplate';

export async function generatePdfBuffer(cvData: any, layoutConfig?: any): Promise<Buffer> {
  // @react-pdf/renderer chạy ở môi trường server-side NodeJS 
  // kết xuất component ra định dạng PDF stream
  const stream = await renderToStream(<CVPdfTemplate cvData={cvData} layoutConfig={layoutConfig} />);
  
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    stream.on('data', (data) => {
      buffers.push(Buffer.from(data));
    });
    stream.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on('error', reject);
  });
}
