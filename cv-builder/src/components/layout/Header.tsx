import { Search, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white/70 backdrop-blur-lg border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      
      <div className="flex items-center">
        {/* Search Bar - Tiện ích tìm kiếm chung */}
        <div className="flex items-center bg-gray-50/80 px-3 py-2 rounded-lg border border-gray-200/60 w-[400px] focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search jobs, tracking status, or templates..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
        </button>
      </div>
      
    </header>
  );
}
