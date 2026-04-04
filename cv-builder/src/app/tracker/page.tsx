"use client";

import { useState, useEffect } from 'react';
import { KanbanSquare, Search, Filter, MoreVertical, Calendar, Building, MapPin, Briefcase, ChevronRight, CheckCircle2, Clock, XCircle, Trophy } from 'lucide-react';

const COLUMNS = [
  { id: 'SAVED', name: 'Đã Lưu', icon: Clock, color: 'text-gray-400', bg: 'bg-gray-50' },
  { id: 'APPLIED', name: 'Đang Ứng Tuyển', icon: KanbanSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'INTERVIEW', name: 'Phỏng Vấn', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'OFFER', name: 'Kết Quả', icon: Trophy, color: 'text-green-500', bg: 'bg-green-50' }
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const result = await res.json();
      if (result.success) setApplications(result.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchApplications();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Application Tracker</h1>
          <p className="text-gray-500 mt-1">Sắp xếp các job đang theo đuổi theo phong cách Kanban mượt mà.</p>
        </div>
        
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
             <Filter className="w-4 h-4" /> Filter
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {COLUMNS.map((col) => {
          const colApps = applications.filter(app => col.id === 'OFFER' ? (app.status === 'OFFER' || app.status === 'REJECTED') : app.status === col.id);
          const Icon = col.icon;
          
          return (
            <div key={col.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${col.bg}`}>
                    <Icon className={`w-4 h-4 ${col.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 whitespace-nowrap">{col.name}</h3>
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{colApps.length}</span>
                </div>
              </div>

              <div className="space-y-4 min-h-[600px] rounded-2xl bg-gray-50/50 p-2 border border-dashed border-gray-200/60">
                 {colApps.map((app) => (
                    <div key={app.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                       <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{app.job.source}</span>
                          <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4" /></button>
                       </div>
                       
                       <h4 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{app.job.title}</h4>
                       
                       <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                             <Building className="w-3 h-3" /> {app.job.company}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                             <MapPin className="w-3 h-3" /> {app.job.location}
                          </div>
                       </div>

                       <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                          <span className="text-[10px] text-gray-400 font-medium">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                          <div className="flex gap-1">
                             {/* Small fast actions to change status */}
                             {col.id === 'SAVED' && (
                                <button onClick={() => updateStatus(app.id, 'APPLIED')} title="Move to Applied" className="p-1 hover:bg-blue-50 text-blue-400 rounded transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
                             )}
                             {col.id === 'APPLIED' && (
                                <button onClick={() => updateStatus(app.id, 'INTERVIEW')} title="Move to Interview" className="p-1 hover:bg-amber-50 text-amber-400 rounded transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
                             )}
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 {colApps.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 opacity-20 group">
                       <Icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-center">No jobs here</span>
                    </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
