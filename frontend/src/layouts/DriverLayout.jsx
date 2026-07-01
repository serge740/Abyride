import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, X, Menu, LogOut, ChevronDown, Car, List } from 'lucide-react';
import { useDriverAuth } from '../contexts/DriverAuthContext';

const BRK = {
  bg:    '#064e3b',
  bg2:   '#022c22',
  fg:    '#ffffff',
  mute:  'rgba(255,255,255,0.65)',
  mute2: 'rgba(255,255,255,0.4)',
  line:  'rgba(255,255,255,0.10)',
  accent:'#6ee7b7',
};

const D = {
  font:   "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  ivory:  '#ffffff',
  ink:    '#064e3b',
  slate:  '#4b5b75',
  mute:   '#8a8d96',
  rule:   '#e6e7eb',
  paper:  '#f6f7f9',
  greenHi:'#059669',
};

const NAV = [
  { id: 'trips',        label: 'Active Trips',    icon: CalendarDays, path: '/driver/dashboard',  end: true },
  { id: 'reservations', label: 'Reservations',    icon: List,         path: '/driver/reservations', end: false },
];

function DriverSidebar({ isOpen, onToggle, driver }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,.6)' }} onClick={onToggle} />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 240, background: BRK.bg, color: BRK.fg, borderRight: `1px solid ${BRK.line}`, overflowY: 'auto', flexShrink: 0 }}
      >
        <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${BRK.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(110,231,183,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Car size={14} color={BRK.accent} />
            </div>
            <span style={{ fontFamily: D.font, fontSize: 17, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 700, fontStyle: 'italic' }}>
              Abyride<span style={{ color: BRK.accent }}>.</span>
            </span>
          </div>
          <button onClick={onToggle} className="lg:hidden" style={{ padding: 4, borderRadius: 4, background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer' }}>
            <X size={14} color={BRK.fg} />
          </button>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', color: BRK.mute2, textTransform: 'uppercase', fontWeight: 700, padding: '10px 20px 0', fontFamily: D.font }}>Driver Portal</div>

        <nav style={{ padding: '14px 10px', flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', color: BRK.mute2, textTransform: 'uppercase', fontWeight: 700, padding: '0 8px 12px', fontFamily: D.font }}>Navigation</div>
          {NAV.map(({ id, label, icon: Icon, path, end }) => (
            <NavLink
              key={id} to={path} end={end}
              onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
              style={({ isActive }) => ({
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 7, cursor: 'pointer',
                fontFamily: D.font,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                background: isActive ? 'rgba(110,231,183,0.14)' : 'transparent',
                borderLeft: isActive ? `2px solid ${BRK.accent}` : '2px solid transparent',
                marginBottom: 2, transition: 'all 0.12s', textDecoration: 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? BRK.accent : 'rgba(255,255,255,0.38)', display: 'flex', alignItems: 'center' }}>
                    <Icon size={15} />
                  </span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '14px 10px 20px', borderTop: `1px solid ${BRK.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px', marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: BRK.accent, color: BRK.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D.font, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {(driver?.names || 'D')[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: BRK.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: D.font }}>{driver?.names || 'Driver'}</div>
              <div style={{ fontSize: 11, color: BRK.mute2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{driver?.email || ''}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px', fontSize: 10.5, color: BRK.mute2, letterSpacing: '0.04em', fontFamily: D.font }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#34d399', flexShrink: 0 }} />
            Ready for trips
          </div>
        </div>
      </aside>
    </>
  );
}

function DriverHeader({ onToggle, driver, onLogout, title }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const TODAY = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ background: D.ivory, borderBottom: `1px solid ${D.rule}`, padding: '14px 32px', display: 'flex', alignItems: 'center', flexShrink: 0, fontFamily: D.font }}>
      <button onClick={onToggle} className="lg:hidden" style={{ marginRight: 12, padding: 6, borderRadius: 6, background: 'transparent', border: `1px solid ${D.rule}`, cursor: 'pointer' }}>
        <Menu size={16} color={D.ink} />
      </button>

      <div>
        <div style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: D.greenHi, marginBottom: 3 }}>Driver Portal</div>
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
            <div style={{ width: 28, height: 28, borderRadius: 999, background: D.greenHi, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {(driver?.names || 'D')[0]?.toUpperCase()}
            </div>
            <span className="hidden md:inline" style={{ fontSize: 12.5, fontWeight: 600, color: D.ink }}>{driver?.names || 'Driver'}</span>
            <ChevronDown size={12} color={D.mute} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }} className="hidden md:inline" />
          </button>

          {dropdownOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 220, background: D.ivory, border: `1px solid ${D.rule}`, borderRadius: 8, zIndex: 50, overflow: 'hidden', boxShadow: '0 8px 32px rgba(6,78,59,0.16)' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${D.rule}`, background: D.paper }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: D.ink }}>{driver?.names || 'Driver'}</div>
                <div style={{ fontSize: 11, color: D.mute, marginTop: 2 }}>{driver?.email || ''}</div>
              </div>
              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => { setDropdownOpen(false); onLogout(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#991b1b', fontFamily: D.font }}
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

const PAGE_TITLES = {
  '/driver/dashboard':   'Active Trips',
  '/driver/reservations': 'Reservations',
};

export default function DriverLayout() {
  const { driver, logout } = useDriverAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggle = () => setSidebarOpen((v) => !v);

  const handleLogout = async () => {
    await logout();
    navigate('/driver/login');
  };

  const pageTitle = location.pathname.startsWith('/driver/reservations/')
    ? 'Reservation Detail'
    : PAGE_TITLES[location.pathname] || 'Driver Portal';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f6f7f9', overflow: 'hidden' }}>
      <DriverSidebar isOpen={sidebarOpen} onToggle={toggle} driver={driver} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <DriverHeader onToggle={toggle} driver={driver} onLogout={handleLogout} title={pageTitle} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#f6f7f9' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
