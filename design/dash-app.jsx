// dash-app.jsx — Main Abyride Dashboard app with page router
const {
  Sidebar, TopBar,
  OverviewPage,
  DriversListPage, DriverCreatePage, DriverViewPage,
  BookingsListPage, BookingCreatePage, BookingViewPage,
} = window;

const PAGE_META = {
  'overview':        { title: 'Overview',           crumbs: [{ label: 'Dashboard' }] },
  'drivers':         { title: 'Driver Management',  crumbs: [{ label: 'Dashboard', to: 'overview' }, { label: 'Drivers' }] },
  'driver-create':   { title: 'Add New Driver',     crumbs: [{ label: 'Dashboard', to: 'overview' }, { label: 'Drivers', to: 'drivers' }, { label: 'New Driver' }] },
  'driver-view':     { title: 'Driver Profile',     crumbs: [{ label: 'Dashboard', to: 'overview' }, { label: 'Drivers', to: 'drivers' }, { label: 'Profile' }] },
  'bookings':        { title: 'Booking Management', crumbs: [{ label: 'Dashboard', to: 'overview' }, { label: 'Bookings' }] },
  'booking-create':  { title: 'New Booking',        crumbs: [{ label: 'Dashboard', to: 'overview' }, { label: 'Bookings', to: 'bookings' }, { label: 'New Booking' }] },
  'booking-view':    { title: 'Booking Detail',     crumbs: [{ label: 'Dashboard', to: 'overview' }, { label: 'Bookings', to: 'bookings' }, { label: 'Detail' }] },
};

const DashApp = () => {
  const [page,    setPage]    = React.useState('overview');
  const [selDrv,  setSelDrv]  = React.useState(null);
  const [selBk,   setSelBk]   = React.useState(null);

  const navigate = (p, data) => {
    setPage(p);
    if (p === 'driver-view')  setSelDrv(data);
    if (p === 'booking-view') setSelBk(data);
    const el = document.getElementById('dash-scroll');
    if (el) el.scrollTop = 0;
  };

  const meta = PAGE_META[page] || {};
  const breadcrumb = (meta.crumbs || []).map((c, i, arr) => ({
    label:   c.label,
    onClick: c.to && i < arr.length - 1 ? () => navigate(c.to) : undefined,
  }));

  return (
    <>
      <Sidebar page={page} navigate={navigate}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar title={meta.title || ''} breadcrumb={breadcrumb}/>
        <div id="dash-scroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-2)' }}>
          {page === 'overview'       && <OverviewPage      navigate={navigate}/>}
          {page === 'drivers'        && <DriversListPage   navigate={navigate}/>}
          {page === 'driver-create'  && <DriverCreatePage  navigate={navigate}/>}
          {page === 'driver-view'    && <DriverViewPage    driver={selDrv}  navigate={navigate}/>}
          {page === 'bookings'       && <BookingsListPage  navigate={navigate}/>}
          {page === 'booking-create' && <BookingCreatePage navigate={navigate}/>}
          {page === 'booking-view'   && <BookingViewPage   booking={selBk}  navigate={navigate}/>}
        </div>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<DashApp/>);
