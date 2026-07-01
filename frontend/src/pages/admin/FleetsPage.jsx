import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, Ban, CheckCircle, Trash2, RefreshCw, Users, Accessibility } from 'lucide-react';
import fleetService from '../../services/fleetService';
import { D } from '../../components/admin/theme';
import { Badge, BtnPrimary, EmptyState, TableHead, FilterTabs, SearchBar } from '../../components/admin/ui';

const CATEGORY_LABEL = { STANDARD: 'Standard', PREMIUM: 'Premium', GROUP: 'Group', ACCESSIBLE: 'Accessible' };
const COL = '1.4fr 110px 100px 100px 110px 170px';

export default function FleetsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fleets, setFleets]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(location.state?.savedMessage || '');
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fleetService.getAllForAdmin();
      setFleets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load fleets');
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

  const handleToggleStatus = async (fleet) => {
    setActionId(fleet.id);
    try {
      if (fleet.status === 'ACTIVE') {
        await fleetService.deactivate(fleet.id);
        setFleets((prev) => prev.map((f) => f.id === fleet.id ? { ...f, status: 'INACTIVE' } : f));
      } else {
        await fleetService.activate(fleet.id);
        setFleets((prev) => prev.map((f) => f.id === fleet.id ? { ...f, status: 'ACTIVE' } : f));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (fleet) => {
    if (!window.confirm(`Delete fleet "${fleet.name}"? This cannot be undone.`)) return;
    setActionId(fleet.id);
    try {
      await fleetService.remove(fleet.id);
      setFleets((prev) => prev.filter((f) => f.id !== fleet.id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActionId(null);
    }
  };

  const counts = {
    all:        fleets.length,
    STANDARD:   fleets.filter((f) => f.category === 'STANDARD').length,
    PREMIUM:    fleets.filter((f) => f.category === 'PREMIUM').length,
    GROUP:      fleets.filter((f) => f.category === 'GROUP').length,
    ACCESSIBLE: fleets.filter((f) => f.category === 'ACCESSIBLE').length,
  };

  const filtered = fleets.filter((f) => {
    const q = search.toLowerCase();
    const ok = !q || f.name.toLowerCase().includes(q) || f.slug.toLowerCase().includes(q);
    return ok && (filter === 'all' || f.category === filter);
  });

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTabs
          options={[
            ['all', `All (${counts.all})`],
            ['STANDARD', `Standard (${counts.STANDARD})`],
            ['PREMIUM', `Premium (${counts.PREMIUM})`],
            ['GROUP', `Group (${counts.GROUP})`],
            ['ACCESSIBLE', `Accessible (${counts.ACCESSIBLE})`],
          ]}
          value={filter} onChange={setFilter}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search fleets…" />
        <button
          onClick={load} disabled={loading} title="Refresh"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, background: D.ivory, border: `1px solid ${D.rule}`, cursor: 'pointer', fontSize: 12, color: D.slate }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'admSpin 1s linear infinite' : 'none' }} />
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <BtnPrimary onClick={() => navigate('/admin/dashboard/fleets/create')}>+ Add Fleet</BtnPrimary>
        </div>
      </div>

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

      <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 760 }}>
          <TableHead cols={['Fleet', 'Category', 'Capacity', 'Rate / km', 'Status', 'Actions']} template={COL} />
          {loading ? (
            <div style={{ padding: '40px 0' }}><EmptyState title="Loading fleets…" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Truck size={32} color={D.mute} />} title="No fleets found" desc={search || filter !== 'all' ? 'Try adjusting your search or filter.' : 'Add your first fleet to get started.'} />
          ) : filtered.map((f) => {
            const busy = actionId === f.id;
            return (
              <div key={f.id} className="d-row" onClick={() => navigate(`/admin/dashboard/fleets/${f.id}/edit`)}
                style={{ display: 'grid', gridTemplateColumns: COL, gap: 12, padding: '13px 20px', borderTop: `1px solid ${D.rule}`, cursor: 'pointer', alignItems: 'center', background: D.ivory, opacity: busy ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,70,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {f.accessible ? <Accessibility size={15} color={D.cobaltHi} /> : <Truck size={15} color={D.cobaltHi} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: D.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: D.slate, marginTop: 1 }}>{f.slug} · {f._count?.drivers ?? 0} driver{f._count?.drivers === 1 ? '' : 's'}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: D.slate }}>{CATEGORY_LABEL[f.category] || f.category}</div>
                <div style={{ fontSize: 13, color: D.ink, display: 'flex', alignItems: 'center', gap: 5 }}><Users size={12} color={D.mute} /> {f.passengerCapacity}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: D.ink }}>${Number(f.perKmRate).toFixed(2)}</div>
                <div>
                  <Badge status={f.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'} />
                </div>
                <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  {f.status === 'ACTIVE' ? (
                    <button onClick={() => handleToggleStatus(f)} disabled={busy} title="Deactivate"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 5, background: '#fffbeb', border: '1px solid #fde68a', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#92400e' }}>
                      <Ban size={12} /> Deactivate
                    </button>
                  ) : (
                    <button onClick={() => handleToggleStatus(f)} disabled={busy} title="Activate"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 5, background: 'rgba(37,70,184,0.08)', border: '1px solid rgba(37,70,184,0.25)', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: D.cobaltHi }}>
                      <CheckCircle size={12} /> Activate
                    </button>
                  )}
                  <button onClick={() => handleDelete(f)} disabled={busy} title="Delete"
                    style={{ display: 'flex', alignItems: 'center', padding: '5px 8px', borderRadius: 5, background: '#fee2e2', border: '1px solid #fecaca', cursor: 'pointer', color: '#991b1b' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div></div>
      </div>

      <div style={{ fontSize: 11, color: D.mute, marginTop: 12, paddingLeft: 4 }}>
        Showing {filtered.length} of {fleets.length} fleets
      </div>
    </div>
  );
}
