import React, { useState, useEffect, useRef } from 'react';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const INITIAL_FORM = {
  subject: '',
  description: '',
  customerEmail: '',
  priority: '',
};

function validate(form) {
  const errors = {};
  if (!form.subject.trim() || form.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }
  if (!form.description.trim()) {
    errors.description = 'Description is required.';
  }
  if (!form.customerEmail.trim()) {
    errors.customerEmail = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) {
    errors.customerEmail = 'Please enter a valid email address.';
  }
  if (!form.priority) {
    errors.priority = 'Priority is required.';
  }
  return errors;
}

export default function CreateTicketModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const firstInputRef = useRef(null);

  // Focus first input on mount
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        subject: form.subject.trim(),
        description: form.description.trim(),
        customerEmail: form.customerEmail.trim(),
        priority: form.priority,
      });
      onClose();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">Create New Ticket</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className="form-server-error" role="alert">{serverError}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="subject">Subject</label>
            <input
              ref={firstInputRef}
              id="subject"
              name="subject"
              type="text"
              className={`form-input${errors.subject ? ' form-input--error' : ''}`}
              placeholder="Brief description of the issue"
              value={form.subject}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.subject && <span className="form-error" role="alert">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea${errors.description ? ' form-input--error' : ''}`}
              placeholder="Detailed explanation of the issue"
              rows={4}
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.description && <span className="form-error" role="alert">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customerEmail">Customer Email</label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              className={`form-input${errors.customerEmail ? ' form-input--error' : ''}`}
              placeholder="customer@example.com"
              value={form.customerEmail}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.customerEmail && <span className="form-error" role="alert">{errors.customerEmail}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              className={`form-select${errors.priority ? ' form-input--error' : ''}`}
              value={form.priority}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="">Select priority…</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            {errors.priority && <span className="form-error" role="alert">{errors.priority}</span>}
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={submitting}
              id="cancel-ticket-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
              id="submit-ticket-btn"
            >
              {submitting ? 'Creating…' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
