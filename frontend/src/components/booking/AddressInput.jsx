import { useRef, useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { useAddressSearch } from '../../hooks/useAddressSearch';

/**
 * AddressInput
 *
 * Props:
 *   value       — display string currently shown in the input
 *   latlng      — [lat, lng] | null — when non-null, shows confirmed-selection style
 *   onSelect    — (label: string, latlng: [lat, lng]) => void — fires when user picks a suggestion
 *   onClear     — () => void — fires when user edits after a selection (coords invalidated)
 *   placeholder — string
 *   icon        — 'pickup' | 'dropoff'
 */
export default function AddressInput({ value, latlng, onSelect, onClear, placeholder, icon = 'dropoff' }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen]   = useState(false);
  const wrapRef           = useRef(null);

  const { results, loading } = useAddressSearch(open ? query : '');

  // Keep local query in sync when parent resets the value (e.g. on clear/swap)
  useEffect(() => { setQuery(value || ''); }, [value]);

  // Close on outside click
  useEffect(() => {
    const handle = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    if (latlng) onClear(); // invalidate stored coords the moment user edits
  };

  const handleSelect = (result) => {
    setQuery(result.label);
    setOpen(false);
    onSelect(result.label, result.latlng);
  };

  const handleClear = () => {
    setQuery('');
    setOpen(false);
    onClear();
  };

  const confirmed = Boolean(latlng);
  const IconComp  = icon === 'pickup' ? Navigation : MapPin;
  const iconColor = icon === 'pickup' ? '#2546b8' : 'var(--c-ink)';

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Input row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        backgroundColor: 'var(--c-bg-2)', borderRadius: 12, padding: '14px 16px',
        border: `1.5px solid ${confirmed ? '#2546b8' : 'transparent'}`,
        transition: 'border-color 0.15s',
      }}>
        <IconComp size={16} color={iconColor} style={{ flexShrink: 0 }} />
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => query.length >= 3 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--c-ink)', fontFamily: 'inherit' }}
        />
        {loading && (
          <div style={{
            width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
            border: '2px solid var(--c-rule)', borderTopColor: 'var(--c-muted)',
            animation: 'addressSpin 0.7s linear infinite',
          }} />
        )}
        {!loading && query && (
          <button onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-muted)', padding: 0, flexShrink: 0, display: 'flex' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
          backgroundColor: 'var(--c-bg)', border: '1px solid var(--c-rule)',
          borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,0.13)', overflow: 'hidden',
        }}>
          {results.map((r, i) => (
            <button
              key={r.id || i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(r); }} // preventDefault keeps input focused until select fires
              style={{
                width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', borderBottom: i < results.length - 1 ? '1px solid var(--c-rule)' : 'none',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c-bg-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <MapPin size={14} color="var(--c-muted)" style={{ flexShrink: 0, marginTop: 3 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--c-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</p>
                {r.sublabel && <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--c-muted)' }}>{r.sublabel}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
