import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays, RefreshCw, Eye, TrendingUp, CheckCircle,
  DollarSign, Search, Navigation, MapPin, Phone,
} from 'lucide-react';
import api from '../../api/api';
import { useSocket, useSocketEvent } from '../../contexts/SocketContext';
import { useDriverAuth } from '../../contexts/DriverAuthContext';

const G = {
  font:  "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  bg:    '#f4f6f9',
  card:  '#ffffff',
  ink:   '#0b1f3a',
  slate: '#4b5b75',
  mute:  '#8a8d96',
  rule:  '#e6e7eb',
  green: '#059669',
  gBg:   'rgba(5,150,105,0.08)',
  gBd:   'rgba(5,150,105,0.2)',
};

const STATUS_CFG = {
  REQUESTED:         { label: 'Requested',     dot: '#f59e0b', bg: '#fffbeb',              color: '#92400e' },
  ACCEPTED:          { label: 'Heading to Pickup', dot: '#2546b8', bg: 'rgba(37,70,184,0.08)', color: '#1e3a8a' },
  ARRIVED_AT_PICKUP: { label: 'At Pickup',     dot: G.green,  bg: G.gBg,                  color: '#065f46' },
  IN_PROGRESS:       { label: 'En Route',      dot: '#f97316', bg: '#fff7ed',              color: '#c2410c' },
  COMPLETED:         { label: 'Completed',     dot: G.ink,    bg: 'rgba(11,31,58,0.06)',   color: G.ink    },
  CANCELLED:         { label: 'Cancelled',     dot: '#dc2626', bg: '#fee2e2',              color: '#991b1b' },
};

const PAYMENT_CFG = {
  PENDING:  { label: 'Unpaid',   color: '#92400e', bg: '#fffbeb' },
  PAID:     { label: 'Paid',     color: '#065f46', bg: G.gBg },
  FAILED:   { label: 'Failed',   color: '#991b1b', bg: '#fee2e2' },
  REFUNDED: { label: 'Refunded', color: G.slate,   bg: '#f1f2f5' },
};

const ACTIVE = ['ACCEPTED', 'ARRIVED_AT_PICKUP', 'IN_PROGRESS'];

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : '—';

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.REQUESTED;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: c.bg, color: c.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />{c.label}
    </span>
  );
}

function PayBadge({ status }) {
  const c = PAYMENT_CFG[status] || PAYMENT_CFG.PENDING;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: c.bg, color: c.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {c.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ background: G.card, borderRadius: 14, padding: '18px 20px', border: `1px solid ${G.rule}`, flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.05em', color: G.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: G.mute, marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'all',       label: 'All'       },
  { id: 'active',    label: 'Active'    },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function DriverReservationsPage() {
  const navigate = useNavigate();
  const { driver }            = useDriverAuth();
  const { emit, isConnected } = useSocket();

  const [trips,    setTrips]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState('');
  const [filter,   setFilter]  = useState('all');
  const [search,   setSearch]  = useState('');

  useEffect(() => {
    if (isConnected && driver?.id) emit('registerUser', { id: driver.id, type: 'DRIVER' });
  }, [isConnected, driver?.id, emit]);

  useSocketEvent('trip:assigned', (updated) => {
    setTrips((prev) => {
      const exists = prev.some((t) => t.id === updated.id);
      return exists ? prev.map((t) => t.id === updated.id ? updated : t) : [updated, ...prev];
    });
  });
  useSocketEvent('trip:statusChanged', (updated) => {
    if (updated.driverId === driver?.id)
      setTrips((prev) => prev.map((t) => t.id === updated.id ? updated : t));
  });
  useSocketEvent('trip:paymentUpdated', ({ tripId, paymentStatus }) => {
    setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, paymentStatus } : t));
  });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/trips/driver-trips');
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const active    = trips.filter((t) => ACTIVE.includes(t.status));
  const completed = trips.filter((t) => t.status === 'COMPLETED');
  const earnings  = completed.filter((t) => t.paymentStatus === 'PAID').reduce((s, t) => s + (t.fare || 0), 0);

  const filtered = trips.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.member?.names?.toLowerCase().includes(q)
      || t.pickupAddress?.toLowerCase().includes(q)
      || t.dropoffAddress?.toLowerCase().includes(q);
    const matchFilter =
      filter === 'active'    ? ACTIVE.includes(t.status) :
      filter === 'completed' ? t.status === 'COMPLETED'  :
      filter === 'cancelled' ? t.status === 'CANCELLED'  : true;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: '28px 32px', fontFamily: G.font, background: G.bg, minHeight: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: G.ink, margin: 0, letterSpacing: '-0.03em' }}>Reservations</h1>
          <p style={{ fontSize: 13, color: G.mute, margin: '4px 0 0' }}>All trips assigned to you</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: isConnected ? G.green : G.mute, background: G.card, border: `1px solid ${G.rule}`, borderRadius: 20, padding: '6px 12px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: isConnected ? '#10b981' : G.mute, boxShadow: isConnected ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none' }} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
          <button onClick={load} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: G.card, border: `1px solid ${G.rule}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: G.slate }}>
            <RefreshCw size={13} style={{ animation: loading ? 'drSpin 1s linear infinite' : 'none' }} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard icon={CalendarDays} label="Total"    value={trips.length}     accent={G.ink}   />
        <StatCard icon={TrendingUp}   label="Active"   value={active.length}    accent={G.green} />
        <StatCard icon={CheckCircle}  label="Done"     value={completed.length} accent="#047857" />
        <StatCard icon={DollarSign}   label="Earnings" value={`$${earnings.toFixed(0)}`} accent={G.green} />
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 2, background: G.card, borderRadius: 10, padding: 4, border: `1px solid ${G.rule}` }}>
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setFilter(id)}
              style={{ padding: '6px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: filter === id ? 700 : 500, fontFamily: G.font, background: filter === id ? G.ink : 'transparent', color: filter === id ? '#fff' : G.mute, transition: 'all .15s' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: G.mute, pointerEvents: 'none' }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search passenger, address…"
            style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: `1px solid ${G.rule}`, background: G.card, fontSize: 12, color: G.ink, fontFamily: G.font, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <span style={{ fontSize: 12, color: G.mute, marginLeft: 4 }}>{filtered.length} reservation{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
          ⚠ {error}
        </div>
      )}

      {/* List */}
      <div style={{ background: G.card, borderRadius: 14, border: `1px solid ${G.rule}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', border: `3px solid ${G.rule}`, borderTopColor: G.green, animation: 'drSpin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 13, color: G.mute }}>Loading reservations…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <CalendarDays size={32} color={G.mute} style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: G.ink, marginBottom: 4 }}>No reservations found</div>
            <div style={{ fontSize: 13, color: G.mute }}>
              {search || filter !== 'all' ? 'Try adjusting your filter or search.' : 'New assignments will appear here instantly.'}
            </div>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 150px 120px 110px', gap: 12, padding: '10px 20px', borderBottom: `1px solid ${G.rule}`, background: G.bg }}>
              {['When', 'Passenger', 'Route', 'Status', 'Payment', 'Actions'].map((h) => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: G.mute }}>{h}</div>
              ))}
            </div>

            {filtered.map((t) => {
              const isActive = ACTIVE.includes(t.status);
              return (
                <div key={t.id}
                  style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 150px 120px 110px', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${G.rule}`, alignItems: 'center', background: isActive ? 'rgba(5,150,105,0.02)' : G.card, transition: 'background .15s' }}>

                  {/* When */}
                  <div>
                    {t.scheduledAt && (
                      <div style={{ fontSize: 9, fontWeight: 700, color: '#2546b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Scheduled</div>
                    )}
                    <div style={{ fontSize: 12, color: G.slate }}>{fmtDate(t.scheduledAt || t.createdAt)}</div>
                  </div>

                  {/* Passenger */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: G.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.member?.names || '—'}
                    </div>
                    {t.member?.phone && (
                      <a href={`tel:${t.member.phone}`} style={{ fontSize: 11, color: G.green, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <Phone size={10} /> {t.member.phone}
                      </a>
                    )}
                  </div>

                  {/* Route */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                      <Navigation size={10} color="#2546b8" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: G.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.pickupAddress}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={10} color={G.mute} style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: G.slate, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.dropoffAddress}</div>
                    </div>
                    <div style={{ fontSize: 11, color: G.mute, marginTop: 3 }}>{t.distanceKm?.toFixed(1)} km · ${t.fare?.toFixed(2)}</div>
                  </div>

                  {/* Status */}
                  <div><StatusBadge status={t.status} /></div>

                  {/* Payment */}
                  <div><PayBadge status={t.paymentStatus} /></div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => navigate(`/driver/reservations/${t.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7, background: isActive ? G.green : G.bg, border: `1px solid ${isActive ? G.gBd : G.rule}`, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: isActive ? '#fff' : G.slate, fontFamily: G.font }}>
                      <Eye size={12} /> View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`@keyframes drSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
