import React, { useState, useEffect, useRef } from 'react';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

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
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-[#121214] border border-[#1f1f23] rounded-xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto animate-scale-up" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f1f23] mb-5">
          <h2 id="modal-title" className="font-display font-bold text-base text-white tracking-tight">
            Create New Ticket
          </h2>
          <button 
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors outline-none" 
            onClick={onClose} 
            aria-label="Close modal" 
            id="modal-close-btn"
          >
            <span className="material-symbols-outlined text-[18px] font-bold">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3 rounded-lg flex items-center gap-2" role="alert">
              <span className="material-symbols-outlined text-[16px] font-bold">error</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Subject Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-display" htmlFor="subject">
              Subject
            </label>
            <input
              ref={firstInputRef}
              id="subject"
              name="subject"
              type="text"
              className={`bg-[#0b0e15] border rounded-lg py-2 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all ${
                errors.subject 
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                  : 'border-[#1f1f23] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20'
              }`}
              placeholder="Brief summary of the issue (at least 3 chars)"
              value={form.subject}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.subject && (
              <span className="text-red-400 text-[11px] font-medium flex items-center gap-1 mt-0.5" role="alert">
                <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
                {errors.subject}
              </span>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-display" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`bg-[#0b0e15] border rounded-lg py-2 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all ${
                errors.description 
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                  : 'border-[#1f1f23] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20'
              }`}
              placeholder="Detailed explanation of the problem..."
              rows={4}
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.description && (
              <span className="text-red-400 text-[11px] font-medium flex items-center gap-1 mt-0.5" role="alert">
                <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
                {errors.description}
              </span>
            )}
          </div>

          {/* Customer Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-display" htmlFor="customerEmail">
              Customer Email
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              className={`bg-[#0b0e15] border rounded-lg py-2 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all ${
                errors.customerEmail 
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                  : 'border-[#1f1f23] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20'
              }`}
              placeholder="customer@example.com"
              value={form.customerEmail}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.customerEmail && (
              <span className="text-red-400 text-[11px] font-medium flex items-center gap-1 mt-0.5" role="alert">
                <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
                {errors.customerEmail}
              </span>
            )}
          </div>

          {/* Priority Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-display" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className={`bg-[#0b0e15] border rounded-lg py-2 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all appearance-none cursor-pointer ${
                errors.priority 
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                  : 'border-[#1f1f23] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20'
              }`}
              value={form.priority}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="" disabled className="text-zinc-600">Select priority…</option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value} className="bg-[#121214] text-zinc-200 py-2">
                  {p.label}
                </option>
              ))}
            </select>
            {errors.priority && (
              <span className="text-red-400 text-[11px] font-medium flex items-center gap-1 mt-0.5" role="alert">
                <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
                {errors.priority}
              </span>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f1f23] mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-transparent hover:bg-zinc-800 border border-transparent rounded-lg text-zinc-400 hover:text-zinc-200 text-xs font-semibold tracking-wide transition-all active:scale-95 outline-none"
              onClick={onClose}
              disabled={submitting}
              id="cancel-ticket-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-xs font-semibold tracking-wide shadow-lg shadow-blue-500/10 border border-blue-400/20 transition-all active:scale-95 outline-none"
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
