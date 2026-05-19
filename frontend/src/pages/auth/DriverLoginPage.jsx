import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, CalendarDays, DollarSign, Map, Phone } from 'lucide-react';
import logo from '../../assets/images/abyride_logo.png';

const FEATURES = [
  { Icon: CalendarDays, text: 'View your upcoming trip schedule' },
  { Icon: DollarSign,   text: 'Track earnings and weekly payouts' },
  { Icon: Map,          text: 'Get turn-by-turn navigation' },
  { Icon: Phone,        text: 'Contact dispatch in one tap' },
];

export default function DriverLoginPage() {
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!driverId || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* ── Left brand panel ── */}
      <div style={{
        display: 'none',
        flex: '0 0 440px',
        background: 'linear-gradient(160deg, #0b1f3a 0%, #1a3a5c 100%)',
        padding: '48px 44px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }} className="auth-left-panel">

        {/* Accent stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, #2546b8, #7c9bff)',
          zIndex: 2,
        }} />

        {/* Animated grid */}
        <div className="auth-grid" style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(124,155,255,0.13) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(124,155,255,0.13) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '44px 44px',
        }} />

        {/* Intersection dots */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.35,
          backgroundImage: 'radial-gradient(circle, #7c9bff 1.5px, transparent 1.5px)',
          backgroundSize: '44px 44px',
        }} />

        {/* Radial vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, #0c2040 90%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/">
            <img src={logo} alt="Abyride" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>
            Driver portal
          </p>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.035em', color: '#ffffff', lineHeight: 1.15, margin: '0 0 36px' }}>
            Ready to<br />hit the road?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FEATURES.map(({ Icon, text }) => (
              <div key={text} className="auth-feature-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 10, transition: 'background 0.2s', cursor: 'default' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(37,70,184,0.25)',
                  border: '1px solid rgba(124,155,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'background 0.2s, border-color 0.2s',
                }}>
                  <Icon size={17} color="#7c9bff" />
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.4 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {new Date().getFullYear()} Abyride LLC · Detroit, MI
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        backgroundColor: 'var(--c-bg, #ffffff)',
        padding: '32px 24px',
      }}>

        {/* Mobile header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }} className="auth-mobile-header">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src={logo} alt="Abyride" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--c-ink-soft, #64748b)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Home
          </Link>
        </div>

        {/* Form container */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>

            {/* Driver badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: '#eef2ff', border: '1px solid #c7d2fe',
              borderRadius: 20, padding: '6px 14px', marginBottom: 20,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2546b8' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2546b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Driver portal
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-ink, #0b1f3a)', margin: '0 0 6px' }}>
              Driver sign in
            </h1>
            <p style={{ fontSize: 14, color: 'var(--c-ink-soft, #64748b)', margin: '0 0 32px' }}>
              Access your schedule, earnings, and dispatch.
            </p>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '12px 16px',
                fontSize: 13, color: '#b91c1c', marginBottom: 20,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Driver ID */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--c-muted, #94a3b8)', marginBottom: 8 }}>
                  Driver ID or email
                </label>
                <input
                  type="text"
                  value={driverId}
                  onChange={e => setDriverId(e.target.value)}
                  placeholder="ABY-00000 or you@example.com"
                  autoComplete="username"
                  style={{
                    width: '100%', padding: '13px 16px', borderRadius: 10,
                    border: '1.5px solid var(--c-rule, #e2e8f0)',
                    backgroundColor: 'var(--c-bg-2, #f8fafc)',
                    fontSize: 14, color: 'var(--c-ink, #0b1f3a)',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2546b8'}
                  onBlur={e => e.target.style.borderColor = 'var(--c-rule, #e2e8f0)'}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--c-muted, #94a3b8)' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: 12, fontWeight: 600, color: '#2546b8', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{
                      width: '100%', padding: '13px 44px 13px 16px', borderRadius: 10,
                      border: '1.5px solid var(--c-rule, #e2e8f0)',
                      backgroundColor: 'var(--c-bg-2, #f8fafc)',
                      fontSize: 14, color: 'var(--c-ink, #0b1f3a)',
                      outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit', transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#2546b8'}
                    onBlur={e => e.target.style.borderColor = 'var(--c-rule, #e2e8f0)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--c-muted, #94a3b8)', padding: 2,
                    }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#0b1f3a', cursor: 'pointer' }} />
                <span style={{ fontSize: 13, color: 'var(--c-ink-soft, #64748b)', fontWeight: 500 }}>Keep me signed in on this device</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                  backgroundColor: loading ? '#6b7280' : '#0b1f3a',
                  color: '#ffffff', fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginTop: 4, transition: 'background-color 0.15s',
                }}
              >
                {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--c-rule, #e2e8f0)' }} />
              <span style={{ fontSize: 12, color: 'var(--c-muted, #94a3b8)', fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--c-rule, #e2e8f0)' }} />
            </div>

            {/* Switch to member */}
            <Link
              to="/login"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '13px', borderRadius: 10,
                border: '1.5px solid var(--c-rule, #e2e8f0)',
                backgroundColor: 'transparent', color: 'var(--c-ink, #0b1f3a)',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0b1f3a'; e.currentTarget.style.backgroundColor = 'var(--c-bg-2, #f8fafc)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-rule, #e2e8f0)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Sign in as a member instead
            </Link>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--c-muted, #94a3b8)', marginTop: 28 }}>
              Want to drive for Abyride?{' '}
              <Link to="/drivers" style={{ fontWeight: 700, color: '#2546b8', textDecoration: 'none' }}>
                Apply to drive
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes auth-grid-drift {
          from { background-position: 0px 0px; }
          to   { background-position: 44px 44px; }
        }
        .auth-grid {
          animation: auth-grid-drift 9s linear infinite;
        }
        .auth-feature-row:hover {
          background: rgba(124, 155, 255, 0.07) !important;
        }
        .auth-feature-row:hover > div {
          background: rgba(37, 70, 184, 0.4) !important;
          border-color: rgba(124, 155, 255, 0.55) !important;
        }
        @media (min-width: 768px) {
          .auth-left-panel { display: flex !important; }
          .auth-mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
