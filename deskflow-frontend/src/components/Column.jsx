import React, { useState } from 'react';
import TicketCard from './TicketCard';

const STATUS_CONFIGS = {
  open: {
    label: 'Open',
    icon: 'radio_button_unchecked',
    iconColorClass: 'text-blue-400',
    headerClass: 'border-b-2 border-blue-500/20',
  },
  in_progress: {
    label: 'In Progress',
    icon: 'data_usage',
    iconColorClass: 'text-amber-500 animate-[spin_3s_linear_infinite]',
    headerClass: 'border-b-2 border-amber-500/20',
  },
  resolved: {
    label: 'Resolved',
    icon: 'check_circle',
    iconColorClass: 'text-emerald-500',
    headerClass: 'border-b-2 border-emerald-500/20',
  },
  closed: {
    label: 'Closed',
    icon: 'inventory_2',
    iconColorClass: 'text-zinc-500',
    headerClass: 'border-b-2 border-zinc-700/20',
  },
};

export default function Column({ status, tickets, onMove, onDelete, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [snapBack, setSnapBack] = useState(false);

  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.open;

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const ticketId = e.dataTransfer.getData('ticketId');
    const fromStatus = e.dataTransfer.getData('ticketStatus');

    if (!ticketId || fromStatus === status) return;

    try {
      await onDrop(ticketId, status);
    } catch (err) {
      setSnapBack(true);
      setTimeout(() => setSnapBack(false), 500);
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-[300px] flex flex-col h-full shrink-0 select-none transition-all duration-300 rounded-xl bg-[#0e0e11] border border-[#1f1f23]/60 p-4 ${
        isDragOver ? 'bg-zinc-800/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.05)]' : ''
      } ${snapBack ? 'animate-bounce' : ''}`}
      id={`column-${status.replace('_', '-')}`}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between pb-3.5 mb-4 ${config.headerClass}`}>
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[18px] font-bold ${config.iconColorClass}`}>
            {config.icon}
          </span>
          <h3 className="font-display font-bold text-sm tracking-tight text-zinc-100">
            {config.label}
          </h3>
        </div>
        <span className="bg-[#121214] border border-[#1f1f23] text-zinc-400 text-xs font-semibold px-2 py-0.5 rounded-md min-w-[20px] text-center font-mono">
          {tickets.length}
        </span>
      </div>

      {/* Cards Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 kanban-scroll">
        {tickets.length === 0 ? (
          status === 'closed' ? (
            <div className="border border-dashed border-[#1f1f23] rounded-lg bg-zinc-900/10 flex flex-col items-center justify-center p-6 text-center h-32 text-zinc-600 transition-colors hover:border-zinc-800">
              <span className="material-symbols-outlined text-[28px] mb-1.5 text-zinc-600">archive</span>
              <p className="text-[11px] font-medium tracking-wide">Archived tickets</p>
            </div>
          ) : (
            <div className="border border-dashed border-[#1f1f23] rounded-lg bg-zinc-900/10 flex flex-col items-center justify-center p-6 text-center h-32 text-zinc-600 transition-colors hover:border-zinc-800">
              <span className="material-symbols-outlined text-[28px] mb-1.5 text-zinc-700">inbox</span>
              <p className="text-[11px] font-medium tracking-wide">No tickets in here</p>
            </div>
          )
        ) : (
          tickets.map((ticket, idx) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
