import React from 'react';
import Column from './Column';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export default function Board({ tickets, loading, error, onMove, onDelete }) {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 select-none animate-fade-in">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-medium text-sm tracking-wide font-display">Initializing triage canvas…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 select-none px-6">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 animate-bounce">
          <span className="material-symbols-outlined text-2xl font-bold">warning</span>
        </div>
        <h3 className="text-zinc-200 font-semibold text-base mb-1 font-display">Triage Canvas Error</h3>
        <p className="text-zinc-500 font-medium text-sm max-w-md text-center leading-relaxed">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-5 px-4 py-1.5 bg-[#121214] border border-[#1f1f23] hover:border-zinc-700/60 hover:bg-zinc-800/40 text-zinc-300 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 kanban-scroll">
      <div className="flex gap-6 h-full min-w-max">
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
    </div>
  );
}
