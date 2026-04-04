"use client";

import { useState, useEffect } from 'react';
import { Settings, Save, Plus, Tags, FileCode, CheckCircle2, Globe, Trash2, Edit3, X, Loader2, Sparkles, User, Users } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

// Sub-components for better organization
function BlockCard({ block, onEdit, horizontal = false }: { block: any, onEdit: () => void, horizontal?: boolean }) {
  const formattedDate = block.createdAt ? new Date(block.createdAt).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Vừa mới';

  return (
    <div className={`bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm group hover:border-blue-200 transition-all relative overflow-hidden flex ${horizontal ? 'flex-col md:flex-row gap-6' : 'flex-col'}`}>
      <div className={`${horizontal ? 'flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-widest">{block.category}</span>
            <h4 className="font-bold text-gray-800 tracking-tight">{block.variant}</h4>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl border border-transparent hover:border-blue-100 transition-all">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-red-50 text-red-400 rounded-xl border border-transparent hover:border-red-100 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 leading-relaxed bg-gray-50/30 p-4 rounded-2xl border border-gray-100/50 min-h-[60px]">
          {typeof block.content === 'string' ? (
            <div className="whitespace-pre-wrap line-clamp-3">{block.content}</div>
          ) : (
            <pre className="text-[10px] font-mono overflow-hidden truncate">
              {JSON.stringify(block.content, null, 2)}
            </pre>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {block.keywords?.split(',').map((kw: string, i: number) => (
              <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                {kw.trim()}
              </span>
            ))}
          </div>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded italic">
            📅 {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyCard({ message, icon }: { message: string, icon: React.ReactNode }) {
  return (
    <div className="border-2 border-dashed border-gray-50 rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
      <div className="text-gray-200 mb-3">{icon}</div>
      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{message}</p>
    </div>
  );
}

const CATEGORIES = ['TITLE', 'SUMMARY', 'SKILL', 'PROJECT', 'EDUCATION', 'ACHIEVEMENT'];

export default function SettingsPage() {
  const { aiModel } = useAppStore();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<any | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isProfilesLoading, setIsProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (activeProfileId) {
      fetchBlocks();
    }
  }, [activeProfileId]);

  const fetchProfiles = async () => {
    setIsProfilesLoading(true);
    setProfilesError(null);
    try {
      const res = await fetch('/api/profiles');
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        setProfiles(result.data);
        setActiveProfileId(result.data[0].id);
      } else if (result.success === false) {
        setProfilesError(result.error || 'Failed to load profiles');
      }
    } catch (e: any) { 
       console.error(e); 
       setProfilesError(e.message);
    } finally {
       setIsProfilesLoading(false);
    }
  };

  const fetchBlocks = async () => {
    if (!activeProfileId) return;
    try {
      const res = await fetch(`/api/master-cv?profileId=${activeProfileId}`);
      const result = await res.json();
      if (result.success) setBlocks(result.data);
    } catch (e) { console.error(e); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isNew = !editingBlock.id;
      const res = await fetch('/api/master-cv', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingBlock, profileId: activeProfileId })
      });
      if (res.ok) {
        setEditingBlock(null);
        fetchBlocks();
      }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleCreateProfile = async () => {
    if (!newProfileName) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProfileName })
      });
      const result = await res.json();
      if (result.success) {
        setProfiles([result.data, ...profiles]);
        setActiveProfileId(result.data.id);
        setIsCreatingProfile(false);
        setNewProfileName('');
      }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['PERSONAL_INFO', 'TITLE', 'SUMMARY', 'SKILL', 'PROJECT', 'EDUCATION', 'ACHIEVEMENT'];

  const filteredBlocks = activeCategory === 'ALL' 
    ? blocks 
    : blocks.filter(b => b.category === activeCategory);

  const getBlocksByCategory = (cat: string) => blocks.filter(b => b.category === cat);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-500 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Settings className="w-6 h-6" />
            </div>
            Master Profile Board
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 font-medium whitespace-nowrap">Dashboard của:</p>
            <div className="flex items-center gap-2">
               <div className="relative group">
                  <button 
                    disabled={isProfilesLoading}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full text-sm font-bold text-blue-600 hover:border-blue-200 transition-all shadow-sm disabled:opacity-50"
                  >
                    <User className="w-4 h-4" /> 
                    {isProfilesLoading ? 'Đang tải hồ sơ...' : profilesError ? 'Lỗi tải hồ sơ' : activeProfile?.name || 'Chọn hồ sơ'}
                  </button>
                  {/* Profile Dropdown */}
                  {!isProfilesLoading && !profilesError && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                       {profiles.map(p => (
                          <button 
                            key={p.id} 
                            onClick={() => setActiveProfileId(p.id)}
                            className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeProfileId === p.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                          >
                            {p.name}
                          </button>
                       ))}
                       <div className="h-px bg-gray-50 my-2" />
                       <button 
                          onClick={() => setIsCreatingProfile(true)}
                          className="w-full text-left px-4 py-2 rounded-xl text-[10px] uppercase font-black text-amber-600 hover:bg-amber-50 transition-all flex items-center gap-2"
                       >
                          <Plus className="w-3 h-3" /> New Profile
                       </button>
                    </div>
                  )}

                  {profilesError && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-red-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4">
                       <p className="text-[10px] text-red-500 font-bold mb-2 uppercase">Lỗi: {profilesError}</p>
                       <button 
                         onClick={fetchProfiles}
                         className="w-full py-2 bg-red-50 text-red-600 text-[10px] uppercase font-black rounded-xl hover:bg-red-100 transition-all"
                       >
                         Thử lại
                       </button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImporting(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-5 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-5 h-5" /> AI Import CV
          </button>
          <button 
            onClick={() => setEditingBlock({ category: 'SUMMARY', variant: 'New Variant', content: '', language: 'VI', keywords: '', profileId: activeProfileId })}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Thêm Khối Mới
          </button>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Column: Navigation & Stats */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Navigation</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveCategory('ALL')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeCategory === 'ALL' ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-tight">Tất cả các khối</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-inherit">
                  {blocks.length}
                </span>
              </button>
              
              <div className="h-4" />
              
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeCategory === cat ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="font-bold text-xs uppercase tracking-tight">{cat.replace('_', ' ')}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-inherit">
                    {getBlocksByCategory(cat).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-50">
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Profile Completeness</p>
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-sm font-black text-gray-800">{Math.round((blocks.length / 10) * 100)}%</span>
                     <span className="text-[10px] text-gray-400 font-bold uppercase">Strong</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-gray-100">
                     <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${Math.min(100, (blocks.length / 10) * 100)}%` }} />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Area */}
        <div className="xl:col-span-3 space-y-10">
          
          {/* Summary Sections */}
          {activeCategory === 'ALL' ? (
            <div className="space-y-12">
               {/* Personal Info Header Card */}
               <section>
                  <div className="flex items-center justify-between mb-4 px-2">
                     <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Main Identity Profile
                     </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     {getBlocksByCategory('PERSONAL_INFO').map(block => (
                        <div key={block.id} className="relative group">
                           <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                           <div className="relative bg-white p-8 rounded-[32px] border border-blue-50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                              <div className="flex items-center gap-5">
                                 <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 uppercase">
                                   {block.variant.charAt(0)}
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">{block.variant}</h4>
                                    <div className="text-sm text-gray-500 font-medium max-w-md line-clamp-2">
                                       {typeof block.content === 'string' ? block.content : 'Personal Details Attached'}
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                       {block.keywords?.split(',').map((kw: string, i: number) => (
                                          <span key={i} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{kw.trim()}</span>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-3">
                                 <button onClick={() => setEditingBlock(block)} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 transition-all active:scale-95">Edit Identity</button>
                                 <button className="p-3 text-red-100 hover:text-red-500 bg-white border border-gray-100 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                              </div>
                           </div>
                        </div>
                     ))}
                     {getBlocksByCategory('PERSONAL_INFO').length === 0 && (
                        <div 
                          onClick={() => setEditingBlock({ category: 'PERSONAL_INFO', variant: 'Họ và tên của bạn', content: 'Email | SĐT | Địa chỉ của bạn', language: 'VI', keywords: '' })}
                          className="border-2 border-dashed border-gray-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                        >
                           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all mb-4">
                              <Plus className="w-8 h-8" />
                           </div>
                           <p className="font-bold text-gray-400 group-hover:text-blue-600 transition-all">Nhấn để thêm thông tin cá nhân</p>
                           <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">Họ tên, SĐT, Email là thông tin bắt buộc</p>
                        </div>
                     )}
                  </div>
               </section>

               {/* Summaries & Global Info */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section>
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 px-2">Global Titles</h2>
                    <div className="space-y-4">
                       {getBlocksByCategory('TITLE').map(block => (
                          <BlockCard key={block.id} block={block} onEdit={() => setEditingBlock(block)} />
                       ))}
                    </div>
                  </section>
                  <section>
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 px-2">Professional Summaries</h2>
                    <div className="space-y-4">
                       {getBlocksByCategory('SUMMARY').map(block => (
                          <BlockCard key={block.id} block={block} onEdit={() => setEditingBlock(block)} />
                       ))}
                    </div>
                  </section>
               </div>

               {/* Experience & Projects - The "Heavy" Stuff */}
               <section>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Work Experience & Projects</h2>
                    <span className="text-[10px] font-bold text-gray-400">{getBlocksByCategory('PROJECT').length} Blocks</span>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                     {getBlocksByCategory('PROJECT').map(block => (
                        <BlockCard key={block.id} block={block} onEdit={() => setEditingBlock(block)} horizontal />
                     ))}
                  </div>
               </section>

               {/* Skills & Others */}
               <section>
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 px-2">Technical Skills & Achievements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {getBlocksByCategory('SKILL').map(block => (
                        <BlockCard key={block.id} block={block} onEdit={() => setEditingBlock(block)} />
                     ))}
                     {getBlocksByCategory('EDUCATION').map(block => (
                        <BlockCard key={block.id} block={block} onEdit={() => setEditingBlock(block)} />
                     ))}
                  </div>
               </section>
            </div>
          ) : (
            /* Filtered View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBlocks.map(block => (
                 <BlockCard key={block.id} block={block} onEdit={() => setEditingBlock(block)} />
              ))}
              {filteredBlocks.length === 0 && (
                <div className="col-span-full border-2 border-dashed border-gray-100 rounded-[32px] p-20 flex flex-col items-center justify-center text-gray-300">
                  <FileCode className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">No blocks in this category</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editing Modal */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setEditingBlock(null)}>
           <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Edit Lego Block</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Master CV Editor</p>
                 </div>
                 <button onClick={() => setEditingBlock(null)} className="p-2 hover:bg-gray-200 bg-white border border-gray-200 text-gray-500 rounded-full transition-all"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                       <select 
                        value={editingBlock.category}
                        onChange={e => setEditingBlock({ ...editingBlock, category: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all font-bold tracking-tight outline-none"
                       >
                         {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Variant / Name</label>
                       <input 
                        type="text"
                        value={editingBlock.variant}
                        onChange={e => setEditingBlock({ ...editingBlock, variant: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all font-bold tracking-tight outline-none"
                        placeholder="e.g. Backend Focus"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Content (Text or JSON)</label>
                    <textarea 
                      value={typeof editingBlock.content === 'string' ? editingBlock.content : JSON.stringify(editingBlock.content, null, 2)}
                      onChange={e => setEditingBlock({ ...editingBlock, content: e.target.value })}
                      className="w-full h-48 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all font-medium tracking-tight outline-none resize-none font-mono"
                      placeholder="Paste your content block here..."
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Keywords (comma separated)</label>
                    <div className="relative">
                      <Tags className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="text"
                        value={editingBlock.keywords}
                        onChange={e => setEditingBlock({ ...editingBlock, keywords: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all font-medium tracking-tight outline-none"
                        placeholder="react, nodejs, sql..."
                      />
                    </div>
                 </div>
                 
                 <div className="pt-2 flex justify-end gap-3 border-t border-gray-50 mt-8 pt-6">
                    <button type="button" onClick={() => setEditingBlock(null)} className="px-6 py-3 text-gray-500 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md active:scale-95 flex items-center gap-2">
                       {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Lego Block
                    </button>
                 </div>
               </form>
            </div>
         </div>
      )}
      {/* AI Import Modal */}
      {isImporting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-6" onClick={() => setIsImporting(false)}>
           <div className="bg-white w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b border-gray-100 bg-amber-50/30 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                       <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI CV Import</h3>
                       <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mt-0.5">Tự động bóc tách từ CV cũ</p>
                    </div>
                 </div>
                 <button onClick={() => setIsImporting(false)} className="p-2 hover:bg-gray-100 bg-white border border-gray-200 text-gray-400 rounded-full transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-10 space-y-8">
                 <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
                    <Globe className="w-6 h-6 text-blue-500 mt-1" />
                    <p className="text-sm text-blue-700 font-medium leading-relaxed">
                       Dán toàn bộ nội dung CV cũ của bạn vào đây. AI sẽ tự động phân tích và chia nhỏ thành các "Khối Lego" (Kỹ năng, Kinh nghiệm, Dự án...) để bạn quản lý tập trung.
                    </p>
                 </div>

                 <textarea 
                   value={importText}
                   onChange={e => setImportText(e.target.value)}
                   className="w-full h-64 bg-gray-50 border-2 border-gray-100 rounded-[32px] p-6 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all font-medium tracking-tight outline-none resize-none"
                   placeholder="Sao chép nội dung CV của bạn và dán vào đây..."
                 />

                 <div className="flex gap-4">
                    <button 
                      onClick={() => setIsImporting(false)} 
                      className="flex-1 py-4 text-gray-500 font-black text-xs uppercase tracking-widest bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      disabled={!importText || isSaving}
                      onClick={async () => {
                        setIsSaving(true);
                        try {
                          const res = await fetch('/api/cv/extract', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ rawText: importText, modelName: aiModel, profileId: activeProfileId })
                          });
                          if (res.ok) {
                            setIsImporting(false);
                            setImportText('');
                            fetchBlocks();
                          }
                        } catch (e) { console.error(e); }
                        finally { setIsSaving(false); }
                      }}
                      className="flex-[2] py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      Bắt đầu bóc tách CV
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
      {isCreatingProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Create New Profile</h3>
                 <button onClick={() => setIsCreatingProfile(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Profile Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={newProfileName}
                      onChange={e => setNewProfileName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateProfile()}
                      placeholder="e.g. John Doe - Senior Backend"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                 </div>
                 <button 
                   onClick={handleCreateProfile}
                   disabled={!newProfileName || isSaving}
                   className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg active:scale-95 disabled:opacity-50"
                 >
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Tạo hồ sơ mới'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
