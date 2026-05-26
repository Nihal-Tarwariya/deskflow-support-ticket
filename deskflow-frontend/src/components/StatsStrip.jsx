import React from 'react';

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function StatsStrip({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="stats-strip stats-strip--loading">
        <span className="stats-loading-text">Loading stats…</span>
      </div>
    );
  }

  const statuses = ['open', 'in_progress', 'resolved', 'closed'];

  return (
    <div className="stats-strip">
      {statuses.map((s) => (
        <div key={s} className={`stats-item stats-item--${s.replace('_', '-')}`}>
          <span className="stats-count">{stats.byStatus[s] ?? 0}</span>
          <span className="stats-label">{STATUS_LABELS[s]}</span>
        </div>
      ))}
      <div className="stats-divider" />
      <div className="stats-item stats-item--breached">
        <span className="stats-count stats-count--breached">{stats.breachedOpen ?? 0}</span>
        <span className="stats-label">SLA Breached</span>
      </div>
    </div>
  );
}
