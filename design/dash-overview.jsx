// dash-overview.jsx — Dashboard summary / overview page
const {
  MOCK_DRIVERS, MOCK_BOOKINGS,
  D_FONT, D_INK, D_IVORY, D_PAPER, D_SLATE, D_MUTE, D_RULE, D_COBALT,
  BRK_BG, BRK_ACC,
  Badge, StatCard, Avatar, BtnPrimary, BtnGhost, SectionTitle, EmptyState,
} = window;

const OverviewPage = ({ navigate }) => {
  const active     = MOCK_DRIVERS.filter(d => d.status === 'active').length;
  const todayBks   = MOCK_BOOKINGS.filter(b => b.date === 'Jun 29, 2026');
  const todayRev   = todayBks.reduce((s, b) => s + b.fare, 0);
  const pending    = MOCK_BOOKINGS.filter(b => b.status === 'pending').length;
  const enRoute    = MOCK_BOOKINGS.filter(b => b.status === 'en-route').length;
  const completed  = MOCK_BOOKINGS.filter(b => b.status === 'completed').length;

  return (
    <div style={{ padding: '28px 32px', minHeight: '100%' }}>

      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: D_MUTE, fontWeight: 600, marginBottom: 5 }}>Sunday, June 29, 2026</div>
        <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', fontStyle: 'italic', color: D_INK }}>
          Good morning, Admin.
        </h2>
        <p style={{ fontSize: 14, color: D_SLATE, marginTop: 5 }}>Here's what's happening with Abyride today.</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
        <StatCard label="Total Bookings · All Time" value="3,241"     sub="↑ 12% from last month"    accentColor="#2546b8"/>
        <StatCard label="Active Drivers · Right Now" value={String(active)} sub={`${MOCK_DRIVERS.length - active} currently off duty`} accentColor="#0b1f3a"/>
        <StatCard label="Revenue · Today"            value={`$${todayRev}`} sub={`${todayBks.length} trips dispatched`}              accentColor="#2546b8"/>
        <StatCard label="On-time Rate · YTD"         value="99.1%"    sub="Industry avg: 82%"        accentColor="#0b1f3a"/>
      </div>

      {/* Status mini-strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Pending Assignment', val: pending,   bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
          { label: 'Currently En Route',  val: enRoute,   bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' },
          { label: 'Completed Today',     val: completed, bg: 'rgba(37,70,184,0.06)', border: 'rgba(37,70,184,0.15)', color: '#1e3a8a' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 9, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: s.color, letterSpacing: '0.02em' }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Main 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 14 }}>

        {/* Recent Bookings table */}
        <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${D_RULE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: D_MUTE }}>Activity</div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: D_INK, marginTop: 1 }}>Recent bookings</div>
            </div>
            <button type="button" onClick={() => navigate('bookings')} style={{ fontSize: 12, fontWeight: 600, color: D_COBALT, background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${D_COBALT}`, paddingBottom: 1 }}>
              View all →
            </button>
          </div>
          <div style={{ borderTop: `2px solid ${D_INK}` }}>
            {MOCK_BOOKINGS.slice(0, 7).map(b => (
              <div key={b.id} className="d-row" onClick={() => navigate('booking-view', b)}
                style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: 12, padding: '13px 22px', borderBottom: `1px solid ${D_RULE}`, cursor: 'pointer', alignItems: 'center', background: D_IVORY }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', color: D_MUTE, fontWeight: 700, textTransform: 'uppercase' }}>{b.type}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: D_INK, marginTop: 2 }}>{b.id}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: D_INK }}>{b.rider}</div>
                  <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickup}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Badge status={b.status}/>
                  <div style={{ fontSize: 11, color: D_MUTE, marginTop: 4 }}>{b.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Active Drivers */}
          <div style={{ background: D_IVORY, borderRadius: 10, border: `1px solid ${D_RULE}`, overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${D_RULE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: D_MUTE }}>Fleet</div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: D_INK, marginTop: 1 }}>On duty now</div>
              </div>
              <button type="button" onClick={() => navigate('drivers')} style={{ fontSize: 12, fontWeight: 600, color: D_COBALT, background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${D_COBALT}`, paddingBottom: 1 }}>
                View all →
              </button>
            </div>
            <div style={{ borderTop: `2px solid ${D_INK}` }}>
              {MOCK_DRIVERS.filter(d => d.status === 'active').map(d => (
                <div key={d.id} className="d-row" onClick={() => navigate('driver-view', d)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderBottom: `1px solid ${D_RULE}`, cursor: 'pointer', background: D_IVORY }}>
                  <Avatar initial={d.avatar} size={30}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: D_INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: D_SLATE, marginTop: 1 }}>{d.type} · {d.city}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: D_COBALT, flexShrink: 0 }}>★ {d.rating}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: BRK_BG, borderRadius: 10, padding: '20px', color: '#fff', flexShrink: 0 }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: 12 }}>Quick Actions</div>
            {[
              { label: 'New Booking',  sub: 'Dispatch a ride now',     page: 'booking-create' },
              { label: 'Add Driver',   sub: 'Onboard a new driver',    page: 'driver-create'  },
            ].map(a => (
              <button key={a.page} type="button" onClick={() => navigate(a.page)} className="qa-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 7, color: '#fff', fontFamily: D_FONT, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', marginBottom: 8, transition: 'background 0.12s', textAlign: 'left' }}>
                <div>
                  {a.label}
                  <div style={{ fontSize: 10.5, fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginTop: 2, letterSpacing: '0.02em' }}>{a.sub}</div>
                </div>
                <span style={{ color: BRK_ACC, fontSize: 16 }}>→</span>
              </button>
            ))}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)' }}>(833) 829-7339 · dispatch</div>
              <div style={{ fontSize: 10.5, color: '#34d399', fontWeight: 600, letterSpacing: '0.04em' }}>● Live</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

Object.assign(window, { OverviewPage });
