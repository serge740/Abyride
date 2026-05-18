import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

/* ── Unsplash image helper ────────────────────────────────────── */
// Uses Unsplash's free CDN — no API key needed for <img> src
// Format: https://images.unsplash.com/photo-{ID}?w={W}&h={H}&fit=crop&auto=format&q=80
const UImg = ({ id, w = 800, h = 600, alt, className }) => (
  <img
    src={`https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`}
    alt={alt}
    className={className}
    loading="lazy"
    decoding="async"
  />
);

/* ── FAQ accordion item ───────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-rule">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-[15px] lg:text-[16px] font-semibold text-ink">{q}</span>
        <span className={`text-accent text-[20px] font-light flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <p className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.7] pb-5">
          {a}
        </p>
      )}
    </div>
  );
}

/* ── Channel card ─────────────────────────────────────────────── */
function ChannelCard({ icon, title, desc, cta, dark = false }) {
  return (
    <div className={`rounded-[10px] px-6 pt-6 pb-7 flex flex-col gap-4 border
      ${dark ? 'bg-card-dark text-white border-white/[0.08]' : 'bg-surface-2 text-ink border-rule'}`}>
      <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[20px]
        ${dark ? 'bg-white/10' : 'bg-accent/10'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-[16px] font-bold mb-1">{title}</h3>
        <p className={`text-[13.5px] leading-[1.6] ${dark ? 'text-white/65' : 'text-ink-soft'}`}>{desc}</p>
      </div>
      <a href="#" className={`text-[13px] font-semibold mt-auto border-b pb-0.5 self-start
        ${dark ? 'text-blue-glow border-blue-glow/40' : 'text-accent border-accent/40'}`}>
        {cta}
      </a>
    </div>
  );
}

/* ── Office card ──────────────────────────────────────────────── */
function OfficeCard({ city, addr, note, isHQ = false }) {
  return (
    <div className={`rounded-[10px] px-5 py-5 border ${isHQ ? 'bg-ink text-surface border-ink' : 'bg-surface-2 text-ink border-rule'}`}>
      <div className={`text-[10px] tracking-[0.16em] uppercase font-bold mb-2 ${isHQ ? 'text-blue-glow' : 'text-accent'}`}>
        {note}
      </div>
      <div className="text-[17px] font-bold mb-1">{city}</div>
      <div className={`text-[13px] ${isHQ ? 'text-white/65' : 'text-ink-soft'}`}>{addr}</div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const CHANNELS = [
    { icon: '📱', title: t('contact.ch1_title'), desc: t('contact.ch1_desc'), cta: t('contact.ch1_cta'), dark: false },
    { icon: '✉️', title: t('contact.ch2_title'), desc: t('contact.ch2_desc'), cta: t('contact.ch2_cta'), dark: true },
    { icon: '🚗', title: t('contact.ch3_title'), desc: t('contact.ch3_desc'), cta: t('contact.ch3_cta'), dark: false },
    { icon: '📰', title: t('contact.ch4_title'), desc: t('contact.ch4_desc'), cta: t('contact.ch4_cta'), dark: true },
  ];

  const OFFICES = [
    { city: t('contact.office1_city'), addr: t('contact.office1_addr'), note: t('contact.office1_note'), isHQ: true },
    { city: t('contact.office2_city'), addr: t('contact.office2_addr'), note: t('contact.office2_note') },
    { city: t('contact.office3_city'), addr: t('contact.office3_addr'), note: t('contact.office3_note') },
    { city: t('contact.office4_city'), addr: t('contact.office4_addr'), note: t('contact.office4_note') },
  ];

  const FAQS = [
    { q: t('contact.faq1_q'), a: t('contact.faq1_a') },
    { q: t('contact.faq2_q'), a: t('contact.faq2_a') },
    { q: t('contact.faq3_q'), a: t('contact.faq3_a') },
    { q: t('contact.faq4_q'), a: t('contact.faq4_a') },
    { q: t('contact.faq5_q'), a: t('contact.faq5_a') },
  ];

  const inputCls = `w-full bg-surface border border-rule rounded-[8px] px-4 py-3 text-[14px] text-ink
    placeholder:text-muted focus:outline-none focus:border-accent transition-colors`;

  return (
    <div className="bg-surface text-ink transition-colors duration-300">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-navy text-on-dark relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 pt-16 lg:pt-24 pb-0 relative z-[1]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-end">
            <div className="pb-14 lg:pb-20">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-5">
                <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">·</span>
                {t('contact.page_eyebrow')}
              </div>
              <h1 className="text-[44px] sm:text-[64px] lg:text-[80px] leading-[0.97] tracking-[-0.045em] font-bold mb-5">
                {t('contact.page_title_1')}<br />
                <em className="italic text-blue-glow">{t('contact.page_title_2')}</em>
              </h1>
              <p className="text-[15px] lg:text-[18px] text-white/65 max-w-[480px] leading-[1.65]">
                {t('contact.page_sub')}
              </p>
            </div>
            {/* Hero photo */}
            <div className="hidden lg:block h-[420px] rounded-t-[12px] overflow-hidden">
              <UImg
                id="1587560699-d0d8d2e0f4b5"
                w={700} h={420}
                alt="Abyride dispatch team at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CHANNELS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface-2 py-16 lg:py-[100px] transition-colors duration-300">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 mb-10 lg:mb-14 items-start">
            <div className="lg:pt-2">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">I</span>
                {t('contact.channels_eyebrow').replace('II · ', '')}
              </div>
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[44px] leading-[1.06] tracking-[-0.035em] font-bold">
                {t('contact.channels_eyebrow').replace('II · ', '')}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHANNELS.map(c => <ChannelCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          DISPATCH — primary CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[100px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
            {/* Left: photo */}
            <div className="rounded-[12px] overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <UImg
                id="1516733725897-1aa73b87c8e8"
                w={700} h={525}
                alt="Person on phone booking a ride"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Right: content */}
            <div>
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold mb-6">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">II</span>
                {t('contact.dispatch_eyebrow').replace('I · ', '')}
              </div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[52px] leading-[1.05] tracking-[-0.04em] font-bold mb-5">
                {t('contact.dispatch_h2')}
              </h2>
              <p className="text-[15px] lg:text-[17px] text-ink-soft leading-[1.7] mb-8 max-w-[480px]">
                {t('contact.dispatch_body')}
              </p>
              {/* Phone number — big */}
              <div className="border-t border-rule pt-7">
                <div className="text-[11px] tracking-[0.16em] text-muted uppercase font-semibold mb-2">
                  {t('contact.dispatch_label')}
                </div>
                <a href="tel:+18338297339"
                  className="text-[36px] sm:text-[48px] lg:text-[56px] leading-none font-bold tracking-[-0.04em] text-ink hover:text-accent transition-colors block mb-3">
                  (833) 829‑7339
                </a>
                <div className="inline-flex items-center gap-2 text-[12px] text-muted font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-play animate-pulse" />
                  {t('contact.dispatch_note')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT FORM + PHOTO
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[100px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">

            {/* Left: form */}
            <div>
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold mb-6">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">III</span>
                {t('contact.form_eyebrow').replace('III · ', '')}
              </div>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('contact.form_h2')}
              </h2>
              <p className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.6] mb-8 max-w-[440px]">
                {t('contact.form_body')}
              </p>

              {submitted ? (
                <div className="bg-surface-2 border border-rule rounded-[12px] px-6 py-10 text-center">
                  <div className="text-[40px] mb-4">✓</div>
                  <div className="text-[18px] font-bold mb-2">Message sent</div>
                  <p className="text-[14px] text-ink-soft">We'll get back to you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] tracking-[0.12em] uppercase font-semibold text-ink-soft mb-1.5">
                        {t('contact.form_name')}
                      </label>
                      <input
                        type="text" required
                        placeholder={t('contact.form_name_ph')}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-[0.12em] uppercase font-semibold text-ink-soft mb-1.5">
                        {t('contact.form_email')}
                      </label>
                      <input
                        type="email" required
                        placeholder={t('contact.form_email_ph')}
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] tracking-[0.12em] uppercase font-semibold text-ink-soft mb-1.5">
                        {t('contact.form_phone')}
                      </label>
                      <input
                        type="tel"
                        placeholder={t('contact.form_phone_ph')}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-[0.12em] uppercase font-semibold text-ink-soft mb-1.5">
                        {t('contact.form_subject')}
                      </label>
                      <select
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className={inputCls}
                      >
                        <option value="">{t('contact.form_subject_ph')}</option>
                        <option value="booking">{t('contact.form_subject_booking')}</option>
                        <option value="billing">{t('contact.form_subject_billing')}</option>
                        <option value="driver">{t('contact.form_subject_driver')}</option>
                        <option value="feedback">{t('contact.form_subject_feedback')}</option>
                        <option value="other">{t('contact.form_subject_other')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.12em] uppercase font-semibold text-ink-soft mb-1.5">
                      {t('contact.form_message')}
                    </label>
                    <textarea
                      required rows={5}
                      placeholder={t('contact.form_message_ph')}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                    <button
                      type="submit"
                      className="bg-ink text-surface px-[22px] py-3.5 rounded-[8px] text-[14px] font-semibold inline-flex items-center gap-2 hover:bg-accent transition-colors"
                    >
                      {t('contact.form_submit')}
                    </button>
                    <span className="text-[12px] text-muted leading-[1.5]">{t('contact.form_note')}</span>
                  </div>
                </form>
              )}
            </div>

            {/* Right: photo stack */}
            <div className="flex flex-col gap-4 lg:pt-[88px]">
              <div className="rounded-[12px] overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <UImg
                  id="1576091160550-2173dba999ef"
                  w={640} h={480}
                  alt="Abyride driver helping a passenger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[10px] overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  <UImg
                    id="1559839734-2851eb3e7b7b"
                    w={320} h={320}
                    alt="Wheelchair accessible van ramp"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-[10px] overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  <UImg
                    id="1582719508461-905c673536f6"
                    w={320} h={320}
                    alt="Dispatch coordinator on headset"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[100px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 items-start">
            {/* Left: sticky label + photo */}
            <div className="lg:sticky lg:top-[100px]">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold mb-5">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">V</span>
                {t('contact.faq_eyebrow').replace('V · ', '')}
              </div>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.06] tracking-[-0.035em] font-bold mb-6">
                {t('contact.faq_h2')}
              </h2>
              <div className="rounded-[12px] overflow-hidden hidden lg:block" style={{ aspectRatio: '4/3' }}>
                <UImg
                  id="1519494026892-476f9e6a0e9e"
                  w={480} h={360}
                  alt="Abyride van on a Michigan road"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Right: accordion */}
            <div className="border-t border-rule">
              {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
