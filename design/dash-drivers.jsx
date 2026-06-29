// dash-drivers.jsx — Driver list, create, and view pages
const {
  MOCK_DRIVERS, MOCK_BOOKINGS,
  D_FONT, D_INK, D_IVORY, D_PAPER, D_SLATE, D_MUTE, D_RULE, D_COBALT,
  BRK_BG, BRK_FG, BRK_MUT2, BRK_LINE, BRK_ACC,
  Badge, Avatar, BtnPrimary, BtnGhost, BtnDanger, BtnCobalt,
  Field, SectionTitle, EmptyState, TableHead, FilterTabs, SearchBar,
} = window;

// ── DRIVER LIST ─────────────────────────────────────────────────────────
const DriversListPage = ({ navigate }) => {
  const [search, setSearch]   = React.useState('');
  const [filter, setFilter]   = React.useState('all');

  const counts = {
    all:      MOCK_DRIVERS.length,
    active:   MOCK_DRIVERS.filter(d => d.status === 'active').length,
    break:    MOCK_DRIVERS.filter(d => d.status === 'break').length,
    inactive: MOCK_DRIVERS.filter(d => d.status === 'inactive').length,
  };

  const filtered = MOCK_DRIVERS.filter(d => {
    const q = search.toLowerCase();
    const ok = !q || d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
    return ok && (filter === 'all' || d.status === filter);
  });

  const COL = '88px 1fr 90px 130px 76px 68px';

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Top controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTabs
          options={[['all',`All (${counts.all})`], ['active',`Active (${counts.active})`], ['break',`On Break (${counts.break})`], ['inactive',`Inactive (${counts.inactive})`]]}
          value={filter} onChange={setFilter}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search drivers…"/>
        <div style={{ marginLeft: 'auto' }}>
          <BtnPrimary onClick={() => navigate('driver-create')}>+ Add Driver</BtnPrimary>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 660 }}>
          <TableHead cols={['Driver ID', 'Name & Vehicle', 'Status', 'Type · City', 'Rating', 'Trips']} template={COL}/>
          {filtered.length === 0
            ? <EmptyState icon="👤" title="No drivers found" desc="Try adjusting your search or filter."/>
            : filtered.map(d => (
              <div key={d.id} className="d-row" onClick={() => navigate('driver-view', d)}
                style={{ display: 'grid', gridTemplateColumns: COL, gap: 12, padding: '13px 20px', borderTop: `1px solid ${D_RULE}`, cursor: 'pointer', alignItems: 'center', background: D_IVORY }}>
                <div style={{ fontSize: 10.5, letterSpacing: '0.08em', color: D_MUTE, fontWeight: 700 }}>{d.id}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Avatar initial={d.avatar} size={32}/>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: D_INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.vehicle}</div>
                  </div>
                </div>
                <div><Badge status={d.status}/></div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: D_INK }}>{d.type}</div>
                  <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1 }}>{d.city}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: D_COBALT }}>★ {d.rating}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: D_INK }}>{d.trips.toLocaleString()}</div>
              </div>
            ))}
        </div></div>
      </div>

      {/* Footer count */}
      <div style={{ fontSize: 11, color: D_MUTE, marginTop: 12, paddingLeft: 4 }}>
        Showing {filtered.length} of {MOCK_DRIVERS.length} drivers
      </div>
    </div>
  );
};

// ── DRIVER CREATE ───────────────────────────────────────────────────────
const DriverCreatePage = ({ navigate }) => {
  const [form, setForm] = React.useState({
    name: '', phone: '', email: '', license: '',
    type: 'Standard', plate: '', city: 'Detroit', status: 'active', notes: '',
  });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = e => {
    e.preventDefault();
    alert('Driver created successfully! (demo — data not persisted)');
    navigate('drivers');
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 860 }}>

        {/* Personal info */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Personal Information</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="Full Name"        value={form.name}    onChange={set('name')}    placeholder="Marcus Williams"      required/>
            <Field label="Phone Number"     value={form.phone}   onChange={set('phone')}   placeholder="(313) 555-0000"  type="tel"/>
            <Field label="Email Address"    value={form.email}   onChange={set('email')}   placeholder="driver@abyride.com" type="email"/>
            <Field label="Driver License #" value={form.license} onChange={set('license')} placeholder="MW-000000"/>
          </div>
        </div>

        {/* Vehicle & assignment */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Vehicle & Assignment</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="Service Type" type="select" value={form.type} onChange={set('type')}
              options={['Standard', 'Medical Van', 'Accessible Van']}/>
            <Field label="License Plate" value={form.plate} onChange={set('plate')} placeholder="ABC 1234"/>
            <Field label="Base City" type="select" value={form.city} onChange={set('city')}
              options={['Detroit', 'Ann Arbor', 'Flint', 'Lansing', 'Grand Rapids', 'Dearborn']}/>
            <Field label="Initial Status" type="select" value={form.status} onChange={set('status')}
              options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}/>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '24px 28px', marginBottom: 24 }}>
          <SectionTitle>Notes & Languages</SectionTitle>
          <Field label="Driver Notes" type="textarea" value={form.notes} onChange={set('notes')}
            placeholder="Languages spoken, special certifications, wheelchair training, preferred routes…"/>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <BtnPrimary type="submit">Create Driver</BtnPrimary>
          <BtnGhost onClick={() => navigate('drivers')}>Cancel</BtnGhost>
        </div>
      </form>
    </div>
  );
};

// ── DRIVER VIEW ─────────────────────────────────────────────────────────
const DriverViewPage = ({ driver, navigate }) => {
  if (!driver) return (
    <div style={{ padding: 40 }}>
      <EmptyState icon="👤" title="Driver not found" desc="Return to the driver list."/>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <BtnGhost onClick={() => navigate('drivers')}>← Back to Drivers</BtnGhost>
      </div>
    </div>
  );

  const trips = MOCK_BOOKINGS.filter(b => b.driverId === driver.id);
  const AVATAR_COLORS = { M: '#1e3a8a', A: '#2546b8', D: '#0f2768', F: '#6b21a8', J: '#065f46', Y: '#92400e', R: '#991b1b' };

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Profile hero */}
      <div style={{ background: BRK_BG, borderRadius: 12, padding: '28px 32px', marginBottom: 14, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative bg circle */}
        <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: 'absolute', right: -60, top: -60, opacity: 0.05, pointerEvents: 'none' }}>
          <circle cx="140" cy="140" r="130" fill="white"/>
          <circle cx="140" cy="140" r="80"  fill="none" stroke="white" strokeWidth="2"/>
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
          <Avatar initial={driver.avatar} size={68} bg={AVATAR_COLORS[driver.avatar] || '#2546b8'}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 5 }}>{driver.id}</div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', fontStyle: 'italic', marginBottom: 6 }}>{driver.name}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Badge status={driver.status}/>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{driver.type} · {driver.city}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 40, textAlign: 'center', position: 'relative', paddingLeft: 32, borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
            {[
              { l: 'Rating',  v: `★ ${driver.rating}` },
              { l: 'Trips',   v: driver.trips.toLocaleString() },
              { l: 'Member since', v: driver.joined },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontWeight: 700, marginBottom: 6 }}>{s.l}</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', fontStyle: 'italic' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Contact */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '22px 24px' }}>
          <SectionTitle>Contact Details</SectionTitle>
          {[
            { l: 'Phone',     v: driver.phone   },
            { l: 'Email',     v: driver.email   },
            { l: 'License #', v: driver.license },
          ].map(r => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${D_RULE}` }}>
              <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: D_MUTE, fontWeight: 700 }}>{r.l}</span>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: D_INK }}>{r.v}</span>
            </div>
          ))}
        </div>

        {/* Vehicle */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '22px 24px' }}>
          <SectionTitle>Vehicle Information</SectionTitle>
          {[
            { l: 'Vehicle',      v: driver.vehicle },
            { l: 'Plate',        v: driver.plate   },
            { l: 'Service Type', v: driver.type    },
            { l: 'Base City',    v: driver.city    },
          ].map(r => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${D_RULE}` }}>
              <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: D_MUTE, fontWeight: 700, flexShrink: 0 }}>{r.l}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: D_INK, textAlign: 'right', maxWidth: 230 }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {driver.notes && (
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, padding: '22px 24px', marginBottom: 12 }}>
          <SectionTitle>Notes</SectionTitle>
          <p style={{ fontSize: 14, color: D_SLATE, lineHeight: 1.65 }}>{driver.notes}</p>
        </div>
      )}

      {/* Trip history */}
      <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${D_RULE}` }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: D_MUTE }}>History</div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: D_INK, marginTop: 1 }}>Assigned trips ({trips.length})</div>
        </div>
        <div style={{ borderTop: `2px solid ${D_INK}` }}>
          {trips.length === 0
            ? <EmptyState icon="—" title="No trips yet" desc="This driver has not been assigned any bookings."/>
            : trips.map(b => (
              <div key={b.id} className="d-row" onClick={() => navigate('booking-view', b)}
                style={{ display: 'grid', gridTemplateColumns: '80px 1fr 140px 100px 80px', gap: 12, padding: '13px 24px', borderBottom: `1px solid ${D_RULE}`, cursor: 'pointer', alignItems: 'center', background: D_IVORY }}>
                <div style={{ fontSize: 11, letterSpacing: '0.08em', color: D_MUTE, fontWeight: 700 }}>{b.id}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: D_INK }}>{b.rider}</div>
                  <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickup}</div>
                </div>
                <div style={{ fontSize: 11.5, color: D_SLATE }}>{b.date} · {b.time}</div>
                <div><Badge status={b.status}/></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: D_INK, textAlign: 'right' }}>${b.fare}</div>
              </div>
            ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <BtnGhost onClick={() => navigate('drivers')}>← Back to Drivers</BtnGhost>
        <BtnDanger onClick={() => navigate('drivers')}>Deactivate Driver</BtnDanger>
      </div>
    </div>
  );
};

Object.assign(window, { DriversListPage, DriverCreatePage, DriverViewPage });
