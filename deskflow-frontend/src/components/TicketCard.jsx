import React, { useState } from 'react';

const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed'];

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const PRIORITY_THEMES = {
  low: {
    label: 'Low',
    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700/40',
    borderClass: 'border-zinc-800 hover:border-zinc-700',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    borderClass: 'border-zinc-800 hover:border-blue-500/30',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    borderClass: 'border-zinc-800 hover:border-orange-500/30',
  },
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    borderClass: 'border-zinc-800 hover:border-red-500/40',
  },
};

function formatAge(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  const days = Math.floor(hours / 24);
  const hrs = hours % 24;
  return `${days}d${hrs > 0 ? ` ${hrs}h` : ''}`;
}

function getValidMoves(currentStatus) {
  const idx = STATUS_ORDER.indexOf(currentStatus);
  const moves = [];
  if (idx > 0) moves.push({ status: STATUS_ORDER[idx - 1], direction: 'back' });
  if (idx < STATUS_ORDER.length - 1) moves.push({ status: STATUS_ORDER[idx + 1], direction: 'forward' });
  return moves;
}

export default function TicketCard({ ticket, onMove, onDelete, isDragging }) {
  const [moving, setMoving] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const validMoves = getValidMoves(ticket.status);
  const theme = PRIORITY_THEMES[ticket.priority] || PRIORITY_THEMES.low;

  async function handleMove(newStatus) {
    setMoving(newStatus);
    try {
      await onMove(ticket._id, newStatus);
    } catch (err) {
      alert(`Failed to move ticket: ${err.message}`);
    } finally {
      setMoving(null);
    }
  }

  async function handleDelete(e) {
    e.stopPropagation();
    if (!confirm(`Delete ticket "${ticket.subject}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(ticket._id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`ticket-card motion-safe:opacity-0 motion-safe:animate-slide-up-fade bg-[#121214] border ${
        theme.borderClass
      } ${ticket.slaBreached ? 'pt-7 border-red-500/20' : ''} ${
        isDragging ? 'opacity-40 scale-95' : 'hover:scale-[1.01] hover:shadow-lg'
      } rounded-lg p-4 cursor-pointer group transition-all duration-300 relative flex flex-col`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('ticketId', ticket._id);
        e.dataTransfer.setData('ticketStatus', ticket.status);
        e.dataTransfer.effectAllowed = 'move';
      }}
      id={`ticket-${ticket._id}`}
    >
      {/* SLA Banner */}
      {ticket.slaBreached && (
        <div className="animate-pulse-subtle absolute top-0 left-0 w-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-t-lg border-b border-red-500/20 flex items-center gap-1.5 select-none">
          <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
          SLA Breached
        </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-center mb-2.5">
        <span className={`border text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${theme.badgeClass}`}>
          {theme.label}
        </span>
        <span className="text-zinc-500 text-xs font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-zinc-600">schedule</span>
          {formatAge(ticket.ageMinutes)}
        </span>
      </div>

      {/* Subject */}
      <h4 className={`text-sm font-semibold leading-snug mb-3 flex-1 transition-colors ${
        ticket.status === 'resolved' || ticket.status === 'closed'
          ? 'text-zinc-500 line-through decoration-zinc-700/80 font-normal'
          : 'text-zinc-200'
      }`}>
        {ticket.subject}
      </h4>

      {/* Customer Email & Quick Actions */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800/40">
        <div className="text-[10px] text-zinc-500 truncate max-w-[150px] font-medium" title={ticket.customerEmail}>
          {ticket.customerEmail}
        </div>

        {/* Action Controls */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-zinc-500">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors duration-150 active:scale-90 outline-none"
            title="Delete ticket"
            id={`delete-${ticket._id}`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {deleting ? 'more_horiz' : 'delete'}
            </span>
          </button>

          {validMoves.map(({ status, direction }) => (
            <button
              key={status}
              onClick={(e) => {
                e.stopPropagation();
                handleMove(status);
              }}
              disabled={!!moving || deleting}
              className="p-1 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors duration-150 active:scale-90 outline-none"
              title={`Move to ${STATUS_LABELS[status]}`}
              id={`move-${ticket._id}-${status.replace('_', '-')}`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">
                {moving === status ? 'more_horiz' : (direction === 'back' ? 'arrow_back' : 'arrow_forward')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
