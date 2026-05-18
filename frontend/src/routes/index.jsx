import { createBrowserRouter } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import HomePage from '../pages/landing/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

export default router;
