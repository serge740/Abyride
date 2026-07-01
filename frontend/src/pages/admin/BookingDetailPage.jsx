import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Navigation, User, Phone, Mail,
  Car, DollarSign, Ruler, Clock, CalendarDays, Ban, Check,
  ExternalLink, ShieldCheck, ShieldOff,
} from 'lucide-react';
import tripService from '../../services/tripService';
import driverService from '../../services/driverService';
import { D, STATUS_CFG } from '../../components/admin/theme';
import { Badge, SectionTitle } from '../../components/admin/ui';
import { useSocket, useSocketEvent } from '../../contexts/SocketContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AbyMap from '../../components/AbyMap';
import { useRoute } from '../../hooks/useRoute';

const PAYMENT_LABEL = {
  PENDING:  { label: 'Not paid',  color: '#92400e', bg: '#fffbeb',              border: '1px solid #fde68a' },
  PAID:     { label: 'Paid',      color: '#1e3a8a', bg: 'rgba(37,70,184,0.08)', border: '1px solid rgba(37,70,184,0.2)' },
  FAILED:   { label: 'Failed',    color: '#991b1b', bg: '#fee2e2',              border: '1px solid #fecaca' },
  REFUNDED: { label: 'Refunded',  color: '#4b5b75', bg: D.paper,                border: `1px solid ${D.rule}` },
};

const PAY_METHOD_CFG = {
  CASH:       { label: 'Cash',        emoji: '💵' },
  CARD:       { label: 'Card',        emoji: '💳' },
  PAYPAL:     { label: 'PayPal',      emoji: '🅿' },
  GOOGLE_PAY: { label: 'Google Pay',  emoji: '🔵' },
  APPLE_PAY:  { label: 'Apple Pay',   emoji: '🍎' },
};

const fmtFull = (iso) => iso ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const TIMELINE_STEPS = [
  { status: 'REQUESTED',   label: 'Booking received' },
  { status: 'ACCEPTED',    label: 'Driver assigned'  },
  { status: 'IN_PROGRESS', label: 'Trip in progress' },
  { status: 'COMPLETED',   label: 'Completed'        },
];
const STATUS_ORDER = { REQUESTED: 0, ACCEPTED: 1, IN_PROGRESS: 2, COMPLETED: 3, CANCELLED: -1 };

export default function BookingDetailPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { admin } = useAdminAuth();
  const { emit, isConnected } = useSocket();

  const [trip,      setTrip]      = useState(null);
  const [drivers,   setDrivers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [actionId,  setActionId]  = useState(null);
  const [driverPos, setDriverPos] = useState(null); // [lat, lng] live from socket
  const [staleSecs, setStaleSecs] = useState(0);     // seconds since the last driver:location update

  // Register admin for socket
  useEffect(() => {
    if (isConnected && admin?.id) emit('registerUser', { id: admin.id, type: 'ADMIN' });
  }, [isConnected, admin?.id, emit]);

  // Real-time: this specific trip's status changes
  useSocketEvent('trip:statusChanged', (updated) => {
    if (updated.id === id) setTrip(updated);
  });
  useSocketEvent('trip:assigned', (updated) => {
    if (updated.id === id) setTrip(updated);
  });
  useSocketEvent('trip:paymentUpdated', ({ tripId, paymentStatus }) => {
    if (tripId === id) setTrip((prev) => prev ? { ...prev, paymentStatus } : prev);
  });
  useSocketEvent('trip:permissionChanged', ({ tripId, driverCanComplete }) => {
    if (tripId === id) setTrip((prev) => prev ? { ...prev, driverCanComplete } : prev);
  });
  // Live driver location — broadcast to all admins, filter to this trip
  useSocketEvent('driver:location', ({ tripId, lat, lng }) => {
    if (tripId === id) setDriverPos([lat, lng]);
  });

  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const [tripData, driversData] = await Promise.all([tripService.getOne(id), driverService.getAll()]);
        setTrip(tripData);
        setDrivers(Array.isArray(driversData) ? driversData : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const run = async (fn) => {
    setActionId(true); setError('');
    try { const updated = await fn(); setTrip(updated); }
    catch (err) { setError(err.response?.data?.message || err.message); }
    finally { setActionId(false); }
  };

  // Map route
  const pickupLatLng  = trip ? [trip.pickupLat, trip.pickupLng]   : null;
  const dropoffLatLng = trip ? [trip.dropoffLat, trip.dropoffLng] : null;
  const { positions } = useRoute(pickupLatLng, dropoffLatLng);

  // Live driver approach line — driver heading to pickup, then to dropoff
  const isHeadingToPickup = trip && ['ACCEPTED', 'ARRIVED_AT_PICKUP'].includes(trip.status);
  const approachDest = isHeadingToPickup ? pickupLatLng : dropoffLatLng;
  const { positions: approachPositions } = useRoute(driverPos, approachDest);

  if (loading) {
    return (
      <div style={{ padding: '60px 32px', fontFamily: D.font, textAlign: 'center', color: D.mute }}>
        Loading booking…
      </div>
    );
  }
  if (!trip) {
    return (
      <div style={{ padding: '60px 32px', fontFamily: D.font, textAlign: 'center', color: D.error }}>
        {error || 'Booking not found'}
      </div>
    );
  }

  const pCfg          = PAYMENT_LABEL[trip.paymentStatus] || PAYMENT_LABEL.PENDING;
  const stepIndex     = STATUS_ORDER[trip.status] ?? 0;
  const isCancelled   = trip.status === 'CANCELLED';
  const eligibleDrivers = drivers.filter((d) => d.fleetId === trip.fleetId && d.status === 'ACTIVE');

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/admin/dashboard/bookings')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: D.slate, fontFamily: D.font, padding: 0 }}>
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ width: 1, height: 18, background: D.rule }} />
        <div>
          <span style={{ fontSize: 11, color: D.mute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Booking</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: D.ink, fontFamily: 'monospace', letterSpacing: '0.04em' }}>#{trip.id.slice(0, 8).toUpperCase()}</div>
        </div>
        <Badge status={trip.status} />
        <span style={{ fontSize: 11, fontWeight: 600, color: pCfg.color, background: pCfg.bg, border: pCfg.border, padding: '3px 10px', borderRadius: 999 }}>{pCfg.label}</span>

        {/* Live dot */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: isConnected ? '#047857' : D.mute }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: isConnected ? '#10b981' : D.mute, boxShadow: isConnected ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none' }} />
          {isConnected ? 'Live updates' : 'Offline'}
        </div>

        {/* Track link */}
        <a href={`/track/${trip.id}`} target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: D.cobaltHi, textDecoration: 'none', fontWeight: 600 }}>
          <ExternalLink size={13} /> Client view
        </a>
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Stats strip ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: Ruler,        label: 'Distance',  value: `${trip.distanceKm?.toFixed(1)} km` },
          { icon: Clock,        label: 'Est. Duration', value: trip.durationMin ? `${Math.round(trip.durationMin)} min` : '—' },
          { icon: DollarSign,   label: 'Fare',      value: `$${trip.fare?.toFixed(2)}` },
          { icon: CalendarDays, label: trip.scheduledAt ? 'Scheduled' : 'Booked at', value: fmtFull(trip.scheduledAt || trip.createdAt) },
        ].map(({ icon: Ic, label, value }) => (
          <div key={label} style={{ background: D.ivory, borderRadius: 9, border: `1px solid ${D.rule}`, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Ic size={13} color={D.mute} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.mute }}>{label}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: D.ink, fontStyle: 'italic', letterSpacing: '-0.02em' }}>{value}</div>
          </div>
        ))}
        {/* Payment method */}
        <div style={{ background: D.ivory, borderRadius: 9, border: `1px solid ${D.rule}`, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.mute, marginBottom: 6 }}>Pay method</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>{(PAY_METHOD_CFG[trip.paymentMethod] || PAY_METHOD_CFG.CASH).emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: D.ink, fontStyle: 'italic', letterSpacing: '-0.02em' }}>
              {(PAY_METHOD_CFG[trip.paymentMethod] || PAY_METHOD_CFG.CASH).label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Two-column body ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'start' }}>

        {/* LEFT ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Route + Map */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, overflow: 'hidden' }}>
            <div style={{ height: 220 }}>
              <AbyMap
                pickupLatLng={pickupLatLng}
                dropoffLatLng={dropoffLatLng}
                pickupLabel={trip.pickupAddress}
                dropoffLabel={trip.dropoffAddress}
                routePositions={positions}
                driverLatLng={driverPos}
                approachPositions={approachPositions}
                onDriverStaleness={setStaleSecs}
                style={{ height: '100%' }}
              />
            </div>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${D.rule}` }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2546b8', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, color: D.mute, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Pickup</div>
                  <div style={{ fontSize: 13, color: D.ink, fontWeight: 500 }}>{trip.pickupAddress}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: D.ink, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, color: D.mute, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Dropoff</div>
                  <div style={{ fontSize: 13, color: D.ink, fontWeight: 500 }}>{trip.dropoffAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rider card */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '20px 24px' }}>
            <SectionTitle>Rider</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: User,  label: 'Name',  value: trip.member?.names || '—' },
                { icon: Mail,  label: 'Email', value: trip.member?.email || '—' },
                { icon: Phone, label: 'Phone', value: trip.member?.phone || '—' },
                { icon: Car,   label: 'Fleet', value: trip.fleet?.name   || '—' },
              ].map(({ icon: Ic, label, value }) => (
                <div key={label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <Ic size={12} color={D.mute} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.mute }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: D.ink, fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Actions card */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '20px 24px' }}>
            <SectionTitle>Actions</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Assign driver */}
              {trip.status === 'REQUESTED' && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: D.mute, marginBottom: 6 }}>Assign Driver</div>
                  <select defaultValue="" onChange={(e) => { if (e.target.value) run(() => tripService.assign(id, e.target.value)); }} disabled={!!actionId}
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${D.rule}`, borderRadius: 7, fontSize: 13, color: D.ink, background: D.paper, cursor: 'pointer', fontFamily: D.font }}>
                    <option value="">Select a driver…</option>
                    {eligibleDrivers.length === 0
                      ? <option disabled>No active drivers for this fleet</option>
                      : eligibleDrivers.map((d) => <option key={d.id} value={d.id}>{d.names}</option>)}
                  </select>
                </div>
              )}

              {/* Start */}
              {trip.status === 'ACCEPTED' && (
                <button onClick={() => run(() => tripService.start(id))} disabled={!!actionId}
                  style={{ width: '100%', padding: '10px 16px', borderRadius: 7, border: 'none', background: 'rgba(37,70,184,0.1)', color: D.cobaltHi, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: D.font }}>
                  Start Trip
                </button>
              )}

              {/* Complete */}
              {trip.status === 'IN_PROGRESS' && (
                <button onClick={() => run(() => tripService.complete(id))} disabled={!!actionId}
                  style={{ width: '100%', padding: '10px 16px', borderRadius: 7, border: 'none', background: D.ink, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: D.font }}>
                  Mark as Complete
                </button>
              )}

              {/* Payment toggle */}
              {trip.paymentStatus !== 'PAID' && trip.status !== 'CANCELLED' && (
                <button onClick={() => run(() => tripService.markPaid(id))} disabled={!!actionId}
                  style={{ width: '100%', padding: '10px 16px', borderRadius: 7, border: '1px solid rgba(4,120,87,0.3)', background: 'rgba(16,185,129,0.08)', color: '#047857', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: D.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Check size={14} /> Mark as Paid
                </button>
              )}
              {trip.paymentStatus === 'PAID' && (
                <button onClick={() => run(() => tripService.markUnpaid(id))} disabled={!!actionId}
                  style={{ width: '100%', padding: '10px 16px', borderRadius: 7, border: `1px solid ${D.rule}`, background: D.paper, color: D.slate, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: D.font }}>
                  Mark as Unpaid
                </button>
              )}

              {/* Driver complete permission toggle */}
              {trip.driver && ['ACCEPTED','ARRIVED_AT_PICKUP','IN_PROGRESS'].includes(trip.status) && (
                <div style={{ borderRadius: 8, border: trip.driverCanComplete ? '1px solid rgba(5,150,105,0.35)' : `1px solid ${D.rule}`, background: trip.driverCanComplete ? 'rgba(5,150,105,0.06)' : D.paper, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        {trip.driverCanComplete
                          ? <ShieldCheck size={13} color="#047857" />
                          : <ShieldOff size={13} color={D.mute} />}
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: trip.driverCanComplete ? '#047857' : D.slate }}>
                          Driver can complete
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: D.mute, lineHeight: 1.4 }}>
                        {trip.driverCanComplete
                          ? 'Driver is allowed to mark the trip as completed.'
                          : 'Only admin can complete this trip currently.'}
                      </div>
                    </div>
                    {/* Toggle switch */}
                    <button
                      onClick={() => run(() => tripService.grantComplete(id))}
                      disabled={!!actionId}
                      title={trip.driverCanComplete ? 'Revoke permission' : 'Grant permission'}
                      style={{ flexShrink: 0, width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative', background: trip.driverCanComplete ? '#059669' : D.rule, transition: 'background 0.2s', padding: 0 }}>
                      <span style={{ position: 'absolute', top: 3, left: trip.driverCanComplete ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel */}
              {['REQUESTED','ACCEPTED','ARRIVED_AT_PICKUP','IN_PROGRESS'].includes(trip.status) && (
                <button
                  onClick={() => { if (window.confirm('Cancel this trip?')) run(() => tripService.adminCancel(id)); }}
                  disabled={!!actionId}
                  style={{ width: '100%', padding: '10px 16px', borderRadius: 7, border: '1px solid #fecaca', background: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: D.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Ban size={13} /> Cancel Trip
                </button>
              )}
            </div>
          </div>

          {/* Driver card */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionTitle>Driver</SectionTitle>
              {trip.driver && driverPos && (
                staleSecs < 15
                  ? (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.18)' }} />
                      Location live
                    </span>
                  )
                  : (
                    <span style={{ fontSize: 10, fontWeight: 700, color: D.mute }}>Last seen {Math.round(staleSecs)}s ago</span>
                  )
              )}
            </div>
            {trip.driver ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: User,  label: 'Name',  value: trip.driver.names },
                  { icon: Phone, label: 'Phone', value: trip.driver.phone || '—' },
                  { icon: Mail,  label: 'Email', value: trip.driver.email },
                ].map(({ icon: Ic, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: D.paper3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Ic size={13} color={D.mute} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: D.mute, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ fontSize: 13, color: D.ink, fontWeight: 500 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: D.mute, fontStyle: 'italic' }}>No driver assigned yet.</div>
            )}
          </div>

          {/* Status timeline */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '20px 24px' }}>
            <SectionTitle>Timeline</SectionTitle>
            {isCancelled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca' }}>
                <Ban size={14} color="#991b1b" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>Trip cancelled</div>
                  {trip.cancelledAt && <div style={{ fontSize: 11, color: '#991b1b', opacity: 0.8 }}>{fmtFull(trip.cancelledAt)}</div>}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TIMELINE_STEPS.map((step, i) => {
                  const done    = stepIndex > i;
                  const current = stepIndex === i;
                  return (
                    <div key={step.status} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0, paddingTop: 2 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: done ? D.ink : current ? D.cobaltHi : D.paper3,
                          border: current ? `2px solid ${D.cobaltHi}` : done ? 'none' : `2px solid ${D.rule}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: current ? '0 0 0 4px rgba(37,70,184,0.12)' : 'none',
                          transition: 'all 0.3s',
                        }}>
                          {done && <Check size={10} color="#fff" />}
                          {current && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div style={{ width: 2, height: 28, background: done ? D.ink : D.rule, transition: 'background 0.3s' }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 20 }}>
                        <div style={{ fontSize: 12.5, fontWeight: current ? 700 : 500, color: done || current ? D.ink : D.mute }}>
                          {step.label}
                        </div>
                        {current && <div style={{ fontSize: 10.5, color: D.cobaltHi, fontWeight: 600, marginTop: 1 }}>Current</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
