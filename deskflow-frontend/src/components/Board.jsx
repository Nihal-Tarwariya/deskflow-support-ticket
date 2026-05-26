import React from 'react';
import Column from './Column';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export default function Board({ tickets, loading, error, onMove, onDelete }) {
  if (loading) {
    return (
      <div className="board-loading">
        <div className="spinner" />
        <p>Loading tickets…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="board-error">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="board">
      {STATUSES.map((status) => (
        <Column
          key={status}
          status={status}
          tickets={tickets.filter((t) => t.status === status)}
          onMove={onMove}
          onDelete={onDelete}
          onDrop={onMove}
        />
      ))}
    </div>
  );
}
