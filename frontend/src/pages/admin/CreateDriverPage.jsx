import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText, Image } from 'lucide-react';
import driverService from '../../services/driverService';
import fleetService from '../../services/fleetService';
import { D } from '../../components/admin/theme';
import { Field, SectionTitle, BtnPrimary, BtnGhost } from '../../components/admin/ui';

const INIT_FORM  = { names: '', email: '', phone: '', status: 'PENDING', fleetId: '' };
const INIT_FILES = { profileImg: null, licenseImage: null, vehicleImage: null, licenseDocument: null, insuranceDocument: null };

/* ── Image upload card with live thumbnail ─────────────────── */
function ImgCard({ label, name, value, onChange, optional = true }) {
  const ref = useRef();
  const preview = value ? URL.createObjectURL(value) : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: D.slate, display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        {optional && <span style={{ color: D.mute, fontWeight: 400, letterSpacing: 0, textTransform: 'none', fontSize: 10.5 }}>optional</span>}
      </label>
      <div
        onClick={() => ref.current.click()}
        style={{
          position: 'relative', cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
          height: 110, border: `1.5px dashed ${value ? D.cobaltHi : D.rule}`,
          background: value ? 'transparent' : D.paper,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color .15s',
        }}
      >
        {preview ? (
          <img src={preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: D.mute }}>
            <Image size={22} style={{ margin: '0 auto 6px' }} />
            <p style={{ fontSize: 11.5, margin: 0 }}>Upload photo</p>
            <p style={{ fontSize: 10, margin: '2px 0 0', color: D.mute }}>JPG, PNG, WEBP</p>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(name, null); ref.current.value = ''; }}
            style={{
              position: 'absolute', top: 6, right: 6, width: 22, height: 22,
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(11,31,58,0.65)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={11} />
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => onChange(name, e.target.files[0] || null)} />
    </div>
  );
}

/* ── Document upload row ───────────────────────────────────── */
function DocRow({ label, name, accept, value, onChange }) {
  const ref = useRef();
  const ext = value?.name?.split('.').pop().toUpperCase() || '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: D.slate, display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        <span style={{ color: D.mute, fontWeight: 400, letterSpacing: 0, textTransform: 'none', fontSize: 10.5 }}>optional</span>
      </label>
      <div
        onClick={() => ref.current.click()}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8,
          border: `1.5px dashed ${value ? D.cobaltHi : D.rule}`,
          background: value ? 'rgba(37,70,184,0.04)' : D.paper,
          cursor: 'pointer', transition: 'all .15s',
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 6, flexShrink: 0,
          background: value ? 'rgba(37,70,184,0.1)' : D.rule,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText size={16} color={value ? D.cobaltHi : D.mute} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {value ? (
            <>
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: D.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: D.mute }}>{ext} · {(value.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 12.5, color: D.slate }}>Click to upload</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: D.mute }}>PDF, DOC, DOCX</p>
            </>
          )}
        </div>
        {value ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(name, null); ref.current.value = ''; }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: D.mute, flexShrink: 0 }}
          >
            <X size={13} />
          </button>
        ) : (
          <Upload size={14} color={D.mute} style={{ flexShrink: 0 }} />
        )}
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => onChange(name, e.target.files[0] || null)} />
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function CreateDriverPage() {
  const navigate = useNavigate();
  const [form,      setForm]      = useState(INIT_FORM);
  const [files,     setFiles]     = useState(INIT_FILES);
  const [fleets,    setFleets]    = useState([]);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState('');

  useEffect(() => { fleetService.getAll().then(setFleets).catch(() => {}); }, []);

  const setField = (k) => (v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })); };
  const setFile  = (k, v) => setFiles((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.names.trim()) e.names = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const fd = new FormData();
    fd.append('names', form.names.trim());
    fd.append('email', form.email.trim());
    if (form.phone.trim()) fd.append('phone', form.phone.trim());
    fd.append('status', form.status);
    if (form.fleetId) fd.append('fleetId', form.fleetId);
    Object.entries(files).forEach(([k, v]) => { if (v) fd.append(k, v); });

    setLoading(true);
    setServerErr('');
    try {
      await driverService.create(fd);
      navigate('/admin/dashboard/drivers', { state: { created: true } });
    } catch (err) {
      setServerErr(err.response?.data?.message || err.message || 'Failed to create driver');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>
      {serverErr && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
          ⚠ {serverErr}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Two-column layout ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>

          {/* LEFT — Personal information */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '24px 28px' }}>
            <SectionTitle>Personal Information</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Field label="Full Name" required error={errors.names} value={form.names} onChange={setField('names')} placeholder="e.g. John Doe" />
              <Field label="Email Address" required error={errors.email} type="email" value={form.email} onChange={setField('email')} placeholder="driver@example.com" />
              <Field label="Phone Number" type="tel" value={form.phone} onChange={setField('phone')} placeholder="+1 313 xxx xxxx" />
              <Field label="Initial Status" type="select" value={form.status} onChange={setField('status')}
                options={[{ value: 'PENDING', label: 'Pending' }, { value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} />
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Fleet (Vehicle Category)" type="select" value={form.fleetId} onChange={setField('fleetId')}
                  options={fleets.map((f) => ({ value: f.id, label: `${f.name} — $${Number(f.perKmRate).toFixed(2)}/km` }))}
                  helpText="Which vehicle category this driver operates — used to match them to trip requests." />
              </div>
            </div>

            {/* Info note */}
            <div style={{ marginTop: 24, padding: '12px 14px', borderRadius: 8, background: 'rgba(37,70,184,0.06)', border: '1px solid rgba(37,70,184,0.15)', fontSize: 12, color: D.slate, lineHeight: 1.6 }}>
              A temporary password will be generated and sent to the driver's email address automatically.
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <BtnPrimary type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Driver'}</BtnPrimary>
              <BtnGhost onClick={() => navigate('/admin/dashboard/drivers')} disabled={loading}>Cancel</BtnGhost>
            </div>
          </div>

          {/* RIGHT — Documents & Images */}
          <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '24px 24px' }}>
            <SectionTitle>Documents & Images</SectionTitle>

            {/* Photos — 3 image cards in a grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <ImgCard label="Profile Photo" name="profileImg" value={files.profileImg} onChange={setFile} />
              </div>
              <ImgCard label="License Photo" name="licenseImage" value={files.licenseImage} onChange={setFile} />
              <ImgCard label="Vehicle Photo" name="vehicleImage" value={files.vehicleImage} onChange={setFile} />
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${D.rule}`, marginBottom: 16 }} />

            {/* Documents */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DocRow label="License Document" name="licenseDocument" accept=".pdf,.doc,.docx" value={files.licenseDocument} onChange={setFile} />
              <DocRow label="Insurance Document" name="insuranceDocument" accept=".pdf,.doc,.docx" value={files.insuranceDocument} onChange={setFile} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
