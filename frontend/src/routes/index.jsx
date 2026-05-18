import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/landing/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);

export default router;
