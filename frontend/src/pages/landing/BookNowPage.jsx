import { useEffect, useState } from 'react';
import {
  MapPin, Navigation, ArrowUpDown, Users,
  ArrowRight, Check, Clock, ChevronRight, AlertTriangle,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AbyMap from '../../components/AbyMap';
import AddressInput from '../../components/booking/AddressInput';
import { useRoute } from '../../hooks/useRoute';
import fleetService from '../../services/fleetService';
import RideCheckoutStep from '../../components/booking/RideCheckoutStep';
import RideConfirmedStep from '../../components/booking/RideConfirmedStep';


const LS_DROPOFF_KEY = 'abyride_dropoff_history';
function loadDropoffHistory() {
  try { return JSON.parse(localStorage.getItem(LS_DROPOFF_KEY) || '[]'); }
  catch { return []; }
}
function saveDropoffHistory(label, latlng) {
  if (!label || !latlng) return;
  try {
    const list = loadDropoffHistory().filter((e) => e.label !== label);
    localStorage.setItem(LS_DROPOFF_KEY, JSON.stringify([{ label, latlng }, ...list].slice(0, 5)));
  } catch {}
}

/* ── Fleet card ───────────────────────────────────────────── */
function FleetCard({ fleet, selected, fare, durationMin, onSelect }) {
  const active = selected === fleet.id;
  return (
    <button
      onClick={() => onSelect(fleet.id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 12,
        border: `2px solid ${active ? '#0b1f3a' : 'var(--c-rule)'}`,
        backgroundColor: active ? 'var(--c-bg-2)' : 'var(--c-bg)',
        cursor: 'pointer', transition: 'border-color 0.15s, background-color 0.15s', textAlign: 'left',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: active ? '#0b1f3a' : 'var(--c-bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Users size={18} color={active ? '#fff' : 'var(--c-ink-soft)'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-ink)', margin: 0 }}>{fleet.name}</p>
            <p style={{ fontSize: 12, color: 'var(--c-ink-soft)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={11} /> {fleet.passengerCapacity} · {fleet.description}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {fare > 0
              ? <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-ink)', margin: 0 }}>${fare.toFixed(2)}</p>
              : <p style={{ fontSize: 12, color: 'var(--c-muted)', margin: 0 }}>${fleet.perKmRate.toFixed(2)}/km</p>
            }
            {durationMin > 0 && (
              <p style={{ fontSize: 12, color: 'var(--c-ink-soft)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                <Clock size={11} /> ~{Math.round(durationMin)} min
              </p>
            )}
          </div>
        </div>
      </div>
      {active && (
        <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#0b1f3a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={12} color="white" />
        </div>
      )}
    </button>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function BookNowPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pickup,          setPickup]          = useState(searchParams.get('pu') || '');
  const [dropoff,         setDropoff]         = useState(searchParams.get('do') || '');
  const [pickupLatLng,    setPickupLatLng]    = useState(() => {
    const lat = searchParams.get('plat'), lng = searchParams.get('plng');
    return lat && lng ? [parseFloat(lat), parseFloat(lng)] : null;
  });
  const [dropoffLatLng,   setDropoffLatLng]   = useState(() => {
    const lat = searchParams.get('dlat'), lng = searchParams.get('dlng');
    return lat && lng ? [parseFloat(lat), parseFloat(lng)] : null;
  });
  const [selectedFleetId, setSelectedFleetId] = useState(searchParams.get('fleet') || '');
  const [step,            setStep]            = useState(Math.min(parseInt(searchParams.get('step') || '1', 10), 2));
  const [fleets,          setFleets]          = useState([]);
  const [confirmedTrip,   setConfirmedTrip]   = useState(null);
  const [dropoffHistory,  setDropoffHistory]  = useState(loadDropoffHistory);
  const [geoLoading,      setGeoLoading]      = useState(false);

  const { distanceKm, durationMin, positions, loading: routeLoading, error: routeError } = useRoute(pickupLatLng, dropoffLatLng);

  useEffect(() => { fleetService.getAll().then(setFleets).catch(() => {}); }, []);

  // Auto-detect current location for pickup on first load
  useEffect(() => {
    if (pickup || pickupLatLng) return;
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const parts = [
            addr.road || addr.pedestrian || addr.footway,
            addr.neighbourhood || addr.suburb,
            addr.city || addr.town || addr.village,
          ].filter(Boolean);
          setPickup(parts.join(', ') || data.display_name || 'Current location');
          setPickupLatLng([lat, lng]);
        } catch { /* reverse geocode failed, leave pickup empty */ }
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Sync state → URL params (never during checkout/confirmed)
  useEffect(() => {
    if (step >= 3) return;
    const p = {};
    if (pickup)          p.pu    = pickup;
    if (dropoff)         p.do    = dropoff;
    if (pickupLatLng)  { p.plat  = pickupLatLng[0];  p.plng  = pickupLatLng[1]; }
    if (dropoffLatLng) { p.dlat  = dropoffLatLng[0]; p.dlng  = dropoffLatLng[1]; }
    if (selectedFleetId) p.fleet = selectedFleetId;
    p.step = step;
    setSearchParams(p, { replace: true });
  }, [pickup, dropoff, pickupLatLng, dropoffLatLng, selectedFleetId, step]);

  const effectiveFleetId = selectedFleetId || fleets[0]?.id || '';
  const selectedFleet    = fleets.find((f) => f.id === effectiveFleetId);
  const fare             = selectedFleet && distanceKm ? distanceKm * selectedFleet.perKmRate : 0;

  const canNext = Boolean(pickupLatLng && dropoffLatLng);

  const swap = () => {
    const [tp, td, tpl, tdl] = [pickup, dropoff, pickupLatLng, dropoffLatLng];
    setPickup(td);  setDropoff(tp);
    setPickupLatLng(tdl); setDropoffLatLng(tpl);
  };

  const bookingPayload = selectedFleet ? {
    pickupAddress:  pickup,
    dropoffAddress: dropoff,
    pickupLat:  pickupLatLng?.[0],
    pickupLng:  pickupLatLng?.[1],
    dropoffLat: dropoffLatLng?.[0],
    dropoffLng: dropoffLatLng?.[1],
    fleetId: selectedFleet.id,
  } : null;

  const reset = () => {
    setStep(1); setPickup(''); setDropoff('');
    setPickupLatLng(null); setDropoffLatLng(null);
    setSelectedFleetId(''); setConfirmedTrip(null);
    setSearchParams({}, { replace: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative', backgroundColor: 'var(--c-bg)' }}>

      <div style={{
        width: '100%', maxWidth: 420, flexShrink: 0,
        backgroundColor: 'var(--c-bg)', borderRight: '1px solid var(--c-rule)',
        display: 'flex', flexDirection: 'column', zIndex: 10, position: 'relative', overflowY: 'auto',
      }}>

        {/* ── Step 1: Location ─────────────────────────────── */}
        {step === 1 && (
          <div style={{ padding: '32px 24px', flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-ink)', margin: '0 0 28px' }}>
              Where to?
            </h1>

            <div style={{ position: 'relative' }}>
              {/* Connector line between the two inputs */}
              <div style={{ position: 'absolute', left: 19, top: 50, bottom: 50, width: 2, backgroundColor: 'var(--c-rule)', zIndex: 0 }} />

              <div style={{ position: 'relative', marginBottom: 8 }}>
                <AddressInput
                  value={pickup}
                  latlng={pickupLatLng}
                  placeholder={geoLoading ? 'Detecting your location…' : 'Current location or pickup address'}
                  icon="pickup"
                  onSelect={(label, latlng) => { setPickup(label); setPickupLatLng(latlng); }}
                  onClear={() => { setPickup(''); setPickupLatLng(null); }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '4px 0', position: 'relative', zIndex: 2 }}>
                <button onClick={swap} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--c-rule)', backgroundColor: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-ink)' }}>
                  <ArrowUpDown size={14} />
                </button>
              </div>

              <AddressInput
                value={dropoff}
                latlng={dropoffLatLng}
                placeholder="Dropoff address"
                icon="dropoff"
                onSelect={(label, latlng) => { setDropoff(label); setDropoffLatLng(latlng); }}
                onClear={() => { setDropoff(''); setDropoffLatLng(null); }}
              />
            </div>

            {/* Route preview hint */}
            {canNext && !routeLoading && !routeError && distanceKm && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, backgroundColor: 'var(--c-bg-2)', fontSize: 13, color: 'var(--c-ink-soft)' }}>
                <MapPin size={13} color="#2546b8" />
                <span><strong style={{ color: 'var(--c-ink)' }}>{distanceKm.toFixed(1)} km</strong> · ~{Math.round(durationMin)} min route ready</span>
              </div>
            )}
            {canNext && routeLoading && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, backgroundColor: 'var(--c-bg-2)', fontSize: 13, color: 'var(--c-muted)' }}>
                <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--c-rule)', borderTopColor: 'var(--c-muted)', animation: 'addressSpin 0.7s linear infinite', flexShrink: 0 }} />
                Calculating route…
              </div>
            )}
            {routeError && (
              <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
                <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                Couldn't calculate a route. Try adjusting the addresses.
              </div>
            )}

            {dropoffHistory.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: 12 }}>Recent destinations</p>
                {dropoffHistory.map((h, i, arr) => (
                  <button key={i} onClick={() => { setDropoff(h.label); setDropoffLatLng(h.latlng); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', borderBottom: i < arr.length - 1 ? '1px solid var(--c-rule)' : 'none', textAlign: 'left' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--c-bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={15} color="var(--c-muted)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label}</p>
                    </div>
                    <ChevronRight size={16} color="var(--c-muted)" style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}

            <div style={{ margin: '28px 0 24px', borderTop: '1px solid var(--c-rule)' }} />
            <Link to="/schedule" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, backgroundColor: 'var(--c-bg-2)', color: 'var(--c-ink)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              <Clock size={18} color="#2546b8" />
              Schedule a ride in advance
              <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
            </Link>

            <button
              onClick={() => canNext && setStep(2)} disabled={!canNext}
              style={{
                width: '100%', marginTop: 16, padding: '16px', borderRadius: 12, border: 'none',
                backgroundColor: canNext ? '#0b1f3a' : 'var(--c-bg-3)', color: canNext ? '#ffffff' : 'var(--c-muted)',
                fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              See available rides <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── Step 2: Vehicle selection ─────────────────────── */}
        {step === 2 && (
          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setStep(1)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', backgroundColor: 'var(--c-bg-2)', borderRadius: 12, padding: '12px 16px', border: '1px solid var(--c-rule)', cursor: 'pointer', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2546b8', flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: 'var(--c-ink)', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pickup || 'Current location'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#0b1f3a', flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: 'var(--c-ink)', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dropoff}</p>
                </div>
              </div>
              <ChevronRight size={16} color="var(--c-muted)" style={{ flexShrink: 0 }} />
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Choose a ride
            </h2>

            {routeLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: 'var(--c-muted)' }}>
                <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--c-rule)', borderTopColor: 'var(--c-muted)', animation: 'addressSpin 0.7s linear infinite', flexShrink: 0 }} />
                Calculating route…
              </div>
            )}
            {routeError && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', marginBottom: 16 }}>
                <AlertTriangle size={15} color="#991b1b" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: '#991b1b', margin: 0 }}>Couldn't calculate a route for these addresses. Try adjusting them.</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {fleets.map((f) => (
                <FleetCard
                  key={f.id} fleet={f} selected={effectiveFleetId}
                  fare={distanceKm ? distanceKm * f.perKmRate : 0}
                  durationMin={durationMin || 0}
                  onSelect={setSelectedFleetId}
                />
              ))}
            </div>

            <div style={{ paddingTop: 20, borderTop: '1px solid var(--c-rule)', marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: 'var(--c-ink-soft)' }}>Estimated fare</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-ink)' }}>
                  {distanceKm ? `$${fare.toFixed(2)}` : '—'}
                </span>
              </div>
              <button
                onClick={() => distanceKm && selectedFleet && setStep(3)}
                disabled={!distanceKm || !selectedFleet}
                style={{
                  width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                  backgroundColor: distanceKm && selectedFleet ? '#0b1f3a' : 'var(--c-bg-3)',
                  color: distanceKm && selectedFleet ? '#ffffff' : 'var(--c-muted)',
                  fontSize: 15, fontWeight: 700, cursor: distanceKm && selectedFleet ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                Request {selectedFleet?.name} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Checkout ──────────────────────────────── */}
        {step === 3 && bookingPayload && (
          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <RideCheckoutStep
              bookingPayload={bookingPayload}
              fare={fare}
              onBack={() => setStep(2)}
              onSuccess={(trip) => {
                saveDropoffHistory(dropoff, dropoffLatLng);
                setDropoffHistory(loadDropoffHistory());
                setConfirmedTrip(trip);
                setStep(4);
              }}
            />
          </div>
        )}

        {/* ── Step 4: Confirmed ─────────────────────────────── */}
        {step === 4 && confirmedTrip && (
          <div style={{ padding: '32px 24px', flex: 1 }}>
            <RideConfirmedStep trip={confirmedTrip} onBookAnother={reset} />
          </div>
        )}
      </div>

      <div className="hidden lg:block" style={{ flex: 1, position: 'relative' }}>
        <AbyMap
          pickupLatLng={pickupLatLng}
          dropoffLatLng={dropoffLatLng}
          pickupLabel={pickup || 'Pickup'}
          dropoffLabel={dropoff || 'Dropoff'}
          routePositions={positions}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>
    </div>
  );
}
