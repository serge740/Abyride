import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, RefreshCw, Truck, Ban, Eye, TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import tripService from '../../services/tripService';
import driverService from '../../services/driverService';
import { D } from '../../components/admin/theme';
import { Badge, EmptyState, TableHead, FilterTabs, SearchBar } from '../../components/admin/ui';
import { useSocket, useSocketEvent } from '../../contexts/SocketContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const fmtDateTime = (iso) => iso
  ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : '—';

const PAYMENT_LABEL = {
  PENDING:  { label: 'Unpaid',    color: '#92400e', bg: '#fffbeb' },
  PAID:     { label: 'Paid',      color: '#1e3a8a', bg: 'rgba(37,70,184,0.08)' },
  FAILED:   { label: 'Failed',    color: '#991b1b', bg: '#fee2e2' },
  REFUNDED: { label: 'Refunded',  color: '#4b5b75', bg: '#f6f7f9' },
};

function PaymentBadge({ status }) {
  const cfg = PAYMENT_LABEL[status] || PAYMENT_LABEL.PENDING;
  return <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, padding: '3px 9px', borderRadius: 999 }}>{cfg.label}</span>;
}

function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 130 }}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.04em', color: D.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: D.mute, marginTop: 3, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: D.mute, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

const PAY_METHOD_LABEL = { CASH: { l: 'Cash', e: '💵' }, CARD: { l: 'Card', e: '💳' }, PAYPAL: { l: 'PayPal', e: '🅿' }, GOOGLE_PAY: { l: 'G Pay', e: '🔵' }, APPLE_PAY: { l: 'Apple Pay', e: '🍎' } };
const COL = '155px 1fr 1fr 120px 130px 90px 80px 90px 200px';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { admin }        = useAdminAuth();
  const { emit, isConnected } = useSocket();
  const [trips,    setTrips]    = useState([]);
  const [drivers,  setDrivers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [actionId, setActionId] = useState(null);

  // Register as admin for real-time pushes
  useEffect(() => {
    if (isConnected && admin?.id) {
      emit('registerUser', { id: admin.id, type: 'ADMIN' });
    }
  }, [isConnected, admin?.id, emit]);

  // Real-time: new booking arrives
  useSocketEvent('trip:created', (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  });

  // Real-time: trip status changed
  useSocketEvent('trip:statusChanged', (updated) => {
    setTrips((prev) => prev.map((t) => t.id === updated.id ? updated : t));
  });

  // Real-time: payment status updated
  useSocketEvent('trip:paymentUpdated', ({ tripId, paymentStatus }) => {
    setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, paymentStatus } : t));
  });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [tripsData, driversData] = await Promise.all([tripService.getAll(), driverService.getAll()]);
      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setDrivers(Array.isArray(driversData) ? driversData : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const runAction = async (tripId, fn) => {
    setActionId(tripId); setError('');
    try {
      const updated = await fn();
      setTrips((prev) => prev.map((t) => t.id === tripId ? updated : t));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleAssign   = (tripId, driverId) => { if (!driverId) return; runAction(tripId, () => tripService.assign(tripId, driverId)); };
  const handleStart    = (tripId) => runAction(tripId, () => tripService.start(tripId));
  const handleComplete = (tripId) => runAction(tripId, () => tripService.complete(tripId));
  const handleCancel   = (tripId) => {
    if (!window.confirm('Cancel this trip?')) return;
    runAction(tripId, () => tripService.adminCancel(tripId));
  };

  // ── Stats ───────────────────────────────────────────────────
  const total     = trips.length;
  const requested = trips.filter((t) => t.status === 'REQUESTED').length;
  const active    = trips.filter((t) => ['ACCEPTED','ARRIVED_AT_PICKUP','IN_PROGRESS'].includes(t.status)).length;
  const completed = trips.filter((t) => t.status === 'COMPLETED').length;
  const cancelled = trips.filter((t) => t.status === 'CANCELLED').length;
  const revenue   = trips
    .filter((t) => t.status === 'COMPLETED' && t.paymentStatus === 'PAID')
    .reduce((sum, t) => sum + (t.fare || 0), 0);

  // ── Filter / search ─────────────────────────────────────────
  const filtered = trips.filter((t) => {
    const q  = search.toLowerCase();
    const ok = !q || t.pickupAddress?.toLowerCase().includes(q) || t.dropoffAddress?.toLowerCase().includes(q) || t.member?.names?.toLowerCase().includes(q);
    return ok && (filter === 'all' || t.status === filter);
  });

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>

      {/* ── Stats row ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard icon={CalendarDays} label="Total Bookings" value={total}     accent="#0b1f3a" />
        <StatCard icon={Clock}        label="Awaiting Driver" value={requested} accent="#92400e" />
        <StatCard icon={TrendingUp}   label="Active Rides"    value={active}    accent="#2546b8" />
        <StatCard icon={CheckCircle}  label="Completed"       value={completed} accent="#047857" />
        <StatCard icon={XCircle}      label="Cancelled"       value={cancelled} accent="#991b1b" />
        <StatCard icon={DollarSign}   label="Revenue (Paid)"  value={`$${revenue.toFixed(0)}`} accent="#2546b8" sub="completed + paid" />
      </div>

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTabs
          options={[
            ['all',         `All (${total})`],
            ['REQUESTED',   `Requested (${requested})`],
            ['ACCEPTED',    `Accepted (${trips.filter(t => t.status === 'ACCEPTED').length})`],
            ['IN_PROGRESS', `En Route (${trips.filter(t => t.status === 'IN_PROGRESS').length})`],
            ['COMPLETED',   `Completed (${completed})`],
          ]}
          value={filter} onChange={setFilter}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings…" />

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: isConnected ? '#047857' : D.mute, marginLeft: 'auto' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: isConnected ? '#10b981' : D.mute, boxShadow: isConnected ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none' }} />
          {isConnected ? 'Live' : 'Offline'}
        </div>

        <button
          onClick={load} disabled={loading} title="Refresh"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, background: D.ivory, border: `1px solid ${D.rule}`, cursor: 'pointer', fontSize: 12, color: D.slate }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'admSpin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────── */}
      <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 1060 }}>
          <TableHead cols={['When', 'Route', 'Member', 'Fleet', 'Driver', 'Status', 'Payment', 'Method', 'Actions']} template={COL} />
          {loading ? (
            <div style={{ padding: '40px 0' }}><EmptyState title="Loading bookings…" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={32} color={D.mute} />}
              title="No bookings found"
              desc={search || filter !== 'all' ? 'Try adjusting your search or filter.' : 'New bookings from the public site will appear here in real time.'}
            />
          ) : filtered.map((t) => {
            const busy = actionId === t.id;
            const eligibleDrivers = drivers.filter((d) => d.fleetId === t.fleetId && d.status === 'ACTIVE');
            return (
              <div key={t.id} className="d-row" style={{ display: 'grid', gridTemplateColumns: COL, gap: 12, padding: '12px 20px', borderTop: `1px solid ${D.rule}`, alignItems: 'center', background: D.ivory, opacity: busy ? 0.5 : 1, transition: 'opacity .15s' }}>
                <div style={{ fontSize: 11.5, color: D.slate }}>
                  {t.scheduledAt ? <><span style={{ fontSize: 10, fontWeight: 700, color: '#2546b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Scheduled</span><br />{fmtDateTime(t.scheduledAt)}</> : fmtDateTime(t.createdAt)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: D.ink, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.pickupAddress}</div>
                  <div style={{ fontSize: 11, color: D.slate, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>→ {t.dropoffAddress}</div>
                  <div style={{ fontSize: 11, color: D.mute, marginTop: 2 }}>{t.distanceKm?.toFixed(1)} km · ${t.fare?.toFixed(2)}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: D.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.member?.names || '—'}</div>
                  <div style={{ fontSize: 11, color: D.slate, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.member?.phone || t.member?.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: D.ink }}>
                  <Truck size={12} color={D.mute} /> {t.fleet?.name}
                </div>
                <div style={{ fontSize: 12, color: D.ink }}>
                  {t.driver ? t.driver.names : (
                    t.status === 'REQUESTED' ? (
                      <select defaultValue="" onChange={(e) => handleAssign(t.id, e.target.value)} disabled={busy}
                        style={{ fontSize: 11, padding: '4px 6px', borderRadius: 5, border: `1px solid ${D.rule}`, background: D.paper, color: D.ink, maxWidth: 120 }}>
                        <option value="">Assign…</option>
                        {eligibleDrivers.length === 0 ? <option disabled>No matching</option> : eligibleDrivers.map((d) => <option key={d.id} value={d.id}>{d.names}</option>)}
                      </select>
                    ) : <span style={{ color: D.mute, fontStyle: 'italic', fontSize: 11 }}>—</span>
                  )}
                </div>
                <div><Badge status={t.status} /></div>
                <div><PaymentBadge status={t.paymentStatus} /></div>
                <div style={{ fontSize: 12, color: D.ink }}>
                  {(() => { const m = PAY_METHOD_LABEL[t.paymentMethod] || PAY_METHOD_LABEL.CASH; return <span title={m.l}>{m.e} {m.l}</span>; })()}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* View detail */}
                  <button onClick={() => navigate(`/admin/dashboard/bookings/${t.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '5px 9px', borderRadius: 5, background: D.paper3, border: `1px solid ${D.rule}`, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: D.slate }}>
                    <Eye size={11} /> View
                  </button>
                  {t.status === 'ACCEPTED' && (
                    <button onClick={() => handleStart(t.id)} disabled={busy}
                      style={{ padding: '5px 9px', borderRadius: 5, background: 'rgba(37,70,184,0.08)', border: '1px solid rgba(37,70,184,0.25)', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: D.cobaltHi }}>
                      Start
                    </button>
                  )}
                  {t.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleComplete(t.id)} disabled={busy}
                      style={{ padding: '5px 9px', borderRadius: 5, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#047857' }}>
                      Done
                    </button>
                  )}
                  {['REQUESTED','ACCEPTED','ARRIVED_AT_PICKUP','IN_PROGRESS'].includes(t.status) && (
                    <button onClick={() => handleCancel(t.id)} disabled={busy}
                      style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '5px 9px', borderRadius: 5, background: '#fee2e2', border: '1px solid #fecaca', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#991b1b' }}>
                      <Ban size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div></div>
      </div>

      <div style={{ fontSize: 11, color: D.mute, marginTop: 12, paddingLeft: 4 }}>
        Showing {filtered.length} of {trips.length} bookings
      </div>
    </div>
  );
}
