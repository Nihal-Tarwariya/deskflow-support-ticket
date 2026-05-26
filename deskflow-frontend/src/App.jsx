import React, { useState } from 'react';
import { useTickets } from './hooks/useTickets';
import Sidebar from './components/Sidebar';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import Board from './components/Board';
import CreateTicketModal from './components/CreateTicketModal';

export default function App() {
  const [showModal, setShowModal] = useState(false);
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

  // Filter tickets by search query locally for instant responsiveness
  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-[#f4f4f5]">
      {/* ── Left Sidebar ── */}
      <Sidebar />

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col pl-[260px] h-screen overflow-hidden relative">
        
        {/* ── Page Header ── */}
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
            
            {/* Quick Live Indicator */}
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

        {/* ── Filter Bar ── */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterBreached={filterBreached}
          setFilterBreached={setFilterBreached}
          onNewTicket={() => setShowModal(true)}
        />

        {/* ── Kanban Board Canvas ── */}
        <main className="flex-1 p-8 overflow-hidden flex flex-col bg-background/50" role="main">
          <Board
            tickets={filteredTickets}
            loading={loading}
            error={error}
            onMove={moveTicket}
            onDelete={removeTicket}
          />
        </main>
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
