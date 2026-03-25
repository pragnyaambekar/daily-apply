import { STATUS_COLORS } from '../constants';

export default function StatusBadge({ status, size = 'sm' }) {
  const colors = STATUS_COLORS[status] || { bg: '#6b728020', text: '#6b7280', border: '#6b7280' };
  const pad = size === 'sm' ? '2px 9px' : '4px 12px';
  const fs  = size === 'sm' ? 11 : 13;

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: pad, borderRadius: 20, fontSize: fs, fontWeight: 500,
        background: colors.bg, color: colors.text,
        border: `1px solid ${colors.border}40`,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.text, flexShrink: 0 }} />
      {status}
    </span>
  );
}
