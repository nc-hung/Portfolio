"use client";

import React from 'react';

export const CVDomTemplate = ({ cvData, id }: { cvData: any, id?: string }) => {
  if (!cvData) return null;

  return (
    <div 
      id={id}
      className="bg-white p-[40px] text-[#333] font-sans leading-normal mx-auto shadow-2xl"
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        fontFamily: "'Roboto', sans-serif" 
      }}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[28px] font-black text-[#1e293b] tracking-tight uppercase">{cvData.personalInfo?.fullName || 'NGUYEN CONG HUNG'}</h1>
        <p className="text-[14px] font-bold text-blue-600 mt-1 uppercase">{cvData.targetJobTitle || 'SOFTWARE ENGINEER'}</p>
        <div className="flex gap-4 text-[10px] text-gray-500 mt-2 font-medium">
          <span>{cvData.personalInfo?.email || 'chienthan0200@gmail.com'}</span>
          <span>|</span>
          <span>{cvData.personalInfo?.phone || '0379207086'}</span>
          <span>|</span>
          <span>{cvData.personalInfo?.location || 'District 7, Ho Chi Minh City'}</span>
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary */}
        {cvData.summary && (
          <section>
            <h2 className="text-[13px] font-black text-[#1e293b] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Professional Summary</h2>
            <p className="text-[11px] text-gray-700 leading-relaxed text-justify">{cvData.summary}</p>
          </section>
        )}

        {/* Skills */}
        {cvData.skills && cvData.skills.length > 0 && (
          <section>
            <h2 className="text-[13px] font-black text-[#1e293b] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Technical Skills</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {cvData.skills.map((skill: string, idx: number) => (
                <div key={idx} className="text-[11px] text-gray-700 flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {cvData.experience && cvData.experience.length > 0 && (
          <section>
            <h2 className="text-[13px] font-black text-[#1e293b] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Work Experience / Projects</h2>
            <div className="space-y-5">
              {cvData.experience.map((exp: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-black text-[#334155]">{exp.companyOrProject}</h3>
                    <span className="text-[10px] text-gray-400 italic">Project Reference</span>
                  </div>
                  <p className="text-[11px] font-bold text-blue-600">{exp.role}</p>
                  <ul className="space-y-1 mt-2">
                    {exp.achievements?.map((ach: string, i: number) => (
                      <li key={i} className="text-[10.5px] text-gray-700 flex items-start gap-2 pl-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="leading-relaxed">{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {cvData.achievements && cvData.achievements.length > 0 && (
          <section>
            <h2 className="text-[13px] font-black text-[#1e293b] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Notable Achievements</h2>
            <ul className="space-y-1.5">
              {cvData.achievements.map((ach: string, idx: number) => (
                <li key={idx} className="text-[10.5px] text-gray-700 flex items-start gap-2 pl-2">
                  <span className="text-amber-500 font-bold">🏆</span>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {cvData.education && cvData.education.length > 0 && (
          <section>
            <h2 className="text-[13px] font-black text-[#1e293b] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Education</h2>
            <div className="space-y-1">
              {cvData.education.map((edu: string, idx: number) => (
                <p key={idx} className="text-[11px] text-gray-700 font-medium pl-2">• {edu}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
