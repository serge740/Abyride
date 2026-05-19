import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Check, Car, Accessibility, Plus } from 'lucide-react';

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
        <Plus size={20} className={`text-accent flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`} />
      </button>
      {open && <p className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.7] pb-5">{a}</p>}
    </div>
  );
}

export default function DriversPage() {
  const { t } = useLanguage();

  const WHY = [
    { num: '01', title: t('drv.why_1_title'), body: t('drv.why_1_body'), variant: 'dark' },
    { num: '02', title: t('drv.why_2_title'), body: t('drv.why_2_body'), variant: 'cobalt' },
    { num: '03', title: t('drv.why_3_title'), body: t('drv.why_3_body'), variant: 'paper' },
    { num: '04', title: t('drv.why_4_title'), body: t('drv.why_4_body'), variant: 'ink' },
  ];

  const STEPS = [
    { num: t('drv.step1_num'), title: t('drv.step1_title'), body: t('drv.step1_body'), time: t('drv.step1_time') },
    { num: t('drv.step2_num'), title: t('drv.step2_title'), body: t('drv.step2_body'), time: t('drv.step2_time') },
    { num: t('drv.step3_num'), title: t('drv.step3_title'), body: t('drv.step3_body'), time: t('drv.step3_time') },
    { num: t('drv.step4_num'), title: t('drv.step4_title'), body: t('drv.step4_body'), time: t('drv.step4_time') },
  ];

  const EARN = [
    { type: t('drv.earn_s1_type'), hours: t('drv.earn_s1_hours'), num: t('drv.earn_s1_num'), label: t('drv.earn_s1_label'), dark: false },
    { type: t('drv.earn_s2_type'), hours: t('drv.earn_s2_hours'), num: t('drv.earn_s2_num'), label: t('drv.earn_s2_label'), dark: true  },
    { type: t('drv.earn_s3_type'), hours: t('drv.earn_s3_hours'), num: t('drv.earn_s3_num'), label: t('drv.earn_s3_label'), dark: false },
  ];

  const REQS = [
    t('drv.req_1'), t('drv.req_2'), t('drv.req_3'),
    t('drv.req_4'), t('drv.req_5'), t('drv.req_6'),
  ];

  const FAQS = [
    { q: t('drv.faq1_q'), a: t('drv.faq1_a') },
    { q: t('drv.faq2_q'), a: t('drv.faq2_a') },
    { q: t('drv.faq3_q'), a: t('drv.faq3_a') },
    { q: t('drv.faq4_q'), a: t('drv.faq4_a') },
    { q: t('drv.faq5_q'), a: t('drv.faq5_a') },
  ];

  const variantCls = {
    dark:   'bg-card-dark text-white',
    cobalt: 'bg-card-cobalt text-white',
    paper:  'bg-surface-2 text-ink',
    ink:    'bg-ink text-surface',
  };

  return (
    <div className="bg-surface text-ink transition-colors duration-300">

      {/* ══ PAGE HEADER ══════════════════════════════════════════ */}
      <div className="bg-navy text-on-dark py-14 lg:py-20 relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-5">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">·</span>
            {t('drv.page_eyebrow')}
          </div>
          <h1 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-none tracking-[-0.04em] font-bold mb-4">
            {t('drv.page_title_1')}<br />
            <em className="italic text-blue-glow">{t('drv.page_title_2')}</em>
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/65 max-w-[540px] leading-[1.6] mb-8">
            {t('drv.page_sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a href="#apply"
              className="bg-white text-[#0b1f3a] px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2 whitespace-nowrap hover:bg-blue-glow transition-colors">
              {t('drv.cta_apply')}
            </a>
            <a href="tel:+18338297339"
              className="border border-white/25 text-white px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2 whitespace-nowrap hover:bg-white/[0.06] transition-colors">
              {t('drv.cta_call')}
            </a>
          </div>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 lg:gap-14 mt-10 pt-8 border-t border-white/[0.12]">
            {[
              { n: '$1,240', l: t('driver.stat1_label') },
              { n: '+38%',   l: t('driver.stat2_label') },
              { n: '120+',   l: 'Active drivers' },
              { n: '< 90s',  l: 'Dispatch response' },
            ].map(s => (
              <div key={s.l}>
                <div className="text-[28px] sm:text-[36px] leading-none font-bold tracking-[-0.04em]">{s.n}</div>
                <div className="text-[10px] tracking-[0.14em] text-white/45 mt-2 uppercase font-semibold max-w-[160px] leading-[1.4]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ WHY ABYRIDE ══════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[120px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 mb-10 lg:mb-14 items-start">
            <div className="lg:pt-1">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">I</span>
                {t('drv.why_eyebrow')}
              </div>
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('drv.why_h2')}
              </h2>
              <p className="text-[15px] lg:text-[16px] text-ink-soft leading-[1.6] max-w-[520px]">
                {t('drv.why_body')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WHY.map(w => (
              <div key={w.num} className={`${variantCls[w.variant]} rounded-[10px] px-6 pt-6 pb-7 flex flex-col min-h-[260px] lg:min-h-[300px]`}>
                <div className={`text-[28px] italic font-bold leading-none mb-4 ${w.variant === 'paper' ? 'text-accent' : 'text-white/40'}`}>{w.num}</div>
                <h3 className="text-[20px] lg:text-[22px] leading-[1.1] tracking-[-0.02em] font-bold mb-3">{w.title}</h3>
                <p className="text-[13.5px] leading-[1.55] opacity-[0.85]">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EARNINGS ══════════════════════════════════════════════ */}
      <section className="bg-surface-2 py-16 lg:py-[120px] transition-colors duration-300">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 mb-10 lg:mb-14 items-start">
            <div className="lg:pt-1">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">II</span>
                {t('drv.earn_eyebrow')}
              </div>
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('drv.earn_h2')}
              </h2>
              <p className="text-[15px] lg:text-[16px] text-ink-soft leading-[1.6] max-w-[520px]">
                {t('drv.earn_body')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {EARN.map(e => (
              <div key={e.type}
                className={`rounded-[12px] px-7 py-8 flex flex-col border
                  ${e.dark ? 'bg-navy text-on-dark border-white/[0.08] relative overflow-hidden' : 'bg-surface text-ink border-rule'}`}>
                {e.dark && <div className="app-bg-grid rounded-[12px]" />}
                <div className={`relative z-[1] ${e.dark ? '' : ''}`}>
                  <div className={`text-[11px] tracking-[0.16em] uppercase font-semibold mb-1 ${e.dark ? 'text-blue-glow' : 'text-accent'}`}>
                    {e.type}
                  </div>
                  <div className={`text-[12px] mb-5 ${e.dark ? 'text-white/50' : 'text-muted'}`}>{e.hours}</div>
                  <div className={`text-[48px] sm:text-[56px] lg:text-[64px] leading-none font-bold tracking-[-0.045em] mb-2
                    ${e.dark ? 'text-blue-glow' : 'text-ink'}`}>
                    {e.num}
                  </div>
                  <div className={`text-[11px] tracking-[0.14em] uppercase font-semibold ${e.dark ? 'text-white/45' : 'text-muted'}`}>
                    {e.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted leading-[1.6] max-w-[600px]">{t('drv.earn_note')}</p>
        </div>
      </section>

      {/* ══ HOW TO APPLY — 4 steps ════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[120px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 mb-12 lg:mb-16 items-start">
            <div className="lg:pt-1">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">III</span>
                {t('drv.steps_eyebrow')}
              </div>
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('drv.steps_h2')}
              </h2>
              <p className="text-[15px] lg:text-[16px] text-ink-soft leading-[1.6] max-w-[520px]">
                {t('drv.steps_body')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 border-t border-ink">
            {STEPS.map((s, i) => (
              <div key={s.num}
                className={`py-8 lg:py-10 px-0 lg:pr-8 ${i < STEPS.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-rule' : ''} ${i > 0 ? 'lg:pl-8' : ''}`}>
                <div className="flex items-start gap-4 lg:block">
                  <div className="text-[40px] lg:text-[52px] leading-none italic font-bold text-accent opacity-40 flex-shrink-0 lg:mb-6">
                    {s.num}
                  </div>
                  <div className="pt-1 lg:pt-0">
                    <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.16em] text-muted uppercase font-semibold mb-2 lg:mb-3">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M6 3.5v3l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      {s.time}
                    </div>
                    <h3 className="text-[17px] lg:text-[18px] font-bold tracking-[-0.02em] mb-2">{s.title}</h3>
                    <p className="text-[13px] lg:text-[14px] text-ink-soft leading-[1.65]">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 lg:mt-14">
            <a href="#apply"
              className="bg-ink text-surface px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2 hover:bg-accent transition-colors">
              {t('drv.cta_apply')}
            </a>
          </div>
        </div>
      </section>

      {/* ══ REQUIREMENTS ══════════════════════════════════════════ */}
      <section className="bg-navy text-on-dark py-16 lg:py-[120px] relative overflow-hidden transition-colors duration-300">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start">
            <div className="lg:pt-1">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold">
                <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">IV</span>
                {t('drv.req_eyebrow')}
              </div>
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('drv.req_h2')}
              </h2>
              <p className="text-[15px] lg:text-[16px] text-white/65 leading-[1.6] max-w-[520px] mb-10">
                {t('drv.req_body')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {REQS.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.08] rounded-[8px] px-5 py-4">
                    <Check size={15} className="text-blue-glow mt-0.5 flex-shrink-0" />
                    <span className="text-[13.5px] lg:text-[14px] text-white/80 leading-[1.55]">{r}</span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-white/40 leading-[1.6] max-w-[520px]">{t('drv.req_note')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VEHICLE OPTIONS ════════════════════════════════════════ */}
      <section className="bg-surface-2 py-16 lg:py-[120px] transition-colors duration-300">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 mb-10 lg:mb-14 items-start">
            <div className="lg:pt-1">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">V</span>
                {t('drv.vehicle_eyebrow')}
              </div>
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold">
                {t('drv.vehicle_h2')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Own vehicle */}
            <div className="bg-surface border border-rule rounded-[12px] px-7 sm:px-10 py-8 sm:py-10 flex flex-col">
              <div className="w-12 h-12 rounded-[10px] bg-accent/10 text-accent flex items-center justify-center mb-6"><Car size={24} /></div>
              <h3 className="text-[22px] lg:text-[26px] font-bold tracking-[-0.02em] mb-3">{t('drv.vehicle_own_title')}</h3>
              <p className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.65] mb-8 flex-1">{t('drv.vehicle_own_body')}</p>
              <div className="border-t border-rule pt-6 flex items-center justify-between gap-4">
                <a href="#apply" className="text-[14px] font-semibold text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors">
                  {t('drv.vehicle_own_cta')}
                </a>
                <div className="text-[12px] text-muted">2015+ · 4-door · inspected</div>
              </div>
            </div>

            {/* Fleet vehicle */}
            <div className="bg-card-cobalt text-white rounded-[12px] px-7 sm:px-10 py-8 sm:py-10 flex flex-col relative overflow-hidden">
              <div className="app-bg-grid rounded-[12px]" />
              <div className="relative z-[1] flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-[10px] bg-white/10 text-white flex items-center justify-center"><Accessibility size={24} /></div>
                  <div className="text-[10px] tracking-[0.14em] text-white bg-blue-glow/80 px-[10px] py-[5px] rounded-[4px] font-bold uppercase whitespace-nowrap">
                    {t('drv.vehicle_fleet_badge')}
                  </div>
                </div>
                <h3 className="text-[22px] lg:text-[26px] font-bold tracking-[-0.02em] mb-3">{t('drv.vehicle_fleet_title')}</h3>
                <p className="text-[14px] lg:text-[15px] text-white/75 leading-[1.65] mb-8 flex-1">{t('drv.vehicle_fleet_body')}</p>
                <div className="border-t border-white/[0.15] pt-6">
                  <a href="#apply" className="text-[14px] font-semibold text-white border-b border-white/60 pb-0.5 hover:border-white transition-colors">
                    {t('drv.vehicle_fleet_cta')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[120px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-[100px]">
              <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold mb-5">
                <span className="text-accent text-[18px] italic font-bold tracking-normal">VI</span>
                {t('drv.faq_eyebrow')}
              </div>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.06] tracking-[-0.035em] font-bold mb-6">
                {t('drv.faq_h2')}
              </h2>
              <a href="#apply"
                className="hidden lg:inline-flex bg-ink text-surface px-[20px] py-3.5 rounded-[8px] text-[14px] font-semibold items-center gap-2 hover:bg-accent transition-colors">
                {t('drv.cta_apply')}
              </a>
            </div>
            <div className="border-t border-rule">
              {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══════════════════════════════════════════════ */}
      <section id="apply" className="bg-navy text-on-dark py-16 lg:py-24 relative overflow-hidden transition-colors duration-300">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-end">
            <div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-white/45 font-semibold mb-5">
                {t('drv.cta_eyebrow')}
              </div>
              <h2 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-[1.0] tracking-[-0.045em] font-bold">
                {t('drv.cta_h2_1')}<br />
                <em className="italic text-blue-glow">{t('drv.cta_h2_em')}</em>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end lg:pb-2">
              <a href="#"
                className="bg-white text-[#0b1f3a] px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2 whitespace-nowrap hover:bg-blue-glow transition-colors">
                {t('drv.cta_apply')}
              </a>
              <a href="tel:+18338297339"
                className="border border-white/25 text-white px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2 whitespace-nowrap hover:bg-white/[0.06] transition-colors">
                {t('drv.cta_call')}
              </a>
              <p className="text-[11px] text-white/35 lg:text-right max-w-[200px] leading-[1.5]">{t('drv.cta_note')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
