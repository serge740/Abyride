// dash-bookings.jsx — Booking list, create, and view pages
const {
  MOCK_DRIVERS, MOCK_BOOKINGS,
  D_FONT, D_INK, D_IVORY, D_PAPER, D_SLATE, D_MUTE, D_RULE, D_COBALT,
  BRK_BG, BRK_FG, BRK_MUT2, BRK_LINE, BRK_ACC,
  Badge, Avatar, BtnPrimary, BtnGhost, BtnDanger, BtnCobalt,
  Field, SectionTitle, EmptyState, TableHead, FilterTabs, SearchBar,
} = window;

const TYPE_COLOR = { Medical: '#1e3a8a', Standard: '#0b1f3a', Accessible: '#6b21a8' };
const TYPE_BG    = { Medical: 'rgba(30,58,138,0.09)', Standard: 'rgba(11,31,58,0.08)', Accessible: 'rgba(107,33,168,0.09)' };

const TypePill = ({ type }) => (
  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: TYPE_COLOR[type] || D_INK, background: TYPE_BG[type] || D_PAPER, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
    {type}
  </span>
);

// ── BOOKINGS LIST ───────────────────────────────────────────────────────
const BookingsListPage = ({ navigate }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const counts = {
    all:        MOCK_BOOKINGS.length,
    pending:    MOCK_BOOKINGS.filter(b => b.status === 'pending').length,
    confirmed:  MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length,
    'en-route': MOCK_BOOKINGS.filter(b => b.status === 'en-route').length,
    completed:  MOCK_BOOKINGS.filter(b => b.status === 'completed').length,
    cancelled:  MOCK_BOOKINGS.filter(b => b.status === 'cancelled').length,
  };

  const filtered = MOCK_BOOKINGS.filter(b => {
    const q = search.toLowerCase();
    const ok = !q || b.id.toLowerCase().includes(q) || b.rider.toLowerCase().includes(q) || b.driver.toLowerCase().includes(q) || b.type.toLowerCase().includes(q);
    return ok && (filter === 'all' || b.status === filter);
  });

  const COL = '80px 100px 1fr 1fr 115px 95px';

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTabs
          options={[
            ['all',       `All (${counts.all})`],
            ['pending',   `Pending (${counts.pending})`],
            ['confirmed', `Confirmed (${counts.confirmed})`],
            ['en-route',  `En Route (${counts['en-route']})`],
            ['completed', `Completed (${counts.completed})`],
          ]}
          value={filter} onChange={setFilter}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings…"/>
        <div style={{ marginLeft: 'auto' }}>
          <BtnPrimary onClick={() => navigate('booking-create')}>+ New Booking</BtnPrimary>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 640 }}>
          <TableHead cols={['Booking ID', 'Type', 'Rider', 'Driver', 'Date & Time', 'Status']} template={COL}/>
          {filtered.length === 0
            ? <EmptyState icon="📋" title="No bookings found" desc="Try adjusting your search or filter."/>
            : filtered.map(b => (
              <div key={b.id} className="d-row" onClick={() => navigate('booking-view', b)}
                style={{ display: 'grid', gridTemplateColumns: COL, gap: 12, padding: '13px 20px', borderTop: `1px solid ${D_RULE}`, cursor: 'pointer', alignItems: 'center', background: D_IVORY }}>
                <div style={{ fontSize: 11, letterSpacing: '0.08em', color: D_MUTE, fontWeight: 700 }}>{b.id}</div>
                <div><TypePill type={b.type}/></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: D_INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.rider}</div>
                  <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickup}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: b.driver === '—' ? D_MUTE : D_INK, fontStyle: b.driver === '—' ? 'italic' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.driver === '—' ? 'Unassigned' : b.driver}</div>
                  <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.dropoff}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: D_INK }}>{b.date}</div>
                  <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1 }}>{b.time}</div>
                </div>
                <div><Badge status={b.status}/></div>
              </div>
            ))}
        </div></div>
      </div>

      <div style={{ fontSize: 11, color: D_MUTE, marginTop: 12, paddingLeft: 4 }}>
        Showing {filtered.length} of {MOCK_BOOKINGS.length} bookings
      </div>
    </div>
  );
};

// ── BOOKING CREATE ──────────────────────────────────────────────────────
const BookingCreatePage = ({ navigate }) => {
  const [form, setForm] = React.useState({
    rider: '', riderPhone: '', pickup: '', dropoff: '',
    date: '', time: '', type: 'Standard', driverId: '', notes: '',
  });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const availableDrivers = MOCK_DRIVERS.filter(d => d.status === 'active');

  const handleSubmit = e => {
    e.preventDefault();
    alert('Booking created successfully! (demo — data not persisted)');
    navigate('bookings');
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 860 }}>

        {/* Rider info */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Rider Information</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="Rider Full Name" value={form.rider}      onChange={set('rider')}      placeholder="Sarah Thompson" required/>
            <Field label="Phone Number"    value={form.riderPhone}  onChange={set('riderPhone')} placeholder="(313) 555-0000" type="tel"/>
          </div>
        </div>

        {/* Route */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Route Details</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Pickup Address" value={form.pickup} onChange={set('pickup')} placeholder="Cass Tech HS · 2501 Second Ave, Detroit" required/>
            {/* Visual connector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 6 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: D_INK }}/>
                <div style={{ width: 1, height: 20, borderLeft: `1.5px dashed ${D_RULE}` }}/>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: D_COBALT }}/>
              </div>
              <div style={{ flex: 1, height: 1, borderTop: `1px dashed ${D_RULE}` }}/>
            </div>
            <Field label="Drop-off Address" value={form.dropoff} onChange={set('dropoff')} placeholder="Henry Ford Hospital · 2799 W Grand Blvd" required/>
          </div>
        </div>

        {/* Schedule & type */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Schedule & Ride Type</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <Field label="Pickup Date"  type="date" value={form.date} onChange={set('date')} required/>
            <Field label="Pickup Time"  type="time" value={form.time} onChange={set('time')} required/>
            <Field label="Ride Type"    type="select" value={form.type} onChange={set('type')}
              options={['Standard', 'Medical', 'Accessible']}/>
          </div>
        </div>

        {/* Assignment & notes */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '24px 28px', marginBottom: 24 }}>
          <SectionTitle>Driver Assignment & Notes</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="Assign Driver (optional)" type="select" value={form.driverId} onChange={set('driverId')}
              options={availableDrivers.map(d => ({ value: d.id, label: `${d.name} · ${d.type}` }))}
              helpText="Leave blank to assign later."/>
            <div/>
            <div style={{ gridColumn: 'span 2' }}>
              <Field label="Notes & Special Instructions" type="textarea" value={form.notes} onChange={set('notes')}
                placeholder="Accessibility needs, recurring schedule, wheelchair type, language preference, insurance reference…"/>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <BtnPrimary type="submit">Create Booking</BtnPrimary>
          <BtnGhost onClick={() => navigate('bookings')}>Cancel</BtnGhost>
        </div>
      </form>
    </div>
  );
};

// ── BOOKING VIEW ────────────────────────────────────────────────────────
const BookingViewPage = ({ booking, navigate }) => {
  if (!booking) return (
    <div style={{ padding: 40 }}>
      <EmptyState icon="📋" title="Booking not found" desc="Return to the bookings list."/>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <BtnGhost onClick={() => navigate('bookings')}>← Back to Bookings</BtnGhost>
      </div>
    </div>
  );

  const driver = MOCK_DRIVERS.find(d => d.id === booking.driverId);
  const tColor = TYPE_COLOR[booking.type] || D_INK;

  const STATUS_ORDER = ['pending', 'confirmed', 'en-route', 'completed'];
  const currentIdx  = STATUS_ORDER.indexOf(booking.status);
  const isCancelled = booking.status === 'cancelled';

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Booking header */}
      <div style={{ background: BRK_BG, borderRadius: 12, padding: '26px 32px', marginBottom: 14, color: '#fff', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <svg width="260" height="260" viewBox="0 0 260 260" style={{ position: 'absolute', right: -50, top: -50, opacity: 0.05, pointerEvents: 'none' }}>
          <circle cx="130" cy="130" r="120" fill="white"/>
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{booking.id}</span>
            <TypePill type={booking.type}/>
            <Badge status={booking.status}/>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', fontStyle: 'italic', marginBottom: 4 }}>{booking.rider}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{booking.riderPhone}</div>
        </div>
        <div style={{ display: 'flex', gap: 36, textAlign: 'center', position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 36 }}>
          {[
            { l: 'Date',     v: booking.date },
            { l: 'Time',     v: booking.time },
            { l: 'Fare',     v: booking.fare > 0 ? `$${booking.fare}` : '—' },
            { l: 'Distance', v: booking.distance },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontWeight: 700, marginBottom: 5 }}>{s.l}</div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em', fontStyle: 'italic' }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Route */}
      <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '22px 28px', marginBottom: 12 }}>
        <SectionTitle>Route</SectionTitle>
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: D_INK, flexShrink: 0 }}/>
            <div style={{ width: 1, flex: 1, borderLeft: `1.5px dashed ${D_RULE}`, margin: '6px 0' }}/>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: D_COBALT, flexShrink: 0 }}/>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: D_MUTE, fontWeight: 700, marginBottom: 4 }}>Pickup</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: D_INK }}>{booking.pickup}</div>
            </div>
            <div>
              <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: D_COBALT, fontWeight: 700, marginBottom: 4 }}>Drop-off</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: D_INK }}>{booking.dropoff}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rider + Driver cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Rider */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '22px 24px' }}>
          <SectionTitle>Rider</SectionTitle>
          {[
            { l: 'Name',  v: booking.rider      },
            { l: 'Phone', v: booking.riderPhone  },
            { l: 'Notes', v: booking.notes || '—' },
          ].map(r => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${D_RULE}` }}>
              <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: D_MUTE, fontWeight: 700, flexShrink: 0 }}>{r.l}</span>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: D_INK, textAlign: 'right', maxWidth: 240, lineHeight: 1.5 }}>{r.v}</span>
            </div>
          ))}
        </div>

        {/* Driver */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '22px 24px' }}>
          <SectionTitle>Assigned Driver</SectionTitle>
          {driver ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0 14px', borderBottom: `1px solid ${D_RULE}`, marginBottom: 4 }}>
                <Avatar initial={driver.avatar} size={40}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: D_INK }}>{driver.name}</div>
                  <div style={{ fontSize: 12, color: D_SLATE, marginTop: 2 }}>{driver.type} · {driver.city}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: D_COBALT }}>★ {driver.rating}</div>
              </div>
              {[
                { l: 'Vehicle', v: driver.vehicle },
                { l: 'Plate',   v: driver.plate   },
                { l: 'Phone',   v: driver.phone   },
              ].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${D_RULE}` }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: D_MUTE, fontWeight: 700 }}>{r.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: D_INK, textAlign: 'right', maxWidth: 220 }}>{r.v}</span>
                </div>
              ))}
              <button type="button" onClick={() => navigate('driver-view', driver)} style={{ fontSize: 12, fontWeight: 600, color: D_COBALT, background: 'none', border: 'none', cursor: 'pointer', marginTop: 12, borderBottom: `1px solid ${D_COBALT}`, paddingBottom: 1 }}>
                View driver profile →
              </button>
            </>
          ) : (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: D_MUTE, fontStyle: 'italic', marginBottom: 14 }}>No driver assigned yet.</div>
              <BtnCobalt small onClick={() => {}}>Assign Driver</BtnCobalt>
            </div>
          )}
        </div>
      </div>

      {/* Status timeline */}
      <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '22px 28px', marginBottom: 24 }}>
        <SectionTitle>Status Timeline</SectionTitle>
        {isCancelled ? (
          <div style={{ padding: '14px 18px', background: '#fee2e2', borderRadius: 7, fontSize: 13.5, color: '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>✕</span>
            Booking was cancelled. {booking.notes && `· ${booking.notes}`}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {STATUS_ORDER.map((s, i) => {
              const isActive  = i <= currentIdx;
              const isCurrent = i === currentIdx;
              const labels = { pending: 'Pending', confirmed: 'Confirmed', 'en-route': 'En Route', completed: 'Completed' };
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 999, background: isActive ? (isCurrent ? '#2546b8' : D_INK) : D_RULE, border: isCurrent ? '2px solid #2546b8' : 'none', boxShadow: isCurrent ? '0 0 0 3px rgba(37,70,184,0.15)' : 'none', transition: 'all 0.2s' }}/>
                    <div style={{ fontSize: 11.5, fontWeight: isCurrent ? 700 : 500, color: isActive ? D_INK : D_MUTE, textAlign: 'center', letterSpacing: '0.02em' }}>{labels[s]}</div>
                  </div>
                  {i < STATUS_ORDER.length - 1 && (
                    <div style={{ flex: 2, height: 2, background: i < currentIdx ? D_INK : D_RULE, marginTop: 6, borderRadius: 1 }}/>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <BtnGhost onClick={() => navigate('bookings')}>← Back to Bookings</BtnGhost>
        {!isCancelled && booking.status !== 'completed' && (
          <BtnDanger onClick={() => navigate('bookings')}>Cancel Booking</BtnDanger>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { BookingsListPage, BookingCreatePage, BookingViewPage, TypePill });
