import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Phone, Navigation } from 'lucide-react';
import { useSocket, useSocketEvent } from '../../contexts/SocketContext';

const STATUS_COPY = {
  REQUESTED:   { title: 'Request received',  body: "We're finding you a driver — you'll get an email as soon as one is assigned." },
  ACCEPTED:    { title: 'Driver assigned!',  body: 'Your driver has been assigned and will be in touch shortly.' },
  IN_PROGRESS: { title: 'Trip in progress',  body: 'Enjoy your ride!' },
  COMPLETED:   { title: 'Trip completed',    body: 'Thanks for riding with Abyride!' },
  CANCELLED:   { title: 'Trip cancelled',    body: 'This trip was cancelled.' },
};

export default function RideConfirmedStep({ trip, onBookAnother }) {
  const [liveTrip, setLiveTrip] = useState(trip);
  const { emit, isConnected } = useSocket();

  // Register as MEMBER on connect / reconnect — no raw io() needed
  useEffect(() => {
    if (isConnected && trip?.memberId) {
      emit('registerUser', { id: trip.memberId, type: 'MEMBER' });
    }
  }, [isConnected, trip?.memberId, emit]);

  useSocketEvent('trip:assigned',      (updated) => { if (updated.id === trip.id) setLiveTrip(updated); });
  useSocketEvent('trip:statusChanged', (updated) => { if (updated.id === trip.id) setLiveTrip(updated); });

  const copy = STATUS_COPY[liveTrip.status] || STATUS_COPY.REQUESTED;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, flex: 1 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#0b1f3a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Check size={34} color="white" />
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 8px', letterSpacing: '-0.025em', textAlign: 'center' }}>
        {copy.title}
      </h2>
      <p style={{ fontSize: 14, color: 'var(--c-ink-soft)', margin: '0 0 16px', textAlign: 'center' }}>
        {copy.body}
      </p>

      {/* Track link — always visible so rider can bookmark/share it */}
      <Link
        to={`/track/${trip.id}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginBottom: 24, padding: '10px 20px', borderRadius: 10,
          background: '#0b1f3a', color: '#fff', textDecoration: 'none',
          fontSize: 13, fontWeight: 700,
        }}
      >
        <Navigation size={14} />
        Track your trip
      </Link>

      <div style={{ width: '100%', borderRadius: 16, border: '1px solid var(--c-rule)', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ backgroundColor: '#0b1f3a', padding: '18px 20px' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            {liveTrip.scheduledAt ? 'Pickup scheduled for' : 'Pickup'}
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            {liveTrip.scheduledAt ? new Date(liveTrip.scheduledAt).toLocaleString('en-US') : 'As soon as a driver is assigned'}
          </p>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Pickup',   value: liveTrip.pickupAddress,               color: '#2546b8' },
            { label: 'Dropoff',  value: liveTrip.dropoffAddress,              color: '#0b1f3a' },
            { label: 'Vehicle',  value: liveTrip.fleet?.name },
            { label: 'Distance', value: `${liveTrip.distanceKm?.toFixed(1)} km` },
            { label: 'Fare',     value: `$${liveTrip.fare?.toFixed(2)}` },
            { label: 'Driver',   value: liveTrip.driver?.names || 'Not yet assigned' },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--c-muted)', fontWeight: 500, minWidth: 60 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: row.color || 'var(--c-ink)', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
          {liveTrip.driver?.phone && (
            <a href={`tel:${liveTrip.driver.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, padding: '10px', borderRadius: 10, background: 'var(--c-bg-2)', color: 'var(--c-ink)', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              <Phone size={14} /> Call driver
            </a>
          )}
        </div>
      </div>

      <button
        onClick={onBookAnother}
        style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid var(--c-rule)', backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
      >
        Book another ride
      </button>
    </div>
  );
}
