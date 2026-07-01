import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Car } from 'lucide-react';
import { useDriverAuth } from '../../contexts/DriverAuthContext';

const C = {
  bg:     '#0a0e14',
  panel:  '#0d121a',
  card:   '#11161f',
  green:  '#065f46',
  greenHi:'#059669',
  border: 'rgba(255,255,255,.08)',
  text:   'rgba(255,255,255,.85)',
  text2:  'rgba(255,255,255,.45)',
  error:  '#e84040',
};

const input = (err) => ({
  width: '100%', padding: '10px 12px', borderRadius: 6, outline: 'none',
  background: C.card, border: `1px solid ${err ? C.error : C.border}`,
  fontSize: 14, color: C.text, transition: 'border-color .15s', boxSizing: 'border-box',
});

export default function DriverLoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useDriverAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(location.state?.from?.pathname || '/driver/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading]);

  const validate = (name, value) => {
    if (name === 'email') {
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email';
    }
    if (name === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
    }
    return '';
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = { email: validate('email', form.email), password: validate('password', form.password) };
    const clean = Object.fromEntries(Object.entries(errs).filter(([, v]) => v));
    setTouched({ email: true, password: true });
    if (Object.keys(clean).length) { setErrors(clean); return; }

    setLoading(true);
    setErrors({});
    try {
      await login({ email: form.email, password: form.password });
      navigate(location.state?.from?.pathname || '/driver/dashboard', { replace: true });
    } catch (err) {
      setErrors({ general: err.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.email && form.password && !errors.email && !errors.password;
  const busy    = loading || authLoading;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg }}>

      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between"
        style={{ width: 'clamp(260px,34%,460px)', padding: '64px 56px', background: C.panel, borderRight: `1px solid ${C.border}`, position: 'relative', flexShrink: 0 }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: C.greenHi, letterSpacing: 5, textTransform: 'uppercase' }}>
          ABYRIDE &nbsp;·&nbsp; DRIVER
        </div>

        <div>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(5,150,105,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <Car size={28} color={C.greenHi} />
          </div>
          <div style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: 'clamp(36px,4vw,60px)', fontWeight: 700, color: '#fff', lineHeight: 1.05 }}>
            Welcome<br />Back.
          </div>
          <div style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: 'clamp(36px,4vw,60px)', fontWeight: 700, color: C.greenHi, lineHeight: 1.05, fontStyle: 'italic' }}>
            Driver.
          </div>
          <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,.15)', marginTop: 20 }} />
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.85, marginTop: 16, maxWidth: 300 }}>
            View your assigned rides, track trip progress, and manage your schedule — all in one place.
          </p>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: 4, textTransform: 'uppercase' }}>
          ABYRIDE.COM
        </div>

        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg,${C.green},${C.greenHi})` }} />
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile icon */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(5,150,105,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={20} color={C.greenHi} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: 1 }}>ABYRIDE</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: C.greenHi, letterSpacing: 3, textTransform: 'uppercase' }}>Driver Portal</div>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.greenHi, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 6 }}>Driver Login</div>
            <div style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: C.text, letterSpacing: 2, lineHeight: .9 }}>SIGN IN</div>
            <p style={{ fontSize: 13, fontWeight: 300, color: C.text2, marginTop: 8 }}>Enter your credentials to continue</p>
          </div>

          {errors.general && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 6, background: 'rgba(232,64,64,.1)', border: '1px solid rgba(232,64,64,.3)', fontSize: 13, color: C.error }}>
              ⚠ {errors.general}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 10, fontWeight: 700, color: C.text2, letterSpacing: 3, textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={onChange} onBlur={onBlur} disabled={busy}
                placeholder="driver@abyride.com"
                style={input(errors.email && touched.email)}
              />
              {errors.email && touched.email && (
                <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>⚠ {errors.email}</div>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 10, fontWeight: 700, color: C.text2, letterSpacing: 3, textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={onChange} onBlur={onBlur} disabled={busy}
                  placeholder="••••••••"
                  style={{ ...input(errors.password && touched.password), paddingRight: 40 }}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                >
                  {showPw ? <EyeOff size={15} color={C.text2} /> : <Eye size={15} color={C.text2} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>⚠ {errors.password}</div>
              )}
            </div>

            <button
              type="submit" disabled={busy || !isValid}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 6, border: 'none',
                background: C.greenHi, opacity: busy || !isValid ? .5 : 1,
                cursor: busy || !isValid ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 2, textTransform: 'uppercase',
                transition: 'opacity .15s',
              }}
            >
              {busy ? (
                <>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Signing in…
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 12, color: C.text2, textAlign: 'center', lineHeight: 1.6 }}>
            Your credentials were emailed when your account was created.<br />
            Contact admin if you need help accessing your account.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
