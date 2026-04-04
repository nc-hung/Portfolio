import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { MatchScore } from './MatchScore';
import { CheckCircle2, XCircle, MapPin, Building, Briefcase, Zap, Loader2, ArrowRight, FileText, Search, KanbanSquare } from 'lucide-react';
import Link from 'next/link';

export function JobAnalysis() {
  const { 
    currentJobData, 
    currentJdAnalysis, 
    currentMatchData, 
    scrapedJobs, 
    loadJobFromHistory, 
    isAnalyzing 
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSavingToTracker, setIsSavingToTracker] = useState<string | null>(null);

  const decodeUnicode = (str: string) => {
    if (!str) return '';
    try {
      return str.replace(/\\u([a-fA-F0-9]{4})/g, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
      });
    } catch (e) {
      return str;
    }
  };

  const filteredJobs = scrapedJobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTrackJob = async (job: any) => {
    setIsSavingToTracker(job.title + job.company);
    try {
      // 1. First ensure the Job exists in DB (our scraper should have saved it, but lets check)
      // Actually, assume jobId is available or create it.
      // For now, let's just use the api/applications POST as implemented before.
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobId: job.id, // Assuming job.id was returned from scraper
          status: 'SAVED'
        })
      });
      if (res.ok) {
        alert('Đã lưu vào Tracker Board!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingToTracker(null);
    }
  };

  if (scrapedJobs.length === 0 && !currentJobData && !isAnalyzing) return null;

  return (
    <div className="mt-12 pb-24">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT SIDE: Recently Scraped List */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">📋 Scraped ({filteredJobs.length})</h3>
            <div className="h-px flex-1 mx-4 bg-gray-100" />
          </div>

          {/* Search Filter */}
          <div className="relative px-2">
            <Search className="absolute left-5 top-2.5 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder="Lọc theo tên job/công ty..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredJobs.map((job, idx) => {
              const isSelected = currentJobData?.title === job.title && currentJobData?.company === job.company;
              const hasAnalysis = !!job.matchData;
              
              return (
                <div key={idx} className="relative group">
                  <button 
                    onClick={() => loadJobFromHistory(job)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all hover:translate-x-1 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20' 
                        : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col gap-1 pr-6">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`font-bold text-xs line-clamp-1 leading-tight flex-1 ${isSelected ? 'text-white' : 'text-gray-900 group-hover:text-blue-600'}`}>
                          {decodeUnicode(job.title)}
                        </h4>
                        {hasAnalysis && (
                          <div className={`shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {job.matchData.matchScore}%
                          </div>
                        )}
                      </div>
                      <p className={`text-[10px] font-medium truncate ${isSelected ? 'text-blue-100 opacity-80' : 'text-gray-500'}`}>
                        {decodeUnicode(job.company)}
                      </p>
                    </div>
                  </button>

                  {/* Track Action Button Overlay */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleTrackJob(job); }}
                    disabled={isSavingToTracker === (job.title + job.company)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-sm ${
                       isSelected ? 'bg-white/20 text-white hover:bg-white/40' : 'bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 border border-gray-100'
                    }`}
                  >
                    {isSavingToTracker === (job.title + job.company) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KanbanSquare className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Main Analysis Content */}
        <div className="flex-1 w-full min-w-0">
          {!currentJobData ? (
             <div className="h-64 flex flex-col items-center justify-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200 text-gray-400">
                <Briefcase className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Chọn một Job từ danh sách để xem phân tích chi tiết</p>
             </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-2 px-2">
                  <div className="h-4 w-1 bg-blue-600 rounded-full" />
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Job Details Analysis</h3>
               </div>

              {/* Header Card */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-2xl flex flex-col md:flex-row gap-8 justify-between items-start ring-1 ring-black/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="space-y-4 flex-1 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{currentJobData.source || 'Scraped'}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{currentJobData.location}</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">{decodeUnicode(currentJobData.title)}</h2>
                  <p className="text-xl font-bold text-blue-600 flex items-center gap-2"><Building className="w-5 h-5"/> {decodeUnicode(currentJobData.company)}</p>
                </div>
                
                <div className="relative z-10 shrink-0">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-3xl border border-blue-100 min-w-[180px]">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                      <p className="text-sm font-bold text-blue-800 text-center uppercase tracking-widest">AI Matching...</p>
                    </div>
                  ) : currentMatchData ? (
                     <MatchScore score={currentMatchData.matchScore} />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-3xl border border-gray-100 min-w-[180px]">
                      <Zap className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">Chưa phân tích</p>
                    </div>
                  )}
                </div>
              </div>

              {/* NEW SECTION: Raw JD Text (For Verification) */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Raw Job Description (Source)
                </h3>
                <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100/50 max-h-60 overflow-y-auto custom-scrollbar">
                   <pre className="text-[11px] text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">
                     {decodeUnicode(currentJobData.rawContent) || 'Không tìm thấy nội dung JD gốc.'}
                   </pre>
                </div>
              </div>

              {/* Detailed Insights Grid */}
              {currentJdAnalysis && currentMatchData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* JD Analysis Card */}
                  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 border-b border-gray-50 pb-4">
                      <div className="p-2 bg-amber-50 rounded-xl"><Zap className="w-4 h-4 text-amber-500" /></div>
                      JD Core Requirements
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Responsibilities</p>
                        <ul className="space-y-2.5">
                          {currentJdAnalysis.keyResponsibilities?.map((resp: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" /> <span className="leading-relaxed font-medium">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-gray-50">
                         <div className="flex-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Seniority</p>
                            <span className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100">{currentJdAnalysis.seniority}</span>
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Domain</p>
                            <span className="inline-block bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-xs font-bold border border-purple-100">{currentJdAnalysis.domain}</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Matching Insight Card */}
                  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-8 h-fit">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 border-b border-gray-50 pb-4">
                      <div className="p-2 bg-green-50 rounded-xl"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                      Resume Matching Insight
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3">Core Match Points</p>
                        <ul className="space-y-3">
                          {currentMatchData.strongPoints?.map((point: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-800 flex items-start gap-3 bg-green-50/30 p-3 rounded-xl border border-green-50/50 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {currentMatchData.missingSkills && currentMatchData.missingSkills.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">Skill Gaps to Address</p>
                          <div className="flex flex-wrap gap-2">
                            {currentMatchData.missingSkills.map((skill: string, idx: number) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100">
                                <XCircle className="w-3 h-3" /> {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={`p-6 rounded-2xl border-2 shadow-inner ${currentMatchData.shouldApply ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-70">AI Recommendation</span>
                        </div>
                        <p className={`text-sm font-bold italic leading-relaxed ${currentMatchData.shouldApply ? 'text-green-800' : 'text-amber-800'}`}>"{currentMatchData.recommendation}"</p>
                      </div>
                      
                      {currentMatchData.shouldApply && (
                         <div className="pt-4 animate-bounce-slow">
                           <Link href="/cv/generate" className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all group active:scale-95">
                              Lắp ráp LEGO CV Phù hợp <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                           </Link>
                         </div>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
