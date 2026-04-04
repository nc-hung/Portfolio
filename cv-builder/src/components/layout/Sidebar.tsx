"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileSignature, FileText, Settings, Rocket, KanbanSquare } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Job Scraper', path: '/jobs', icon: Briefcase },
  { name: 'Tracker Board', path: '/tracker', icon: KanbanSquare },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3 shadow-md shadow-blue-500/20">
          <Rocket className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-gray-900 tracking-tight">AutoCV<span className="text-blue-600">.</span></span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1 overscroll-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
            CH
          </div>
          <div className="text-sm overflow-hidden">
            <p className="font-semibold text-gray-800 text-ellipsis truncate">Cong Hung</p>
            <p className="text-gray-400 text-xs text-ellipsis truncate">Pro Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
