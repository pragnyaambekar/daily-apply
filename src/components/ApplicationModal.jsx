import { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Trash2, ExternalLink } from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import { STATUSES, JOB_TYPES, EMPTY_APPLICATION } from '../constants';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';

export default function ApplicationModal({ application, onClose }) {
  const { addApplication, updateApplication, deleteApplication } = useApplications();
  const isEditing = !!application?.id;

  const [form, setForm] = useState(() => ({
    ...EMPTY_APPLICATION,
    dateApplied: new Date().toISOString().split('T')[0],
    ...(application || {}),
  }));
  const [errors, setErrors]           = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => firstInputRef.current?.focus(), 100); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const set = (field, value) => { setForm((p) => ({ ...p, [field]: value })); if (errors[field]) setErrors((p) => ({ ...p, [field]: null })); };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, resumeFile: ev.target.result, resumeName: file.name }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = 'Company name is required';
    if (!form.role.trim())    errs.role    = 'Job title is required';
    if (form.url && !/^https?:\/\/.+/.test(form.url.trim())) errs.url = 'URL must start with http:// or https://';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    isEditing ? updateApplication(form) : addApplication(form);
    onClose();
  };

  const handleDelete = () => {
    deleteApplication(application.id);
    onClose();
  };

  const labelStyle = { fontSize: 12, fontWeight: 500, color: 'var(--text-sub)', marginBottom: 6, display: 'block' };

  return (
    <div
      className="anim-fade-in"
      style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', justifyContent: 'flex-end' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div
        className="anim-slide-right"
        style={{ position: 'relative', width: '100%', maxWidth: 520, height: '100%', overflowY: 'auto', background: 'var(--bg-card)', boxShadow: '-8px 0 40px rgba(0,0,0,.15)' }}
      >
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {isEditing ? 'Edit Application' : 'Add Application'}
          </h2>
          <div className="d-flex align-items-center gap-2">
            {isEditing && (
              <button
                type="button" onClick={() => setShowDeleteConfirm(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 8 }}
                title="Delete"
              >
                <Trash2 size={17} />
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 8 }}>
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="mb-3">
            <label style={labelStyle}>Company Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input ref={firstInputRef} type="text" value={form.company} onChange={(e) => set('company', e.target.value)} className="jt-input" placeholder="e.g., Google" style={errors.company ? { borderColor: '#ef4444' } : {}} />
            {errors.company && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.company}</div>}
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Job Title / Role <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" value={form.role} onChange={(e) => set('role', e.target.value)} className="jt-input" placeholder="e.g., Software Engineer" style={errors.role ? { borderColor: '#ef4444' } : {}} />
            {errors.role && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.role}</div>}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="jt-input">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-6">
              <label style={labelStyle}>Job Type</label>
              <select value={form.jobType} onChange={(e) => set('jobType', e.target.value)} className="jt-input">
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label style={labelStyle}>Date Applied</label>
              <input type="date" value={form.dateApplied} onChange={(e) => set('dateApplied', e.target.value)} className="jt-input" />
            </div>
            <div className="col-6">
              <label style={labelStyle}>Interview Date</label>
              <input type="date" value={form.interviewDate} onChange={(e) => set('interviewDate', e.target.value)} className="jt-input" />
            </div>
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Location</label>
            <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className="jt-input" placeholder="e.g., Remote, Seattle, WA" />
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Salary Range</label>
            <input type="text" value={form.salary} onChange={(e) => set('salary', e.target.value)} className="jt-input" placeholder="e.g., $120k–$150k" />
          </div>

          <div className="mb-3">
            <label style={labelStyle}>
              Job Posting URL
              {form.url && (
                <a href={form.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, fontSize: 11, color: '#6366f1' }}>
                  <ExternalLink size={11} style={{ marginRight: 2 }} />Open
                </a>
              )}
            </label>
            <input type="url" value={form.url} onChange={(e) => set('url', e.target.value)} className="jt-input" placeholder="https://..." style={errors.url ? { borderColor: '#ef4444' } : {}} />
            {errors.url && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.url}</div>}
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Job Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="jt-input" style={{ minHeight: 110, resize: 'vertical' }} placeholder="Paste the full job description here…" />
          </div>

          {/* Resume */}
          <div className="mb-3">
            <label style={labelStyle}>Resume</label>
            {form.resumeFile ? (
              <div>
                <div className="d-flex align-items-center justify-content-between rounded-3 px-3 py-2" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={15} color="#6366f1" />
                    <span style={{ fontSize: 13, color: 'var(--text-main)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.resumeName}</span>
                  </div>
                  <button type="button" onClick={() => setForm((p) => ({ ...p, resumeFile: null, resumeName: '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 2 }}>
                    <X size={13} />
                  </button>
                </div>
                {form.resumeFile.startsWith('data:application/pdf') && (
                  <iframe src={form.resumeFile} style={{ width: '100%', height: 280, borderRadius: 10, border: '1px solid var(--border)', marginTop: 8 }} title="Resume Preview" />
                )}
              </div>
            ) : (
              <label
                className="d-flex flex-column align-items-center justify-content-center gap-2 rounded-3"
                style={{ border: '2px dashed var(--border)', padding: '28px 16px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, transition: 'border-color .15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Upload size={22} />
                Click to upload resume (PDF)
                <input type="file" accept=".pdf" className="d-none" onChange={handleResumeUpload} />
              </label>
            )}
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} className="jt-input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Interview questions, vibes, follow-up reminders…" />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="jt-btn-accent flex-grow-1 justify-content-center" style={{ padding: '10px 0' }}>
              {isEditing ? 'Save Changes' : 'Add Application'}
            </button>
            <button type="button" onClick={onClose} className="jt-btn-ghost" style={{ padding: '10px 18px' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Application"
          message={`Are you sure you want to delete the application for ${form.role} at ${form.company}? This can't be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
