import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Navigation, User, Phone, Mail,
  Car, DollarSign, Ruler, Clock, CalendarDays, CheckCircle,
  AlertCircle, MapIcon, Flag,
} from 'lucide-react';
import api from '../../api/api';
import AbyMap from '../../components/AbyMap';
import { useRoute } from '../../hooks/useRoute';
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
  REQUESTED:         { label: 'Requested',        color: '#92400e', bg: '#fffbeb',              dot: '#f59e0b' },
  ACCEPTED:          { label: 'Heading to Pickup', color: '#1e3a8a', bg: 'rgba(37,70,184,0.08)', dot: '#2546b8' },
  ARRIVED_AT_PICKUP: { label: 'At Pickup',         color: '#065f46', bg: G.gBg,                  dot: G.green   },
  IN_PROGRESS:       { label: 'En Route',          color: '#c2410c', bg: '#fff7ed',              dot: '#f97316' },
  COMPLETED:         { label: 'Completed',         color: G.ink,    bg: 'rgba(11,31,58,0.06)',   dot: G.ink     },
  CANCELLED:         { label: 'Cancelled',         color: '#991b1b', bg: '#fee2e2',              dot: '#dc2626' },
};

const PAYMENT_CFG = {
  PENDING:  { label: 'Unpaid',   color: '#92400e', bg: '#fffbeb' },
  PAID:     { label: 'Paid',     color: '#065f46', bg: G.gBg },
  FAILED:   { label: 'Failed',   color: '#991b1b', bg: '#fee2e2' },
  REFUNDED: { label: 'Refunded', color: G.slate,   bg: '#f1f2f5' },
};

const TIMELINE = [
  { key: 'REQUESTED',         label: 'Booking received'  },
  { key: 'ACCEPTED',          label: 'Assigned to you'   },
  { key: 'ARRIVED_AT_PICKUP', label: 'Arrived at pickup' },
  { key: 'IN_PROGRESS',       label: 'Trip started'      },
  { key: 'COMPLETED',         label: 'Trip completed'    },
];
const STATUS_ORDER = { REQUESTED: 0, ACCEPTED: 1, ARRIVED_AT_PICKUP: 2, IN_PROGRESS: 3, COMPLETED: 4, CANCELLED: -1 };

const ACTIVE = ['ACCEPTED', 'ARRIVED_AT_PICKUP', 'IN_PROGRESS'];

const fmtFull  = (iso) => iso ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium',  timeStyle: 'short' }) : '—';

export default function DriverReservationDetailPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { driver }            = useDriverAuth();
  const { emit, isConnected } = useSocket();

  const [trip,      setTrip]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [actionErr, setActionErr] = useState('');
  const [busy,      setBusy]      = useState(false);
  const [driverPos, setDriverPos] = useState(null);
  const watchIdRef    = useRef(null);
  const currentPosRef = useRef(null); // latest known position, read by the 10s broadcast interval

  // Load trip
  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const res = await api.get(`/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Trip not found');
      } finally { setLoading(false); }
    })();
  }, [id]);

  // Register + watch trip room
  useEffect(() => {
    if (!isConnected || !trip) return;
    emit('registerUser', { id: driver.id, type: 'DRIVER' });
    emit('watchTrip', { tripId: trip.id });
  }, [isConnected, trip?.id, driver?.id, emit]);

  // Live updates
  useSocketEvent('trip:statusChanged', (updated) => { if (updated.id === id) setTrip(updated); });
  useSocketEvent('trip:assigned',      (updated) => { if (updated.id === id) setTrip(updated); });
  useSocketEvent('trip:paymentUpdated', ({ tripId, paymentStatus }) => {
    if (tripId === id) setTrip((p) => p ? { ...p, paymentStatus } : p);
  });
  useSocketEvent('trip:permissionChanged', ({ tripId, driverCanComplete }) => {
    if (tripId === id) setTrip((p) => p ? { ...p, driverCanComplete } : p);
  });

  // GPS — only when this is an active trip assigned to this driver
  useEffect(() => {
    if (!trip || !ACTIVE.includes(trip.status) || trip.driverId !== driver?.id || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        currentPosRef.current = newPos;
        setDriverPos(newPos);
      },
      (err) => console.warn('GPS:', err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [trip?.id, trip?.status, driver?.id]);

  // Broadcast the driver's current position to the server every 10s while the trip is active
  useEffect(() => {
    if (!trip || !ACTIVE.includes(trip.status) || trip.driverId !== driver?.id) return;

    const intervalId = setInterval(() => {
      if (isConnected && currentPosRef.current) {
        emit('driver:location', { tripId: trip.id, lat: currentPosRef.current[0], lng: currentPosRef.current[1] });
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [trip?.id, trip?.status, driver?.id, isConnected, emit]);

  const runAction = async (endpoint, body) => {
    setBusy(true); setActionErr('');
    try {
      const res = await api.patch(`/trips/${id}/${endpoint}`, body);
      setTrip(res.data);
    } catch (err) {
      setActionErr(err.response?.data?.message || err.message || 'Action failed');
    } finally { setBusy(false); }
  };

  // Map data
  const pickupLatLng  = trip ? [trip.pickupLat,  trip.pickupLng]  : null;
  const dropoffLatLng = trip ? [trip.dropoffLat, trip.dropoffLng] : null;
  const { positions: tripRoute } = useRoute(pickupLatLng, dropoffLatLng);

  const isHeadingToPickup = trip && ['ACCEPTED', 'ARRIVED_AT_PICKUP'].includes(trip.status);
  const approachDest      = isHeadingToPickup ? pickupLatLng : dropoffLatLng;
  const { positions: approachRoute, distanceKm: distRemaining } = useRoute(driverPos, approachDest);

  const isMyTrip      = trip?.driverId === driver?.id;
  const isActive      = trip && ACTIVE.includes(trip.status);
  const currentStep   = STATUS_ORDER[trip?.status] ?? 0;

  /* ── Loading / error ──────────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', fontFamily: G.font }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${G.rule}`, borderTopColor: G.green, animation: 'drSpin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 13, color: G.mute }}>Loading reservation…</div>
      </div>
    </div>
  );

  if (error || !trip) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', fontFamily: G.font }}>
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <AlertCircle size={36} color="#991b1b" style={{ margin: '0 auto 12px', display: 'block' }} />
        <div style={{ fontSize: 17, fontWeight: 700, color: G.ink, marginBottom: 6 }}>Not found</div>
        <div style={{ fontSize: 13, color: G.mute, marginBottom: 20 }}>{error}</div>
        <button onClick={() => navigate('/driver/reservations')}
          style={{ padding: '10px 20px', borderRadius: 8, background: G.ink, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: G.font }}>
          Back to Reservations
        </button>
      </div>
    </div>
  );

  const sCfg = STATUS_CFG[trip.status] || STATUS_CFG.REQUESTED;
  const pCfg = PAYMENT_CFG[trip.paymentStatus] || PAYMENT_CFG.PENDING;

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: G.font, overflow: 'hidden' }}>

      {/* ── Map side (left) ─────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 400 }}>
        <AbyMap
          pickupLatLng={pickupLatLng}
          dropoffLatLng={dropoffLatLng}
          pickupLabel={trip.pickupAddress}
          dropoffLabel={trip.dropoffAddress}
          routePositions={tripRoute}
          driverLatLng={driverPos}
          approachPositions={approachRoute}
          followDriver={false}
          style={{ position: 'absolute', inset: 0, height: '100%', borderRadius: 0 }}
        />

        {/* Back button overlay */}
        <button onClick={() => navigate('/driver/reservations')}
          style={{ position: 'absolute', top: 16, left: 16, zIndex: 500, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.95)', border: `1px solid ${G.rule}`, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: G.ink, boxShadow: '0 2px 10px rgba(0,0,0,0.12)', backdropFilter: 'blur(6px)' }}>
          <ChevronLeft size={14} /> Reservations
        </button>

        {/* GPS indicator */}
        {driverPos && (
          <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 500, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 20, background: 'rgba(5,150,105,0.9)', color: '#fff', fontSize: 11, fontWeight: 700, boxShadow: '0 2px 10px rgba(5,150,105,0.4)' }}>
            <MapIcon size={11} /> GPS active
          </div>
        )}

        {/* Distance overlay */}
        {isActive && distRemaining !== null && (
          <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 500, background: 'rgba(255,255,255,0.95)', border: `1px solid ${G.rule}`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', backdropFilter: 'blur(6px)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: G.mute, marginBottom: 2 }}>
              {isHeadingToPickup ? 'To pickup' : 'To dropoff'}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: G.ink, letterSpacing: '-0.04em' }}>
              {distRemaining < 1 ? `${(distRemaining * 1000).toFixed(0)} m` : `${distRemaining.toFixed(1)} km`}
            </div>
          </div>
        )}
      </div>

      {/* ── Right panel ─────────────────────────────────────── */}
      <div style={{ width: 380, flexShrink: 0, background: G.card, borderLeft: `1px solid ${G.rule}`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Status + badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, padding: '6px 12px', borderRadius: 999, background: sCfg.bg, color: sCfg.color }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: sCfg.dot }} /> {sCfg.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 999, background: pCfg.bg, color: pCfg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{pCfg.label}</span>
          </div>

          {/* Action error */}
          {actionErr && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 12, color: '#991b1b', display: 'flex', gap: 6 }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {actionErr}
            </div>
          )}

          {/* Action buttons — only for my trips */}
          {isMyTrip && isActive && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {trip.status === 'ACCEPTED' && (
                <>
                  <button onClick={() => runAction('arrived-pickup', driverPos ? { lat: driverPos[0], lng: driverPos[1] } : undefined)} disabled={busy}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px', borderRadius: 10, border: 'none', background: '#2546b8', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: G.font, opacity: busy ? 0.6 : 1 }}>
                    <MapPin size={14} /> I'm at the pickup
                  </button>
                </>
              )}
              {trip.status === 'ARRIVED_AT_PICKUP' && (
                <>
                  <div style={{ background: G.gBg, borderRadius: 10, padding: '12px', textAlign: 'center', border: `1px solid ${G.gBd}` }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>✅</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>At pickup location</div>
                    <div style={{ fontSize: 11, color: G.mute, marginTop: 2 }}>Waiting for passenger to board</div>
                  </div>
                  <button onClick={() => runAction('start')} disabled={busy}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px', borderRadius: 10, border: 'none', background: G.green, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: G.font, opacity: busy ? 0.6 : 1 }}>
                    ▶ Passenger boarded — Start Trip
                  </button>
                </>
              )}
              {trip.status === 'IN_PROGRESS' && (
                <>
                  {trip.driverCanComplete ? (
                    <button onClick={() => runAction('complete')} disabled={busy}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px', borderRadius: 10, border: 'none', background: G.ink, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: G.font, opacity: busy ? 0.6 : 1 }}>
                      <Flag size={14} /> Arrived at Dropoff — Complete
                    </button>
                  ) : (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>🔒</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>Waiting for admin approval</div>
                        <div style={{ fontSize: 11, color: '#b45309', marginTop: 1 }}>Admin must allow you to complete this trip</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Timeline */}
          {trip.status !== 'CANCELLED' && (
            <div style={{ background: G.bg, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: G.mute, marginBottom: 12 }}>Progress</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TIMELINE.map((step, i) => {
                  const order    = STATUS_ORDER[step.key] ?? 0;
                  const done     = currentStep > order;
                  const current  = currentStep === order;
                  const upcoming = currentStep < order;
                  return (
                    <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
                      {/* Vertical connector */}
                      {i < TIMELINE.length - 1 && (
                        <div style={{ position: 'absolute', left: 9, top: 22, bottom: -2, width: 2, background: done ? G.ink : G.rule, zIndex: 0 }} />
                      )}
                      {/* Dot */}
                      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, zIndex: 1, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? G.ink : current ? '#2546b8' : G.card, border: upcoming ? `2px solid ${G.rule}` : 'none', boxShadow: current ? '0 0 0 4px rgba(37,70,184,0.15)' : 'none' }}>
                        {done && <CheckCircle size={11} color="#fff" strokeWidth={3} />}
                        {current && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                      <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 14 : 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: current ? 700 : done ? 600 : 400, color: upcoming ? G.mute : G.ink }}>
                          {step.label}
                        </div>
                        {current && <div style={{ fontSize: 10, color: '#2546b8', fontWeight: 600, marginTop: 1 }}>Current step</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {trip.status === 'CANCELLED' && (
            <div style={{ background: '#fee2e2', borderRadius: 10, padding: '12px 16px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b', marginBottom: trip.cancelReason ? 4 : 0 }}>Trip cancelled</div>
              {trip.cancelReason && <div style={{ fontSize: 12, color: '#991b1b' }}>{trip.cancelReason}</div>}
            </div>
          )}

          {/* Route */}
          <div style={{ background: G.bg, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: G.mute, marginBottom: 12 }}>Route</div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 6, top: 18, bottom: 18, width: 2, background: G.rule }} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#2546b8', flexShrink: 0, marginTop: 2, zIndex: 1 }} />
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: G.mute, marginBottom: 1 }}>Pickup</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: G.ink, lineHeight: 1.4 }}>{trip.pickupAddress}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: G.ink, flexShrink: 0, marginTop: 2, zIndex: 1 }} />
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: G.mute, marginBottom: 1 }}>Dropoff</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: G.ink, lineHeight: 1.4 }}>{trip.dropoffAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          {(() => {
            const PM = { CASH: '💵 Cash', CARD: '💳 Card', PAYPAL: '🅿 PayPal', GOOGLE_PAY: '🔵 G Pay', APPLE_PAY: '🍎 Apple Pay' };
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { icon: Car,         label: 'Fleet',       value: trip.fleet?.name || '—' },
                  { icon: Ruler,       label: 'Distance',    value: `${trip.distanceKm?.toFixed(1)} km` },
                  { icon: Clock,       label: 'Duration',    value: `${Math.round(trip.durationMin ?? 0)} min` },
                  { icon: DollarSign,  label: 'Fare',        value: `$${trip.fare?.toFixed(2)}` },
                  { icon: DollarSign,  label: 'Pay method',  value: PM[trip.paymentMethod] || '💵 Cash', span: 2 },
                  { icon: CalendarDays,label: trip.scheduledAt ? 'Scheduled' : 'Booked', value: fmtFull(trip.scheduledAt || trip.createdAt), span: 2 },
                ].map(({ icon: Ic, label, value, span }) => (
                  <div key={label} style={{ background: G.bg, borderRadius: 8, padding: '10px 12px', gridColumn: span ? `span ${span}` : undefined }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                      <Ic size={10} color={G.mute} />
                      <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: G.mute }}>{label}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: G.ink }}>{value}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Passenger */}
          <div style={{ background: G.bg, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: G.mute, marginBottom: 12 }}>Passenger</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(37,70,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15, fontWeight: 800, color: '#2546b8' }}>
                {trip.member?.names?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: G.ink }}>{trip.member?.names || '—'}</div>
                {trip.member?.phone && (
                  <a href={`tel:${trip.member.phone}`} style={{ fontSize: 12, color: G.green, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <Phone size={11} /> {trip.member.phone}
                  </a>
                )}
                {trip.member?.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <Mail size={10} color={G.mute} />
                    <span style={{ fontSize: 11, color: G.mute }}>{trip.member.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`@keyframes drSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
