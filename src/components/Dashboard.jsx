import { useMemo } from 'react';
import { Briefcase, TrendingUp, Clock, Award, Target, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApplications } from '../context/ApplicationContext';
import { computeStats, needsFollowUp } from '../utils/helpers';
import { STATUS_COLORS, STATUSES } from '../constants';

function StatCard({ icon: Icon, label, value, accent, delay }) {
  return (
    <div className="jt-stat-card anim-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div
        className="position-absolute top-0 end-0 rounded-circle opacity-25"
        style={{ width: 80, height: 80, background: accent, filter: 'blur(24px)', transform: 'translate(20px,-20px)' }}
      />
      <div
        className="d-flex align-items-center justify-content-center rounded-3 mb-3"
        style={{ width: 38, height: 38, background: `${accent}1a`, color: accent }}
      >
        <Icon size={17} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-3 px-3 py-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,.12)', fontSize: 13 }}>
      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{payload[0].name}</div>
      <div style={{ color: payload[0].payload.fill || 'var(--text-sub)', marginTop: 2 }}>
        {payload[0].value} application{payload[0].value !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { applications } = useApplications();
  const stats = useMemo(() => computeStats(applications), [applications]);

  const pieData = useMemo(() =>
    STATUSES.filter((s) => stats.statusCounts[s] > 0).map((s) => ({
      name: s, value: stats.statusCounts[s] || 0, fill: STATUS_COLORS[s]?.text || '#6b7280',
    })), [stats]);

  const weeklyData = useMemo(() => {
    const weeks = {};
    applications.forEach((app) => {
      if (!app.dateApplied) return;
      const d = new Date(app.dateApplied);
      const ws = new Date(d);
      ws.setDate(d.getDate() - d.getDay());
      const key = ws.toISOString().split('T')[0];
      weeks[key] = (weeks[key] || 0) + 1;
    });
    return Object.entries(weeks).sort(([a],[b]) => a.localeCompare(b)).slice(-8).map(([week, count]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count,
    }));
  }, [applications]);

  const followUpCount = useMemo(() => applications.filter(needsFollowUp).length, [applications]);

  return (
    <div className="anim-fade-in">
      {/* Stats */}
      <div className="row g-3 mb-4 stagger">
        <div className="col-6 col-lg-3"><StatCard icon={Briefcase}   label="Total Applications" value={stats.total}          accent="#6366f1" delay={0}   /></div>
        <div className="col-6 col-lg-3"><StatCard icon={Clock}       label="Applied This Week"  value={stats.thisWeek}       accent="#3b82f6" delay={60}  /></div>
        <div className="col-6 col-lg-3"><StatCard icon={TrendingUp}  label="Active Pipeline"    value={stats.activePipeline} accent="#f59e0b" delay={120} /></div>
        <div className="col-6 col-lg-3"><StatCard icon={Award}       label="Offers"             value={stats.offers}         accent="#10b981" delay={180} /></div>
      </div>

      {/* Follow-up alert */}
      {followUpCount > 0 && (
        <div
          className="d-flex align-items-center gap-2 rounded-3 px-4 py-3 mb-4 anim-slide-up"
          style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.22)', color: '#d97706', fontSize: 13, fontWeight: 500 }}
        >
          <AlertCircle size={16} />
          {followUpCount} application{followUpCount !== 1 ? 's' : ''} with no status change in 7+ days
        </div>
      )}

      {/* Charts */}
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="jt-card p-4 anim-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)' }}>
              <Target size={14} /> Status Distribution
            </div>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="none">
                      {pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {pieData.map((e) => (
                    <div key={e.name} className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: 'var(--text-sub)' }}>
                      <span className="rounded-circle" style={{ width: 8, height: 8, background: e.fill, display: 'inline-block' }} />
                      {e.name} <span style={{ color: 'var(--text-muted)' }}>({e.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: 220, color: 'var(--text-muted)', fontSize: 13 }}>
                No applications yet
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="jt-card p-4 anim-slide-up" style={{ animationDelay: '260ms' }}>
            <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)' }}>
              <TrendingUp size={14} /> Applications Over Time
            </div>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData} barSize={26}>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,.06)', radius: 6 }} />
                  <defs>
                    <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={.7} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="count" name="Applications" fill="url(#barG)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: 220, color: 'var(--text-muted)', fontSize: 13 }}>
                No data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
