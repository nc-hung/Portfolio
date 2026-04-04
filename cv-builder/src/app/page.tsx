"use client";

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, FileText, KanbanSquare, CheckCircle2, 
  TrendingUp, Sparkles, Clock, ArrowRight, MousePointer2, 
  Layers, Box, ChevronRight, Wand2 
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    scrapedCount: 0,
    legoBlocks: 0,
    accuracy: 98,
    topMatch: 0
  });

  const { scrapedJobs } = useAppStore();

  useEffect(() => {
    setStats({
      scrapedCount: scrapedJobs.length || 15,
      legoBlocks: 42,
      accuracy: 98,
      topMatch: 85
    });
  }, [scrapedJobs]);

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-700">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-sans">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hung Architect</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium text-lg">Hệ thống LEGO CV đã sẵn sàng. Hôm nay chúng ta sẽ "may đo" JD nào?</p>
        </div>
        <div className="hidden md:block bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm animate-bounce-slow">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Heuristic</p>
           <p className="text-xs font-bold text-blue-600 flex items-center gap-2"><Sparkles className="w-3 h-3"/> Mindset Over Syntax v2.1</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Jobs Khám Phá', value: stats.scrapedCount, color: 'text-blue-600', bg: 'bg-blue-50', icon: Briefcase },
          { label: 'Lego Blocks (IT)', value: stats.legoBlocks, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Layers },
          { label: 'Match Accuracy', value: `${stats.accuracy}%`, color: 'text-teal-600', bg: 'bg-teal-50', icon: CheckCircle2 },
          { label: 'Avg Match Score', value: `${stats.topMatch}%`, color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingUp },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
               <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} -mr-4 -mt-4 rounded-full opacity-40 group-hover:scale-150 transition-transform`} />
               <div className="flex flex-col gap-4 relative">
                  <div className={`w-10 h-10 ${stat.bg} ${stat.color} flex items-center justify-center rounded-2xl shadow-sm border border-gray-100/50`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-gray-900">{stat.value}</p>
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-widest mt-1">{stat.label}</p>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-blue-500" /> Recent LEGO Assemblies
               </h3>
               <Link href="/jobs" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 group">
                 Open Job Scraper <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[320px] flex flex-col items-center justify-center p-12 text-center group">
                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded-[32px] mb-6 border border-gray-100 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                  <Box className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-2">Sẵn sàng lắp ráp CV đầu tiên?</h4>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-8">
                  Hệ thống AI sẽ tự động bóc tách JD, chọn lọc các khối chuyên môn (Lego Blocks) phù hợp và "may đo" nội dung sát nhất với yêu cầu nhà tuyển dụng.
                </p>
                <Link href="/jobs" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 font-black text-sm tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                   KHÁM PHÁ JOB NGAY <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Phân loại Domain</h3>
            <div className="space-y-4">
               {[
                 { name: 'Mobile / Software', count: scrapedJobs.filter((j: any) => j.matchData?.matchScore > 50).length || 0, color: 'border-blue-500 bg-blue-50/50' },
                 { name: 'Legal / Business', count: 0, color: 'border-purple-500 bg-purple-50/50' },
                 { name: 'Customer Service', count: 0, color: 'border-emerald-500 bg-emerald-50/50' },
               ].map((topic, i) => (
                 <div key={i} className={`p-4 rounded-2xl border-l-[6px] border-y border-r border-gray-100 shadow-sm bg-white ${topic.color.split(' ')[1]} transition-transform hover:-translate-x-1 cursor-pointer`}>
                    <div className="flex justify-between items-center">
                       <span className="font-bold text-gray-700">{topic.name}</span>
                       <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-white border border-gray-100 shadow-xs`}>
                         {topic.count} Analyzed
                       </span>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group border border-white/10">
             <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700" />
             <div className="relative z-10">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tighter">
                   <Wand2 className="w-5 h-5 text-amber-400" /> LEGO Strategy
                </h3>
                <p className="text-sm font-medium text-blue-100 leading-relaxed mb-8 italic">
                   "Đừng rập khuôn framework. Hãy tập trung vào việc thể hiện bạn đã giải quyết các bài toán Mobile Architecture như thế nào trong phần Master CV."
                </p>
                <div className="h-px w-full bg-white/20 mb-6" />
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Active Rule:</p>
                <p className="text-xs font-bold text-white mt-1">Cross-Platform to Native Equivalence</p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
