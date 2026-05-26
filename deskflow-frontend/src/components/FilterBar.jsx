import React from 'react';

const PRIORITIES = [
  { value: '', label: 'All' },
  { value: 'low', label: 'Low', colorClass: 'hover:text-zinc-200 border-zinc-700/30' },
  { value: 'medium', label: 'Medium', colorClass: 'hover:text-blue-400 hover:border-blue-500/20' },
  { value: 'high', label: 'High', colorClass: 'hover:text-orange-400 hover:border-orange-500/20' },
  { value: 'urgent', label: 'Urgent', colorClass: 'hover:text-red-400 hover:border-red-500/20' },
];

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  filterBreached,
  setFilterBreached,
  onNewTicket,
}) {
  return (
    <div className="border-b border-[#1f1f23] bg-[#0b0e15]/40 backdrop-blur-md px-8 py-3.5 shrink-0 flex items-center justify-between gap-4 select-none animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-5 flex-1">
        {/* Search */}
        <div className="relative w-72 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm group-focus-within:text-blue-500 transition-colors">
            search
          </span>
          <input
            className="w-full bg-[#121214] border border-[#1f1f23] rounded-lg py-1.5 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none"
            placeholder="Search tickets by subject..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#121214] border border-[#1f1f23] rounded-lg p-1">
          {PRIORITIES.map((p) => {
            const isActive = filterPriority === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setFilterPriority(p.value)}
                className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-zinc-800 border border-zinc-700/40 text-white shadow-sm ring-1 ring-blue-500/20'
                    : `text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-300 border border-transparent ${p.colorClass}`
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* SLA Breach Only Checkbox */}
        <label className="flex items-center gap-2.5 cursor-pointer group select-none">
          <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center relative ${
            filterBreached 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-[#1f1f23] bg-[#121214] group-hover:border-zinc-700'
          }`}>
            <input
              type="checkbox"
              className="opacity-0 absolute inset-0 cursor-pointer"
              checked={filterBreached}
              onChange={(e) => setFilterBreached(e.target.checked)}
            />
            {filterBreached && (
              <span className="material-symbols-outlined text-[12px] text-blue-500 font-bold">
                check
              </span>
            )}
          </div>
          <span className={`text-xs font-medium transition-colors ${
            filterBreached ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-300'
          }`}>
            SLA Breach Only
          </span>
        </label>
      </div>

      {/* New Ticket Button */}
      <button
        onClick={onNewTicket}
        className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/10 border border-blue-400/20 transition-all duration-200 outline-none"
      >
        <span className="material-symbols-outlined text-sm font-bold">add</span>
        <span>New Ticket</span>
      </button>
    </div>
  );
}
