import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Ban, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import driverService from '../../services/driverService';
import { D } from '../../components/admin/theme';
import { Badge, Avatar, BtnPrimary, EmptyState, TableHead, FilterTabs, SearchBar } from '../../components/admin/ui';

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const COL = '1.4fr 1fr 110px 120px 170px';

export default function AdminDriversPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(location.state?.created ? 'Driver created successfully.' : '');
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await driverService.getAll();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const handleSuspend = async (id) => {
    setActionId(id);
    try {
      await driverService.suspend(id);
      setDrivers((prev) => prev.map((d) => d.id === id ? { ...d, status: 'SUSPENDED' } : d));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleActivate = async (id) => {
    setActionId(id);
    try {
      await driverService.activate(id);
      setDrivers((prev) => prev.map((d) => d.id === id ? { ...d, status: 'ACTIVE' } : d));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete driver "${name}"? This cannot be undone.`)) return;
    setActionId(id);
    try {
      await driverService.remove(id);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const counts = {
    all:       drivers.length,
    ACTIVE:    drivers.filter((d) => d.status === 'ACTIVE').length,
    PENDING:   drivers.filter((d) => d.status === 'PENDING').length,
    SUSPENDED: drivers.filter((d) => d.status === 'SUSPENDED').length,
    INACTIVE:  drivers.filter((d) => d.status === 'INACTIVE').length,
  };

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase();
    const ok = !q || d.names?.toLowerCase().includes(q) || d.email?.toLowerCase().includes(q) || d.phone?.includes(search);
    return ok && (filter === 'all' || d.status === filter);
  });

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTabs
          options={[
            ['all', `All (${counts.all})`],
            ['ACTIVE', `Active (${counts.ACTIVE})`],
            ['PENDING', `Pending (${counts.PENDING})`],
            ['SUSPENDED', `Suspended (${counts.SUSPENDED})`],
            ['INACTIVE', `Inactive (${counts.INACTIVE})`],
          ]}
          value={filter} onChange={setFilter}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search drivers…" />
        <button
          onClick={load} disabled={loading} title="Refresh"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, background: D.ivory, border: `1px solid ${D.rule}`, cursor: 'pointer', fontSize: 12, color: D.slate }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'admSpin 1s linear infinite' : 'none' }} />
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <BtnPrimary onClick={() => navigate('/admin/dashboard/drivers/create')}>+ Add Driver</BtnPrimary>
        </div>
      </div>

      {/* Banners */}
      {success && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: 'rgba(37,70,184,0.08)', border: '1px solid rgba(37,70,184,0.25)', fontSize: 13, color: D.cobaltHi }}>
          ✓ {success}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 720 }}>
          <TableHead cols={['Driver', 'Phone', 'Status', 'Joined', 'Actions']} template={COL} />
          {loading ? (
            <div style={{ padding: '40px 0' }}><EmptyState title="Loading drivers…" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Car size={32} color={D.mute} />} title="No drivers found" desc={search || filter !== 'all' ? 'Try adjusting your search or filter.' : 'Add your first driver to get started.'} />
          ) : filtered.map((d) => {
            const busy = actionId === d.id;
            return (
              <div key={d.id} className="d-row" onClick={() => navigate(`/admin/dashboard/drivers/${d.id}`)}
                style={{ display: 'grid', gridTemplateColumns: COL, gap: 12, padding: '13px 20px', borderTop: `1px solid ${D.rule}`, cursor: 'pointer', alignItems: 'center', background: D.ivory, opacity: busy ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Avatar initial={d.names?.[0]?.toUpperCase() || 'D'} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: D.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.names}</div>
                    <div style={{ fontSize: 11, color: D.slate, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: D.slate }}>{d.phone || '—'}</div>
                <div><Badge status={d.status} /></div>
                <div style={{ fontSize: 12.5, color: D.slate }}>{fmtDate(d.createdAt)}</div>
                <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  {d.status === 'SUSPENDED' ? (
                    <button
                      onClick={() => handleActivate(d.id)} disabled={busy} title="Activate"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 5, background: 'rgba(37,70,184,0.08)', border: '1px solid rgba(37,70,184,0.25)', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: D.cobaltHi }}
                    >
                      <CheckCircle size={12} /> Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspend(d.id)} disabled={busy} title="Suspend"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 5, background: '#fffbeb', border: '1px solid #fde68a', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#92400e' }}
                    >
                      <Ban size={12} /> Suspend
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(d.id, d.names)} disabled={busy} title="Delete"
                    style={{ display: 'flex', alignItems: 'center', padding: '5px 8px', borderRadius: 5, background: '#fee2e2', border: '1px solid #fecaca', cursor: 'pointer', color: '#991b1b' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div></div>
      </div>

      <div style={{ fontSize: 11, color: D.mute, marginTop: 12, paddingLeft: 4 }}>
        Showing {filtered.length} of {drivers.length} drivers
      </div>
    </div>
  );
}
