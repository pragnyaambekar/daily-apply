import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Sparkles } from 'lucide-react';

const MOTIVATIONS = [
  "Every application is a step closer. Keep going.",
  "The job you want is looking for someone like you.",
  "Consistency beats talent when talent doesn't show up.",
  "One more application could change everything.",
  "Your next opportunity is one click away.",
  "Progress, not perfection. Apply today.",
  "The only application that fails is the one never sent.",
  "Dream big. Apply bigger.",
  "You are more qualified than you think.",
  "Today's effort is tomorrow's offer.",
  "Rejection is redirection. Keep pushing.",
  "Show up. Apply. Repeat. Success follows.",
  "Every no brings you closer to the right yes.",
  "Your future self will thank you for applying today.",
];

const FEATURES = [
  'Kanban board to visualize your pipeline',
  'Interview dates & follow-up reminders',
  'Dashboard with application insights',
  'Synced securely across all devices',
];

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Pick a quote based on day of year — changes daily
  const quote = useMemo(() => {
    const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return MOTIVATIONS[day % MOTIVATIONS.length];
  }, []);

  const handleSignIn = async () => {
    setLoading(true); setError('');
    try { await signInWithGoogle(); }
    catch (err) {
      setError(err.code === 'auth/popup-closed-by-user' ? 'Sign-in cancelled' : 'Sign-in failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* ── Colorful gradient background ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'linear-gradient(135deg, #f0f4ff 0%, #dbeafe 50%, #e0f2fe 100%)',
      }} />

      {/* Animated blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,253,.5), transparent 70%)', top: '-15%', left: '-10%', animation: 'floatA 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(186,230,255,.6), transparent 70%)', bottom: '-10%', right: '-5%', animation: 'floatB 15s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(199,210,254,.5), transparent 70%)', top: '40%', right: '15%', animation: 'floatC 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,242,254,.8), transparent 70%)', top: '20%', left: '30%', animation: 'floatA 8s ease-in-out infinite reverse' }} />
      </div>

      {/* Subtle grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(24,95,165,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(24,95,165,.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* ── Content ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 1000, display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Left — branding */}
          <div style={{ flex: '1 1 380px', maxWidth: 460 }} className="anim-fade-in">
            <div style={{ marginBottom: 28 }}>
              <img src="/logo.svg" alt="DailyApply" style={{ width: '100%', maxWidth: 400, height: 'auto' }} />
            </div>

            {/* Daily motivation */}
            <div style={{
              background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(24,95,165,.15)', borderRadius: 14,
              padding: '16px 20px', marginBottom: 32,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <Sparkles size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#94a3b8', marginBottom: 4 }}>
                  Today's motivation
                </div>
                <p style={{ fontSize: 15, color: '#1e3a5f', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{quote}"
                </p>
              </div>
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FEATURES.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(24,95,165,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle size={13} color="#185FA5" />
                  </div>
                  <span style={{ fontSize: 14, color: '#334155' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — sign in card */}
          <div
            className="anim-scale-in"
            style={{
              flex: '0 0 340px',
              background: 'rgba(255,255,255,.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(24,95,165,.12)',
              borderRadius: 24, padding: '40px 36px', textAlign: 'center',
              boxShadow: '0 24px 64px rgba(24,95,165,.12), 0 4px 16px rgba(0,0,0,.06)',
            }}
          >
            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #185FA5, #6366f1)', boxShadow: '0 8px 24px rgba(99,102,241,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" viewBox="-20 -20 40 40">
                  <rect x="-16" y="-12" width="32" height="30" rx="5" fill="white" opacity=".9"/>
                  <rect x="-16" y="-12" width="32" height="9" rx="5" fill="white" opacity=".35"/>
                  <rect x="-16" y="-7" width="32" height="4" fill="white" opacity=".35"/>
                  <rect x="-9" y="-17" width="4" height="8" rx="2" fill="#B5D4F4"/>
                  <rect x="5" y="-17" width="4" height="8" rx="2" fill="#B5D4F4"/>
                  <path d="M0,12 L0,-1 M0,-1 L-5,4 M0,-1 L5,4" fill="none" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6, letterSpacing: '-.02em' }}>
              Get started
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, lineHeight: 1.5 }}>
              Sign in to track your job applications
            </p>

            {/* Google button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: '#fff', color: '#1a1a2e', border: '1.5px solid #d1d5db',
                borderRadius: 12, padding: '13px 20px', fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? .7 : 1, transition: 'all .2s',
                boxShadow: '0 2px 8px rgba(0,0,0,.08)',
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.borderColor = '#185FA5'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(24,95,165,.2)'; }}}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.08)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Signing in…' : 'Continue with Google'}
            </button>

            {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 12, fontWeight: 500 }}>{error}</p>}

            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 24, lineHeight: 1.6 }}>
              Secured by Firebase · Your data stays private
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '16px 20px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
          © {new Date().getFullYear()} DailyApply — Show up. Apply. Repeat.
        </p>
      </div>
    </div>
  );
}
