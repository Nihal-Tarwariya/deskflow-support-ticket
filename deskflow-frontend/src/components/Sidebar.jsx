import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'board', label: 'Triage Board', icon: 'view_kanban' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar({ currentView, setCurrentView }) {
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

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 outline-none active:scale-[0.98] ${
                isActive
                  ? 'text-white bg-zinc-850 border border-zinc-700/30 shadow-sm ring-1 ring-blue-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-blue-500 font-bold' : ''}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-zinc-800/60 pt-4 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-500">NT</div>
          <div className="overflow-hidden">
            <div className="font-semibold text-sm leading-none text-zinc-200 truncate">Nihal Tarwariya</div>
            <div className="text-[11px] text-zinc-500 mt-1 font-medium truncate font-mono">21BCE10243</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
