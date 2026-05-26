import React, { useState } from 'react';
import TicketCard from './TicketCard';

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const STATUS_ICONS = {
  open: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  in_progress: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 4.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  resolved: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  closed: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function Column({ status, tickets, onMove, onDelete, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [snapBack, setSnapBack] = useState(false);

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
      // Snap-back animation for invalid drops
      setSnapBack(true);
      setTimeout(() => setSnapBack(false), 600);
    }
  }

  return (
    <div
      className={`column${isDragOver ? ' column--drag-over' : ''}${snapBack ? ' column--snap-back' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      id={`column-${status.replace('_', '-')}`}
    >
      <div className="column__header">
        <div className="column__title">
          <span className={`column__icon column__icon--${status.replace('_', '-')}`}>
            {STATUS_ICONS[status]}
          </span>
          <h2 className="column__name">{STATUS_LABELS[status]}</h2>
        </div>
        <span className="column__count">{tickets.length}</span>
      </div>

      <div className="column__cards">
        {tickets.length === 0 ? (
          <div className="column__empty">
            <p>No tickets</p>
          </div>
        ) : (
          tickets.map((ticket) => (
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
