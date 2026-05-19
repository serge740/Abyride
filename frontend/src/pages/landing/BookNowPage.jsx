import { useState } from 'react';
import {
  MapPin, Navigation, ArrowUpDown, Users,
  ArrowRight, Check, Phone, Clock, ChevronRight, X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AbyMap from '../../components/AbyMap';
import { useGeocode } from '../../hooks/useGeocode';

/* ── Data ─────────────────────────────────────────────────── */
const VEHICLES = [
  {
    id: 'x',
    name: 'Abyride X',
    desc: 'Everyday rides',
    capacity: 4,
    eta: '3 min',
    price: '$12–15',
    img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=240&h=140&fit=crop&auto=format&q=75',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    desc: 'Newer cars, more room',
    capacity: 4,
    eta: '5 min',
    price: '$16–20',
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=240&h=140&fit=crop&auto=format&q=75',
  },
  {
    id: 'xl',
    name: 'Abyride XL',
    desc: 'Up to 6 passengers',
    capacity: 6,
    eta: '8 min',
    price: '$22–28',
    img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=240&h=140&fit=crop&auto=format&q=75',
  },
  {
    id: 'wav',
    name: 'WAV',
    desc: 'Wheelchair accessible',
    capacity: 4,
    eta: '10 min',
    price: '$14–18',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=240&h=140&fit=crop&auto=format&q=75',
  },
];

const SUGGESTIONS = [
  { type: 'recent', label: 'Detroit Medical Center', sub: '3990 John R St, Detroit' },
  { type: 'recent', label: 'Detroit Metro Airport',  sub: 'DTW Terminal — Romulus, MI' },
  { type: 'recent', label: 'Henry Ford Hospital',    sub: '2799 W Grand Blvd, Detroit' },
];

const DRIVER = {
  name: 'Marcus T.',
  rating: '4.97',
  plate: 'MLT 4829',
  car: 'Toyota Camry · Silver',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format&q=80',
};


/* ── Vehicle card ─────────────────────────────────────────── */
function VehicleCard({ v, selected, onSelect }) {
  const active = selected === v.id;
  return (
    <button
      onClick={() => onSelect(v.id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        borderRadius: 12,
        border: `2px solid ${active ? '#0b1f3a' : 'var(--c-rule)'}`,
        backgroundColor: active ? 'var(--c-bg-2)' : 'var(--c-bg)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background-color 0.15s',
        textAlign: 'left',
      }}
    >
      <img
        src={v.img}
        alt={v.name}
        onError={e => { e.currentTarget.style.display = 'none'; }}
        style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 8, flexShrink: 0, backgroundColor: 'var(--c-bg-3)' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-ink)', margin: 0 }}>{v.name}</p>
            <p style={{ fontSize: 12, color: 'var(--c-ink-soft)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={11} /> {v.capacity} · {v.desc}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-ink)', margin: 0 }}>{v.price}</p>
            <p style={{ fontSize: 12, color: 'var(--c-ink-soft)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
              <Clock size={11} /> {v.eta}
            </p>
          </div>
        </div>
      </div>
      {active && (
        <div style={{
          width: 20, height: 20, borderRadius: '50%', backgroundColor: '#0b1f3a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Check size={12} color="white" />
        </div>
      )}
    </button>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function BookNowPage() {
  const [pickup,  setPickup]  = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selected, setSelected] = useState('x');
  const [step, setStep] = useState(1);

  const vehicle  = VEHICLES.find(v => v.id === selected);
  const canNext  = pickup.trim().length > 2 && dropoff.trim().length > 2;

  const [pickupLatLng]  = useGeocode(pickup);
  const [dropoffLatLng] = useGeocode(dropoff);

  const swap = () => { const t = pickup; setPickup(dropoff); setDropoff(t); };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative', backgroundColor: 'var(--c-bg)' }}>

      {/* ── Left panel ─────────────────────────────────────── */}
      <div style={{
        width: '100%', maxWidth: 420, flexShrink: 0,
        backgroundColor: 'var(--c-bg)',
        borderRight: '1px solid var(--c-rule)',
        display: 'flex', flexDirection: 'column',
        zIndex: 10, position: 'relative',
        overflowY: 'auto',
      }}>

        {/* ── Step 1: Location ─────────────────────────────── */}
        {step === 1 && (
          <div style={{ padding: '32px 24px', flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-ink)', margin: '0 0 28px' }}>
              Where to?
            </h1>

            {/* Input group */}
            <div style={{ position: 'relative' }}>
              {/* Connector line */}
              <div style={{
                position: 'absolute', left: 19, top: 44, bottom: 44,
                width: 2, backgroundColor: 'var(--c-rule)',
              }} />

              {/* Pickup */}
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  backgroundColor: 'var(--c-bg-2)',
                  borderRadius: 12, padding: '14px 16px',
                  border: '1.5px solid transparent',
                }}>
                  <Navigation size={16} color="#2546b8" style={{ flexShrink: 0 }} />
                  <input
                    placeholder="Current location or pickup address"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    style={{
                      flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      fontSize: 14, color: 'var(--c-ink)', fontFamily: 'inherit',
                    }}
                  />
                  {pickup && (
                    <button onClick={() => setPickup('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-muted)', padding: 0 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Swap */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '4px 0', position: 'relative', zIndex: 2 }}>
                <button
                  onClick={swap}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '1.5px solid var(--c-rule)',
                    backgroundColor: 'var(--c-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--c-ink)',
                  }}
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>

              {/* Dropoff */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  backgroundColor: 'var(--c-bg-2)',
                  borderRadius: 12, padding: '14px 16px',
                }}>
                  <MapPin size={16} color="var(--c-ink)" style={{ flexShrink: 0 }} />
                  <input
                    placeholder="Dropoff address"
                    value={dropoff}
                    onChange={e => setDropoff(e.target.value)}
                    style={{
                      flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      fontSize: 14, color: 'var(--c-ink)', fontFamily: 'inherit',
                    }}
                  />
                  {dropoff && (
                    <button onClick={() => setDropoff('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-muted)', padding: 0 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: 12 }}>
                Recent
              </p>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setDropoff(s.label)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: i < SUGGESTIONS.length - 1 ? '1px solid var(--c-rule)' : 'none',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--c-bg-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Clock size={15} color="var(--c-muted)" />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-ink)', margin: 0 }}>{s.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--c-muted)', margin: '2px 0 0' }}>{s.sub}</p>
                  </div>
                  <ChevronRight size={16} color="var(--c-muted)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </button>
              ))}
            </div>

            {/* Divider + schedule shortcut */}
            <div style={{ margin: '28px 0 24px', borderTop: '1px solid var(--c-rule)' }} />
            <Link
              to="/schedule"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12,
                backgroundColor: 'var(--c-bg-2)', color: 'var(--c-ink)',
                textDecoration: 'none', fontSize: 14, fontWeight: 600,
              }}
            >
              <Clock size={18} color="#2546b8" />
              Schedule a ride in advance
              <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
            </Link>

            {/* CTA */}
            <button
              onClick={() => canNext && setStep(2)}
              disabled={!canNext}
              style={{
                width: '100%', marginTop: 16,
                padding: '16px', borderRadius: 12, border: 'none',
                backgroundColor: canNext ? '#0b1f3a' : 'var(--c-bg-3)',
                color: canNext ? '#ffffff' : 'var(--c-muted)',
                fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background-color 0.15s',
              }}
            >
              See available rides <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── Step 2: Vehicle selection ─────────────────────── */}
        {step === 2 && (
          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Location summary */}
            <button
              onClick={() => setStep(1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                backgroundColor: 'var(--c-bg-2)', borderRadius: 12, padding: '12px 16px',
                border: '1px solid var(--c-rule)', cursor: 'pointer', marginBottom: 20, textAlign: 'left',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2546b8', flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: 'var(--c-ink)', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {pickup || 'Current location'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#0b1f3a', flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: 'var(--c-ink)', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dropoff}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} color="var(--c-muted)" style={{ flexShrink: 0 }} />
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Choose a ride
            </h2>

            {/* Vehicle list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {VEHICLES.map(v => (
                <VehicleCard key={v.id} v={v} selected={selected} onSelect={setSelected} />
              ))}
            </div>

            {/* Book button */}
            <div style={{ paddingTop: 20, borderTop: '1px solid var(--c-rule)', marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: 'var(--c-ink-soft)' }}>Estimated fare</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-ink)' }}>{vehicle?.price}</span>
              </div>
              <button
                onClick={() => setStep(3)}
                style={{
                  width: '100%', padding: '16px', borderRadius: 12, border: 'none',
                  backgroundColor: '#0b1f3a', color: '#ffffff',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                Request {vehicle?.name} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirmed ─────────────────────────────── */}
        {step === 3 && (
          <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Success badge */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', backgroundColor: '#0b1f3a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Check size={30} color="white" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
                Ride confirmed!
              </h2>
              <p style={{ fontSize: 14, color: 'var(--c-ink-soft)', margin: 0 }}>
                Your driver is on the way
              </p>
            </div>

            {/* ETA bar */}
            <div style={{
              backgroundColor: '#0b1f3a', borderRadius: 12, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 2px', fontWeight: 500 }}>Arriving in</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.03em' }}>{vehicle?.eta}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>Vehicle</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>{vehicle?.name}</p>
              </div>
            </div>

            {/* Driver card */}
            <div style={{
              borderRadius: 12, border: '1px solid var(--c-rule)', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
            }}>
              <img
                src={DRIVER.photo}
                alt={DRIVER.name}
                onError={e => { e.currentTarget.style.display = 'none'; }}
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', backgroundColor: 'var(--c-bg-3)', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-ink)', margin: '0 0 2px' }}>{DRIVER.name}</p>
                <p style={{ fontSize: 13, color: 'var(--c-muted)', margin: 0 }}>★ {DRIVER.rating} · {DRIVER.car}</p>
                <p style={{ fontSize: 12, color: 'var(--c-muted)', margin: '2px 0 0', fontWeight: 600, letterSpacing: '0.06em' }}>{DRIVER.plate}</p>
              </div>
              <a
                href="tel:8338297339"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '1.5px solid var(--c-rule)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--c-ink)', textDecoration: 'none',
                }}
              >
                <Phone size={16} />
              </a>
            </div>

            {/* Fare */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: 'var(--c-bg-2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24,
            }}>
              <span style={{ fontSize: 13, color: 'var(--c-ink-soft)' }}>Estimated fare</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--c-ink)' }}>{vehicle?.price}</span>
            </div>

            {/* Actions */}
            <button
              onClick={() => { setStep(1); setPickup(''); setDropoff(''); }}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid var(--c-rule)',
                backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Cancel ride
            </button>
          </div>
        )}
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
