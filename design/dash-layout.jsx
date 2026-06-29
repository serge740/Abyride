// dash-layout.jsx — Abyride Dashboard: shared layout + UI components
const { MOCK_DRIVERS, MOCK_BOOKINGS } = window;

// ── Tokens ─────────────────────────────────────────────────────────────
const D_FONT   = '"Poppins", -apple-system, sans-serif';
const D_INK    = 'var(--ink)';
const D_IVORY  = 'var(--bg)';
const D_PAPER  = 'var(--bg-2)';
const D_SLATE  = 'var(--ink-soft)';
const D_MUTE   = 'var(--mute)';
const D_RULE   = 'var(--rule)';
const D_COBALT = 'var(--cobalt-hi)';
const BRK_BG   = 'var(--break-bg)';
const BRK_BG2  = 'var(--break-bg-2)';
const BRK_FG   = 'var(--break-fg)';
const BRK_MUTE = 'var(--break-mute)';
const BRK_MUT2 = 'var(--break-mute-2)';
const BRK_LINE = 'var(--break-line)';
const BRK_ACC  = 'var(--break-accent)';

// ── Status badge config ─────────────────────────────────────────────────
const STATUS_CFG = {
  active:    { label: 'Active',    bg: '#2546b8',              color: '#fff' },
  inactive:  { label: 'Inactive',  bg: '#fee2e2',              color: '#991b1b' },
  break:     { label: 'On Break',  bg: '#fef3c7',              color: '#92400e' },
  completed: { label: 'Completed', bg: '#0b1f3a',              color: '#fff' },
  confirmed: { label: 'Confirmed', bg: 'rgba(37,70,184,0.11)', color: '#2546b8' },
  'en-route':{ label: 'En Route',  bg: '#fff7ed',              color: '#c2410c', border: '1px solid #fed7aa' },
  pending:   { label: 'Pending',   bg: 'var(--bg-2)',          color: 'var(--ink-soft)', border: '1px solid var(--rule)' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2',              color: '#991b1b' },
};

const Badge = ({ status }) => {
  const cfg = STATUS_CFG[status] || { label: status, bg: D_PAPER, color: D_SLATE };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      background: cfg.bg, color: cfg.color,
      border: cfg.border || 'none',
      whiteSpace: 'nowrap', fontFamily: D_FONT,
    }}>{cfg.label}</span>
  );
};

// ── Logo ────────────────────────────────────────────────────────────────
const DashLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="6" fill="rgba(255,255,255,0.10)"/>
      <path d="M9 24 L17 8 L25 24" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinejoin="miter"/>
      <path d="M13 18 H21" stroke="#fff" strokeWidth="2.4"/>
      <circle cx="17" cy="27" r="1.6" fill="#7c9bff"/>
    </svg>
    <span style={{ fontFamily: D_FONT, fontSize: 17, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 700, fontStyle: 'italic' }}>
      Abyride<span style={{ color: '#7c9bff' }}>.</span>
    </span>
  </div>
);

// ── Nav Icons ───────────────────────────────────────────────────────────
const ICONS = {
  overview: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>,
  drivers:  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="5.5" r="3.5"/><path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6z"/></svg>,
  bookings: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6h6M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

// ── Sidebar ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview',           icon: 'overview' },
  { id: 'drivers',  label: 'Driver Management',  icon: 'drivers'  },
  { id: 'bookings', label: 'Booking Management', icon: 'bookings' },
];

const Sidebar = ({ page, navigate }) => {
  const activeCounts = {
    drivers:  MOCK_DRIVERS.filter(d => d.status === 'active').length,
    bookings: MOCK_BOOKINGS.filter(b => b.status === 'pending').length,
  };
  const isDriverPage  = ['drivers', 'driver-create', 'driver-view'].includes(page);
  const isBookingPage = ['bookings', 'booking-create', 'booking-view'].includes(page);

  return (
    <div style={{ width: 240, height: '100vh', background: BRK_BG, color: BRK_FG, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${BRK_LINE}`, overflowY: 'auto' }}>

      {/* Brand */}
      <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${BRK_LINE}` }}>
        <DashLogo />
        <div style={{ fontSize: 10, letterSpacing: '0.18em', color: BRK_MUT2, textTransform: 'uppercase', fontWeight: 700, marginTop: 10 }}>Admin Dashboard</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '14px 10px', flex: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.22em', color: BRK_MUT2, textTransform: 'uppercase', fontWeight: 700, padding: '0 8px 12px' }}>Navigation</div>

        {NAV_ITEMS.map(item => {
          const active = item.id === page || (item.id === 'drivers' && isDriverPage) || (item.id === 'bookings' && isBookingPage);
          const cnt = activeCounts[item.id];
          return (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`nav-item${active ? ' nav-active' : ''}`}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: active ? '9px 10px 9px 8px' : '9px 10px',
                borderRadius: 7, cursor: 'pointer', fontFamily: D_FONT,
                color: active ? '#fff' : 'rgba(255,255,255,0.62)',
                fontSize: 13.5, fontWeight: active ? 600 : 500,
                background: active ? 'rgba(124,155,255,0.14)' : 'transparent',
                borderLeft: active ? '2px solid #7c9bff' : '2px solid transparent',
                marginBottom: 2, transition: 'all 0.12s',
              }}>
              <span style={{ color: active ? BRK_ACC : 'rgba(255,255,255,0.38)', display: 'flex', alignItems: 'center' }}>{ICONS[item.icon]}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {cnt > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', background: item.id === 'bookings' ? 'rgba(251,191,36,0.18)' : 'rgba(124,155,255,0.18)', color: item.id === 'bookings' ? '#fbbf24' : BRK_ACC, padding: '2px 7px', borderRadius: 999 }}>{cnt}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider + User */}
      <div style={{ padding: '14px 10px 20px', borderTop: `1px solid ${BRK_LINE}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px', marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 999, background: '#2546b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D_FONT, fontSize: 13, fontWeight: 700, fontStyle: 'italic', flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: BRK_FG }}>Admin</div>
            <div style={{ fontSize: 11, color: BRK_MUT2 }}>Dispatcher · Detroit</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px', fontSize: 10.5, color: BRK_MUT2, letterSpacing: '0.04em' }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#34d399', flexShrink: 0 }}/>
          System online · 24 / 7
        </div>
      </div>
    </div>
  );
};

// ── Top Bar ─────────────────────────────────────────────────────────────
const TopBar = ({ title, breadcrumb }) => (
  <div style={{ background: D_IVORY, borderBottom: `1px solid ${D_RULE}`, padding: '14px 32px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <div>
      {breadcrumb && breadcrumb.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 3 }}>
          {breadcrumb.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {i > 0 && <span style={{ color: D_MUTE, fontSize: 11, margin: '0 5px' }}>/</span>}
              <span onClick={b.onClick} style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: b.onClick ? D_COBALT : D_MUTE, cursor: b.onClick ? 'pointer' : 'default' }}>
                {b.label}
              </span>
            </span>
          ))}
        </div>
      )}
      <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', fontStyle: 'italic', color: D_INK, lineHeight: 1.2 }}>{title}</h1>
    </div>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ fontSize: 12, color: D_MUTE, letterSpacing: '0.04em' }}>Jun 29, 2026</div>
      <div style={{ width: 1, height: 18, background: D_RULE }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 28, height: 28, borderRadius: 999, background: '#2546b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontStyle: 'italic' }}>A</div>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: D_INK }}>Admin</span>
      </div>
    </div>
  </div>
);

// ── Buttons ─────────────────────────────────────────────────────────────
const BtnPrimary = ({ children, onClick, small, type }) => (
  <button type={type || 'button'} onClick={onClick} style={{ background: D_INK, color: D_IVORY, border: 'none', padding: small ? '7px 13px' : '10px 18px', borderRadius: 6, fontSize: small ? 12 : 13.5, fontWeight: 600, fontFamily: D_FONT, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    {children}
  </button>
);

const BtnGhost = ({ children, onClick, small }) => (
  <button type="button" onClick={onClick} style={{ background: 'transparent', color: D_INK, border: `1px solid ${D_RULE}`, padding: small ? '6px 12px' : '9px 17px', borderRadius: 6, fontSize: small ? 12 : 13.5, fontWeight: 500, fontFamily: D_FONT, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    {children}
  </button>
);

const BtnDanger = ({ children, onClick }) => (
  <button type="button" onClick={onClick} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '9px 17px', borderRadius: 6, fontSize: 13.5, fontWeight: 600, fontFamily: D_FONT, cursor: 'pointer' }}>
    {children}
  </button>
);

const BtnCobalt = ({ children, onClick, small }) => (
  <button type="button" onClick={onClick} style={{ background: '#2546b8', color: '#fff', border: 'none', padding: small ? '7px 13px' : '10px 18px', borderRadius: 6, fontSize: small ? 12 : 13.5, fontWeight: 600, fontFamily: D_FONT, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    {children}
  </button>
);

// ── Avatar ──────────────────────────────────────────────────────────────
const Avatar = ({ initial, size = 36, bg }) => (
  <div style={{ width: size, height: size, borderRadius: 999, background: bg || '#2546b8', color: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D_FONT, fontSize: Math.round(size * 0.38), fontWeight: 700, fontStyle: 'italic' }}>
    {initial}
  </div>
);

// ── Stat Card ───────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accentColor }) => (
  <div style={{ background: D_IVORY, borderRadius: 10, padding: '22px 24px 18px', border: `1px solid ${D_RULE}`, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentColor || D_INK }}/>
    <div style={{ fontSize: 10, letterSpacing: '0.18em', color: D_MUTE, textTransform: 'uppercase', fontWeight: 700, marginBottom: 14 }}>{label}</div>
    <div style={{ fontFamily: D_FONT, fontSize: 38, lineHeight: 1, fontWeight: 700, letterSpacing: '-0.04em', fontStyle: 'italic', color: D_INK }}>{value}</div>
    {sub && <div style={{ fontSize: 11.5, color: D_SLATE, marginTop: 8 }}>{sub}</div>}
  </div>
);

// ── Section title ───────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: D_MUTE, paddingBottom: 10, borderBottom: `1px solid ${D_RULE}`, marginBottom: 18 }}>
    {children}
  </div>
);

// ── Form Field ──────────────────────────────────────────────────────────
const Field = ({ label, type = 'text', value, onChange, placeholder, options, required, helpText, disabled }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: D_SLATE }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </label>
    {type === 'select' ? (
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className="d-input"
        style={{ padding: '10px 12px', border: `1px solid ${D_RULE}`, borderRadius: 6, fontSize: 13.5, color: D_INK, background: D_IVORY, width: '100%', cursor: 'pointer' }}>
        <option value="">Select…</option>
        {(options || []).map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
    ) : type === 'textarea' ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="d-input"
        style={{ padding: '10px 12px', border: `1px solid ${D_RULE}`, borderRadius: 6, fontSize: 13.5, color: D_INK, background: D_IVORY, width: '100%', resize: 'vertical', minHeight: 80 }}/>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className="d-input"
        style={{ padding: '10px 12px', border: `1px solid ${D_RULE}`, borderRadius: 6, fontSize: 13.5, color: D_INK, background: D_IVORY, width: '100%' }}/>
    )}
    {helpText && <div style={{ fontSize: 11, color: D_MUTE }}>{helpText}</div>}
  </div>
);

// ── Empty State ─────────────────────────────────────────────────────────
const EmptyState = ({ icon, title, desc }) => (
  <div style={{ textAlign: 'center', padding: '56px 40px' }}>
    <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>{icon || '○'}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: D_INK, marginBottom: 6 }}>{title}</div>
    {desc && <div style={{ fontSize: 13, color: D_SLATE }}>{desc}</div>}
  </div>
);

// ── Table Header Row ────────────────────────────────────────────────────
const TableHead = ({ cols, template }) => (
  <div style={{ display: 'grid', gridTemplateColumns: template, gap: 12, padding: '10px 20px', background: D_PAPER, borderTop: `2px solid ${D_INK}` }}>
    {cols.map((c, i) => (
      <div key={c} style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: D_MUTE }}>{c}</div>
    ))}
  </div>
);

// ── Pill filter tabs ────────────────────────────────────────────────────
const FilterTabs = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', gap: 4, background: D_PAPER, padding: 4, borderRadius: 8, border: `1px solid ${D_RULE}` }}>
    {options.map(([v, l]) => (
      <button key={v} type="button" onClick={() => onChange(v)} style={{ padding: '6px 12px', borderRadius: 5, fontSize: 12, fontWeight: 600, fontFamily: D_FONT, cursor: 'pointer', border: 'none', background: value === v ? D_IVORY : 'transparent', color: value === v ? D_INK : D_MUTE, boxShadow: value === v ? '0 1px 3px rgba(11,31,58,0.08)' : 'none', transition: 'all 0.12s', whiteSpace: 'nowrap' }}>
        {l}
      </button>
    ))}
  </div>
);

// ── Search Bar ──────────────────────────────────────────────────────────
const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: `1px solid ${D_RULE}`, borderRadius: 6, background: D_IVORY, flex: 1, maxWidth: 280 }}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={D_MUTE} strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="5"/><path d="M10.5 10.5l3 3" strokeLinecap="round"/></svg>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="d-input" style={{ border: 'none', outline: 'none', fontSize: 13, color: D_INK, fontFamily: D_FONT, background: 'transparent', width: '100%' }}/>
  </div>
);

Object.assign(window, {
  D_FONT, D_INK, D_IVORY, D_PAPER, D_SLATE, D_MUTE, D_RULE, D_COBALT,
  BRK_BG, BRK_BG2, BRK_FG, BRK_MUTE, BRK_MUT2, BRK_LINE, BRK_ACC,
  STATUS_CFG, Badge, DashLogo, Sidebar, TopBar,
  BtnPrimary, BtnGhost, BtnDanger, BtnCobalt,
  Avatar, StatCard, SectionTitle, Field, EmptyState, TableHead,
  FilterTabs, SearchBar,
});
