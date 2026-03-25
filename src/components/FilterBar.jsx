import { useState, useMemo } from 'react';
import { Search, Filter, X, Calendar, ChevronDown } from 'lucide-react';
import { STATUSES, JOB_TYPES } from '../constants';
import StatusBadge from './StatusBadge';

export default function FilterBar({ filters, onFiltersChange, searchQuery, onSearchChange, searchRef }) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActive = useMemo(() =>
    filters.statuses.length > 0 || filters.jobTypes.length > 0 || filters.dateFrom || filters.dateTo,
    [filters]);

  const activeCount = filters.statuses.length + filters.jobTypes.length + (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0);

  const toggleStatus  = (s) => onFiltersChange({ ...filters, statuses:  filters.statuses.includes(s)  ? filters.statuses.filter((x) => x !== s)  : [...filters.statuses, s]  });
  const toggleJobType = (t) => onFiltersChange({ ...filters, jobTypes:  filters.jobTypes.includes(t)  ? filters.jobTypes.filter((x) => x !== t)  : [...filters.jobTypes, t]  });
  const clearAll = () => { onFiltersChange({ statuses: [], jobTypes: [], dateFrom: '', dateTo: '' }); onSearchChange(''); };

  return (
    <div>
      <div className="d-flex gap-2">
        {/* Search */}
        <div className="position-relative flex-grow-1">
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company or role…"
            className="jt-input"
            style={{ paddingLeft: 36, paddingRight: searchQuery ? 36 : 12 }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          className="jt-btn-ghost"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: hasActive ? 'rgba(99,102,241,.1)' : undefined,
            color: hasActive ? '#6366f1' : undefined,
            borderColor: hasActive ? 'rgba(99,102,241,.3)' : undefined,
            boxShadow: showFilters ? '0 0 0 3px rgba(99,102,241,.15)' : undefined,
          }}
        >
          <Filter size={13} />
          Filters
          {hasActive && (
            <span
              className="rounded-pill text-white d-inline-flex align-items-center justify-content-center"
              style={{ background: '#6366f1', fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, padding: '0 5px' }}
            >
              {activeCount}
            </span>
          )}
          <ChevronDown size={12} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div
          className="mt-2 p-4 rounded-3 anim-scale-in"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(15,23,42,.07)' }}
        >
          {/* Status */}
          <div className="mb-3">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Status</div>
            <div className="d-flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleStatus(s)}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    opacity: filters.statuses.includes(s) ? 1 : 0.5,
                    transform: filters.statuses.includes(s) ? 'scale(1.05)' : 'none',
                    outline: filters.statuses.includes(s) ? '2px solid rgba(99,102,241,.4)' : 'none',
                    outlineOffset: 2,
                    borderRadius: 20,
                    transition: 'all .15s',
                  }}
                >
                  <StatusBadge status={s} />
                </button>
              ))}
            </div>
          </div>

          {/* Job type */}
          <div className="mb-3">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Job Type</div>
            <div className="d-flex flex-wrap gap-2">
              {JOB_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleJobType(t)}
                  style={{
                    fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all .15s',
                    background: filters.jobTypes.includes(t) ? 'rgba(99,102,241,.12)' : 'var(--bg-subtle)',
                    color:      filters.jobTypes.includes(t) ? '#6366f1' : 'var(--text-sub)',
                    border:     `1px solid ${filters.jobTypes.includes(t) ? 'rgba(99,102,241,.3)' : 'var(--border)'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="mb-2">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Date Range</div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <Calendar size={13} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>From</span>
                <input type="date" value={filters.dateFrom} onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })} className="jt-input" style={{ width: 'auto' }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>→</span>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>To</span>
                <input type="date" value={filters.dateTo} onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })} className="jt-input" style={{ width: 'auto' }} />
              </div>
            </div>
          </div>

          {hasActive && (
            <button onClick={clearAll} style={{ fontSize: 12, fontWeight: 500, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
