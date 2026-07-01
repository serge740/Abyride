import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { D } from './theme';

function getPageMeta(pathname) {
  if (/^\/admin\/dashboard\/drivers\/create\/?$/.test(pathname)) {
    return { title: 'Add New Driver', crumbs: [{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Drivers', to: '/admin/dashboard/drivers' }, { label: 'New Driver' }] };
  }
  if (/^\/admin\/dashboard\/drivers\/[^/]+\/?$/.test(pathname)) {
    return { title: 'Driver Profile', crumbs: [{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Drivers', to: '/admin/dashboard/drivers' }, { label: 'Profile' }] };
  }
  if (/^\/admin\/dashboard\/drivers\/?$/.test(pathname)) {
    return { title: 'Driver Management', crumbs: [{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Drivers' }] };
  }
  if (/^\/admin\/dashboard\/bookings\/?$/.test(pathname)) {
    return { title: 'Booking Management', crumbs: [{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Bookings' }] };
  }
  if (/^\/admin\/dashboard\/fleets\/create\/?$/.test(pathname)) {
    return { title: 'Add New Fleet', crumbs: [{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Fleets', to: '/admin/dashboard/fleets' }, { label: 'New Fleet' }] };
  }
  if (/^\/admin\/dashboard\/fleets\/[^/]+\/edit\/?$/.test(pathname)) {
    return { title: 'Edit Fleet', crumbs: [{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Fleets', to: '/admin/dashboard/fleets' }, { label: 'Edit' }] };
  }
  if (/^\/admin\/dashboard\/fleets\/?$/.test(pathname)) {
    return { title: 'Fleet Management', crumbs: [{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Fleets' }] };
  }
  return { title: 'Overview', crumbs: [{ label: 'Dashboard' }] };
}

const TODAY = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Header({ onToggle }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  const { title, crumbs } = getPageMeta(location.pathname);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const onLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ background: D.ivory, borderBottom: `1px solid ${D.rule}`, padding: '14px 32px', display: 'flex', alignItems: 'center', flexShrink: 0, fontFamily: D.font }}>
      <button onClick={onToggle} className="lg:hidden" style={{ marginRight: 12, padding: 6, borderRadius: 6, background: 'transparent', border: `1px solid ${D.rule}`, cursor: 'pointer' }}>
        <Menu size={16} color={D.ink} />
      </button>

      <div>
        {crumbs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span style={{ color: D.mute, fontSize: 11, margin: '0 5px' }}>/</span>}
                {c.to ? (
                  <Link to={c.to} style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: D.cobaltHi, cursor: 'pointer' }}>
                    {c.label}
                  </Link>
                ) : (
                  <span style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: D.mute }}>{c.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', fontStyle: 'italic', color: D.ink, lineHeight: 1.2, margin: 0 }}>{title}</h1>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="hidden md:block" style={{ fontSize: 12, color: D.mute, letterSpacing: '0.04em' }}>{TODAY}</div>
        <div className="hidden md:block" style={{ width: 1, height: 18, background: D.rule }} />

        <div style={{ position: 'relative' }} ref={dropRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 999, background: D.cobaltHi, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontStyle: 'italic', flexShrink: 0 }}>
              {(admin?.names || 'A')[0]?.toUpperCase()}
            </div>
            <span className="hidden md:inline" style={{ fontSize: 12.5, fontWeight: 600, color: D.ink }}>{admin?.names || 'Admin'}</span>
            <ChevronDown size={12} color={D.mute} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }} className="hidden md:inline" />
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 220, background: D.ivory, border: `1px solid ${D.rule}`,
              borderRadius: 8, zIndex: 50, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(11,31,58,0.16)',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${D.rule}`, background: D.paper }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: D.ink }}>{admin?.names || 'Admin'}</div>
                <div style={{ fontSize: 11, color: D.mute, marginTop: 2 }}>{admin?.email || ''}</div>
              </div>
              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={onLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#991b1b' }}
                >
                  <LogOut size={14} color="#991b1b" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
