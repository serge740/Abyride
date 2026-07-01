import { Navigate, useLocation } from 'react-router-dom';
import { useDriverAuth } from '../../contexts/DriverAuthContext';
import LoadingScreen from '../LoadingScreen';

export default function ProtectedDriverRoute({ children }) {
  const { isAuthenticated, isLoading } = useDriverAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/driver/login" state={{ from: location }} replace />;

  return children;
}
