import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Users, CalendarDays, Gauge } from 'lucide-react';
import driverService from '../../services/driverService';
import memberService from '../../services/memberService';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { D, BRK } from '../../components/admin/theme';
import { Badge, Avatar, StatCard, EmptyState } from '../../components/admin/ui';

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function PulseCard({ label, value, bg, border, color }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 9, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color, letterSpacing: '0.02em' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { admin } = useAdminAuth();
  const [drivers, setDrivers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [driversData, membersData] = await Promise.all([driverService.getAll(), memberService.getAll()]);
        setDrivers(Array.isArray(driversData) ? driversData : []);
        setMembers(Array.isArray(membersData) ? membersData : []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeDrivers    = drivers.filter((d) => d.status === 'ACTIVE').length;
  const pendingDrivers   = drivers.filter((d) => d.status === 'PENDING').length;
  const suspendedDrivers = drivers.filter((d) => d.status === 'SUSPENDED').length;

  const recentDrivers = drivers.slice(0, 5);
  const recentMembers = members.slice(0, 5);
  const firstName = (admin?.names || 'Admin').split(' ')[0];

  return (
    <div style={{ padding: '28px 32px', minHeight: '100%', fontFamily: D.font }}>

      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: D.mute, fontWeight: 600, marginBottom: 5 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', fontStyle: 'italic', color: D.ink, margin: 0 }}>
          {greeting()}, {firstName}.
        </h2>
        <p style={{ fontSize: 14, color: D.slate, marginTop: 5 }}>Here's what's happening with Abyride today.</p>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: '10px 16px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
          ⚠ {error}
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
        <StatCard label="Total Drivers"  value={drivers.length} sub={`${activeDrivers} currently active`} accentColor="#2546b8" loading={loading} />
        <StatCard label="Active Drivers" value={activeDrivers}  sub={`${drivers.length - activeDrivers} off duty`} accentColor="#0b1f3a" loading={loading} />
        <StatCard label="Total Members"  value={members.length} sub="Registered riders" accentColor="#2546b8" loading={loading} />
        <StatCard label="Total Bookings" value={0} sub="Booking module coming soon" accentColor="#0b1f3a" loading={loading} />
      </div>

      {/* Status mini-strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        <PulseCard label="Pending Drivers"   value={pendingDrivers}   bg="#fffbeb" border="#fde68a" color="#92400e" />
        <PulseCard label="Suspended Drivers" value={suspendedDrivers} bg="#fee2e2" border="#fecaca" color="#991b1b" />
        <PulseCard label="Active Drivers"    value={activeDrivers}    bg="rgba(37,70,184,0.06)" border="rgba(37,70,184,0.15)" color="#1e3a8a" />
      </div>

      {/* Main 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 14 }}>

        {/* Recent Drivers */}
        <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${D.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: D.mute }}>Fleet</div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: D.ink, marginTop: 1 }}>Recent drivers</div>
            </div>
            <button type="button" onClick={() => navigate('/admin/dashboard/drivers')} style={{ fontSize: 12, fontWeight: 600, color: D.cobaltHi, background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${D.cobaltHi}`, paddingBottom: 1 }}>
              View all →
            </button>
          </div>
          <div style={{ borderTop: `2px solid ${D.ink}` }}>
            {loading ? (
              <div style={{ padding: '32px 0' }}><EmptyState title="Loading…" /></div>
            ) : recentDrivers.length === 0 ? (
              <EmptyState icon={<Car size={28} color={D.mute} />} title="No drivers yet" desc="Add your first driver to get started." />
            ) : recentDrivers.map((d) => (
              <div key={d.id} className="d-row" onClick={() => navigate(`/admin/dashboard/drivers/${d.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px', borderBottom: `1px solid ${D.rule}`, cursor: 'pointer', background: D.ivory }}>
                <Avatar initial={d.names?.[0]?.toUpperCase() || 'D'} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: D.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.names}</div>
                  <div style={{ fontSize: 11.5, color: D.slate, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Badge status={d.status} />
                  <div style={{ fontSize: 11, color: D.mute, marginTop: 4 }}>{fmtDate(d.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Recent Members */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${D.rule}` }}>
              <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: D.mute }}>Riders</div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: D.ink, marginTop: 1 }}>Recent members</div>
            </div>
            <div style={{ borderTop: `2px solid ${D.ink}` }}>
              {loading ? null : recentMembers.length === 0 ? (
                <EmptyState icon={<Users size={26} color={D.mute} />} title="No members yet" />
              ) : recentMembers.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderBottom: `1px solid ${D.rule}` }}>
                  <Avatar initial={m.names?.[0]?.toUpperCase() || 'M'} size={30} bg="#0b1f3a" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: D.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.names}</div>
                    <div style={{ fontSize: 11, color: D.slate, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                  </div>
                  <Badge status={m.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: BRK.bg, borderRadius: 10, padding: '20px', color: '#fff', flexShrink: 0 }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: BRK.mute2, marginBottom: 12 }}>Quick Actions</div>
            {[
              { label: 'Add Driver',   sub: 'Onboard a new driver',        path: '/admin/dashboard/drivers/create', icon: Car },
              { label: 'View Bookings', sub: 'Track ride requests',         path: '/admin/dashboard/bookings',       icon: CalendarDays },
            ].map((a) => (
              <button key={a.path} type="button" onClick={() => navigate(a.path)} className="qa-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 7, color: '#fff', fontFamily: D.font, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', marginBottom: 8, transition: 'background 0.12s', textAlign: 'left' }}>
                <div>
                  {a.label}
                  <div style={{ fontSize: 10.5, fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginTop: 2, letterSpacing: '0.02em' }}>{a.sub}</div>
                </div>
                <span style={{ color: BRK.accent, fontSize: 16 }}>→</span>
              </button>
            ))}
            <div style={{ marginTop: 6, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#34d399', fontWeight: 600, letterSpacing: '0.04em' }}>
              <Gauge size={12} /> Operations live
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
