/**
 * SLA target in minutes per priority level.
 */
const SLA_TARGETS = {
  urgent: 60,      // 1 hour
  high: 240,       // 4 hours
  medium: 1440,    // 24 hours
  low: 4320,       // 72 hours
};

/**
 * Returns SLA target in minutes for a given priority.
 * @param {string} priority
 * @returns {number}
 */
function getSlaTargetMinutes(priority) {
  return SLA_TARGETS[priority] ?? Infinity;
}

/**
 * Computes derived fields for a ticket document.
 * - ageMinutes: minutes from createdAt to resolvedAt (if resolved/closed) or now.
 * - slaBreached: true if ticket exceeded its priority-based SLA target.
 *
 * @param {object} ticket - plain ticket object (or mongoose doc with .toObject())
 * @returns {{ ageMinutes: number, slaBreached: boolean }}
 */
function computeDerivedFields(ticket) {
  const slaTarget = getSlaTargetMinutes(ticket.priority);
  const createdAt = new Date(ticket.createdAt);
  const now = new Date();

  const isResolved = ticket.status === 'resolved' || ticket.status === 'closed';

  // For resolved/closed tickets, age is frozen at resolution time.
  const endTime = isResolved && ticket.resolvedAt ? new Date(ticket.resolvedAt) : now;

  const ageMinutes = Math.floor((endTime - createdAt) / (1000 * 60));

  let slaBreached;
  if (isResolved && ticket.resolvedAt) {
    // Breached if resolution happened after the target
    slaBreached = ageMinutes > slaTarget;
  } else {
    // Still open — breached if current age exceeds target
    slaBreached = ageMinutes > slaTarget;
  }

  return { ageMinutes, slaBreached };
}

module.exports = { getSlaTargetMinutes, computeDerivedFields, SLA_TARGETS };
