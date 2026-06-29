import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import driverService from '../../services/driverService';
import { D } from '../../components/admin/theme';
import { Field, FileField, SectionTitle, BtnPrimary, BtnGhost } from '../../components/admin/ui';

const INIT_FORM  = { names: '', email: '', phone: '', status: 'PENDING' };
const INIT_FILES = { profileImg: null, licenseImage: null, vehicleImage: null, licenseDocument: null, insuranceDocument: null };

export default function CreateDriverPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(INIT_FORM);
  const [files, setFiles]   = useState(INIT_FILES);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

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
      <form onSubmit={handleSubmit} style={{ maxWidth: 860 }}>

        {serverErr && (
          <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
            ⚠ {serverErr}
          </div>
        )}

        {/* Personal info */}
        <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Personal Information</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="Full Name" required error={errors.names} value={form.names} onChange={setField('names')} placeholder="e.g. John Doe" />
            <Field label="Email Address" required error={errors.email} type="email" value={form.email} onChange={setField('email')} placeholder="driver@example.com" />
            <Field label="Phone Number" type="tel" value={form.phone} onChange={setField('phone')} placeholder="+250 78x xxx xxx" />
            <Field label="Initial Status" type="select" value={form.status} onChange={setField('status')}
              options={[{ value: 'PENDING', label: 'Pending' }, { value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} />
          </div>
        </div>

        {/* Documents & images */}
        <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Documents & Images</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <FileField label="Profile Photo"      name="profileImg"        accept="image/*"         helpText="JPG, PNG, WEBP"           value={files.profileImg}        onChange={setFile} />
            <FileField label="License Image"      name="licenseImage"      accept="image/*"         helpText="Photo of driving license" value={files.licenseImage}      onChange={setFile} />
            <FileField label="Vehicle Image"      name="vehicleImage"      accept="image/*"         helpText="Photo of the vehicle"     value={files.vehicleImage}      onChange={setFile} />
            <FileField label="License Document"   name="licenseDocument"   accept=".pdf,.doc,.docx" helpText="PDF or Word"              value={files.licenseDocument}   onChange={setFile} />
            <FileField label="Insurance Document" name="insuranceDocument" accept=".pdf,.doc,.docx" helpText="PDF or Word"              value={files.insuranceDocument} onChange={setFile} />
          </div>
        </div>

        {/* Info note */}
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 8, background: 'rgba(37,70,184,0.06)', border: '1px solid rgba(37,70,184,0.18)', fontSize: 12, color: D.slate, lineHeight: 1.6 }}>
          A temporary password will be generated and sent to the driver's email address automatically.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <BtnPrimary type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Driver'}</BtnPrimary>
          <BtnGhost onClick={() => navigate('/admin/dashboard/drivers')} disabled={loading}>Cancel</BtnGhost>
        </div>
      </form>
    </div>
  );
}
