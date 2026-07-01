import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fleetService from '../../services/fleetService';
import { D } from '../../components/admin/theme';
import { Field, SectionTitle, BtnPrimary, BtnGhost, EmptyState } from '../../components/admin/ui';

const INIT_FORM = { slug: '', name: '', description: '', category: 'STANDARD', passengerCapacity: '4', perKmRate: '', accessible: 'false' };

export default function FleetFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm]       = useState(INIT_FORM);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [serverErr, setServerErr] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    fleetService.getOne(id)
      .then((f) => setForm({
        slug: f.slug,
        name: f.name,
        description: f.description || '',
        category: f.category,
        passengerCapacity: String(f.passengerCapacity),
        perKmRate: String(f.perKmRate),
        accessible: String(f.accessible),
      }))
      .catch((err) => setServerErr(err.response?.data?.message || err.message || 'Failed to load fleet'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const setField = (k) => (v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Fleet name is required';
    if (!isEdit && !form.slug.trim()) e.slug = 'Slug is required';
    if (!form.passengerCapacity || Number(form.passengerCapacity) < 1) e.passengerCapacity = 'Enter a valid capacity';
    if (!form.perKmRate || Number(form.perKmRate) <= 0) e.perKmRate = 'Enter a rate greater than 0';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      passengerCapacity: Number(form.passengerCapacity),
      perKmRate: Number(form.perKmRate),
      accessible: form.accessible === 'true',
    };
    if (!isEdit) payload.slug = form.slug.trim();

    setSaving(true);
    setServerErr('');
    try {
      if (isEdit) await fleetService.update(id, payload);
      else await fleetService.create(payload);
      navigate('/admin/dashboard/fleets', { state: { savedMessage: isEdit ? 'Fleet updated successfully.' : 'Fleet created successfully.' } });
    } catch (err) {
      setServerErr(err.response?.data?.message || err.message || 'Failed to save fleet');
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '28px 32px', fontFamily: D.font }}><EmptyState title="Loading fleet…" /></div>;
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>
      <form onSubmit={handleSubmit}>

        {serverErr && (
          <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
            ⚠ {serverErr}
          </div>
        )}

        <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, padding: '24px 28px', marginBottom: 14 }}>
          <SectionTitle>Fleet Details</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="Fleet Name" required error={errors.name} value={form.name} onChange={setField('name')} placeholder="e.g. Abyride X" />
            <Field
              label="Slug" required={!isEdit} error={errors.slug} value={form.slug} onChange={setField('slug')}
              placeholder="e.g. x" disabled={isEdit}
              helpText={isEdit ? 'Slug cannot be changed after creation.' : 'Lowercase identifier, e.g. "x", "comforts".'}
            />
            <Field label="Category" type="select" value={form.category} onChange={setField('category')}
              options={[
                { value: 'STANDARD', label: 'Standard' },
                { value: 'PREMIUM', label: 'Premium' },
                { value: 'GROUP', label: 'Group' },
                { value: 'ACCESSIBLE', label: 'Accessible' },
              ]} />
            <Field label="Wheelchair Accessible" type="select" value={form.accessible} onChange={setField('accessible')}
              options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }]} />
            <Field label="Passenger Capacity" required error={errors.passengerCapacity} type="number" value={form.passengerCapacity} onChange={setField('passengerCapacity')} placeholder="4" />
            <Field label="Rate per Kilometer ($)" required error={errors.perKmRate} type="number" value={form.perKmRate} onChange={setField('perKmRate')} placeholder="1.50" helpText="Used to compute a trip's fare: distance (km) × this rate." />
          </div>
          <div style={{ marginTop: 20 }}>
            <Field label="Description" type="textarea" value={form.description} onChange={setField('description')} placeholder="Affordable everyday rides for up to 4 people" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <BtnPrimary type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Fleet'}</BtnPrimary>
          <BtnGhost onClick={() => navigate('/admin/dashboard/fleets')} disabled={saving}>Cancel</BtnGhost>
        </div>
      </form>
    </div>
  );
}
