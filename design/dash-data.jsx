// dash-data.jsx — Abyride Dashboard mock data

const MOCK_DRIVERS = [
  {
    id: 'DRV-001', name: 'Marcus Williams', phone: '(313) 555-0142',
    email: 'marcus.w@abyride.com', status: 'active',
    type: 'Medical Van', plate: 'ABC 1234', license: 'MW-849201',
    rating: 4.9, trips: 1240, joined: 'Mar 2021', avatar: 'M',
    vehicle: '2022 Ford Transit · Wheelchair Accessible', city: 'Detroit',
    notes: 'Certified in safe transfer technique. Speaks Arabic and English. Specializes in dialysis and oncology routes.'
  },
  {
    id: 'DRV-002', name: 'Aisha Johnson', phone: '(313) 555-0287',
    email: 'aisha.j@abyride.com', status: 'active',
    type: 'Standard', plate: 'XYZ 5678', license: 'AJ-334512',
    rating: 4.8, trips: 892, joined: 'Jul 2022', avatar: 'A',
    vehicle: '2023 Toyota Camry', city: 'Detroit',
    notes: 'Speaks French and English. Available for early morning routes.'
  },
  {
    id: 'DRV-003', name: 'David Chen', phone: '(248) 555-0334',
    email: 'david.c@abyride.com', status: 'active',
    type: 'Accessible Van', plate: 'DEF 9012', license: 'DC-771923',
    rating: 5.0, trips: 2100, joined: 'Jan 2019', avatar: 'D',
    vehicle: '2021 Honda Odyssey · ADA Compliant', city: 'Ann Arbor',
    notes: 'Top-rated driver. Speaks Cantonese, Mandarin, and English. Experienced with long-distance medical transport.'
  },
  {
    id: 'DRV-004', name: 'Fatima Al-Hassan', phone: '(313) 555-0412',
    email: 'fatima.a@abyride.com', status: 'break',
    type: 'Standard', plate: 'GHI 3456', license: 'FA-220847',
    rating: 4.7, trips: 654, joined: 'Sep 2022', avatar: 'F',
    vehicle: '2022 Hyundai Sonata', city: 'Dearborn',
    notes: 'Speaks Arabic and French. Currently on scheduled break — returns Jun 30.'
  },
  {
    id: 'DRV-005', name: 'James Porter', phone: '(586) 555-0519',
    email: 'james.p@abyride.com', status: 'active',
    type: 'Medical Van', plate: 'JKL 7890', license: 'JP-661034',
    rating: 4.9, trips: 1876, joined: 'Feb 2020', avatar: 'J',
    vehicle: '2022 Ford Transit', city: 'Flint',
    notes: 'Specializes in dialysis and recurring medical routes. Flint and Genesee County coverage.'
  },
  {
    id: 'DRV-006', name: 'Yolanda Brooks', phone: '(517) 555-0623',
    email: 'yolanda.b@abyride.com', status: 'inactive',
    type: 'Standard', plate: 'MNO 1234', license: 'YB-448891',
    rating: 4.6, trips: 341, joined: 'Nov 2023', avatar: 'Y',
    vehicle: '2020 Chevrolet Malibu', city: 'Lansing',
    notes: 'Temporarily inactive — vehicle undergoing annual inspection.'
  },
  {
    id: 'DRV-007', name: 'Ahmed Diallo', phone: '(313) 555-0724',
    email: 'ahmed.d@abyride.com', status: 'active',
    type: 'Standard', plate: 'PQR 5678', license: 'AD-992011',
    rating: 4.8, trips: 1102, joined: 'May 2021', avatar: 'A',
    vehicle: '2023 Nissan Altima', city: 'Detroit',
    notes: 'Speaks Wolof, French, and English. Excellent airport and hotel transfer experience.'
  },
  {
    id: 'DRV-008', name: 'Rosa Martinez', phone: '(616) 555-0831',
    email: 'rosa.m@abyride.com', status: 'active',
    type: 'Accessible Van', plate: 'STU 9012', license: 'RM-114729',
    rating: 4.9, trips: 1450, joined: 'Aug 2020', avatar: 'R',
    vehicle: '2021 Chrysler Pacifica · ADA Compliant', city: 'Grand Rapids',
    notes: 'Speaks Spanish and English. ADA specialist — covers Grand Rapids and West Michigan.'
  },
];

const MOCK_BOOKINGS = [
  {
    id: 'BK-2847', rider: 'Sarah Thompson', riderPhone: '(313) 555-1001',
    driver: 'Marcus Williams', driverId: 'DRV-001',
    pickup: 'Cass Tech HS · 2501 Second Ave, Detroit',
    dropoff: 'Henry Ford Hospital · 2799 W Grand Blvd',
    date: 'Jun 29, 2026', time: '9:30 AM', type: 'Medical',
    status: 'completed', fare: 22, distance: '3.2 mi',
    notes: 'Recurring · Mon / Wed / Fri. Dialysis pickup.'
  },
  {
    id: 'BK-2848', rider: 'Ernest Mwangi', riderPhone: '(313) 555-1042',
    driver: 'David Chen', driverId: 'DRV-003',
    pickup: '1842 Trumbull Ave, Detroit',
    dropoff: 'Detroit Metro Airport · DTW Terminal A',
    date: 'Jun 29, 2026', time: '11:00 AM', type: 'Accessible',
    status: 'en-route', fare: 48, distance: '22.4 mi',
    notes: 'Wheelchair — side ramp required. International departure, allow extra check-in time.'
  },
  {
    id: 'BK-2849', rider: 'Amina Hassan', riderPhone: '(313) 555-1183',
    driver: 'Aisha Johnson', driverId: 'DRV-002',
    pickup: 'Dearborn Community Center · 15801 Michigan Ave',
    dropoff: 'Wayne State University · 42 W Warren Ave',
    date: 'Jun 29, 2026', time: '1:00 PM', type: 'Standard',
    status: 'confirmed', fare: 18, distance: '7.1 mi',
    notes: ''
  },
  {
    id: 'BK-2850', rider: 'Carl Washington', riderPhone: '(586) 555-1294',
    driver: 'James Porter', driverId: 'DRV-005',
    pickup: 'McLaren Flint · 401 S Ballenger Hwy',
    dropoff: '2290 Linden Ave, Flint',
    date: 'Jun 29, 2026', time: '2:30 PM', type: 'Medical',
    status: 'pending', fare: 15, distance: '4.8 mi',
    notes: 'Dialysis return — recurring. Needs help with door.'
  },
  {
    id: 'BK-2851', rider: 'Linda Park', riderPhone: '(248) 555-1345',
    driver: 'Rosa Martinez', driverId: 'DRV-008',
    pickup: 'U of M Hospital · 1500 E Medical Center Dr, Ann Arbor',
    dropoff: 'Spectrum Health Butterworth · 100 Michigan St NE, Grand Rapids',
    date: 'Jun 30, 2026', time: '8:00 AM', type: 'Accessible',
    status: 'confirmed', fare: 120, distance: '62 mi',
    notes: 'Long-distance transfer · prior insurance approval confirmed. Power wheelchair.'
  },
  {
    id: 'BK-2852', rider: 'Thomas Okafor', riderPhone: '(313) 555-1421',
    driver: 'Ahmed Diallo', driverId: 'DRV-007',
    pickup: 'Detroit Metro Airport · DTW Baggage Claim B',
    dropoff: 'Westin Book Cadillac · 1114 Washington Blvd, Detroit',
    date: 'Jun 28, 2026', time: '6:45 PM', type: 'Standard',
    status: 'completed', fare: 52, distance: '24 mi',
    notes: 'Meet & greet at baggage claim. Flight AA 2241 from Chicago.'
  },
  {
    id: 'BK-2853', rider: 'Patricia Ndunguru', riderPhone: '(313) 555-1502',
    driver: '—', driverId: null,
    pickup: '8200 Rosa Parks Blvd, Detroit',
    dropoff: "Children's Hospital of Michigan · 3901 Beaubien St",
    date: 'Jun 30, 2026', time: '10:00 AM', type: 'Medical',
    status: 'pending', fare: 24, distance: '5.5 mi',
    notes: 'Pediatric appointment — driver not yet assigned. Under-12 rider, caregiver accompanies.'
  },
  {
    id: 'BK-2854', rider: 'George Brennan', riderPhone: '(517) 555-1638',
    driver: 'Yolanda Brooks', driverId: 'DRV-006',
    pickup: 'Lansing Lugnuts Stadium · 505 E Michigan Ave',
    dropoff: 'Sparrow Hospital · 1215 E Michigan Ave, Lansing',
    date: 'Jun 28, 2026', time: '3:00 PM', type: 'Standard',
    status: 'cancelled', fare: 0, distance: '0.8 mi',
    notes: 'Cancelled by rider 2 hrs prior to pickup.'
  },
];

Object.assign(window, { MOCK_DRIVERS, MOCK_BOOKINGS });
