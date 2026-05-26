import { useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api/tickets';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filterPriority, setFilterPriority] = useState('');
  const [filterBreached, setFilterBreached] = useState(false);

  const statsIntervalRef = useRef(null);

  const fetchTickets = useCallback(async () => {
    try {
      setError(null);
      const filters = {};
      if (filterPriority) filters.priority = filterPriority;
      if (filterBreached) filters.breached = true;
      const data = await api.getTickets(filters);
      setTickets(data);
    } catch (err) {
      setError(err.message);
    }
  }, [filterPriority, filterBreached]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch {
      // stats failure is non-blocking
    }
  }, []);

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTickets(), fetchStats()]).finally(() => setLoading(false));
  }, [fetchTickets, fetchStats]);

  // Auto-refresh stats every 30s
  useEffect(() => {
    statsIntervalRef.current = setInterval(fetchStats, 30000);
    return () => clearInterval(statsIntervalRef.current);
  }, [fetchStats]);

  /**
   * Creates a new ticket and prepends it to the board.
   */
  const addTicket = useCallback(async (formData) => {
    const ticket = await api.createTicket(formData);
    setTickets((prev) => [ticket, ...prev]);
    fetchStats();
    return ticket;
  }, [fetchStats]);

  /**
   * Moves a ticket to a new status. Returns updated ticket or throws on error.
   */
  const moveTicket = useCallback(async (id, newStatus) => {
    const updated = await api.updateTicket(id, { status: newStatus });
    setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
    fetchStats();
    return updated;
  }, [fetchStats]);

  /**
   * Deletes a ticket and removes it from state.
   */
  const removeTicket = useCallback(async (id) => {
    await api.deleteTicket(id);
    setTickets((prev) => prev.filter((t) => t._id !== id));
    fetchStats();
  }, [fetchStats]);

  return {
    tickets,
    stats,
    loading,
    error,
    filterPriority,
    setFilterPriority,
    filterBreached,
    setFilterBreached,
    fetchTickets,
    addTicket,
    moveTicket,
    removeTicket,
  };
}
