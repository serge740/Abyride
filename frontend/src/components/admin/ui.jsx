import { useRef } from 'react';
import { Search, Upload, X } from 'lucide-react';
import { D, STATUS_CFG } from './theme';

// ── Status badge ────────────────────────────────────────────────────────
export function Badge({ status }) {
  const cfg = STATUS_CFG[status] || { label: status || '—', bg: D.paper, color: D.slate };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      background: cfg.bg, color: cfg.color,
      border: cfg.border || 'none',
      whiteSpace: 'nowrap', fontFamily: D.font,
    }}>{cfg.label}</span>
  );
}

// ── Avatar ──────────────────────────────────────────────────────────────
export function Avatar({ initial, size = 36, bg }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: bg || D.cobaltHi,
      color: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: D.font, fontSize: Math.round(size * 0.38), fontWeight: 700, fontStyle: 'italic',
    }}>
      {initial}
    </div>
  );
}

// ── Buttons ─────────────────────────────────────────────────────────────
export function BtnPrimary({ children, onClick, small, type = 'button', disabled, title }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} style={{
      background: D.ink, color: D.ivory, border: 'none',
      padding: small ? '7px 13px' : '10px 18px', borderRadius: 6,
      fontSize: small ? 12 : 13.5, fontWeight: 600, fontFamily: D.font,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {children}
    </button>
  );
}

export function BtnGhost({ children, onClick, small, type = 'button', disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: 'transparent', color: D.ink, border: `1px solid ${D.rule}`,
      padding: small ? '6px 12px' : '9px 17px', borderRadius: 6,
      fontSize: small ? 12 : 13.5, fontWeight: 500, fontFamily: D.font,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {children}
    </button>
  );
}

export function BtnDanger({ children, onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      background: '#fee2e2', color: '#991b1b', border: 'none',
      padding: '9px 17px', borderRadius: 6, fontSize: 13.5, fontWeight: 600, fontFamily: D.font,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
    }}>
      {children}
    </button>
  );
}

export function BtnCobalt({ children, onClick, small, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      background: D.cobaltHi, color: '#fff', border: 'none',
      padding: small ? '7px 13px' : '10px 18px', borderRadius: 6,
      fontSize: small ? 12 : 13.5, fontWeight: 600, fontFamily: D.font,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {children}
    </button>
  );
}

// ── Stat card ───────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accentColor, loading }) {
  return (
    <div style={{ background: D.ivory, borderRadius: 10, padding: '22px 24px 18px', border: `1px solid ${D.rule}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentColor || D.ink }} />
      <div style={{ fontSize: 10, letterSpacing: '0.18em', color: D.mute, textTransform: 'uppercase', fontWeight: 700, marginBottom: 14 }}>{label}</div>
      {loading ? (
        <div style={{ width: 56, height: 30, borderRadius: 4, background: D.paper3, animation: 'admPulse 1.5s ease-in-out infinite' }} />
      ) : (
        <div style={{ fontFamily: D.font, fontSize: 38, lineHeight: 1, fontWeight: 700, letterSpacing: '-0.04em', fontStyle: 'italic', color: D.ink }}>{value}</div>
      )}
      {sub && <div style={{ fontSize: 11.5, color: D.slate, marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

// ── Section title ───────────────────────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: D.mute, paddingBottom: 10, borderBottom: `1px solid ${D.rule}`, marginBottom: 18 }}>
      {children}
    </div>
  );
}

// ── Form field ──────────────────────────────────────────────────────────
export function Field({ label, type = 'text', value, onChange, placeholder, options, required, helpText, disabled, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: D.slate }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {type === 'select' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="d-input"
          style={{ padding: '10px 12px', border: `1px solid ${error ? '#ef4444' : D.rule}`, borderRadius: 6, fontSize: 13.5, color: D.ink, background: D.ivory, width: '100%', cursor: 'pointer' }}>
          <option value="">Select…</option>
          {(options || []).map((o) => (typeof o === 'string'
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="d-input"
          style={{ padding: '10px 12px', border: `1px solid ${error ? '#ef4444' : D.rule}`, borderRadius: 6, fontSize: 13.5, color: D.ink, background: D.ivory, width: '100%', resize: 'vertical', minHeight: 80 }} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className="d-input"
          style={{ padding: '10px 12px', border: `1px solid ${error ? '#ef4444' : D.rule}`, borderRadius: 6, fontSize: 13.5, color: D.ink, background: D.ivory, width: '100%' }} />
      )}
      {error ? (
        <div style={{ fontSize: 11, color: '#ef4444' }}>⚠ {error}</div>
      ) : helpText && (
        <div style={{ fontSize: 11, color: D.mute }}>{helpText}</div>
      )}
    </div>
  );
}

// ── File field (upload box) ─────────────────────────────────────────────
export function FileField({ label, name, accept, value, onChange, helpText, required }) {
  const ref = useRef();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: D.slate }}>
        {label}{required ? <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span> : <span style={{ color: D.mute, fontWeight: 400, letterSpacing: 0, textTransform: 'none', fontSize: 11 }}> — optional</span>}
      </label>
      <div
        onClick={() => ref.current.click()}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 6, cursor: 'pointer',
          border: `1px dashed ${value ? D.cobaltHi : D.rule}`,
          background: value ? 'rgba(37,70,184,0.05)' : D.paper,
          transition: 'all .15s',
        }}
      >
        <Upload size={14} color={value ? D.cobaltHi : D.mute} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: value ? D.cobaltHi : D.slate, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value ? value.name : 'Click to upload'}
          </div>
          {helpText && !value && <div style={{ fontSize: 11, color: D.mute, marginTop: 2 }}>{helpText}</div>}
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(name, null); ref.current.value = ''; }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: D.mute, flexShrink: 0 }}
          >
            <X size={13} />
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => onChange(name, e.target.files[0] || null)} />
    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 40px' }}>
      {icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, opacity: 0.4 }}>{icon}</div>}
      <div style={{ fontSize: 15, fontWeight: 700, color: D.ink, marginBottom: 6 }}>{title}</div>
      {desc && <div style={{ fontSize: 13, color: D.slate }}>{desc}</div>}
    </div>
  );
}

// ── Table header row ─────────────────────────────────────────────────────
export function TableHead({ cols, template }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: template, gap: 12, padding: '10px 20px', background: D.paper, borderTop: `2px solid ${D.ink}` }}>
      {cols.map((c) => (
        <div key={c} style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: D.mute }}>{c}</div>
      ))}
    </div>
  );
}

// ── Filter pill tabs ──────────────────────────────────────────────────────
export function FilterTabs({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: D.paper, padding: 4, borderRadius: 8, border: `1px solid ${D.rule}` }}>
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} style={{
          padding: '6px 12px', borderRadius: 5, fontSize: 12, fontWeight: 600, fontFamily: D.font,
          cursor: 'pointer', border: 'none',
          background: value === v ? D.ivory : 'transparent', color: value === v ? D.ink : D.mute,
          boxShadow: value === v ? '0 1px 3px rgba(11,31,58,0.08)' : 'none',
          transition: 'all 0.12s', whiteSpace: 'nowrap',
        }}>
          {l}
        </button>
      ))}
    </div>
  );
}

// ── Search bar ────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: `1px solid ${D.rule}`, borderRadius: 6, background: D.ivory, flex: 1, maxWidth: 280 }}>
      <Search size={14} color={D.mute} style={{ flexShrink: 0 }} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="d-input"
        style={{ border: 'none', outline: 'none', fontSize: 13, color: D.ink, fontFamily: D.font, background: 'transparent', width: '100%' }} />
    </div>
  );
}
