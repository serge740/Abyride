import { createContext, useContext, useEffect, useState } from 'react';
import adminAuthService from '../services/adminAuthService';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin]               = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]       = useState(true);

  const setAuth = (adminData) => {
    setAdmin(adminData);
    setIsAuthenticated(!!adminData);
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const data = await adminAuthService.getProfile();
      setAuth(data || null);
    } catch {
      setAuth(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { checkAuth(); }, []);

  const login = async (credentials) => {
    const res = await adminAuthService.login(credentials);
    const profile = await adminAuthService.getProfile();
    setAuth(profile || null);
    return res;
  };

  const logout = async () => {
    try { await adminAuthService.logout(); } catch { /* ignore */ }
    setAuth(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
