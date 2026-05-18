import { useLanguage } from '../../../contexts/LanguageContext';

const TESTIMONIALS = [
  { i: 'S', n: 'Steve H.', r: 'Local guide · Detroit', q: "Outstanding driving service when I needed it most. Professional, on time, and great conversation. Clean, spacious ride when other apps had failed me." },
  { i: 'B', n: 'Ben R.', r: 'Rider · Ann Arbor', q: "This is how taxi service should be. Door‑to‑door conversation, the courteous approach, the option to share with the driver with superior service." },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-surface-2 py-16 lg:py-[120px] text-ink transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 lg:mb-14 gap-4 lg:gap-8">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold pb-2">
            <span className="text-accent text-[18px] italic font-bold tracking-normal">V</span>
            {t('testimonials.eyebrow')}
          </div>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold">{t('testimonials.h2')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-4">
          {/* Featured */}
          <figure className="bg-navy text-on-dark px-6 sm:px-9 pt-8 sm:pt-10 pb-7 sm:pb-9 flex flex-col rounded-[10px] sm:col-span-2 lg:col-span-1">
            <div className="flex gap-0.5 mb-4 lg:mb-5 text-[14px] text-amber">★★★★★</div>
            <blockquote className="text-[18px] sm:text-[20px] lg:text-[24px] leading-[1.35] italic tracking-[-0.015em] font-medium mb-6 lg:mb-8 flex-1">
              Incredibly reliable, especially for medical timing. The driver was punctual and professional — exactly what I needed for my early morning pickups.
            </blockquote>
            <figcaption className="flex items-center gap-3 pt-5 mt-auto border-t border-white/[0.18]">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-[16px] italic font-bold">I</div>
              <div>
                <div className="text-[14px] font-semibold">Ivana C.</div>
                <div className="text-[12px] text-white/65 mt-0.5">Family caregiver · Dearborn</div>
              </div>
            </figcaption>
          </figure>
          {/* Regular cards */}
          {TESTIMONIALS.map(t => (
            <figure key={t.i} className="bg-surface border border-rule px-6 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-7 flex flex-col rounded-[10px]">
              <div className="flex gap-0.5 mb-4 lg:mb-5 text-[14px] text-accent">★★★★★</div>
              <blockquote className="text-[14px] sm:text-[16px] leading-[1.6] mb-6 lg:mb-8 flex-1">{t.q}</blockquote>
              <figcaption className="flex items-center gap-3 pt-4 lg:pt-5 mt-auto border-t border-rule">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-[16px] italic font-bold">{t.i}</div>
                <div>
                  <div className="text-[14px] font-semibold">{t.n}</div>
                  <div className="text-[12px] text-ink-soft mt-0.5">{t.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
