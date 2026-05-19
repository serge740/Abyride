import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import LoadingScreen from '../components/LoadingScreen';

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
const MemberLoginPage = lazy(() => import('../pages/auth/MemberLoginPage'));
const DriverLoginPage = lazy(() => import('../pages/auth/DriverLoginPage'));

const wrap = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true,          element: wrap(HomePage)     },
      { path: 'services',     element: wrap(ServicesPage) },
      { path: 'about',        element: wrap(AboutPage)    },
      { path: 'contact',      element: wrap(ContactPage)  },
      { path: 'drivers',      element: wrap(DriversPage)  },
      { path: 'fleet',        element: wrap(FleetPage)    },
      { path: 'team',         element: wrap(TeamPage)     },
      { path: 'blog',         element: wrap(BlogsPage)      },
      { path: 'blog/:slug',   element: wrap(BlogDetailPage) },
      { path: 'book',         element: wrap(BookNowPage)    },
      { path: 'schedule',     element: wrap(SchedulePage)   },
    ],
  },
  { path: '/login',        element: wrap(MemberLoginPage) },
  { path: '/driver-login', element: wrap(DriverLoginPage) },
]);

export default router;
