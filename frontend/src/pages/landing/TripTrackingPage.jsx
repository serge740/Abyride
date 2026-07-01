import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock, CheckCircle, Car, MapPin, Navigation,
  Phone, User, DollarSign, Ruler, Ban, Search,
} from 'lucide-react';
import tripService from '../../services/tripService';
import AbyMap from '../../components/AbyMap';
import { useRoute } from '../../hooks/useRoute';
import { useSocket, useSocketEvent } from '../../contexts/SocketContext';
import { useDriverAuth } from '../../contexts/DriverAuthContext';

const STATUS = {
  REQUESTED:        { icon: Search,      label: 'Finding your driver',    color: '#92400e', bg: '#fffbeb',  border: '1px solid #fde68a' },
  ACCEPTED:         { icon: Car,         label: 'Driver on the way',      color: '#1e3a8a', bg: 'rgba(37,70,184,0.08)', border: '1px solid rgba(37,70,184,0.2)' },
  ARRIVED_AT_PICKUP:{ icon: User,        label: 'Driver has arrived',     color: '#065f46', bg: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)' },
  IN_PROGRESS:      { icon: Car,         label: 'On the way to dropoff',  color: '#c2410c', bg: '#fff7ed',  border: '1px solid #fed7aa' },
  COMPLETED:        { icon: CheckCircle, label: 'Trip completed',         color: '#047857', bg: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' },
  CANCELLED:        { icon: Ban,         label: 'Trip cancelled',         color: '#991b1b', bg: '#fee2e2',  border: '1px solid #fecaca' },
};

const STEPS = [
  { key: 'REQUESTED',         label: 'Booking received' },
  { key: 'ACCEPTED',          label: 'Driver assigned'  },
  { key: 'ARRIVED_AT_PICKUP', label: 'Driver arrived'   },
  { key: 'IN_PROGRESS',       label: 'En route'         },
  { key: 'COMPLETED',         label: 'Arrived'          },
];
const STEP_IDX = { REQUESTED: 0, ACCEPTED: 1, ARRIVED_AT_PICKUP: 2, IN_PROGRESS: 3, COMPLETED: 4 };

const fmtDate = (iso) => iso ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : null;

export default function TripTrackingPage() {
  const { tripId } = useParams();
  const { emit, isConnected } = useSocket();
  const { driver } = useDriverAuth();
  const [trip,       setTrip]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [driverPos,  setDriverPos]  = useState(null); // [lat, lng] live from socket
  const [staleSecs,  setStaleSecs]  = useState(0);    // seconds since the last driver:location update

  // Fetch trip on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await tripService.getOne(tripId);
        setTrip(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Booking not found. Check your link and try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  // Register user + join trip room for driver location updates
  useEffect(() => {
    if (!isConnected || !trip) return;
    if (driver?.id && trip.driverId === driver.id) {
      emit('registerUser', { id: driver.id, type: 'DRIVER' });
    } else if (trip.memberId) {
      emit('registerUser', { id: trip.memberId, type: 'MEMBER' });
    }
    emit('watchTrip', { tripId: trip.id });
  }, [isConnected, trip?.id, driver?.id, emit]);

  // Live status updates
  useSocketEvent('trip:assigned',      (updated) => { if (updated.id === tripId) setTrip(updated); });
  useSocketEvent('trip:statusChanged', (updated) => { if (updated.id === tripId) setTrip(updated); });

  // Live driver location
  useSocketEvent('driver:location', ({ tripId: tid, lat, lng }) => {
    if (tid === tripId) setDriverPos([lat, lng]);
  });

  // Map routes
  const pickupLatLng  = trip ? [trip.pickupLat,  trip.pickupLng]  : null;
  const dropoffLatLng = trip ? [trip.dropoffLat, trip.dropoffLng] : null;
  const { positions: tripRoutePositions, loading: routeLoading } = useRoute(pickupLatLng, dropoffLatLng);

  // Approach line: driver → current destination
  const isHeadingToPickup = trip && ['ACCEPTED', 'ARRIVED_AT_PICKUP'].includes(trip.status);
  const approachDest = isHeadingToPickup ? pickupLatLng : dropoffLatLng;
  const { positions: approachPositions, distanceKm: distRemaining } = useRoute(driverPos, approachDest);

  /* ── Loading / error ────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--c-rule)', borderTopColor: '#0b1f3a', animation: 'addressSpin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14, color: 'var(--c-muted)' }}>Loading your trip…</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: 360, padding: '0 24px' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Ban size={24} color="#991b1b" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 8px' }}>Booking not found</h2>
          <p style={{ fontSize: 14, color: 'var(--c-muted)', margin: '0 0 24px' }}>{error}</p>
          <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 20px', borderRadius: 10, background: '#0b1f3a', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            Book a new ride
          </Link>
        </div>
      </div>
    );
  }

  const statusCfg  = STATUS[trip.status] || STATUS.REQUESTED;
  const StatusIcon = statusCfg.icon;
  const stepIndex  = STEP_IDX[trip.status] ?? 0;
  const isCancelled = trip.status === 'CANCELLED';
  const isActive    = ['ACCEPTED', 'ARRIVED_AT_PICKUP', 'IN_PROGRESS'].includes(trip.status);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Left panel ─────────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: 420, flexShrink: 0, background: 'var(--c-bg)', borderRight: '1px solid var(--c-rule)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Logo + live indicator */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 18, fontWeight: 800, fontStyle: 'italic', color: 'var(--c-ink)', letterSpacing: '-0.03em' }}>Aby<span style={{ color: '#2546b8' }}>ride</span></span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: isConnected ? '#047857' : 'var(--c-muted)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isConnected ? '#10b981' : 'var(--c-muted)', boxShadow: isConnected ? '0 0 0 3px rgba(16,185,129,0.18)' : 'none' }} />
            {isConnected ? 'Live' : 'Connecting…'}
          </div>
        </div>

        <div style={{ padding: '20px 24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Status hero */}
          <div style={{ padding: '18px 20px', borderRadius: 14, border: statusCfg.border, background: statusCfg.bg, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: statusCfg.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <StatusIcon size={22} color={statusCfg.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: statusCfg.color, marginBottom: 2 }}>Trip Status</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: statusCfg.color, letterSpacing: '-0.02em' }}>{statusCfg.label}</div>
            </div>
          </div>

          {/* Distance remaining — show when driver is live & trip is active */}
          {isActive && distRemaining !== null && (
            <div style={{ background: 'rgba(37,70,184,0.07)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(37,70,184,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Navigation size={16} color="#2546b8" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  {isHeadingToPickup ? 'Driver approaching pickup' : 'Driver heading to your destination'}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.03em' }}>
                  {distRemaining < 1
                    ? `${(distRemaining * 1000).toFixed(0)} m remaining`
                    : `${distRemaining.toFixed(1)} km remaining`}
                </div>
              </div>
            </div>
          )}

          {/* Progress steps */}
          {!isCancelled && (
            <div style={{ background: 'var(--c-bg-2)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {STEPS.map((s, i) => {
                  const done    = stepIndex > i;
                  const current = stepIndex === i;
                  return (
                    <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                      {i < STEPS.length - 1 && (
                        <div style={{ position: 'absolute', left: '50%', right: '-50%', top: 10, height: 2, background: done ? '#0b1f3a' : 'var(--c-rule)', zIndex: 0, transition: 'background 0.4s' }} />
                      )}
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', zIndex: 1,
                        background: done ? '#0b1f3a' : current ? '#2546b8' : 'var(--c-bg)',
                        border: current ? '2px solid #2546b8' : done ? 'none' : '2px solid var(--c-rule)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: current ? '0 0 0 4px rgba(37,70,184,0.14)' : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {done && <CheckCircle size={11} color="#fff" strokeWidth={3} />}
                        {current && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                      <span style={{ fontSize: 8.5, fontWeight: current ? 700 : 500, color: done || current ? 'var(--c-ink)' : 'var(--c-muted)', marginTop: 5, textAlign: 'center', lineHeight: 1.3 }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trip details */}
          <div style={{ background: 'var(--c-bg-2)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 6, top: 20, bottom: 20, width: 2, background: 'var(--c-rule)' }} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#2546b8', flexShrink: 0, marginTop: 1, zIndex: 1 }} />
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)', marginBottom: 1 }}>From</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink)' }}>{trip.pickupAddress}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#0b1f3a', flexShrink: 0, marginTop: 1, zIndex: 1 }} />
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)', marginBottom: 1 }}>To</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink)' }}>{trip.dropoffAddress}</div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--c-rule)', paddingTop: 12, marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: Car,        label: 'Fleet',    value: trip.fleet?.name || '—' },
                { icon: Ruler,      label: 'Distance', value: `${trip.distanceKm?.toFixed(1)} km` },
                { icon: DollarSign, label: 'Fare',     value: `$${trip.fare?.toFixed(2)}` },
                { icon: Clock,      label: trip.scheduledAt ? 'Scheduled' : 'Booked', value: fmtDate(trip.scheduledAt || trip.createdAt) },
              ].map(({ icon: Ic, label, value }) => (
                <div key={label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <Ic size={10} color="var(--c-muted)" />
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-muted)' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-ink)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver card */}
          {trip.driver && (
            <div style={{ background: '#0b1f3a', borderRadius: 12, padding: '16px 18px', color: '#fff' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>Your Driver</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>
                    {trip.driver.names?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{trip.driver.names}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>{trip.fleet?.name}</div>
                    {driverPos && (
                      staleSecs < 15
                        ? <div style={{ fontSize: 10, color: '#6ee7b7', marginTop: 2, fontWeight: 600 }}>● Location live</div>
                        : <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2, fontWeight: 600 }}>Last seen {Math.round(staleSecs)}s ago</div>
                    )}
                  </div>
                </div>
                {trip.driver.phone && (
                  <a href={`tel:${trip.driver.phone}`}
                    style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
                    <Phone size={14} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Hints */}
          {trip.status === 'REQUESTED' && (
            <div style={{ fontSize: 12, color: 'var(--c-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              An admin will assign a driver shortly.<br />You'll see their location here when assigned.
            </div>
          )}

          {/* End-state CTA */}
          {(trip.status === 'COMPLETED' || trip.status === 'CANCELLED') && (
            <div style={{ textAlign: 'center' }}>
              <Link to="/book"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: '#0b1f3a', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                <Navigation size={14} /> Book a new ride
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative' }}>
        {routeLoading && (
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 500, background: 'var(--c-bg)', border: '1px solid var(--c-rule)', borderRadius: 20, padding: '7px 14px', fontSize: 12, color: 'var(--c-muted)', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--c-rule)', borderTopColor: 'var(--c-muted)', animation: 'addressSpin 0.7s linear infinite' }} />
            Calculating route…
          </div>
        )}
        <AbyMap
          pickupLatLng={pickupLatLng}
          dropoffLatLng={dropoffLatLng}
          pickupLabel={trip.pickupAddress}
          dropoffLabel={trip.dropoffAddress}
          routePositions={tripRoutePositions}
          driverLatLng={driverPos}
          approachPositions={approachPositions}
          followDriver={false}
          onDriverStaleness={setStaleSecs}
          style={{ position: 'absolute', inset: 0, height: '100%' }}
        />
      </div>
    </div>
  );
}
