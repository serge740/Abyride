import { useEffect, useState, useMemo } from 'react';
import {
  MapPin, Navigation, ArrowUpDown, Clock, Users,
  ArrowRight, Check, ChevronLeft, ChevronRight, AlertTriangle, CalendarDays,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import AbyMap from '../../components/AbyMap';
import AddressInput from '../../components/booking/AddressInput';
import { useRoute } from '../../hooks/useRoute';
import fleetService from '../../services/fleetService';
import RideCheckoutStep from '../../components/booking/RideCheckoutStep';
import RideConfirmedStep from '../../components/booking/RideConfirmedStep';

const TIMES = [
  '12:00 AM','12:30 AM','1:00 AM','1:30 AM','2:00 AM','2:30 AM',
  '3:00 AM','3:30 AM','4:00 AM','4:30 AM','5:00 AM','5:30 AM',
  '6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM',
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM',
  '6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM',
  '9:00 PM','9:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM',
];

const DAY_NAMES   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

function combineDateAndTime(date, time) {
  const match = /^(\d+):(\d+)\s*(AM|PM)$/i.exec(time);
  if (!date || !match) return null;
  let [, h, m, ap] = match;
  h = parseInt(h, 10);
  if (/pm/i.test(ap) && h !== 12) h += 12;
  if (/am/i.test(ap) && h === 12) h = 0;
  const combined = new Date(date);
  combined.setHours(h, parseInt(m, 10), 0, 0);
  return combined;
}

/* ── Date strip ───────────────────────────────────────────── */
function DateStrip({ selectedDate, onSelect }) {
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
      {days.map((d, i) => {
        const isSelected = selectedDate?.toDateString() === d.toDateString();
        const isToday    = i === 0;
        return (
          <button key={i} onClick={() => onSelect(d)}
            style={{
              flexShrink: 0, width: 56, padding: '10px 8px', borderRadius: 12,
              border: `2px solid ${isSelected ? '#0b1f3a' : 'var(--c-rule)'}`,
              backgroundColor: isSelected ? '#0b1f3a' : 'var(--c-bg)',
              cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
            }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--c-muted)' }}>
              {isToday ? 'Today' : DAY_NAMES[d.getDay()]}
            </p>
            <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isSelected ? '#ffffff' : 'var(--c-ink)' }}>{d.getDate()}</p>
            <p style={{ fontSize: 10, margin: '2px 0 0', color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--c-muted)' }}>{MONTH_NAMES[d.getMonth()]}</p>
          </button>
        );
      })}
    </div>
  );
}

/* ── Fleet row ────────────────────────────────────────────── */
function FleetRow({ fleet, selected, fare, durationMin, onSelect }) {
  const active = selected === fleet.id;
  return (
    <button
      onClick={() => onSelect(fleet.id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 16px', borderRadius: 12, border: 'none',
        backgroundColor: active ? 'var(--c-bg-2)' : 'transparent',
        cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.15s',
        outline: active ? '2px solid #0b1f3a' : '2px solid transparent', outlineOffset: -2,
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: active ? '#0b1f3a' : 'var(--c-bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.15s' }}>
        <Users size={18} color={active ? '#ffffff' : 'var(--c-ink-soft)'} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)', margin: '0 0 2px' }}>{fleet.name}</p>
        <p style={{ fontSize: 12, color: 'var(--c-muted)', margin: 0 }}>{fleet.description} · up to {fleet.passengerCapacity}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        {fare > 0
          ? <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--c-ink)', margin: 0 }}>${fare.toFixed(2)}</p>
          : <p style={{ fontSize: 12, color: 'var(--c-muted)', margin: 0 }}>${fleet.perKmRate.toFixed(2)}/km</p>
        }
        {durationMin > 0 && (
          <p style={{ fontSize: 11, color: 'var(--c-ink-soft)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
            <Clock size={10} /> ~{Math.round(durationMin)} min
          </p>
        )}
      </div>
      {active && (
        <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#0b1f3a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={11} color="white" />
        </div>
      )}
    </button>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function SchedulePage() {
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
  const [date,            setDate]            = useState(() => {
    const d = searchParams.get('date');
    return d ? new Date(d) : null;
  });
  const [time,            setTime]            = useState(searchParams.get('time') || '');
  const [selectedFleetId, setSelectedFleetId] = useState(searchParams.get('fleet') || '');
  const [step,            setStep]            = useState(Math.min(parseInt(searchParams.get('step') || '1', 10), 3));
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
        } catch { /* reverse geocode failed */ }
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Sync state → URL params (never during checkout/confirmed)
  useEffect(() => {
    if (step >= 4) return;
    const p = {};
    if (pickup)          p.pu    = pickup;
    if (dropoff)         p.do    = dropoff;
    if (pickupLatLng)  { p.plat  = pickupLatLng[0];  p.plng  = pickupLatLng[1]; }
    if (dropoffLatLng) { p.dlat  = dropoffLatLng[0]; p.dlng  = dropoffLatLng[1]; }
    if (date)            p.date  = date.toISOString().slice(0, 10);
    if (time)            p.time  = time;
    if (selectedFleetId) p.fleet = selectedFleetId;
    p.step = step;
    setSearchParams(p, { replace: true });
  }, [pickup, dropoff, pickupLatLng, dropoffLatLng, date, time, selectedFleetId, step]);

  const effectiveFleetId = selectedFleetId || fleets[0]?.id || '';
  const selectedFleet    = fleets.find((f) => f.id === effectiveFleetId);
  const fare             = selectedFleet && distanceKm ? distanceKm * selectedFleet.perKmRate : 0;

  const canStep1 = Boolean(pickupLatLng && dropoffLatLng);
  const canStep2 = date && time;

  const swap = () => {
    const [tp, td, tpl, tdl] = [pickup, dropoff, pickupLatLng, dropoffLatLng];
    setPickup(td); setDropoff(tp);
    setPickupLatLng(tdl); setDropoffLatLng(tpl);
  };

  const formattedDate  = date ? `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}` : '';
  const scheduledAtDate = combineDateAndTime(date, time);

  const bookingPayload = selectedFleet && scheduledAtDate ? {
    pickupAddress:  pickup,
    dropoffAddress: dropoff,
    pickupLat:  pickupLatLng?.[0],
    pickupLng:  pickupLatLng?.[1],
    dropoffLat: dropoffLatLng?.[0],
    dropoffLng: dropoffLatLng?.[1],
    fleetId: selectedFleet.id,
    scheduledAt: scheduledAtDate.toISOString(),
  } : null;

  const reset = () => {
    setStep(1); setPickup(''); setDropoff('');
    setPickupLatLng(null); setDropoffLatLng(null);
    setDate(null); setTime(''); setSelectedFleetId(''); setConfirmedTrip(null);
    setSearchParams({}, { replace: true });
  };

  const STEPS     = ['Route', 'Date & Time', 'Vehicle', 'Confirmed'];
  const stepIndex = Math.min(step, 4);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative', backgroundColor: 'var(--c-bg)' }}>

      <div style={{
        width: '100%', maxWidth: 440, flexShrink: 0,
        backgroundColor: 'var(--c-bg)', borderRight: '1px solid var(--c-rule)',
        display: 'flex', flexDirection: 'column', zIndex: 10, position: 'relative', overflowY: 'auto',
      }}>
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: i + 1 <= stepIndex ? '#0b1f3a' : 'var(--c-bg-3)',
                  color: i + 1 <= stepIndex ? '#ffffff' : 'var(--c-muted)',
                }}>
                  {i + 1 < stepIndex ? <Check size={12} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 18, height: 2, backgroundColor: i + 1 < stepIndex ? '#0b1f3a' : 'var(--c-bg-3)' }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 24px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* ── Step 1: Route ─────────────────────────────── */}
          {step === 1 && (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-ink)', margin: '0 0 24px' }}>
                Schedule a ride
              </h1>

              <div style={{ position: 'relative', marginBottom: 24 }}>
                <div style={{ position: 'absolute', left: 19, top: 50, bottom: 50, width: 2, backgroundColor: 'var(--c-rule)', zIndex: 0 }} />
                <div style={{ marginBottom: 8 }}>
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

              {/* Route status */}
              {canStep1 && routeLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: 'var(--c-muted)', padding: '10px 14px', borderRadius: 10, backgroundColor: 'var(--c-bg-2)' }}>
                  <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--c-rule)', borderTopColor: 'var(--c-muted)', animation: 'addressSpin 0.7s linear infinite', flexShrink: 0 }} />
                  Calculating route…
                </div>
              )}
              {canStep1 && !routeLoading && distanceKm && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', borderRadius: 10, backgroundColor: 'var(--c-bg-2)', fontSize: 13, color: 'var(--c-ink-soft)' }}>
                  <MapPin size={13} color="#2546b8" />
                  <span><strong style={{ color: 'var(--c-ink)' }}>{distanceKm.toFixed(1)} km</strong> · route ready on map</span>
                </div>
              )}
              {routeError && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', marginBottom: 16, fontSize: 13, color: '#991b1b' }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  Couldn't calculate a route. Try adjusting the addresses.
                </div>
              )}

              {dropoffHistory.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', margin: '0 0 8px' }}>Recent destinations</p>
                  {dropoffHistory.map((h, i, arr) => (
                    <button key={i} onClick={() => { setDropoff(h.label); setDropoffLatLng(h.latlng); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', borderBottom: i < arr.length - 1 ? '1px solid var(--c-rule)' : 'none', textAlign: 'left' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--c-bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Clock size={13} color="var(--c-muted)" />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-ink)', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label}</p>
                      <ChevronRight size={14} color="var(--c-muted)" style={{ flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              )}

              <div style={{ backgroundColor: 'var(--c-bg-2)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
                <Clock size={16} color="#2546b8" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: 'var(--c-ink-soft)', margin: 0, lineHeight: 1.5 }}>
                  Schedule rides up to <strong>30 days</strong> in advance. We'll send a reminder 60 minutes before pickup.
                </p>
              </div>

              <button
                onClick={() => canStep1 && setStep(2)} disabled={!canStep1}
                style={{
                  width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                  backgroundColor: canStep1 ? '#0b1f3a' : 'var(--c-bg-3)', color: canStep1 ? '#ffffff' : 'var(--c-muted)',
                  fontSize: 15, fontWeight: 700, cursor: canStep1 ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                Set date & time <ArrowRight size={16} />
              </button>
            </>
          )}

          {/* ── Step 2: Date & Time ───────────────────────── */}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-ink-soft)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '0 0 16px', marginLeft: -4 }}>
                <ChevronLeft size={16} /> Back
              </button>

              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                When do you need a ride?
              </h2>

              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', margin: '0 0 10px' }}>Date</p>
              <DateStrip selectedDate={date} onSelect={setDate} />

              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', margin: '20px 0 10px' }}>Time</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {TIMES.filter((_, i) => i >= 8 && i <= 47).map((t) => (
                  <button key={t} onClick={() => setTime(t)}
                    style={{
                      padding: '10px 4px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      backgroundColor: time === t ? '#0b1f3a' : 'var(--c-bg-2)', color: time === t ? '#ffffff' : 'var(--c-ink)', transition: 'all 0.12s',
                    }}>
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                {date && time && (
                  <div style={{ backgroundColor: 'var(--c-bg-2)', borderRadius: 10, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CalendarDays size={16} color="#2546b8" />
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-ink)', margin: 0 }}>{formattedDate} at {time}</p>
                  </div>
                )}
                <button
                  onClick={() => canStep2 && setStep(3)} disabled={!canStep2}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                    backgroundColor: canStep2 ? '#0b1f3a' : 'var(--c-bg-3)', color: canStep2 ? '#ffffff' : 'var(--c-muted)',
                    fontSize: 15, fontWeight: 700, cursor: canStep2 ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  Choose vehicle <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Vehicle ───────────────────────────── */}
          {step === 3 && (
            <>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-ink-soft)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '0 0 16px', marginLeft: -4 }}>
                <ChevronLeft size={16} /> Back
              </button>

              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--c-bg-2)', borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--c-ink)' }}>
                  <CalendarDays size={12} color="#2546b8" /> {formattedDate} · {time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--c-bg-2)', borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--c-ink)' }}>
                  <MapPin size={12} color="var(--c-ink-soft)" /> {dropoff.length > 20 ? dropoff.slice(0, 20) + '…' : dropoff}
                </div>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                Choose your ride
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {fleets.map((f) => (
                  <FleetRow key={f.id} fleet={f} selected={effectiveFleetId} fare={distanceKm ? distanceKm * f.perKmRate : 0} durationMin={durationMin || 0} onSelect={setSelectedFleetId} />
                ))}
              </div>

              <div style={{ paddingTop: 20, borderTop: '1px solid var(--c-rule)', marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: 'var(--c-ink-soft)' }}>Estimated fare</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-ink)' }}>
                    {distanceKm ? `$${fare.toFixed(2)}` : '—'}
                  </span>
                </div>
                <button
                  onClick={() => distanceKm && selectedFleet && setStep(4)}
                  disabled={!distanceKm || !selectedFleet}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                    backgroundColor: distanceKm && selectedFleet ? '#0b1f3a' : 'var(--c-bg-3)',
                    color: distanceKm && selectedFleet ? '#ffffff' : 'var(--c-muted)',
                    fontSize: 15, fontWeight: 700, cursor: distanceKm && selectedFleet ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  Continue to checkout <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ── Step 4: Checkout ──────────────────────────── */}
          {step === 4 && bookingPayload && (
            <RideCheckoutStep
              bookingPayload={bookingPayload}
              fare={fare}
              onBack={() => setStep(3)}
              onSuccess={(trip) => {
                saveDropoffHistory(dropoff, dropoffLatLng);
                setDropoffHistory(loadDropoffHistory());
                setConfirmedTrip(trip);
                setStep(5);
              }}
            />
          )}

          {/* ── Step 5: Confirmed ─────────────────────────── */}
          {step === 5 && confirmedTrip && (
            <RideConfirmedStep trip={confirmedTrip} onBookAnother={reset} />
          )}
        </div>
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
