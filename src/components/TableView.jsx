import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, CheckSquare, Square, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import { STATUSES, STATUS_COLORS } from '../constants';
import StatusBadge from './StatusBadge';
import { daysSince, needsFollowUp, formatDate, formatSalary } from '../utils/helpers';

const COLUMNS = [
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'dateApplied', label: 'Applied' },
  { key: 'location', label: 'Location' },
  { key: 'jobType', label: 'Type' },
  { key: 'salary', label: 'Salary' },
  { key: 'daysSince', label: 'Days' },
];

export default function TableView({ filteredApplications, onSelectApp }) {
  const { bulkUpdateStatus } = useApplications();
  const [sortKey, setSortKey] = useState('dateApplied');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);

  const sorted = useMemo(() => {
    const enriched = filteredApplications.map((a) => ({ ...a, daysSince: daysSince(a.dateApplied) ?? -1 }));
    return [...enriched].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredApplications, sortKey, sortDir]);

  const handleSort = (key) => { if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };
  const toggleSelect = (id) => setSelectedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => setSelectedIds(selectedIds.size === sorted.length ? new Set() : new Set(sorted.map((a) => a.id)));
  const handleBulkStatus = (s) => { bulkUpdateStatus([...selectedIds], s); setSelectedIds(new Set()); setBulkOpen(false); };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={11} style={{ opacity: .3 }} />;
    return sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />;
  };

  return (
    <div>
      {/* Bulk bar */}
      {selectedIds.size > 0 && (
        <div
          className="d-flex align-items-center gap-3 rounded-3 px-4 py-2 mb-3 anim-scale-in"
          style={{ background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)' }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: '#6366f1' }}>{selectedIds.size} selected</span>
          <div className="position-relative">
            <button
              className="jt-btn-accent"
              style={{ padding: '5px 12px', fontSize: 12 }}
              onClick={() => setBulkOpen(!bulkOpen)}
            >
              Change Status <ChevronDown size={11} />
            </button>
            {bulkOpen && (
              <div
                className="position-absolute anim-scale-in py-1 rounded-3"
                style={{ top: '100%', left: 0, marginTop: 4, minWidth: 160, zIndex: 99, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}
              >
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleBulkStatus(s)}
                    className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0"
                    style={{ background: 'none', fontSize: 13, color: 'var(--text-main)', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <span className="rounded-circle" style={{ width: 8, height: 8, background: STATUS_COLORS[s]?.text, display: 'inline-block' }} />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setSelectedIds(new Set())} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
        </div>
      )}

      <div className="jt-table">
        <table className="table table-borderless mb-0">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {selectedIds.size === sorted.length && sorted.length > 0
                    ? <CheckSquare size={15} color="#6366f1" />
                    : <Square size={15} color="var(--text-muted)" />}
                </button>
              </th>
              {COLUMNS.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  <span className="d-inline-flex align-items-center gap-1">{col.label} <SortIcon col={col.key} /></span>
                </th>
              ))}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={COLUMNS.length + 2} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>No applications found</td></tr>
            ) : sorted.map((app) => {
              const followUp = needsFollowUp(app);
              return (
                <tr key={app.id} onClick={() => onSelectApp(app)}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(app.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      {selectedIds.has(app.id) ? <CheckSquare size={15} color="#6366f1" /> : <Square size={15} color="var(--text-muted)" />}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.company}</span>
                      {followUp && <AlertTriangle size={12} color="#f59e0b" />}
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink size={12} color="#6366f1" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>{app.role}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(app.dateApplied)}</td>
                  <td>{app.location || '—'}</td>
                  <td>{app.jobType}</td>
                  <td>{formatSalary(app) || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>Not specified</span>}</td>
                  <td>
                    <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      <Clock size={11} />{app.daysSince >= 0 ? `${app.daysSince}d` : '—'}
                    </span>
                  </td>
                  <td />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
