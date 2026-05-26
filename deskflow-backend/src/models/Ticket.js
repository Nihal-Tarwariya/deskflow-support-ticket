const mongoose = require('mongoose');

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'subject is required'],
      trim: true,
      minlength: [3, 'subject must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'customerEmail is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'customerEmail must be a valid email address'],
    },
    priority: {
      type: String,
      required: [true, 'priority is required'],
      enum: {
        values: VALID_PRIORITIES,
        message: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
      },
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`,
      },
      default: 'open',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    versionKey: false,
  }
);

// Index for common query patterns
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
