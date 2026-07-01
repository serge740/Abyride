import { useState } from 'react';
import { ChevronLeft, MapPin, Navigation, DollarSign, Check } from 'lucide-react';
import tripService from '../../services/tripService';

const PAYMENT_METHODS = [
  { id: 'CASH',       label: 'Cash',         emoji: '💵', desc: 'Pay the driver in cash' },
  { id: 'CARD',       label: 'Card',         emoji: '💳', desc: 'Credit or debit card' },
  { id: 'PAYPAL',     label: 'PayPal',       emoji: '🅿',  desc: 'PayPal account' },
  { id: 'GOOGLE_PAY', label: 'Google Pay',   emoji: '🔵', desc: 'Google Pay wallet' },
  { id: 'APPLE_PAY',  label: 'Apple Pay',    emoji: '🍎', desc: 'Apple Pay wallet' },
];

export default function RideCheckoutStep({ bookingPayload, fare, onBack, onSuccess }) {
  const [contact,       setContact]       = useState({ names: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [errors,        setErrors]        = useState({});
  const [loading,       setLoading]       = useState(false);
  const [serverErr,     setServerErr]     = useState('');

  const setField = (k) => (e) => {
    setContact((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!contact.names.trim()) e.names = 'Name is required';
    if (!contact.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contact.email)) e.email = 'Enter a valid email';
    if (!contact.phone.trim()) e.phone = 'Phone number is required';
    return e;
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerErr('');
    try {
      const res = await tripService.create({ ...bookingPayload, ...contact, paymentMethod });
      onSuccess(res.trip);
    } catch (err) {
      setServerErr(err.response?.data?.message || err.message || 'Could not create your booking. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '14px 16px', borderRadius: 12,
    border: `1.5px solid ${err ? '#ef4444' : 'var(--c-rule)'}`,
    outline: 'none', fontSize: 14, color: 'var(--c-ink)',
    background: 'var(--c-bg-2)', fontFamily: 'inherit',
    boxSizing: 'border-box',
  });

  return (
    <>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-ink-soft)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '0 0 16px', marginLeft: -4 }}>
        <ChevronLeft size={16} /> Back
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--c-ink)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
        Your details
      </h2>

      {/* Route + fare summary */}
      <div style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 10, background: 'var(--c-bg-2)', border: '1px solid var(--c-rule)', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <Navigation size={12} color="#2546b8" style={{ flexShrink: 0 }} />
          <span style={{ color: 'var(--c-ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bookingPayload.pickupAddress}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <MapPin size={12} color="var(--c-ink)" style={{ flexShrink: 0 }} />
          <span style={{ color: 'var(--c-ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bookingPayload.dropoffAddress}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--c-rule)', paddingTop: 8 }}>
          <span style={{ color: 'var(--c-ink-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <DollarSign size={12} /> Estimated fare
          </span>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--c-ink)' }}>${fare.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment method selector */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', margin: '0 0 10px' }}>
          How will you pay?
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
          {PAYMENT_METHODS.map((m) => {
            const active = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  position: 'relative',
                  padding: '11px 8px',
                  borderRadius: 12,
                  border: `2px solid ${active ? '#0b1f3a' : 'var(--c-rule)'}`,
                  background: active ? '#0b1f3a' : 'var(--c-bg-2)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                {active && (
                  <div style={{ position: 'absolute', top: 5, right: 5, width: 14, height: 14, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={9} color="#0b1f3a" strokeWidth={3} />
                  </div>
                )}
                <div style={{ fontSize: 18, marginBottom: 4, lineHeight: 1 }}>{m.emoji}</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: active ? '#fff' : 'var(--c-ink)', lineHeight: 1.2 }}>{m.label}</div>
              </button>
            );
          })}
        </div>
        {/* Hint for selected method */}
        <p style={{ fontSize: 11.5, color: 'var(--c-muted)', margin: '8px 0 0', textAlign: 'center' }}>
          {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.desc}
        </p>
      </div>

      {serverErr && (
        <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
          ⚠ {serverErr}
        </div>
      )}

      <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div>
          <input placeholder="Full name" value={contact.names} onChange={setField('names')} style={inputStyle(errors.names)} />
          {errors.names && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '4px 0 0' }}>{errors.names}</p>}
        </div>
        <div>
          <input type="email" placeholder="Email address" value={contact.email} onChange={setField('email')} style={inputStyle(errors.email)} />
          {errors.email && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '4px 0 0' }}>{errors.email}</p>}
        </div>
        <div>
          <input type="tel" placeholder="Phone number" value={contact.phone} onChange={setField('phone')} style={inputStyle(errors.phone)} />
          {errors.phone && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '4px 0 0' }}>{errors.phone}</p>}
        </div>

        <p style={{ fontSize: 12, color: 'var(--c-muted)', lineHeight: 1.5, margin: 0 }}>
          We'll email you a booking confirmation. First-time riders get an account automatically — no signup needed.
        </p>

        <div style={{ marginTop: 'auto', paddingTop: 12 }}>
          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: 12, border: 'none',
              backgroundColor: '#0b1f3a', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Confirming…' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </>
  );
}
