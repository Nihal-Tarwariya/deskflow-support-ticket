import React, { useState } from 'react';

const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed'];

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

/**
 * Format minutes into a human-readable age string (e.g. "3h 12m", "2d 5h").
 */
function formatAge(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  const days = Math.floor(hours / 24);
  const hrs = hours % 24;
  return `${days}d${hrs > 0 ? ` ${hrs}h` : ''}`;
}

/**
 * Returns which status buttons to show for a given current status.
 * Rules: one step forward, one step back.
 */
function getValidMoves(currentStatus) {
  const idx = STATUS_ORDER.indexOf(currentStatus);
  const moves = [];
  if (idx > 0) moves.push({ status: STATUS_ORDER[idx - 1], direction: 'back' });
  if (idx < STATUS_ORDER.length - 1) moves.push({ status: STATUS_ORDER[idx + 1], direction: 'forward' });
  return moves;
}

export default function TicketCard({ ticket, onMove, onDelete, isDragging }) {
  const [moving, setMoving] = useState(null); // status being moved to
  const [moveError, setMoveError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const validMoves = getValidMoves(ticket.status);

  async function handleMove(newStatus) {
    setMoving(newStatus);
    setMoveError(null);
    try {
      await onMove(ticket._id, newStatus);
    } catch (err) {
      setMoveError(err.message);
      setTimeout(() => setMoveError(null), 3000);
    } finally {
      setMoving(null);
    }
  }

  async function handleDelete() {
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
      className={`ticket-card priority--${ticket.priority}${ticket.slaBreached ? ' ticket-card--breached' : ''}${isDragging ? ' ticket-card--dragging' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('ticketId', ticket._id);
        e.dataTransfer.setData('ticketStatus', ticket.status);
        e.dataTransfer.effectAllowed = 'move';
      }}
      id={`ticket-${ticket._id}`}
    >
      {/* Header row */}
      <div className="ticket-card__header">
        <span className={`priority-badge priority-badge--${ticket.priority}`}>
          {PRIORITY_LABELS[ticket.priority]}
        </span>
        {ticket.slaBreached && (
          <span className="sla-badge" title="SLA Breached">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M6 5v2.5M6 9h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            SLA Breach
          </span>
        )}
      </div>

      {/* Subject */}
      <h3 className="ticket-card__subject">{ticket.subject}</h3>

      {/* Meta */}
      <div className="ticket-card__meta">
        <span className="ticket-card__age" title="Time since creation">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatAge(ticket.ageMinutes)}
        </span>
        {(ticket.status === 'resolved' || ticket.status === 'closed') && (
          <span className="ticket-card__resolved-tag">Frozen</span>
        )}
      </div>

      {/* Move error */}
      {moveError && (
        <div className="ticket-card__error" role="alert">{moveError}</div>
      )}

      {/* Actions */}
      <div className="ticket-card__actions">
        <div className="ticket-card__move-btns">
          {validMoves.map(({ status, direction }) => (
            <button
              key={status}
              className={`btn btn--move btn--move-${direction}`}
              onClick={() => handleMove(status)}
              disabled={!!moving || deleting}
              title={`Move to ${STATUS_LABELS[status]}`}
              id={`move-${ticket._id}-${status.replace('_', '-')}`}
            >
              {direction === 'back' ? '← ' : ''}
              {STATUS_LABELS[status]}
              {direction === 'forward' ? ' →' : ''}
              {moving === status && '…'}
            </button>
          ))}
        </div>
        <button
          className="btn btn--delete"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete ticket"
          id={`delete-${ticket._id}`}
          aria-label="Delete ticket"
        >
          {deleting ? '…' : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5.5 3.5V2.5h3V3.5M4 3.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
