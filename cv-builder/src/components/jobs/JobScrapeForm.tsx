"use client";

import { useState } from 'react';
import { Search, Loader2, AlertCircle, ScanLine, FileText, Globe, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

type Mode = 'AUTO' | 'MANUAL';

export function JobScrapeForm() {
  const [mode, setMode] = useState<Mode>('AUTO');
  const [urls, setUrls] = useState('');
  const [manualText, setManualText] = useState('');
  const [isBrowserMode, setIsBrowserMode] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    setLoadingState, 
    setCurrentJob, 
    setAnalysis, 
    resetJobProcess, 
    isScraping, 
    isAnalyzing,
    aiModel,
    setAiModel,
    quotas,
    trackUsage,
    analyzeStep,
    setAnalyzeStep,
    analyzeStatus,
    addScrapedJob,
    updateScrapedJobWithAnalysis,
    setAbortController,
    cancelScraping
  } = useAppStore();

  const [discoveryProgress, setDiscoveryProgress] = useState({ current: 0, total: 0 });

  const topics = [
    { id: 'it', name: 'IT / Software', icon: '💻' },
    { id: 'mobile', name: 'Mobile Dev', icon: '📱' },
    { id: 'legal', name: 'Legal / Luật', icon: '⚖️' },
    { id: 'sales', name: 'Sales / Biz', icon: '💰' },
  ];

  const triggerAnalyze = async (job: any) => {
    setLoadingState('analyze', true);
    try {
      setAnalyzeStep('matching', '⚖️ Đang so sánh & tính điểm Match...');
      
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawContent: job.rawContent, modelName: aiModel })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error("Server returned non-JSON response:", text.substring(0, 500));
        throw new Error(`Server Error (${res.status}): Phản hồi không đúng định dạng JSON.`);
      }

      const result = await res.json();
      
      if (!res.ok || !result.success) throw new Error(result.error);
      
      trackUsage(aiModel);
      setAnalysis(result.data.jdAnalysis, result.data.matchData);
      
      // PERSIST Analysis to history list
      updateScrapedJobWithAnalysis(job.title, result.data.jdAnalysis, result.data.matchData);
      
      setAnalyzeStep('finished', '✅ Hoàn tất phân tích!');
    } catch (err: any) {
      const isQuota = err.message.includes('429') || err.message.toLowerCase().includes('quota');
      setError(isQuota ? `⚠️ QUOTA LIMIT: Hãy đợi ~60s hoặc đổi Model.` : `AI Error: ${err.message}`);
      setAnalyzeStep('idle');
    } finally {
      setLoadingState('analyze', false);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    
    if (mode === 'AUTO' && urlList.length === 0) return;
    if (mode === 'MANUAL' && !manualText.trim()) return;
    
    setError('');
    resetJobProcess();

    if (mode === 'AUTO') {
      setLoadingState('scrape', true);
      
      const firstUrl = urlList[0];
      setAnalyzeStep('scraping', `🌐 Đang kết nối tới: ${firstUrl.substring(0, 30)}...`);
      
      try {
        const scrapeEndpoint = isBrowserMode ? '/api/jobs/scrape-browser' : '/api/jobs/scrape';
        const res = await fetch(scrapeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: firstUrl })
        });
        const result = await res.json();

        if (res.ok && result.success && result.data.isListing) {
          const discoveredUrls = result.data.urls;
          setDiscoveryProgress({ current: 0, total: discoveredUrls.length });
          setAnalyzeStep('scraping', `🔍 Tìm thấy ${discoveredUrls.length} Job tiềm năng. Bắt đầu cào hàng loạt...`);
          
          let index = 1;
          for (const discoveredUrl of discoveredUrls) {
             setDiscoveryProgress({ current: index, total: discoveredUrls.length });
             setAnalyzeStep('scraping', `🌐 [${index}/${discoveredUrls.length}] Đang quét: ${discoveredUrl.substring(0, 30)}...`);
             
             const detRes = await fetch(isBrowserMode ? '/api/jobs/scrape-browser' : '/api/jobs/scrape', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ url: discoveredUrl })
             });
             const detResult = await detRes.json();
             
             if (detRes.ok && detResult.success) {
               addScrapedJob(detResult.data);
               setCurrentJob(detResult.data);
               
               await new Promise(r => setTimeout(r, 1500));
               
               try {
                 await triggerAnalyze(detResult.data);
                 setAnalyzeStep('finished', `✅ Đã quét xong Job ${index}. Nghỉ bảo vệ Quota...`);
                 await new Promise(r => setTimeout(r, 3000)); 
               } catch (aiErr: any) {
                 if (aiErr.message.includes('429')) {
                    setAnalyzeStep('idle', '⚠️ Quota Hit! Nghỉ 45s...');
                    await new Promise(r => setTimeout(r, 45000));
                 }
               }
             }
             index++;
          }
          setLoadingState('scrape', false);
          return;
        }

        // SINGLE or MANUAL BULK MODE
        for (const currentUrl of urlList) {
          if (currentUrl.includes('vieclam24h')) {
            setError(`❌ Bỏ qua: ${currentUrl} (Bị chặn)`);
            continue;
          }

          const controller = new AbortController();
          setAbortController(controller);
          
          const detRes = await fetch(isBrowserMode ? '/api/jobs/scrape-browser' : '/api/jobs/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: currentUrl }),
            signal: controller.signal
          });
          const detResult = await detRes.json();
          
          if (detRes.ok && detResult.success) {
            setCurrentJob(detResult.data);
            addScrapedJob(detResult.data);
            await new Promise(r => setTimeout(r, 2000));
            try {
              await triggerAnalyze(detResult.data);
              setAnalyzeStep('finished', `✅ Nghỉ 5s bảo vệ Quota...`);
              await new Promise(r => setTimeout(r, 5000));
            } catch (aiErr: any) {
              if (aiErr.message?.includes('429')) {
                 setAnalyzeStep('idle', '⚠️ Quota Hit! Tạm dừng 30s...');
                 await new Promise(r => setTimeout(r, 30000));
              }
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
      }
      setLoadingState('scrape', false);
    } else {
      // Manual Mode
      const mockJob = {
        title: 'Job mẫu từ nội dung thủ công',
        company: 'Unknown',
        location: 'Manual',
        source: 'manual',
        rawContent: manualText
      };
      setCurrentJob(mockJob);
      setAnalyzeStep('parsing_jd', '🧠 AI bắt đầu phân tích...');
      triggerAnalyze(mockJob);
    }
  };

  const handleTopicDiscovery = async (topicId: string) => {
    const TOPIC_URLS: Record<string, string> = {
      'it': 'https://www.topcv.vn/tim-viec-lam-it-phan-mem-c10131',
      'mobile': 'https://www.topcv.vn/tim-viec-lam-it-phu-hop-mobile-v9',
      'legal': 'https://www.topcv.vn/tim-viec-lam-phap-ly-c10111',
      'sales': 'https://www.topcv.vn/tim-viec-lam-nhan-vien-kinh-doanh-c10101',
    };
    
    setUrls(TOPIC_URLS[topicId]);
    setMode('AUTO');
    setError('');
    resetJobProcess();
    setLoadingState('scrape', true);
    
    const targetUrl = TOPIC_URLS[topicId];
    setAnalyzeStep('scraping', `🌐 Đang kích hoạt Discovery Topic: ${topicId.toUpperCase()}...`);
    
    try {
      const controller = new AbortController();
      setAbortController(controller);

      const res = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal
      });
      const result = await res.json();
      
      if (res.ok && result.success && result.data.isListing) {
        const discoveredUrls = result.data.urls;
        setDiscoveryProgress({ current: 0, total: discoveredUrls.length });
        
        let index = 1;
        for (const discoveredUrl of discoveredUrls) {
          setDiscoveryProgress({ current: index, total: discoveredUrls.length });
          setAnalyzeStep('scraping', `🌐 [${index}/${discoveredUrls.length}] Đang quét: ${discoveredUrl.substring(0, 30)}...`);
          
          const detRes = await fetch('/api/jobs/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: discoveredUrl })
          });
          const detResult = await detRes.json();
          if (detRes.ok && detResult.success) {
            addScrapedJob(detResult.data);
            setCurrentJob(detResult.data);
            await new Promise(r => setTimeout(r, 1500));
            try {
              await triggerAnalyze(detResult.data);
              setAnalyzeStep('finished', `✅ Đã quét xong Job ${index}. Nghỉ bảo vệ Quota...`);
              await new Promise(r => setTimeout(r, 4000));
            } catch (aiErr) {}
          }
          index++;
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingState('scrape', false);
    }
  };

  const currentQuota = quotas[aiModel] || { used: 0, limit: 100 };
  const percentUsed = Math.min(100, (currentQuota.used / currentQuota.limit) * 100);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6 mb-8 border-b border-gray-50 pb-6">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">🛠️ Select AI Engine</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.keys(quotas).map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => setAiModel(model)}
                className={`px-3 py-2.5 rounded-xl border text-[10px] font-bold text-left transition-all ${
                  aiModel === model 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'
                }`}
              >
                <div className="line-clamp-1 truncate">{model.replace('gemini-', '').toUpperCase()}</div>
                <div className={`mt-1 h-1 w-full rounded-full overflow-hidden ${aiModel === model ? 'bg-blue-400' : 'bg-gray-100'}`}>
                  <div 
                    className={`h-full ${aiModel === model ? 'bg-white' : 'bg-blue-500'}`} 
                    style={{ width: `${Math.min(100, (quotas[model].used / quotas[model].limit) * 100)}%` }} 
                   />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:w-48 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quota Info</span>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${percentUsed > 80 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {currentQuota.limit - currentQuota.used} Left
            </span>
          </div>
          <p className="text-sm font-bold text-gray-800">{currentQuota.used} / {currentQuota.limit} <span className="text-[10px] text-gray-400">RPD</span></p>
          <div className="mt-3 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-1000 ${percentUsed > 80 ? 'bg-red-500' : 'bg-blue-600'}`} 
               style={{ width: `${percentUsed}%` }} 
             />
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-50 pb-6">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">🚀 Quick Topic Discovery</label>
        <div className="flex flex-wrap gap-2">
          {topics.map(t => (
            <button
               key={t.id}
               type="button"
               onClick={() => handleTopicDiscovery(t.id)}
               disabled={isScraping}
               className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${isBrowserMode ? 'bg-amber-50 border-amber-100 text-amber-700 hover:border-amber-200' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-blue-300 hover:bg-blue-50'}`}
            >
              <span>{t.icon}</span> {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Browser Mode Toggle */}
      <div className="mb-6 p-4 rounded-2xl border bg-gray-50/50 flex items-center justify-between group hover:bg-white transition-all">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border transition-all ${isBrowserMode ? 'bg-amber-100 border-amber-200 text-amber-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
               <Globe className={`w-5 h-5 ${isBrowserMode ? 'animate-pulse' : ''}`} />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-gray-800">Advanced Browser Mode</p>
               <p className="text-[10px] font-medium text-gray-400">Dùng Chromium ngầm để bóc tách Job khó (TopCV, CareerViet...)</p>
            </div>
         </div>
         <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isBrowserMode} 
              onChange={() => setIsBrowserMode(!isBrowserMode)} 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
         </label>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-gray-50 border border-gray-200 rounded-xl max-w-xs">
         <button 
           type="button"
           onClick={() => setMode('AUTO')}
           className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'AUTO' ? 'bg-white shadow-sm border border-gray-200 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
           <Globe className="w-3.5 h-3.5" /> BULK URLS
         </button>
         <button 
           type="button"
           onClick={() => setMode('MANUAL')}
           className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'MANUAL' ? 'bg-white shadow-sm border border-gray-200 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
           <FileText className="w-3.5 h-3.5" /> MANUAL PASTE
         </button>
      </div>

      <form onSubmit={handleScrape} className="flex flex-col gap-4">
        {mode === 'AUTO' ? (
          <div className="space-y-4">
            <textarea
              required
              placeholder="Dán danh sách link Job (mỗi dòng 1 link - hỗ trợ Itviec, TopCV, CareerViet, Vietnamworks)..."
              className="w-full h-32 pl-4 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium resize-none shadow-inner"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={isScraping || isAnalyzing}
            />
            <button
              type="submit"
              disabled={isScraping || isAnalyzing || !urls.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isScraping ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ScanLine className="w-5 h-5" /> BULK FETCH & ANALYZE NOW</>}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea 
              placeholder="Dán trực tiếp nội dung JD (Job Description) vào đây..."
              className="w-full h-48 bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none shadow-inner"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              disabled={isAnalyzing}
            />
            <button
              type="submit"
              disabled={isAnalyzing || !manualText.trim()}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 text-amber-400" /> PHÂN TÍCH NỘI DUNG NÀY</>}
            </button>
          </div>
        )}
      </form>

      {/* Status Progress indicator */}
      {(isScraping || isAnalyzing || analyzeStatus) && (
        <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
             {analyzeStep !== 'finished' ? (
               <div className="relative">
                 <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                 </div>
               </div>
             ) : (
               <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
               </div>
             )}
             <div>
                <p className="text-sm font-bold text-gray-800">
                  {discoveryProgress.total > 0 && discoveryProgress.current > 0 ? `[${discoveryProgress.current}/${discoveryProgress.total}] ` : ''}
                  {analyzeStatus}
                </p>
                <div className="flex gap-1 mt-1">
                   {[1, 2, 3].map((s) => {
                      const stepMap = { 'idle': 0, 'scraping': 1, 'parsing_jd': 2, 'matching': 3, 'finished': 4 };
                      const currentS = stepMap[analyzeStep] || 0;
                      return (
                        <div key={s} className={`h-1 w-6 rounded-full transition-all duration-500 ${s <= currentS ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      );
                   })}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => cancelScraping()}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Hủy / Dừng Quét
            </button>
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest hidden sm:block">
              {analyzeStep === 'scraping' && 'Step 1 of 3'}
              {analyzeStep === 'parsing_jd' && 'Step 2 of 3'}
              {analyzeStep === 'matching' && 'Step 3 of 3'}
              {analyzeStep === 'finished' && 'Complete'}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-2xl text-sm border border-red-100 animate-in shake duration-500">
           <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
           <div>
             <p className="font-bold">Đã xảy ra sự cố</p>
             <p className="opacity-80 leading-tight mt-0.5">{error}</p>
           </div>
        </div>
      )}
    </div>
  );
}
