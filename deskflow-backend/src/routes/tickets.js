const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { computeDerivedFields, SLA_TARGETS } = require('../utils/sla');
const { validateTransition, validateCreateBody, validatePatchBody } = require('../middleware/validate');

/**
 * Appends ageMinutes and slaBreached to a plain ticket object.
 */
function withDerived(ticketObj) {
  const derived = computeDerivedFields(ticketObj);
  return { ...ticketObj, ...derived };
}

// ─── POST /tickets ────────────────────────────────────────────────────────────
router.post('/', validateCreateBody, async (req, res) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;

    const ticket = await Ticket.create({
      subject: subject.trim(),
      description: description.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      priority,
    });

    const plain = ticket.toObject();
    return res.status(201).json(withDerived(plain));
  } catch (err) {
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Validation failed', details });
    }
    console.error('POST /tickets error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /tickets ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, priority, breached } = req.query;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    const validPriorities = ['low', 'medium', 'high', 'urgent'];

    const query = {};

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}` });
      }
      query.status = status;
    }

    if (priority) {
      const priorities = priority.split(',').map((p) => p.trim());
      const invalid = priorities.filter((p) => !validPriorities.includes(p));
      if (invalid.length > 0) {
        return res.status(400).json({ error: `Invalid priority filter: ${invalid.join(', ')}. Must be one of: ${validPriorities.join(', ')}` });
      }
      query.priority = { $in: priorities };
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean();

    let result = tickets.map(withDerived);

    // Apply breached filter post-fetch (derived field, not stored in DB)
    if (breached === 'true') {
      result = result.filter((t) => t.slaBreached === true);
    }

    return res.json(result);
  } catch (err) {
    console.error('GET /tickets error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /tickets/stats ───────────────────────────────────────────────────────
// IMPORTANT: This route must be defined BEFORE /:id to avoid "stats" being treated as an id.
router.get('/stats', async (req, res) => {
  try {
    // Counts per status
    const statusCounts = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Counts per priority
    const priorityCounts = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Fetch all open/in_progress tickets to compute slaBreached count
    const unresolvedTickets = await Ticket.find({
      status: { $in: ['open', 'in_progress'] },
    }).lean();

    const breachedCount = unresolvedTickets.filter((t) => {
      const { slaBreached } = computeDerivedFields(t);
      return slaBreached;
    }).length;

    const byStatus = {};
    statusCounts.forEach(({ _id, count }) => {
      byStatus[_id] = count;
    });

    const byPriority = {};
    priorityCounts.forEach(({ _id, count }) => {
      byPriority[_id] = count;
    });

    return res.json({
      byStatus: {
        open: byStatus.open || 0,
        in_progress: byStatus.in_progress || 0,
        resolved: byStatus.resolved || 0,
        closed: byStatus.closed || 0,
      },
      byPriority: {
        low: byPriority.low || 0,
        medium: byPriority.medium || 0,
        high: byPriority.high || 0,
        urgent: byPriority.urgent || 0,
      },
      breachedOpen: breachedCount,
    });
  } catch (err) {
    console.error('GET /tickets/stats error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH /tickets/:id ───────────────────────────────────────────────────────
router.patch('/:id', validatePatchBody, async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: `Ticket with id '${id}' not found.` });
    }

    const { valid, message } = validateTransition(ticket.status, newStatus);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid status transition', details: message });
    }

    const previousStatus = ticket.status;
    ticket.status = newStatus;

    // Handle resolvedAt logic
    if (newStatus === 'resolved' && previousStatus !== 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (previousStatus === 'resolved' && newStatus !== 'resolved') {
      // Moving back from resolved — clear resolvedAt
      ticket.resolvedAt = null;
    }

    await ticket.save();

    const plain = ticket.toObject();
    return res.json(withDerived(plain));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: `Invalid ticket id format: '${req.params.id}'.` });
    }
    console.error('PATCH /tickets/:id error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── DELETE /tickets/:id ──────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({ error: `Ticket with id '${id}' not found.` });
    }

    return res.json({ message: 'Ticket deleted successfully.', id });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: `Invalid ticket id format: '${req.params.id}'.` });
    }
    console.error('DELETE /tickets/:id error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
