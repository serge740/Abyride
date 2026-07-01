import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Car, Truck, CalendarDays, X } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import driverService from '../../services/driverService';
import logo from '../../assets/images/abyride_logo.png';
import { BRK } from './theme';

const NAV = [
  { id: 'overview', label: 'Overview',           icon: LayoutGrid,   path: '/admin/dashboard',         end: true  },
  { id: 'drivers',  label: 'Driver Management',  icon: Car,          path: '/admin/dashboard/drivers', end: false },
  { id: 'fleets',   label: 'Fleet Management',    icon: Truck,        path: '/admin/dashboard/fleets',  end: false },
  { id: 'bookings', label: 'Booking Management', icon: CalendarDays, path: '/admin/dashboard/bookings',end: false },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { admin } = useAdminAuth();
  const [activeDrivers, setActiveDrivers] = useState(0);

  useEffect(() => {
    driverService.getAll()
      .then((data) => setActiveDrivers((Array.isArray(data) ? data : []).filter((d) => d.status === 'ACTIVE').length))
      .catch(() => {});
  }, []);

  const counts = { drivers: activeDrivers, bookings: 0 };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,.6)' }}
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 240, background: BRK.bg, color: BRK.fg, borderRight: `1px solid ${BRK.line}`, overflowY: 'auto', flexShrink: 0 }}
      >
        {/* Brand */}
        <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${BRK.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logo} alt="Abyride" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 6, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 700, fontStyle: 'italic' }}>
              Abyride<span style={{ color: BRK.accent }}>.</span>
            </span>
          </div>
          <button onClick={onToggle} className="lg:hidden" style={{ padding: 4, borderRadius: 4, background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer' }}>
            <X size={14} color={BRK.fg} />
          </button>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', color: BRK.mute2, textTransform: 'uppercase', fontWeight: 700, padding: '10px 20px 0' }}>Admin Dashboard</div>

        {/* Nav */}
        <nav style={{ padding: '14px 10px', flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', color: BRK.mute2, textTransform: 'uppercase', fontWeight: 700, padding: '0 8px 12px' }}>Navigation</div>

          {NAV.map(({ id, label, icon: Icon, path, end }) => {
            const cnt = counts[id];
            return (
              <NavLink
                key={id}
                to={path}
                end={end}
                onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
                className={({ isActive }) => `nav-item${isActive ? ' nav-active' : ''}`}
                style={({ isActive }) => ({
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 7, cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                  fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'rgba(124,155,255,0.14)' : 'transparent',
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
                    {cnt > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', background: 'rgba(124,155,255,0.18)', color: BRK.accent, padding: '2px 7px', borderRadius: 999 }}>
                        {cnt}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: '14px 10px 20px', borderTop: `1px solid ${BRK.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px', marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: '#2546b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, fontStyle: 'italic', flexShrink: 0 }}>
              {(admin?.names || 'A')[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: BRK.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin?.names || 'Admin'}</div>
              <div style={{ fontSize: 11, color: BRK.mute2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin?.email || ''}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px', fontSize: 10.5, color: BRK.mute2, letterSpacing: '0.04em' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#34d399', flexShrink: 0 }} />
            System online · 24 / 7
          </div>
        </div>
      </aside>
    </>
  );
}
