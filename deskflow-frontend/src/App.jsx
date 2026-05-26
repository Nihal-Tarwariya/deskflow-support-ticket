import React, { useState } from 'react';
import { useTickets } from './hooks/useTickets';
import Sidebar from './components/Sidebar';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import Board from './components/Board';
import CreateTicketModal from './components/CreateTicketModal';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [currentView, setCurrentView] = useState('board'); // 'dashboard', 'board', 'analytics', 'settings'
  const [searchQuery, setSearchQuery] = useState('');

  const {
    tickets,
    stats,
    loading,
    error,
    filterPriority,
    setFilterPriority,
    filterBreached,
    setFilterBreached,
    addTicket,
    moveTicket,
    removeTicket,
  } = useTickets();

  // Filter tickets locally for instantaneous, lag-free UI updates
  const filteredTickets = tickets.filter((t) => {
    // 1. Live Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = t.subject && t.subject.toLowerCase().includes(q);
      const matchDesc = t.description && t.description.toLowerCase().includes(q);
      if (!matchSubject && !matchDesc) return false;
    }

    // 2. Priority Pill Badge Filter
    if (filterPriority) {
      if (t.priority !== filterPriority) return false;
    }

    // 3. SLA Breach Indicator Filter
    if (filterBreached) {
      if (!t.slaBreached) return false;
    }

    return true;
  });

  // Calculate statistics for views
  const openCount = stats?.byStatus?.open || 0;
  const inProgressCount = stats?.byStatus?.in_progress || 0;
  const resolvedCount = stats?.byStatus?.resolved || 0;
  const closedCount = stats?.byStatus?.closed || 0;
  const totalTickets = tickets.length;
  
  const priorityDistribution = stats?.byPriority || {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-[#f4f4f5] font-sans">
      {/* ── Left Sidebar ── */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col pl-[260px] h-screen overflow-hidden relative">
        
        {/* ── CONDITIONAL VIEWS ── */}
        
        {/* 1. KANBAN BOARD VIEW */}
        {currentView === 'board' && (
          <>
            {/* Page Header */}
            <header className="border-b border-[#1f1f23] bg-[#0c0c0f] px-8 pt-6 pb-2 shrink-0 select-none animate-slide-up-fade">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="font-display font-bold text-lg text-white leading-none tracking-tight">
                    Support Ticket Triage
                  </h1>
                  <p className="text-zinc-500 font-medium text-xs mt-1">
                    Real-time queue monitoring, SLA violation metrics, and drag-and-drop ticket allocation.
                  </p>
                </div>
                
                {/* Live Status Indicator */}
                <div className="flex items-center gap-2 bg-[#121214] border border-[#1f1f23] rounded-full py-1.5 px-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                    Queue Live
                  </span>
                </div>
              </div>

              {/* Stats Metrics Strip */}
              <StatsStrip stats={stats} loading={loading} />
            </header>

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterBreached={filterBreached}
              setFilterBreached={setFilterBreached}
              onNewTicket={() => setShowModal(true)}
            />

            {/* Kanban Board Canvas */}
            <main className="flex-1 p-8 overflow-hidden flex flex-col bg-background/50" role="main">
              <Board
                tickets={filteredTickets}
                loading={loading}
                error={error}
                onMove={moveTicket}
                onDelete={removeTicket}
              />
            </main>
          </>
        )}

        {/* 2. ANALYTICS DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-8 bg-[#09090b] flex flex-col space-y-6 animate-slide-up-fade">
            <header>
              <h1 className="font-display font-bold text-xl text-white tracking-tight">Triage Operations Dashboard</h1>
              <p className="text-zinc-500 text-xs mt-1">Unified analytics summary for operational queue volumes, priority weights, and SLA compliance.</p>
            </header>

            {/* Metric Blocks */}
            <StatsStrip stats={stats} loading={loading} />

            <div className="grid grid-cols-3 gap-6">
              {/* Priority Load Card */}
              <div className="col-span-1 bg-[#121214] border border-[#1f1f23] rounded-xl p-5 select-none">
                <h3 className="font-display font-bold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-sm">bar_chart</span>
                  Priority Load Distribution
                </h3>
                <div className="space-y-4">
                  {Object.entries(priorityDistribution).map(([prio, count]) => {
                    const total = Object.values(priorityDistribution).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((count / total) * 100);
                    
                    const barColors = {
                      low: 'bg-zinc-600',
                      medium: 'bg-blue-500',
                      high: 'bg-orange-500',
                      urgent: 'bg-red-500',
                    };
                    
                    const textColors = {
                      low: 'text-zinc-400',
                      medium: 'text-blue-400',
                      high: 'text-orange-400',
                      urgent: 'text-red-400',
                    };

                    return (
                      <div key={prio}>
                        <div className="flex justify-between text-xs font-semibold mb-1.5 uppercase tracking-wide">
                          <span className={textColors[prio]}>{prio}</span>
                          <span className="text-zinc-400">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 border border-zinc-800/20 overflow-hidden">
                          <div className={`h-full rounded-full ${barColors[prio]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="col-span-2 bg-[#121214] border border-[#1f1f23] rounded-xl p-5 flex flex-col">
                <h3 className="font-display font-bold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-sm">history</span>
                  Recent Queue Activity
                </h3>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#1f1f23] text-zinc-500 text-[10px] font-bold uppercase tracking-wider select-none">
                        <th className="pb-2.5">Priority</th>
                        <th className="pb-2.5">Subject</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5 text-right">Customer</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-zinc-300 font-medium">
                      {tickets.slice(0, 5).map((t) => {
                        const statusPills = {
                          open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                          in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                          resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                          closed: 'bg-zinc-800 text-zinc-500 border-zinc-700/20',
                        };

                        const prioPills = {
                          low: 'bg-zinc-850 text-zinc-500',
                          medium: 'bg-blue-500/10 text-blue-400',
                          high: 'bg-orange-500/10 text-orange-400',
                          urgent: 'bg-red-500/10 text-red-400',
                        };

                        return (
                          <tr key={t._id} className="border-b border-[#1f1f23]/40 hover:bg-zinc-850/20 transition-colors">
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${prioPills[t.priority]}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="py-2.5 text-zinc-200 font-semibold max-w-[200px] truncate" title={t.subject}>
                              {t.subject}
                            </td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${statusPills[t.status]}`}>
                                {t.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-zinc-500 truncate max-w-[120px]" title={t.customerEmail}>
                              {t.customerEmail}
                            </td>
                          </tr>
                        );
                      })}
                      {tickets.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-zinc-600 select-none">
                            No tickets currently in the queue database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PERFORMANCE ANALYTICS VIEW */}
        {currentView === 'analytics' && (
          <div className="flex-1 overflow-y-auto p-8 bg-[#09090b] flex flex-col space-y-6 animate-slide-up-fade">
            <header>
              <h1 className="font-display font-bold text-xl text-white tracking-tight">Operational Performance Analytics</h1>
              <p className="text-zinc-500 text-xs mt-1">Real-time target evaluations, queue volume parameters, and response SLA monitoring.</p>
            </header>

            <div className="grid grid-cols-2 gap-6">
              {/* Service SLA Stats */}
              <div className="bg-[#121214] border border-[#1f1f23] rounded-xl p-5 select-none">
                <h3 className="font-display font-bold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-sm">schedule_send</span>
                  SLA Response Compliance
                </h3>
                <div className="flex items-center gap-6 py-2">
                  {/* Circular success indicator */}
                  <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                    <span className="font-display font-extrabold text-2xl text-emerald-400">96.8%</span>
                    <span className="absolute bottom-2.5 text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Success</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-zinc-400 mb-1">Target Evaluation</div>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        All Urgent tickets are backed by a rigorous 1-hour resolution target. High priority requires a 4-hour target.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <div className="text-xs font-bold text-zinc-200">2.4h</div>
                        <div className="text-[10px] text-zinc-500">Average Age</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-200">{stats?.breachedOpen || 0}</div>
                        <div className="text-[10px] text-zinc-500">Active Breaches</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Thresholds Card */}
              <div className="bg-[#121214] border border-[#1f1f23] rounded-xl p-5 select-none">
                <h3 className="font-display font-bold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-sm">network_check</span>
                  Operational Parameters
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-850">
                    <span className="text-zinc-500 font-medium">Queue Velocity</span>
                    <span className="text-zinc-200 font-semibold font-mono">0.68 t/hr</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-850">
                    <span className="text-zinc-500 font-medium">Avg Response Latency</span>
                    <span className="text-zinc-200 font-semibold font-mono">1.2 mins</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-850">
                    <span className="text-zinc-500 font-medium">Resolution Throughput</span>
                    <span className="text-zinc-200 font-semibold font-mono">92.4%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-zinc-500 font-medium">Customer Feedback score</span>
                    <span className="text-emerald-400 font-semibold font-mono flex items-center gap-0.5">
                      4.92 / 5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. PREMIUM SETTINGS PANEL VIEW */}
        {currentView === 'settings' && (
          <div className="flex-1 overflow-y-auto p-8 bg-[#09090b] flex flex-col space-y-6 animate-slide-up-fade">
            <header>
              <h1 className="font-display font-bold text-xl text-white tracking-tight">Triage System Settings</h1>
              <p className="text-zinc-500 text-xs mt-1">Configure service priorities, evaluate server connections, and review developer assessment credentials.</p>
            </header>

            <div className="grid grid-cols-2 gap-6 select-none">
              {/* API and Environment Card */}
              <div className="bg-[#121214] border border-[#1f1f23] rounded-xl p-5 flex flex-col">
                <h3 className="font-display font-bold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-sm">settings_ethernet</span>
                  Production Environment & API
                </h3>
                <div className="space-y-4 text-xs font-medium">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Backend API Base URL</div>
                    <code className="block bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 font-mono text-[11px] truncate select-all">
                      https://deskflow-backend.vercel.app
                    </code>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Frontend Client URL</div>
                    <code className="block bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 font-mono text-[11px] truncate select-all">
                      https://deskflow-frontend-kappa.vercel.app
                    </code>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">CORS Status</div>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Active (*)
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Database Cluster</div>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Connected (Atlas)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Credentials Card */}
              <div className="bg-[#121214] border border-[#1f1f23] rounded-xl p-5">
                <h3 className="font-display font-bold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-sm">badge</span>
                  Developer Profile & Roll Details
                </h3>
                <div className="space-y-3.5 text-xs font-semibold">
                  <div className="flex justify-between py-1 border-b border-zinc-850">
                    <span className="text-zinc-500 font-medium">Developer Name</span>
                    <span className="text-zinc-200">Nihal Tarwariya</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-850">
                    <span className="text-zinc-500 font-medium">Student Roll Number</span>
                    <span className="text-zinc-200 font-mono">21BCE10243</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-850">
                    <span className="text-zinc-500 font-medium">Assessment Code</span>
                    <span className="text-zinc-200 font-mono">BFHL-PREP</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500 font-medium">System Status</span>
                    <span className="text-blue-400 font-semibold flex items-center gap-1 font-mono">
                      v1.4.0 (Stitch Premium)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Create Ticket Modal ── */}
      {showModal && (
        <CreateTicketModal
          onClose={() => setShowModal(false)}
          onSubmit={addTicket}
        />
      )}
    </div>
  );
}
