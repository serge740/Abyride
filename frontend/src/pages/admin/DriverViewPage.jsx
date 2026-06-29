import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import driverService from '../../services/driverService';
import { D, BRK } from '../../components/admin/theme';
import { Badge, BtnGhost, BtnDanger, BtnPrimary, SectionTitle, EmptyState } from '../../components/admin/ui';

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

function HeroAvatar({ src, initial }) {
  if (src) {
    return <img src={src} alt={initial} style={{ width: 68, height: 68, borderRadius: 999, objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)' }} />;
  }
  return (
    <div style={{ width: 68, height: 68, borderRadius: 999, background: D.cobaltHi, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D.font, fontSize: 26, fontWeight: 700, fontStyle: 'italic', flexShrink: 0 }}>
      {initial}
    </div>
  );
}

function DocLink({ label, url, kind }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${D.rule}` }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: D.ink, fontWeight: 500 }}>
        {kind === 'image' ? <ImageIcon size={14} color={D.mute} /> : <FileText size={14} color={D.mute} />}
        {label}
      </span>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: D.cobaltHi }}>
          View <ExternalLink size={11} />
        </a>
      ) : (
        <span style={{ fontSize: 12, color: D.mute, fontStyle: 'italic' }}>Not provided</span>
      )}
    </div>
  );
}

export default function DriverViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    driverService.getOne(id)
      .then(setDriver)
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load driver'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStatus = async () => {
    setBusy(true);
    try {
      if (driver.status === 'SUSPENDED') {
        await driverService.activate(id);
        setDriver((p) => ({ ...p, status: 'ACTIVE' }));
      } else {
        await driverService.suspend(id);
        setDriver((p) => ({ ...p, status: 'SUSPENDED' }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete driver "${driver.names}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await driverService.remove(id);
      navigate('/admin/dashboard/drivers');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '28px 32px', fontFamily: D.font }}><EmptyState title="Loading driver…" /></div>;
  }

  if (error || !driver) {
    return (
      <div style={{ padding: 40, fontFamily: D.font }}>
        <EmptyState icon={<FileText size={28} color={D.mute} />} title="Driver not found" desc={error || 'Return to the driver list.'} />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <BtnGhost onClick={() => navigate('/admin/dashboard/drivers')}>← Back to Drivers</BtnGhost>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>

      {/* Profile hero */}
      <div style={{ background: BRK.bg, borderRadius: 12, padding: '28px 32px', marginBottom: 14, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: 'absolute', right: -60, top: -60, opacity: 0.05, pointerEvents: 'none' }}>
          <circle cx="140" cy="140" r="130" fill="white" />
          <circle cx="140" cy="140" r="80" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative', flexWrap: 'wrap' }}>
          <HeroAvatar src={driver.profileImg} initial={driver.names?.[0]?.toUpperCase() || 'D'} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: BRK.mute2, fontWeight: 700, marginBottom: 5 }}>Driver Profile</div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', fontStyle: 'italic', marginBottom: 6 }}>{driver.names}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge status={driver.status} />
              <span style={{ fontSize: 13, color: BRK.mute }}>{driver.email}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32, textAlign: 'center', position: 'relative', paddingLeft: 28, borderLeft: `1px solid ${BRK.line}` }}>
            <div>
              <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: BRK.mute2, fontWeight: 700, marginBottom: 6 }}>Member Since</div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', fontStyle: 'italic' }}>{fmtDate(driver.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>

        {/* Contact */}
        <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '22px 24px' }}>
          <SectionTitle>Contact Details</SectionTitle>
          {[
            { l: 'Phone', v: driver.phone || '—' },
            { l: 'Email', v: driver.email },
            { l: 'Status', v: <Badge status={driver.status} /> },
          ].map((r) => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${D.rule}` }}>
              <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: D.mute, fontWeight: 700 }}>{r.l}</span>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: D.ink }}>{r.v}</span>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '22px 24px' }}>
          <SectionTitle>Documents & Images</SectionTitle>
          <DocLink label="License Image"      url={driver.licenseImage}      kind="image" />
          <DocLink label="Vehicle Image"       url={driver.vehicleImage}      kind="image" />
          <DocLink label="License Document"    url={driver.licenseDocument}   kind="doc" />
          <DocLink label="Insurance Document"  url={driver.insuranceDocument} kind="doc" />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <BtnGhost onClick={() => navigate('/admin/dashboard/drivers')}>← Back to Drivers</BtnGhost>
        {driver.status === 'SUSPENDED' ? (
          <BtnPrimary onClick={toggleStatus} disabled={busy}>Activate Driver</BtnPrimary>
        ) : (
          <BtnGhost onClick={toggleStatus} disabled={busy}>Suspend Driver</BtnGhost>
        )}
        <BtnDanger onClick={handleDelete} disabled={busy}>Delete Driver</BtnDanger>
      </div>
    </div>
  );
}
