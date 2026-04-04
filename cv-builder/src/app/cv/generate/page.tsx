"use client";

import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { CVPreview } from '@/components/cv/CVPreview';
import { CVDomTemplate } from '@/components/cv/CVDomTemplate';
import { 
  Loader2, Download, Wand2, ArrowLeft, FileText, AlertCircle, Sparkles, 
  Image as ImageIcon, CheckCircle2, ChevronRight, Layers, Box, Settings, ArrowRight
} from 'lucide-react';
import { toPng } from 'html-to-image';
import Link from 'next/link';

type AssemblyState = 'IDLE' | 'SELECTING' | 'SELECTED' | 'TAILORING' | 'FINISHED';

export default function CVGeneratePage() {
  const { currentJdAnalysis, currentJobData, aiModel, setAiModel, quotas, trackUsage } = useAppStore();
  const [language, setLanguage] = useState<'VI' | 'EN'>('VI');
  const [assemblyState, setAssemblyState] = useState<AssemblyState>('IDLE');
  
  // Selection Phase
  const [selectedBlocks, setSelectedBlocks] = useState<any[]>([]);
  const [selectionReasoning, setSelectionReasoning] = useState('');
  
  // Final Phase
  const [generatedCV, setGeneratedCV] = useState<any | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const resetAll = () => {
    setAssemblyState('IDLE');
    setSelectedBlocks([]);
    setGeneratedCV(null);
    setError('');
  };

  // 1. PHASE ONE: Curation & Selection
  const handleSelectBlocks = async () => {
    if (!currentJdAnalysis) {
      setError('❌ Không tìm thấy dữ liệu JD Analysis.');
      return;
    }
    
    setAssemblyState('SELECTING');
    setError('');

    try {
      const res = await fetch('/api/cv/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdAnalysis: currentJdAnalysis, modelName: aiModel })
      });
      const result = await res.json();
      
      if (!res.ok || !result.success) throw new Error(result.error);
      
      trackUsage(aiModel);
      setSelectedBlocks(result.selectedBlocks);
      setSelectionReasoning(result.reasoning);
      setAssemblyState('SELECTED');
    } catch (err: any) {
      setError(`AI Selection Error: ${err.message}`);
      setAssemblyState('IDLE');
    }
  };

  // 2. PHASE TWO: Tailoring & Rewriting
  const handleTailorCV = async () => {
    setAssemblyState('TAILORING');
    setError('');

    try {
      const res = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jdAnalysis: currentJdAnalysis, 
          language, 
          modelName: aiModel,
          blocks: selectedBlocks // AI can use these as base
        })
      });
      const result = await res.json();
      
      if (!res.ok || !result.success) throw new Error(result.error);
      
      trackUsage(aiModel);
      setGeneratedCV(result.data);
      setAssemblyState('FINISHED');
    } catch (err: any) {
      setError(`AI Tailoring Error: ${err.message}`);
      setAssemblyState('SELECTED');
    }
  };

  const currentQuota = quotas[aiModel] || { used: 0, limit: 100 };

  const handleDownload = async () => {
    if (!generatedCV) return;
    setIsDownloading(true);
    try {
      const res = await fetch('/api/cv/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: generatedCV })
      });
      if (!res.ok) throw new Error('Download failed from Backend Engine');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_Lego_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("❌ Lỗi mạng khi tạo PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportPng = async () => {
    const node = document.getElementById('cv-capture-area');
    if (!node) return;
    setIsExportingPng(true);
    try {
      const dataUrl = await toPng(node, { quality: 1, pixelRatio: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `CV_LEGO_IMAGE_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG Error:", err);
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-6">
          <Link href="/jobs" className="p-3 border border-gray-100 rounded-2xl hover:bg-white bg-gray-50 transition-all hover:shadow-md text-gray-400 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-blue-600" /> LEGO CV ASSEMBLY
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Architect Mode</span>
               <div className="h-1 w-1 bg-gray-300 rounded-full" />
               <p className="text-gray-500 text-sm font-medium">Lắp ráp các khối chuyên môn phù hợp nhất cho {currentJobData?.title || 'Job'}</p>
            </div>
          </div>
        </div>

        {(assemblyState === 'FINISHED' && generatedCV) && (
          <div className="flex gap-3">
            <button 
              onClick={handleDownload} disabled={isDownloading}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-900 text-gray-900 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-sm"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF FILE
            </button>
            <button 
              onClick={handleExportPng} disabled={isExportingPng}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-200"
            >
              {isExportingPng ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4 text-blue-400" />}
              PRINT PNG
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: The Assembler Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl ring-1 ring-black/5">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Settings className="w-4 h-4" /> Assembly Controls
            </h3>
            
            <div className="space-y-6">
               {/* JD Context */}
               <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Target Job Context</p>
                  <h4 className="font-bold text-lg leading-tight line-clamp-1">{currentJobData?.title || 'Unknown'}</h4>
                  <p className="text-sm font-medium text-blue-100 mt-1">{currentJobData?.company || 'N/A'}</p>
               </div>

               {/* Engine Config */}
               <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">AI Core Engine</label>
                    <select 
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {Object.keys(quotas).map(m => (
                        <option key={m} value={m}>{m.toUpperCase()} ({quotas[m].limit - quotas[m].used})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Language Dialect</label>
                    <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                       <button onClick={() => setLanguage('VI')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${language === 'VI' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>VIETNAMESE</button>
                       <button onClick={() => setLanguage('EN')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${language === 'EN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>ENGLISH</button>
                    </div>
                  </div>
               </div>

               {error && (
                 <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-rose-700 leading-relaxed">{error}</p>
                 </div>
               )}

               {/* Assembly Stepper Actions */}
               <div className="pt-4 space-y-3">
                  {assemblyState === 'IDLE' && (
                    <button 
                      onClick={handleSelectBlocks}
                      className="w-full bg-gray-900 hover:bg-black text-white p-5 rounded-3xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                       <Box className="w-5 h-5 text-blue-400" /> INITIATE SELECTION
                    </button>
                  )}

                  {assemblyState === 'SELECTING' && (
                    <div className="w-full bg-blue-50 border-2 border-blue-100 border-dashed p-6 rounded-3xl flex flex-col items-center justify-center gap-3">
                       <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                       <p className="text-xs font-black text-blue-800 uppercase tracking-widest">AI Curation in Progress...</p>
                    </div>
                  )}

                  {assemblyState === 'SELECTED' && (
                    <div className="space-y-3">
                       <button 
                         onClick={handleTailorCV}
                         className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-3xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-100"
                       >
                          <Wand2 className="w-5 h-5 text-amber-300" /> TAILOR FINAL CV
                       </button>
                       <button onClick={resetAll} className="w-full text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest py-2">Start Over</button>
                    </div>
                  )}

                  {assemblyState === 'TAILORING' && (
                    <div className="w-full bg-amber-50 border-2 border-amber-100 border-dashed p-6 rounded-3xl flex flex-col items-center justify-center gap-3">
                       <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                       <p className="text-xs font-black text-amber-800 uppercase tracking-widest">Assembling Final LEGO Pieces...</p>
                    </div>
                  )}

                  {assemblyState === 'FINISHED' && (
                    <button 
                      onClick={resetAll}
                      className="w-full bg-green-50 border-2 border-green-200 text-green-700 p-5 rounded-3xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                    >
                       <CheckCircle2 className="w-5 h-5" /> RE-ASSEMBLE
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Assembly Board / Result */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* INITIAL BOARD */}
           {assemblyState === 'IDLE' && (
             <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[40px] h-[600px] flex flex-col items-center justify-center text-gray-400">
                <Box className="w-16 h-16 mb-4 opacity-10" />
                <h3 className="font-bold text-lg mb-1">LEGO BOARD EMPTY</h3>
                <p className="text-sm">Initiate selection to see which building blocks match this JD</p>
             </div>
           )}

           {/* SELECTION PREVIEW BOARD */}
           {(assemblyState === 'SELECTED' || assemblyState === 'TAILORING') && (
             <div className="space-y-6 animate-in slide-in-from-right-12 duration-700">
                <div className="flex items-center gap-3 px-4">
                   <h3 className="text-lg font-black text-gray-900">AI Block Selection Results</h3>
                   <div className="h-px flex-1 bg-gray-100" />
                </div>

                <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
                   <div className="p-3 bg-white rounded-2xl shadow-sm"><Sparkles className="w-6 h-6 text-blue-600" /></div>
                   <div>
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Assembly Reasoning</h4>
                      <p className="text-sm font-medium text-blue-900 italic leading-relaxed">"{selectionReasoning}"</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {selectedBlocks.map((block, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                         <div>
                            <div className="flex items-center justify-between mb-4">
                               <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-widest">{block.category}</span>
                               <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                            <h5 className="font-bold text-gray-900 mb-2 truncate">{block.variant}</h5>
                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                              {typeof block.content === 'string' ? block.content : JSON.stringify(block.content)}
                            </p>
                         </div>
                         <div className="mt-4 flex flex-wrap gap-1">
                            {block.keywords.slice(0, 3).map((k: string, i: number) => (
                               <span key={i} className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">#{k}</span>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* FINAL PDF RESULT */}
           {assemblyState === 'FINISHED' && generatedCV && (
              <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-8">
                 <div className="flex items-center gap-3 px-4">
                    <h3 className="text-lg font-black text-gray-900">Final Assembly Preview</h3>
                    <div className="h-px flex-1 bg-gray-100" />
                 </div>

                 {/* Preview */}
                 <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden p-10 ring-1 ring-black/5">
                    <CVPreview cvData={generatedCV} />
                 </div>
              </div>
           )}

        </div>
      </div>

      {/* Hidden capture area for PNG export */}
      {generatedCV && (
        <div style={{ position: 'absolute', left: '-9999px', top: '0', zIndex: -1 }}>
          <div id="cv-capture-area" className="bg-white">
            <CVDomTemplate cvData={generatedCV} />
          </div>
        </div>
      )}
    </div>
  );
}
