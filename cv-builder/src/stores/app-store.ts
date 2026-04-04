import { create } from 'zustand';

interface AppState {
  currentJobData: any | null;
  scrapedJobs: any[];
  currentJdAnalysis: any | null;
  currentMatchData: any | null;
  isScraping: boolean;
  isAnalyzing: boolean;
  analyzeStep: 'idle' | 'scraping' | 'parsing_jd' | 'matching' | 'finished';
  analyzeStatus: string;
  
  // AI Config & Quota
  aiModel: string;
  quotas: Record<string, { used: number, limit: number }>;
  abortController: AbortController | null;
  
  setCurrentJob: (data: any) => void;
  addScrapedJob: (job: any) => void;
  updateScrapedJobWithAnalysis: (jobTitle: string, analysis: any, match: any) => void;
  loadJobFromHistory: (job: any) => void;
  setAnalysis: (analysis: any, match: any) => void;
  setLoadingState: (type: 'scrape' | 'analyze', state: boolean) => void;
  setAnalyzeStep: (step: AppState['analyzeStep'], status?: string) => void;
  resetJobProcess: () => void;
  setAiModel: (model: string) => void;
  trackUsage: (model: string) => void;
  setAbortController: (controller: AbortController | null) => void;
  cancelScraping: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentJobData: null,
  scrapedJobs: [],
  currentJdAnalysis: null,
  currentMatchData: null,
  isScraping: false,
  isAnalyzing: false,
  analyzeStep: 'idle',
  analyzeStatus: '',

  aiModel: 'gemini-3.1-flash-lite-preview',
  quotas: {
    'gemini-3.1-flash-lite-preview': { used: 0, limit: 500 },
    'gemini-3-flash-preview': { used: 0, limit: 500 },
    'gemini-2.5-flash': { used: 0, limit: 20 },
    'gemini-2.0-flash': { used: 0, limit: 15 },
  },
  abortController: null,

  setCurrentJob: (data) => set({ currentJobData: data }),
  addScrapedJob: (job) => set((state) => ({ 
    scrapedJobs: [job, ...state.scrapedJobs] 
  })),
  updateScrapedJobWithAnalysis: (jobTitle, analysis, match) => set((state) => ({
    scrapedJobs: state.scrapedJobs.map((j) => 
      j.title === jobTitle ? { ...j, analysis, matchData: match } : j
    )
  })),
  loadJobFromHistory: (job) => set({
    currentJobData: job,
    currentJdAnalysis: job.analysis || null,
    currentMatchData: job.matchData || null
  }),
  setAnalysis: (analysis, match) => set({ currentJdAnalysis: analysis, currentMatchData: match }),
  setLoadingState: (type, state) => set(prev => ({
    ...prev,
    ...(type === 'scrape' ? { isScraping: state } : { isAnalyzing: state })
  })),
  setAnalyzeStep: (step, status) => set({ analyzeStep: step, analyzeStatus: status || '' }),
  setAiModel: (model) => set({ aiModel: model }),
  setAbortController: (controller) => set({ abortController: controller }),
  cancelScraping: () => set((state) => {
    state.abortController?.abort();
    return { isScraping: false, abortController: null, analyzeStep: 'idle' };
  }),
  trackUsage: (model) => set((state) => ({
    quotas: {
      ...state.quotas,
      [model]: { 
        ...state.quotas[model], 
        used: (state.quotas[model]?.used || 0) + 1 
      }
    }
  })),
  resetJobProcess: () => set((state) => {
    state.abortController?.abort();
    return {
      currentJobData: null,
      currentJdAnalysis: null,
      currentMatchData: null,
      isScraping: false,
      isAnalyzing: false,
      analyzeStep: 'idle',
      analyzeStatus: '',
      abortController: null
    };
  })
}));
