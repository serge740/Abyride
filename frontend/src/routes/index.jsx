import { createBrowserRouter } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import HomePage from '../pages/landing/HomePage';
import ServicesPage from '../pages/landing/ServicesPage';
import AboutPage from '../pages/landing/AboutPage';
import ContactPage from '../pages/landing/ContactPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]);

export default router;
