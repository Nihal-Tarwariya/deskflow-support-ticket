import React from 'react';

export default function StatsStrip({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="flex gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-20 bg-zinc-900 border border-zinc-800/60 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const { byStatus = {}, breachedOpen = 0 } = stats;
  const openCount = byStatus.open || 0;
  const inProgressCount = byStatus.in_progress || 0;
  const resolvedCount = byStatus.resolved || 0;
  const closedCount = byStatus.closed || 0;
  const totalUnresolved = openCount + inProgressCount;
  
  // Calculate dynamic SLA Success Rate
  const slaSuccessRate = totalUnresolved > 0
    ? Math.round(((totalUnresolved - breachedOpen) / totalUnresolved) * 100)
    : 100;

  const metrics = [
    {
      label: 'Open Tickets',
      value: openCount,
      change: 'Active pool',
      icon: 'radio_button_unchecked',
      colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      change: 'Assigned & active',
      icon: 'data_usage',
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20 animate-spin-slow',
    },
    {
      label: 'SLA Breaches',
      value: breachedOpen,
      change: breachedOpen > 0 ? 'Action required' : 'All clear',
      icon: 'warning',
      colorClass: breachedOpen > 0 
        ? 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse-subtle' 
        : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Resolved Today',
      value: resolvedCount,
      change: 'Ready to close',
      icon: 'check_circle',
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6 select-none animate-slide-up-fade">
      {metrics.map((m, idx) => (
        <div 
          key={m.label} 
          className="bg-[#121214] border border-[#1f1f23] rounded-lg p-4 flex items-center justify-between transition-all duration-300 hover:border-zinc-800 hover:-translate-y-0.5"
          style={{ animationDelay: `${idx * 75}ms` }}
        >
          <div>
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider font-display">{m.label}</div>
            <div className="text-2xl font-bold text-white mt-1.5 font-display flex items-baseline gap-2">
              {m.value}
              <span className="text-[10px] text-zinc-400 font-normal font-sans tracking-normal">{m.change}</span>
            </div>
          </div>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${m.colorClass}`}>
            <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
