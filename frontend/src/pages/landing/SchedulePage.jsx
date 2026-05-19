import { useState, useMemo } from 'react';
import {
  MapPin, Navigation, ArrowUpDown, Clock, Users,
  ArrowRight, Check, ChevronLeft, X, CalendarDays,
} from 'lucide-react';
import AbyMap from '../../components/AbyMap';
import { useGeocode } from '../../hooks/useGeocode';

/* ── Data ─────────────────────────────────────────────────── */
const VEHICLES = [
  { id: 'x',       name: 'Abyride X',   desc: 'Everyday rides',       capacity: 4, price: '$12–15' },
  { id: 'comfort', name: 'Comfort',     desc: 'Newer cars, more room', capacity: 4, price: '$16–20' },
  { id: 'xl',      name: 'Abyride XL',  desc: 'Up to 6 passengers',   capacity: 6, price: '$22–28' },
  { id: 'wav',     name: 'WAV',         desc: 'Wheelchair accessible', capacity: 4, price: '$14–18' },
];

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

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


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
        const isToday = i === 0;
        return (
          <button
            key={i}
            onClick={() => onSelect(d)}
            style={{
              flexShrink: 0, width: 56, padding: '10px 8px', borderRadius: 12,
              border: `2px solid ${isSelected ? '#0b1f3a' : 'var(--c-rule)'}`,
              backgroundColor: isSelected ? '#0b1f3a' : 'var(--c-bg)',
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.15s',
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--c-muted)' }}>
              {isToday ? 'Today' : DAY_NAMES[d.getDay()]}
            </p>
            <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isSelected ? '#ffffff' : 'var(--c-ink)' }}>
              {d.getDate()}
            </p>
            <p style={{ fontSize: 10, margin: '2px 0 0', color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--c-muted)' }}>
              {MONTH_NAMES[d.getMonth()]}
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ── Vehicle row ──────────────────────────────────────────── */
function VehicleRow({ v, selected, onSelect }) {
  const active = selected === v.id;
  return (
    <button
      onClick={() => onSelect(v.id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 16px', borderRadius: 12, border: 'none',
        backgroundColor: active ? 'var(--c-bg-2)' : 'transparent',
        cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.15s',
        outline: active ? '2px solid #0b1f3a' : '2px solid transparent',
        outlineOffset: -2,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, backgroundColor: active ? '#0b1f3a' : 'var(--c-bg-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'background-color 0.15s',
      }}>
        <Users size={18} color={active ? '#ffffff' : 'var(--c-ink-soft)'} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)', margin: '0 0 2px' }}>{v.name}</p>
        <p style={{ fontSize: 12, color: 'var(--c-muted)', margin: 0 }}>{v.desc} · up to {v.capacity}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--c-ink)', margin: 0 }}>{v.price}</p>
      </div>
      {active && (
        <div style={{
          width: 18, height: 18, borderRadius: '50%', backgroundColor: '#0b1f3a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Check size={11} color="white" />
        </div>
      )}
    </button>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function SchedulePage() {
  const [pickup,   setPickup]   = useState('');
  const [dropoff,  setDropoff]  = useState('');
  const [date,     setDate]     = useState(null);
  const [time,     setTime]     = useState('');
  const [selected, setSelected] = useState('x');
  const [step,     setStep]     = useState(1); // 1=location, 2=datetime, 3=vehicle, 4=confirmed

  const [pickupLatLng]  = useGeocode(pickup);
  const [dropoffLatLng] = useGeocode(dropoff);

  const vehicle   = VEHICLES.find(v => v.id === selected);
  const canStep1  = pickup.trim().length > 2 && dropoff.trim().length > 2;
  const canStep2  = date && time;
  const canStep3  = !!selected;

  const swap = () => { const t = pickup; setPickup(dropoff); setDropoff(t); };

  const formattedDate = date
    ? `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`
    : '';

  /* ── Step header ── */
  const STEPS = ['Route', 'Date & Time', 'Vehicle', 'Confirmed'];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative', backgroundColor: 'var(--c-bg)' }}>

      {/* ── Left panel ─────────────────────────────────────── */}
      <div style={{
        width: '100%', maxWidth: 440, flexShrink: 0,
        backgroundColor: 'var(--c-bg)',
        borderRight: '1px solid var(--c-rule)',
        display: 'flex', flexDirection: 'column',
        zIndex: 10, position: 'relative', overflowY: 'auto',
      }}>
        <div style={{ padding: '24px 24px 0' }}>
          {/* Step breadcrumb */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: i + 1 < step ? '#0b1f3a' : i + 1 === step ? '#0b1f3a' : 'var(--c-bg-3)',
                  color: i + 1 <= step ? '#ffffff' : 'var(--c-muted)',
                }}>
                  {i + 1 < step ? <Check size={12} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 18, height: 2, backgroundColor: i + 1 < step ? '#0b1f3a' : 'var(--c-bg-3)' }} />
                )}
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

              {/* Inputs */}
              <div style={{ position: 'relative', marginBottom: 24 }}>
                <div style={{ position: 'absolute', left: 19, top: 44, bottom: 44, width: 2, backgroundColor: 'var(--c-rule)' }} />

                {/* Pickup */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'var(--c-bg-2)', borderRadius: 12, padding: '14px 16px', marginBottom: 8 }}>
                  <Navigation size={16} color="#2546b8" style={{ flexShrink: 0 }} />
                  <input
                    placeholder="Pickup address"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--c-ink)', fontFamily: 'inherit' }}
                  />
                  {pickup && <button onClick={() => setPickup('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-muted)', padding: 0 }}><X size={14} /></button>}
                </div>

                {/* Swap */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '4px 0', position: 'relative', zIndex: 2 }}>
                  <button
                    onClick={swap}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--c-rule)', backgroundColor: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-ink)' }}
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </div>

                {/* Dropoff */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'var(--c-bg-2)', borderRadius: 12, padding: '14px 16px' }}>
                  <MapPin size={16} color="var(--c-ink)" style={{ flexShrink: 0 }} />
                  <input
                    placeholder="Dropoff address"
                    value={dropoff}
                    onChange={e => setDropoff(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--c-ink)', fontFamily: 'inherit' }}
                  />
                  {dropoff && <button onClick={() => setDropoff('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-muted)', padding: 0 }}><X size={14} /></button>}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--c-bg-2)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
                <Clock size={16} color="#2546b8" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: 'var(--c-ink-soft)', margin: 0, lineHeight: 1.5 }}>
                  Schedule rides up to <strong>30 days</strong> in advance. We'll send a reminder 60 minutes before pickup.
                </p>
              </div>

              <button
                onClick={() => canStep1 && setStep(2)}
                disabled={!canStep1}
                style={{
                  width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                  backgroundColor: canStep1 ? '#0b1f3a' : 'var(--c-bg-3)',
                  color: canStep1 ? '#ffffff' : 'var(--c-muted)',
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

              {/* Date strip */}
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', margin: '0 0 10px' }}>Date</p>
              <DateStrip selectedDate={date} onSelect={setDate} />

              {/* Time grid */}
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', margin: '20px 0 10px' }}>Time</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {TIMES.filter((_, i) => i >= 12 && i <= 43).map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    style={{
                      padding: '10px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600,
                      backgroundColor: time === t ? '#0b1f3a' : 'var(--c-bg-2)',
                      color: time === t ? '#ffffff' : 'var(--c-ink)',
                      transition: 'all 0.12s',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                {date && time && (
                  <div style={{ backgroundColor: 'var(--c-bg-2)', borderRadius: 10, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CalendarDays size={16} color="#2546b8" />
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-ink)', margin: 0 }}>
                      {formattedDate} at {time}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => canStep2 && setStep(3)}
                  disabled={!canStep2}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                    backgroundColor: canStep2 ? '#0b1f3a' : 'var(--c-bg-3)',
                    color: canStep2 ? '#ffffff' : 'var(--c-muted)',
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

              {/* Summary pill */}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {VEHICLES.map(v => (
                  <VehicleRow key={v.id} v={v} selected={selected} onSelect={setSelected} />
                ))}
              </div>

              <div style={{ paddingTop: 20, borderTop: '1px solid var(--c-rule)', marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: 'var(--c-ink-soft)' }}>Estimated fare</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-ink)' }}>{vehicle?.price}</span>
                </div>
                <button
                  onClick={() => setStep(4)}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                    backgroundColor: '#0b1f3a', color: '#ffffff',
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  Confirm schedule <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ── Step 4: Confirmed ─────────────────────────── */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, flex: 1 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', backgroundColor: '#0b1f3a',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Check size={34} color="white" />
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 8px', letterSpacing: '-0.025em', textAlign: 'center' }}>
                Ride scheduled!
              </h2>
              <p style={{ fontSize: 14, color: 'var(--c-ink-soft)', margin: '0 0 28px', textAlign: 'center' }}>
                We'll remind you 60 minutes before pickup.
              </p>

              {/* Booking summary card */}
              <div style={{ width: '100%', borderRadius: 16, border: '1px solid var(--c-rule)', overflow: 'hidden', marginBottom: 16 }}>
                {/* Header */}
                <div style={{ backgroundColor: '#0b1f3a', padding: '18px 20px' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                    Pickup scheduled for
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                    {formattedDate}
                  </p>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0', fontWeight: 600 }}>
                    {time}
                  </p>
                </div>
                {/* Details */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Pickup', value: pickup || 'Current location', color: '#2546b8' },
                    { label: 'Dropoff', value: dropoff, color: '#0b1f3a' },
                    { label: 'Vehicle', value: vehicle?.name + ' · ' + vehicle?.desc },
                    { label: 'Est. fare', value: vehicle?.price },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontSize: 12, color: 'var(--c-muted)', fontWeight: 500, minWidth: 60 }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: row.color || 'var(--c-ink)', textAlign: 'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setStep(1); setPickup(''); setDropoff(''); setDate(null); setTime(''); }}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  border: '1.5px solid var(--c-rule)', backgroundColor: 'var(--c-bg)',
                  color: 'var(--c-ink)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Schedule another ride
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Map (desktop) ───────────────────────────────────── */}
      <div className="hidden lg:block" style={{ flex: 1, position: 'relative' }}>
        <AbyMap
          pickupLatLng={pickupLatLng}
          dropoffLatLng={dropoffLatLng}
          pickupLabel={pickup || 'Pickup'}
          dropoffLabel={dropoff || 'Dropoff'}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>
    </div>
  );
}
