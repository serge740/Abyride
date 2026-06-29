import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import '../styles/admin-dashboard.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggle = () => setSidebarOpen((v) => !v);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f6f7f9', overflow: 'hidden' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggle} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header onToggle={toggle} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#f6f7f9' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
