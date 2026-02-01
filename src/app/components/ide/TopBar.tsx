import { Play, Bug, Cloud, Settings, User, Share2, Search, Menu } from "lucide-react";

export function TopBar() {
  return (
    <div className="h-12 min-h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-indigo-400">
           <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
             <span className="font-bold text-lg font-mono">N</span>
           </div>
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">hyperion-core</span>
            <span className="text-[10px] text-slate-500">v0.4.2 • Edited 2m ago</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
        <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer text-sm">
             <Menu size={14} />
             <span>Menu</span>
        </div>
      </div>

      <div className="flex items-center bg-slate-900 rounded-md p-1 border border-slate-800 gap-1">
        <button className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded transition-colors">
          <Play size={14} fill="currentColor" className="opacity-80" />
          <span>Run</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1 hover:bg-slate-800 text-slate-400 hover:text-orange-400 text-xs font-medium rounded transition-colors group">
          <Bug size={14} className="group-hover:text-orange-400" />
          <span>Debug</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Cloud size={14} className="text-indigo-400" />
          <span>Synced</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800"></div>
        <div className="flex items-center gap-3 text-slate-400">
             <Search size={16} className="hover:text-slate-200 cursor-pointer transition-colors" />
             <Settings size={16} className="hover:text-slate-200 cursor-pointer transition-colors" />
             <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white font-bold border-2 border-slate-950">
                JD
             </div>
        </div>
      </div>
    </div>
  );
}
