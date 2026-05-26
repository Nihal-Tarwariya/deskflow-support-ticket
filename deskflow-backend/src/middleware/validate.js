/**
 * Status transition state machine.
 * Defines allowed forward and backward moves.
 */
const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed'];

/**
 * Validate that a status transition is allowed.
 * Rules:
 *  - Forward: only one step at a time (open→in_progress, in_progress→resolved, resolved→closed)
 *  - Backward: only one step at a time (resolved→in_progress, in_progress→open, closed→resolved)
 *  - Same status: rejected (no-op transitions are not allowed via PATCH)
 *
 * @param {string} from - current status
 * @param {string} to - requested status
 * @returns {{ valid: boolean, message?: string }}
 */
function validateTransition(from, to) {
  if (from === to) {
    return { valid: false, message: `Ticket is already in '${from}' status.` };
  }

  const fromIdx = STATUS_ORDER.indexOf(from);
  const toIdx = STATUS_ORDER.indexOf(to);

  if (fromIdx === -1) {
    return { valid: false, message: `Unknown current status: '${from}'.` };
  }
  if (toIdx === -1) {
    return { valid: false, message: `Unknown target status: '${to}'. Must be one of: ${STATUS_ORDER.join(', ')}.` };
  }

  const diff = toIdx - fromIdx;

  if (diff === 1 || diff === -1) {
    return { valid: true };
  }

  if (diff > 1) {
    return {
      valid: false,
      message: `Invalid transition: cannot skip from '${from}' to '${to}'. Only one step forward is allowed (next: '${STATUS_ORDER[fromIdx + 1]}').`,
    };
  }

  // diff < -1
  return {
    valid: false,
    message: `Invalid transition: cannot move back from '${from}' to '${to}'. Only one step back is allowed (previous: '${STATUS_ORDER[fromIdx - 1]}').`,
  };
}

/**
 * Middleware to validate request body fields for ticket creation.
 */
function validateCreateBody(req, res, next) {
  const { subject, description, customerEmail, priority } = req.body;
  const errors = [];

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    errors.push('subject is required and must be at least 3 characters.');
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description is required.');
  }
  if (!customerEmail || typeof customerEmail !== 'string') {
    errors.push('customerEmail is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
    errors.push('customerEmail must be a valid email address.');
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!priority) {
    errors.push('priority is required.');
  } else if (!validPriorities.includes(priority)) {
    errors.push(`priority must be one of: ${validPriorities.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

/**
 * Middleware to validate PATCH body for status update.
 */
function validatePatchBody(req, res, next) {
  const { status } = req.body;
  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

  if (!status) {
    return res.status(400).json({ error: 'Validation failed', details: ['status is required in the request body.'] });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: [`status must be one of: ${validStatuses.join(', ')}.`],
    });
  }

  next();
}

module.exports = { validateTransition, validateCreateBody, validatePatchBody };
