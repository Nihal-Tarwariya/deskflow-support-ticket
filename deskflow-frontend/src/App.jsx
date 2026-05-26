import React, { useState } from 'react';
import { useTickets } from './hooks/useTickets';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import Board from './components/Board';
import CreateTicketModal from './components/CreateTicketModal';
import './index.css';

export default function App() {
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">🎫</div>
          <div>
            <div className="header__title">DeskFlow</div>
            <div className="header__subtitle">Support Ticket Triage</div>
          </div>
        </div>
      </header>

      {/* ── Stats Strip ── */}
      <StatsStrip stats={stats} loading={loading} />

      {/* ── Main Content ── */}
      <main className="main" role="main">
        <FilterBar
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterBreached={filterBreached}
          setFilterBreached={setFilterBreached}
          onNewTicket={() => setShowModal(true)}
        />

        <Board
          tickets={tickets}
          loading={loading}
          error={error}
          onMove={moveTicket}
          onDelete={removeTicket}
        />
      </main>

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
