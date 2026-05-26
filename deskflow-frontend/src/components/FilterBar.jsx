import React from 'react';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function FilterBar({ filterPriority, setFilterPriority, filterBreached, setFilterBreached, onNewTicket }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__left">
        <div className="filter-group">
          <label className="filter-label" htmlFor="priority-filter">Priority</label>
          <select
            id="priority-filter"
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <label className="filter-toggle" htmlFor="breached-filter">
          <input
            id="breached-filter"
            type="checkbox"
            className="filter-toggle__input"
            checked={filterBreached}
            onChange={(e) => setFilterBreached(e.target.checked)}
          />
          <span className="filter-toggle__track">
            <span className="filter-toggle__thumb" />
          </span>
          <span className="filter-toggle__label">SLA Breached Only</span>
        </label>
      </div>

      <button id="new-ticket-btn" className="btn btn--primary" onClick={onNewTicket}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        New Ticket
      </button>
    </div>
  );
}
