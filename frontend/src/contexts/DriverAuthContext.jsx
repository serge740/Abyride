import { createContext, useContext, useEffect, useState } from 'react';
import driverAuthService from '../services/driverAuthService';

const DriverAuthContext = createContext(null);

export function DriverAuthProvider({ children }) {
  const [driver, setDriver]               = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]         = useState(true);

  const setAuth = (driverData) => {
    setDriver(driverData);
    setIsAuthenticated(!!driverData);
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const data = await driverAuthService.getProfile();
      setAuth(data || null);
    } catch {
      setAuth(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { checkAuth(); }, []);

  const login = async (credentials) => {
    const res = await driverAuthService.login(credentials);
    const profile = await driverAuthService.getProfile();
    setAuth(profile || null);
    return res;
  };

  const logout = async () => {
    try { await driverAuthService.logout(); } catch { /* ignore */ }
    setAuth(null);
  };

  return (
    <DriverAuthContext.Provider value={{ driver, isAuthenticated, isLoading, login, logout }}>
      {children}
    </DriverAuthContext.Provider>
  );
}

export function useDriverAuth() {
  const ctx = useContext(DriverAuthContext);
  if (!ctx) throw new Error('useDriverAuth must be used inside DriverAuthProvider');
  return ctx;
}
