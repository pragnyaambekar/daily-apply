import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Plus, LayoutGrid, Table, BarChart3,
  Moon, Sun, Download, Upload, ChevronDown,
  LogOut, Loader2,
} from 'lucide-react';
import { useApplications } from './context/ApplicationContext';
import { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TableView from './components/TableView';
import FilterBar from './components/FilterBar';
import ApplicationModal from './components/ApplicationModal';
import JobDescriptionPanel from './components/JobDescriptionPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { exportToJSON, exportToCSV, importFromJSON } from './utils/helpers';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/Toast';

const VIEWS = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'kanban',    label: 'Board',     icon: LayoutGrid },
  { key: 'table',     label: 'Table',     icon: Table },
];

export default function App() {
  const { applications, importApplications, loading } = useApplications();
  const { user, signOut } = useAuth();
  const toast = useToast();

  const [view, setView] = useState('kanban');
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [modalApp, setModalApp]       = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [viewingApp, setViewingApp]   = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ statuses: [], jobTypes: [], dateFrom: '', dateTo: '' });

  const searchRef = useRef(null);
  const importRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleKey = (e) => {
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openAddModal(); }
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const close = () => setShowExportMenu(false);
    if (showExportMenu) { document.addEventListener('click', close); return () => document.removeEventListener('click', close); }
  }, [showExportMenu]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!app.company.toLowerCase().includes(q) && !app.role.toLowerCase().includes(q)) return false;
      }
      if (filters.statuses.length > 0 && !filters.statuses.includes(app.status)) return false;
      if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(app.jobType)) return false;
      if (filters.dateFrom && app.dateApplied < filters.dateFrom) return false;
      if (filters.dateTo   && app.dateApplied > filters.dateTo)   return false;
      return true;
    });
  }, [applications, searchQuery, filters]);

  const openAddModal  = useCallback(() => { setModalApp(null); setShowModal(true); }, []);
  const openEditModal = useCallback((app) => { setViewingApp(null); setModalApp(app); setShowModal(true); }, []);
  const handleSelectApp = useCallback((app) => setViewingApp(app), []);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromJSON(file);
      importApplications(data);
      toast(`Imported ${data.length} application${data.length !== 1 ? 's' : ''}.`, 'success');
    } catch {
      toast('Import failed. Make sure the file is valid JSON.', 'error');
    }
    e.target.value = '';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', position: 'relative', zIndex: 1 }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="jt-navbar">
        <div className="container-fluid px-4" style={{ maxWidth: 1440 }}>
          <div className="d-flex align-items-center justify-content-between" style={{ height: 64 }}>

            {/* Logo */}
            <div className="d-flex align-items-center" style={{ gap: 10 }}>
              <svg width="34" height="34" viewBox="288 85 104 115" xmlns="http://www.w3.org/2000/svg">
                <rect x="288" y="105" width="104" height="100" rx="14" fill="#185FA5"/>
                <rect x="288" y="105" width="104" height="28" rx="14" fill="#0C447C"/>
                <rect x="288" y="119" width="104" height="14" fill="#0C447C"/>
                <rect x="310" y="93" width="8" height="20" rx="4" fill="#B5D4F4"/>
                <rect x="362" y="93" width="8" height="20" rx="4" fill="#B5D4F4"/>
                <path d="M340,183 L340,143 M340,143 L324,159 M340,143 L356,159" fill="none" stroke="#B5D4F4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1 }}>
                  <span style={{ color: '#185FA5' }}>Daily</span><span style={{ color: '#0C447C' }}>Apply</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
                  {applications.length} application{applications.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* View switcher */}
            <div className="jt-pill-group d-none d-sm-inline-flex">
              {VIEWS.map(({ key, label, icon: Icon }) => (
                <button key={key} className={`jt-pill ${view === key ? 'active' : ''}`} onClick={() => setView(key)}>
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center gap-2">

              {/* Export dropdown */}
              <div className="position-relative">
                <button
                  className="jt-btn-ghost"
                  onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); }}
                >
                  <Download size={14} />
                  <span className="d-none d-sm-inline">Export</span>
                  <ChevronDown size={12} />
                </button>
                {showExportMenu && (
                  <div
                    className="anim-scale-in position-absolute end-0 mt-1 py-1 rounded-3"
                    style={{
                      top: '100%', minWidth: 170, zIndex: 999,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 8px 32px rgba(0,0,0,.12)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      { label: 'Export JSON', fn: () => { exportToJSON(applications); setShowExportMenu(false); } },
                      { label: 'Export CSV',  fn: () => { exportToCSV(applications);  setShowExportMenu(false); } },
                    ].map(({ label, fn }) => (
                      <button
                        key={label}
                        onClick={fn}
                        className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0"
                        style={{ background: 'none', fontSize: 13, color: 'var(--text-main)', cursor: 'pointer' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <Download size={13} color="var(--text-muted)" />
                        {label}
                      </button>
                    ))}
                    <hr style={{ margin: '4px 12px', borderColor: 'var(--border)' }} />
                    <button
                      onClick={() => { importRef.current?.click(); setShowExportMenu(false); }}
                      className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0"
                      style={{ background: 'none', fontSize: 13, color: 'var(--text-main)', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <Upload size={13} color="var(--text-muted)" />
                      Import JSON
                    </button>
                  </div>
                )}
                <input ref={importRef} type="file" accept=".json" className="d-none" onChange={handleImport} />
              </div>

              {/* Dark mode */}
              <button className="jt-btn-ghost px-2" style={{ padding: '7px 10px' }} onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* User */}
              {user && (
                <button
                  className="jt-btn-ghost px-2 d-flex align-items-center gap-2"
                  onClick={() => setShowSignOutConfirm(true)}
                  title={`${user.displayName || user.email}`}
                >
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: 8 }} referrerPolicy="no-referrer" />
                    : (
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2 text-white fw-bold"
                        style={{ width: 28, height: 28, fontSize: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                      >
                        {(user.displayName || user.email || '?')[0].toUpperCase()}
                      </div>
                    )
                  }
                  <LogOut size={14} color="var(--text-muted)" />
                </button>
              )}

              {/* Add */}
              <button className="jt-btn-accent" onClick={openAddModal} title="Add application (N)">
                <Plus size={16} />
                <span className="d-none d-sm-inline">Add</span>
              </button>
            </div>
          </div>

          {/* Mobile view switcher */}
          <div className="jt-pill-group d-flex d-sm-none w-100 mb-2" style={{ borderRadius: 10 }}>
            {VIEWS.map(({ key, label, icon: Icon }) => (
              <button key={key} className={`jt-pill flex-fill justify-content-center ${view === key ? 'active' : ''}`} onClick={() => setView(key)}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="container-fluid px-4 pt-4" style={{ maxWidth: 1440, position: 'relative', zIndex: 1 }}>

        {loading && (
          <div
            className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-3"
            style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <Loader2 size={12} className="spin" />
            Syncing with cloud...
          </div>
        )}

        {view !== 'dashboard' && (
          <div className="mb-4">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchRef={searchRef}
            />
          </div>
        )}

        <ErrorBoundary>
          {view === 'dashboard' && <Dashboard />}
          {view === 'kanban'    && <KanbanBoard filteredApplications={filteredApplications} onSelectApp={handleSelectApp} />}
          {view === 'table'     && <TableView   filteredApplications={filteredApplications} onSelectApp={handleSelectApp} />}
        </ErrorBoundary>
      </main>

      {showModal && <ApplicationModal application={modalApp} onClose={() => setShowModal(false)} />}
      {viewingApp && <JobDescriptionPanel application={viewingApp} onClose={() => setViewingApp(null)} onEdit={openEditModal} />}

      {showSignOutConfirm && (
        <ConfirmDialog
          title="Sign out"
          message="Are you sure you want to sign out?"
          confirmLabel="Sign out"
          onConfirm={() => { signOut(); setShowSignOutConfirm(false); }}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}
    </div>
  );
}
