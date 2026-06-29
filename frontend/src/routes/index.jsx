import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import AdminLayout from '../layouts/AdminLayout';
import LoadingScreen from '../components/LoadingScreen';
import ProtectedAdminRoute from '../components/admin/ProtectedAdminRoute';

const wrap = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

// Landing pages
const HomePage       = lazy(() => import('../pages/landing/HomePage'));
const ServicesPage   = lazy(() => import('../pages/landing/ServicesPage'));
const AboutPage      = lazy(() => import('../pages/landing/AboutPage'));
const ContactPage    = lazy(() => import('../pages/landing/ContactPage'));
const DriversPage    = lazy(() => import('../pages/landing/DriversPage'));
const FleetPage      = lazy(() => import('../pages/landing/FleetPage'));
const TeamPage       = lazy(() => import('../pages/landing/TeamPage'));
const BlogsPage      = lazy(() => import('../pages/landing/BlogsPage'));
const BlogDetailPage = lazy(() => import('../pages/landing/BlogDetailPage'));
const BookNowPage    = lazy(() => import('../pages/landing/BookNowPage'));
const SchedulePage   = lazy(() => import('../pages/landing/SchedulePage'));

// Admin pages
const AdminLoginPage  = lazy(() => import('../pages/auth/AdminLoginPage'));
const DashboardPage   = lazy(() => import('../pages/admin/DashboardPage'));
const AdminDriversPage  = lazy(() => import('../pages/admin/AdminDriversPage'));
const CreateDriverPage  = lazy(() => import('../pages/admin/CreateDriverPage'));
const DriverViewPage    = lazy(() => import('../pages/admin/DriverViewPage'));
const BookingsPage      = lazy(() => import('../pages/admin/BookingsPage'));

const router = createBrowserRouter([
  // ── Landing ──────────────────────────────────────────────────
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true,          element: wrap(HomePage)       },
      { path: 'services',     element: wrap(ServicesPage)   },
      { path: 'about',        element: wrap(AboutPage)      },
      { path: 'contact',      element: wrap(ContactPage)    },
      { path: 'drivers',      element: wrap(DriversPage)    },
      { path: 'fleet',        element: wrap(FleetPage)      },
      { path: 'team',         element: wrap(TeamPage)       },
      { path: 'blog',         element: wrap(BlogsPage)      },
      { path: 'blog/:slug',   element: wrap(BlogDetailPage) },
      { path: 'book',         element: wrap(BookNowPage)    },
      { path: 'schedule',     element: wrap(SchedulePage)   },
    ],
  },

  // ── Admin auth ────────────────────────────────────────────────
  {
    path: '/admin/login',
    element: wrap(AdminLoginPage),
  },

  // ── Admin dashboard ───────────────────────────────────────────
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { index: true,          element: wrap(DashboardPage)    },
      { path: 'drivers',         element: wrap(AdminDriversPage)  },
      { path: 'drivers/create',  element: wrap(CreateDriverPage)  },
      { path: 'drivers/:id',     element: wrap(DriverViewPage)    },
      { path: 'bookings',        element: wrap(BookingsPage)       },
    ],
  },
]);

export default router;
