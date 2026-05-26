import React from 'react';

export default function Sidebar() {
  return (
    <aside className="bg-[#121214] border-r border-[#1f1f23] w-[260px] h-screen fixed left-0 top-0 z-50 flex flex-col p-5 select-none shrink-0">
      {/* Header / Brand */}
      <div className="flex items-center gap-3 mb-8 px-2 mt-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-lg" aria-hidden="true">🎫</div>
        <div>
          <div className="font-display font-bold text-base leading-none tracking-tight text-white">DeskFlow</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">Support Triage</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg font-medium text-sm transition-all duration-200">
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span>Dashboard</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-white bg-zinc-800/80 border border-zinc-700/30 rounded-lg font-medium text-sm transition-all duration-200">
          <span className="material-symbols-outlined text-[20px] text-blue-500">view_kanban</span>
          <span>Triage Board</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg font-medium text-sm transition-all duration-200">
          <span className="material-symbols-outlined text-[20px]">analytics</span>
          <span>Analytics</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg font-medium text-sm transition-all duration-200">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* User profile */}
      <div className="border-t border-zinc-800/60 pt-4 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-500">NT</div>
          <div className="overflow-hidden">
            <div className="font-semibold text-sm leading-none text-zinc-200 truncate">Nihal Tarwariya</div>
            <div className="text-[11px] text-zinc-500 mt-1 font-medium truncate">Triage Lead</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
