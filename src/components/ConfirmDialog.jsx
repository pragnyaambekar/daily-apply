export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      className="anim-fade-in"
    >
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="anim-scale-in position-relative"
        style={{ width: '100%', maxWidth: 400, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '28px 28px 24px', boxShadow: '0 24px 64px rgba(0,0,0,.18)' }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 24 }}>{message}</p>

        <div className="d-flex gap-2 justify-content-end">
          <button
            onClick={onCancel}
            className="jt-btn-ghost"
            style={{ padding: '8px 18px', fontSize: 13 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 18px', fontSize: 13, fontWeight: 600, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: danger ? '#ef4444' : 'var(--accent)',
              color: '#fff',
              boxShadow: danger ? '0 4px 14px rgba(239,68,68,.35)' : '0 4px 14px rgba(99,102,241,.35)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
