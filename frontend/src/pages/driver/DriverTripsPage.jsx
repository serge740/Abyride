import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Navigation, Car, Clock, DollarSign,
  Ruler, RefreshCw, CheckCircle, AlertCircle, TrendingUp,
  Flag, Phone, User, MapIcon,
} from 'lucide-react';
import api from '../../api/api';
import AbyMap from '../../components/AbyMap';
import { useSocket, useSocketEvent } from '../../contexts/SocketContext';
import { useDriverAuth } from '../../contexts/DriverAuthContext';
import { useRoute } from '../../hooks/useRoute';

const G = {
  font:   "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  bg:     '#f4f6f9',
  card:   '#ffffff',
  ink:    '#0b1f3a',
  slate:  '#4b5b75',
  mute:   '#8a8d96',
  rule:   '#e6e7eb',
  green:  '#059669',
  gBg:    'rgba(5,150,105,0.08)',
  gBd:    'rgba(5,150,105,0.2)',
  amber:  '#d97706',
};

const STATUS_CFG = {
  REQUESTED:        { label: 'Awaiting Start',   dot: '#f59e0b', bg: '#fffbeb',       color: '#92400e' },
  ACCEPTED:         { label: 'Heading to Pickup', dot: '#2546b8', bg: 'rgba(37,70,184,0.07)', color: '#1e3a8a' },
  ARRIVED_AT_PICKUP:{ label: 'At Pickup',         dot: G.green,  bg: G.gBg,           color: '#065f46' },
  IN_PROGRESS:      { label: 'En Route',          dot: '#f97316', bg: '#fff7ed',       color: '#c2410c' },
  COMPLETED:        { label: 'Completed',         dot: G.ink,    bg: 'rgba(11,31,58,0.06)', color: G.ink },
  CANCELLED:        { label: 'Cancelled',         dot: '#dc2626', bg: '#fee2e2',       color: '#991b1b' },
};

const PAYMENT_CFG = {
  PENDING:  { label: 'Unpaid',   color: '#92400e', bg: '#fffbeb' },
  PAID:     { label: 'Paid',     color: '#065f46', bg: G.gBg },
  FAILED:   { label: 'Failed',   color: '#991b1b', bg: '#fee2e2' },
  REFUNDED: { label: 'Refunded', color: G.slate,   bg: '#f1f2f5' },
};

const ACTIVE_STATUSES = ['ACCEPTED', 'ARRIVED_AT_PICKUP', 'IN_PROGRESS'];

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : '—';

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.REQUESTED;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: cfg.bg, color: cfg.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function PayBadge({ status }) {
  const cfg = PAYMENT_CFG[status] || PAYMENT_CFG.PENDING;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: cfg.bg, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ background: G.card, borderRadius: 14, padding: '20px 22px', border: `1px solid ${G.rule}`, flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.05em', color: G.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: G.mute, marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
      </div>
    </div>
  );
}

/* ── Active trip navigation panel ──────────────────────────── */
function ActiveTripPanel({ trip, driverPos, onAction, busy }) {
  const isAccepted   = trip.status === 'ACCEPTED';
  const isAtPickup   = trip.status === 'ARRIVED_AT_PICKUP';
  const isInProgress = trip.status === 'IN_PROGRESS';

  // Destination for current step
  const destLatLng = isInProgress
    ? [trip.dropoffLat, trip.dropoffLng]
    : [trip.pickupLat, trip.pickupLng];

  const destLabel = isInProgress ? trip.dropoffAddress : trip.pickupAddress;

  // Route for navigation: driver → destination (throttled in parent, we just use what we get)
  const { positions: approachPositions, distanceKm: distRemaining } = useRoute(driverPos, destLatLng);

  // Full trip route (pickup → dropoff) always shown on map
  const pickupLatLng  = [trip.pickupLat,  trip.pickupLng];
  const dropoffLatLng = [trip.dropoffLat, trip.dropoffLng];
  const { positions: tripRoutePositions } = useRoute(pickupLatLng, dropoffLatLng);

  const stepLabel  = isInProgress ? 'Step 2 of 2 — Head to dropoff' : isAtPickup ? 'Arrived at pickup' : 'Step 1 of 2 — Head to pickup';
  const stepColor  = isInProgress ? '#c2410c' : isAtPickup ? G.green : '#1e3a8a';
  const stepBg     = isInProgress ? '#fff7ed' : isAtPickup ? G.gBg   : 'rgba(37,70,184,0.07)';

  return (
    <div style={{ background: G.card, borderRadius: 16, border: `2px solid ${isAtPickup ? G.gBd : isInProgress ? 'rgba(249,115,22,0.35)' : 'rgba(37,70,184,0.2)'}`, overflow: 'hidden', marginBottom: 28, boxShadow: '0 4px 32px rgba(11,31,58,0.1)' }}>

      {/* Step banner */}
      <div style={{ background: stepBg, borderBottom: `1px solid ${G.rule}`, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: stepColor, boxShadow: `0 0 0 3px ${stepColor}30` }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: stepColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stepLabel}</span>
        {distRemaining !== null && !isAtPickup && (
          <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: stepColor }}>
            {distRemaining < 1 ? `${(distRemaining * 1000).toFixed(0)} m` : `${distRemaining.toFixed(1)} km`} remaining
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 320 }}>

        {/* Left: map */}
        <div style={{ position: 'relative', minHeight: 320 }}>
          <AbyMap
            pickupLatLng={pickupLatLng}
            dropoffLatLng={dropoffLatLng}
            pickupLabel={trip.pickupAddress}
            dropoffLabel={trip.dropoffAddress}
            routePositions={tripRoutePositions}
            driverLatLng={driverPos}
            approachPositions={approachPositions}
            followDriver={Boolean(driverPos)}
            style={{ position: 'absolute', inset: 0, height: '100%', borderRadius: 0 }}
          />
          {!driverPos && (
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(11,31,58,0.85)', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>
              📍 Waiting for GPS…
            </div>
          )}
        </div>

        {/* Right: controls */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, borderLeft: `1px solid ${G.rule}` }}>

          {/* Passenger info */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: G.mute, marginBottom: 8 }}>Passenger</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: G.gBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color={G.green} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: G.ink }}>{trip.member?.names || 'Passenger'}</div>
                {trip.member?.phone && (
                  <a href={`tel:${trip.member.phone}`} style={{ fontSize: 12, color: G.green, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    <Phone size={11} /> {trip.member.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Destination */}
          {!isAtPickup && (
            <div style={{ background: G.bg, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: G.mute, marginBottom: 4 }}>
                {isInProgress ? 'Drop off at' : 'Pick up at'}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.ink, lineHeight: 1.4 }}>{destLabel}</div>
              {distRemaining !== null && (
                <div style={{ fontSize: 12, color: stepColor, fontWeight: 700, marginTop: 6 }}>
                  📍 {distRemaining < 1 ? `${(distRemaining * 1000).toFixed(0)} m` : `${distRemaining.toFixed(1)} km`} away
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {isAccepted && (
            <button
              onClick={() => onAction(trip.id, 'arrived-pickup', driverPos ? { lat: driverPos[0], lng: driverPos[1] } : undefined)} disabled={busy}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px', borderRadius: 10, border: 'none', background: '#2546b8', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: G.font, boxShadow: '0 2px 10px rgba(37,70,184,0.35)' }}
            >
              <MapPin size={14} /> I'm at the pickup
            </button>
          )}

          {isAtPickup && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: G.gBg, borderRadius: 10, padding: '12px', textAlign: 'center', border: `1px solid ${G.gBd}` }}>
                <div style={{ fontSize: 20 }}>✅</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46', marginTop: 4 }}>At pickup location</div>
                <div style={{ fontSize: 11, color: G.mute, marginTop: 2 }}>Waiting for passenger to board</div>
              </div>
              <button
                onClick={() => onAction(trip.id, 'start')} disabled={busy}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px', borderRadius: 10, border: 'none', background: G.green, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: G.font, boxShadow: '0 2px 10px rgba(5,150,105,0.35)' }}
              >
                ▶ Passenger boarded — Start Trip
              </button>
            </div>
          )}

          {isInProgress && (
            trip.driverCanComplete ? (
              <button
                onClick={() => onAction(trip.id, 'complete')} disabled={busy}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px', borderRadius: 10, border: 'none', background: G.ink, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: G.font, boxShadow: '0 2px 10px rgba(11,31,58,0.25)' }}
              >
                <Flag size={14} /> Arrived at dropoff — Complete
              </button>
            ) : (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🔒</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>Waiting for admin approval</div>
                  <div style={{ fontSize: 11, color: '#b45309', marginTop: 1 }}>Admin must allow you to complete this trip</div>
                </div>
              </div>
            )
          )}

          {/* Quick trip stats */}
          {(() => {
            const PM_LABEL = { CASH: '💵 Cash', CARD: '💳 Card', PAYPAL: '🅿 PayPal', GOOGLE_PAY: '🔵 G Pay', APPLE_PAY: '🍎 Apple Pay' };
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 'auto' }}>
                {[
                  { label: 'Distance', value: `${trip.distanceKm?.toFixed(1)} km` },
                  { label: 'Fare',     value: `$${trip.fare?.toFixed(2)}` },
                  { label: 'Payment',  value: PM_LABEL[trip.paymentMethod] || '💵 Cash' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: G.bg, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: G.mute, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G.ink }}>{value}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ── Compact trip card (non-active) ─────────────────────────── */
function TripCard({ trip }) {
  return (
    <div style={{ background: G.card, borderRadius: 14, border: `1px solid ${G.rule}`, padding: '16px 18px', boxShadow: '0 1px 4px rgba(11,31,58,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: G.mute, marginBottom: 3 }}>
            {fmtDate(trip.scheduledAt || trip.createdAt)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: G.ink }}>{trip.member?.names || 'Passenger'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <StatusBadge status={trip.status} />
          <PayBadge status={trip.paymentStatus} />
        </div>
      </div>

      <div style={{ background: G.bg, borderRadius: 8, padding: '10px 12px', marginBottom: 12, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 17, top: 26, bottom: 26, width: 2, background: G.rule }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2546b8', flexShrink: 0, zIndex: 1 }} />
          <div style={{ fontSize: 12, color: G.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.pickupAddress}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: G.ink, flexShrink: 0, zIndex: 1 }} />
          <div style={{ fontSize: 12, color: G.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.dropoffAddress}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 12, color: G.slate, fontWeight: 600 }}>{trip.distanceKm?.toFixed(1)} km</span>
          <span style={{ fontSize: 12, color: G.mute }}>·</span>
          <span style={{ fontSize: 12, color: G.slate, fontWeight: 600 }}>${trip.fare?.toFixed(2)}</span>
        </div>
        <Link to={`/track/${trip.id}`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: G.green, textDecoration: 'none' }}>
          <Navigation size={11} /> View map
        </Link>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'all',       label: 'All'       },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function DriverTripsPage() {
  const { driver }            = useDriverAuth();
  const { emit, isConnected } = useSocket();
  const [trips,    setTrips]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [filter,   setFilter]   = useState('all');
  const [actionId, setActionId] = useState(null);
  const [driverPos, setDriverPos] = useState(null); // [lat, lng] from GPS
  const watchIdRef    = useRef(null);
  const currentPosRef = useRef(null); // latest known position, read by the 10s broadcast interval

  // Register as DRIVER
  useEffect(() => {
    if (isConnected && driver?.id) {
      emit('registerUser', { id: driver.id, type: 'DRIVER' });
    }
  }, [isConnected, driver?.id, emit]);

  // Real-time events
  useSocketEvent('trip:assigned', (updated) => {
    setTrips((prev) => {
      const exists = prev.some((t) => t.id === updated.id);
      return exists ? prev.map((t) => t.id === updated.id ? updated : t) : [updated, ...prev];
    });
  });
  useSocketEvent('trip:statusChanged', (updated) => {
    if (updated.driverId === driver?.id) {
      setTrips((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    }
  });
  useSocketEvent('trip:paymentUpdated', ({ tripId, paymentStatus }) => {
    setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, paymentStatus } : t));
  });
  useSocketEvent('trip:permissionChanged', ({ tripId, driverCanComplete }) => {
    setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, driverCanComplete } : t));
  });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/trips/driver-trips');
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // GPS: start watching when there's an active trip
  const activeTrip = trips.find((t) => ACTIVE_STATUSES.includes(t.status));

  useEffect(() => {
    if (!activeTrip || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        currentPosRef.current = newPos;
        setDriverPos(newPos);
      },
      (err) => console.warn('GPS error:', err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [activeTrip?.id]);

  // Broadcast the driver's current position to the server every 10s while a trip is active
  useEffect(() => {
    if (!activeTrip) return;

    const intervalId = setInterval(() => {
      if (isConnected && currentPosRef.current) {
        emit('driver:location', { tripId: activeTrip.id, lat: currentPosRef.current[0], lng: currentPosRef.current[1] });
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [activeTrip?.id, isConnected, emit]);

  const runAction = async (tripId, action, body) => {
    setActionId(tripId); setError('');
    try {
      const r = await api.patch(`/trips/${tripId}/${action}`, body);
      setTrips((prev) => prev.map((t) => t.id === tripId ? r.data : t));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  // Stats (non-active trips)
  const completed = trips.filter((t) => t.status === 'COMPLETED');
  const earnings  = completed.filter((t) => t.paymentStatus === 'PAID').reduce((s, t) => s + (t.fare || 0), 0);

  // Non-active trips for the list
  const nonActive = trips.filter((t) => !ACTIVE_STATUSES.includes(t.status));
  const filtered  = nonActive.filter((t) => {
    if (filter === 'completed') return t.status === 'COMPLETED';
    if (filter === 'cancelled') return t.status === 'CANCELLED';
    return true;
  });

  return (
    <div style={{ padding: '28px 32px', fontFamily: G.font, background: G.bg, minHeight: '100%' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: G.ink, margin: 0, letterSpacing: '-0.03em' }}>My Reservations</h1>
          <p style={{ fontSize: 13, color: G.mute, margin: '4px 0 0' }}>
            Welcome, <strong style={{ color: G.slate }}>{driver?.names?.split(' ')[0]}</strong>
            {activeTrip && <span style={{ marginLeft: 10, color: G.green, fontWeight: 700 }}>· Active trip in progress</span>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: isConnected ? G.green : G.mute, background: G.card, border: `1px solid ${G.rule}`, borderRadius: 20, padding: '6px 12px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: isConnected ? '#10b981' : G.mute, boxShadow: isConnected ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none' }} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
          {driverPos && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: G.green, background: G.gBg, border: `1px solid ${G.gBd}`, borderRadius: 20, padding: '5px 10px' }}>
              <MapIcon size={11} /> GPS active
            </div>
          )}
          <button onClick={load} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: G.card, border: `1px solid ${G.rule}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: G.slate }}>
            <RefreshCw size={13} style={{ animation: loading ? 'driverSpin 1s linear infinite' : 'none' }} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Active trip navigation ───────────────────────────── */}
      {activeTrip && (
        <ActiveTripPanel
          trip={activeTrip}
          driverPos={driverPos}
          onAction={runAction}
          busy={actionId === activeTrip.id}
        />
      )}

      {/* ── Stats ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard icon={CalendarDays} label="Total"     value={trips.length}     accent={G.ink}   />
        <StatCard icon={TrendingUp}   label="Active"    value={trips.filter((t) => ACTIVE_STATUSES.includes(t.status)).length} accent={G.green} />
        <StatCard icon={CheckCircle}  label="Done"      value={completed.length} accent="#047857" />
        <StatCard icon={DollarSign}   label="Earnings"  value={`$${earnings.toFixed(0)}`} accent={G.green} />
      </div>

      {/* ── Error ───────────────────────────────────────────── */}
      {error && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b', display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* ── Past trips ──────────────────────────────────────── */}
      {nonActive.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: G.ink, margin: 0 }}>Trip History</h2>
            <div style={{ display: 'flex', gap: 2, background: G.card, borderRadius: 8, padding: 3, border: `1px solid ${G.rule}` }}>
              {TABS.map(({ id, label }) => (
                <button key={id} onClick={() => setFilter(id)}
                  style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: filter === id ? 700 : 500, fontFamily: G.font, background: filter === id ? G.ink : 'transparent', color: filter === id ? '#fff' : G.mute, transition: 'all .15s' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', border: `3px solid ${G.rule}`, borderTopColor: G.green, animation: 'driverSpin 0.8s linear infinite', margin: '0 auto 10px' }} />
              <div style={{ fontSize: 13, color: G.mute }}>Loading…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: G.ink, marginBottom: 4 }}>No trips here</div>
              <div style={{ fontSize: 13, color: G.mute }}>No trips match this filter.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
              {filtered.map((trip) => <TripCard key={trip.id} trip={trip} />)}
            </div>
          )}
        </>
      )}

      {!activeTrip && !loading && trips.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: G.card, border: `1px solid ${G.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CalendarDays size={26} color={G.mute} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: G.ink, marginBottom: 6 }}>No assignments yet</div>
          <div style={{ fontSize: 13, color: G.mute }}>New trip assignments will appear here instantly.</div>
        </div>
      )}

      <style>{`@keyframes driverSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
