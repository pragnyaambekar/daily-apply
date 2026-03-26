import { useState } from 'react';
import { X, ExternalLink, Calendar, MapPin, Briefcase, DollarSign, FileText, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, daysSince, formatSalary } from '../utils/helpers';
import { useApplications } from '../context/ApplicationContext';
import ConfirmDialog from './ConfirmDialog';

export default function JobDescriptionPanel({ application, onClose, onEdit }) {
  if (!application) return null;
  const days = daysSince(application.dateApplied);
  const { deleteApplication } = useApplications();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    deleteApplication(application.id);
    onClose();
  };

  return (
    <div
      className="anim-fade-in"
      style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', justifyContent: 'flex-end' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div
        className="anim-slide-right"
        style={{ position: 'relative', width: '100%', maxWidth: 640, height: '100%', overflowY: 'auto', background: 'var(--bg-card)', boxShadow: '-8px 0 40px rgba(0,0,0,.15)' }}
      >
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '20px 24px' }}>
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 2, letterSpacing: '-.02em' }}>{application.company}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', margin: 0 }}>{application.role}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
            <StatusBadge status={application.status} size="md" />
            {application.location && (
              <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: 12, color: 'var(--text-sub)' }}>
                <MapPin size={12} />{application.location}
              </span>
            )}
            {application.jobType && (
              <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: 12, color: 'var(--text-sub)' }}>
                <Briefcase size={12} />{application.jobType}
              </span>
            )}
            {days !== null && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Applied {days}d ago</span>}
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="jt-btn-accent" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => onEdit(application)}>
              Edit Application
            </button>
            {application.url && (
              <a
                href={application.url} target="_blank" rel="noopener noreferrer"
                className="jt-btn-ghost d-inline-flex align-items-center gap-1"
                style={{ fontSize: 12, textDecoration: 'none' }}
              >
                <ExternalLink size={12} /> View Posting
              </a>
            )}
            <button
              onClick={() => setShowConfirm(true)}
              className="jt-btn-ghost d-inline-flex align-items-center gap-1 ms-auto"
              style={{ fontSize: 12, color: '#ef4444', borderColor: '#ef444440' }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Meta grid */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Date Applied', icon: Calendar, val: application.dateApplied ? formatDate(application.dateApplied) : null },
              { label: 'Salary Range', icon: DollarSign, val: formatSalary(application) },
              { label: 'Interview Date', icon: Calendar, val: application.interviewDate ? formatDate(application.interviewDate) : null },
            ].filter((x) => x.val).map(({ label, icon: Icon, val }) => (
              <div key={label} className="col-6">
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                <div className="d-flex align-items-center gap-1" style={{ fontSize: 13, color: 'var(--text-main)' }}>
                  <Icon size={13} color="var(--text-muted)" />{val}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          {application.description && (
            <div className="mb-4">
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 10 }}>Job Description</div>
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {application.description}
              </div>
            </div>
          )}

          {/* Resume */}
          {application.resumeFile && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)' }}>
                <FileText size={13} />{application.resumeName}
              </div>
              {application.resumeFile.startsWith('data:application/pdf') && (
                <iframe src={application.resumeFile} style={{ width: '100%', height: 500, borderRadius: 12, border: '1px solid var(--border)' }} title="Resume" />
              )}
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 10 }}>Notes</div>
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {application.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete Application"
          message={`Are you sure you want to delete the application for ${application.role} at ${application.company}? This can't be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
