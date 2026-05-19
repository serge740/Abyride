import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, Circle } from 'lucide-react';

/* ── Real Unsplash images per service ────────────────────────── */
// Photo IDs sourced from Unsplash — free to use, no API key needed for <img> src
const SERVICE_IMAGES = {
  s01: {
    src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=525&fit=crop&auto=format&q=80',
    alt: 'Medical transport driver assisting a patient',
  },
  s02: {
    src: 'https://images.unsplash.com/photo-1559839734-2851eb3e7b7b?w=1200&h=525&fit=crop&auto=format&q=80',
    alt: 'Wheelchair-accessible van with ramp deployed',
  },
  s03: {
    src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=525&fit=crop&auto=format&q=80',
    alt: 'Airport terminal with passengers arriving',
  },
  s04: {
    src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=525&fit=crop&auto=format&q=80',
    alt: 'Two people communicating in different languages',
  },
  s05: {
    src: 'https://images.unsplash.com/photo-1519494026892-476f9e6a0e9e?w=1200&h=525&fit=crop&auto=format&q=80',
    alt: 'City street in Detroit Michigan',
  },
};

/* ── Service config ───────────────────────────────────────────── */
const SERVICE_IDS = ['s01', 's02', 's03', 's04', 's05'];

/* Sidebar accent colours per service */
const ACCENT_CLASSES = {
  s01: { dot: 'bg-accent', num: 'text-accent' },
  s02: { dot: 'bg-blue-glow', num: 'text-blue-glow' },
  s03: { dot: 'bg-accent', num: 'text-accent' },
  s04: { dot: 'bg-blue-glow', num: 'text-blue-glow' },
  s05: { dot: 'bg-accent', num: 'text-accent' },
};

/* ── Main page ────────────────────────────────────────────────── */
export default function ServicesPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('s') || 's01';

  const setActive = (id) => setSearchParams({ s: id }, { replace: true });

  return (
    <div className="bg-surface text-ink transition-colors duration-300 min-h-screen">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="bg-navy text-on-dark py-14 lg:py-20 relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-5">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">I</span>
            {t('svc.page_eyebrow')}
          </div>
          <h1 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-none tracking-[-0.04em] font-bold mb-4">
            {t('svc.page_title')}
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/65 max-w-[540px] leading-[1.6]">
            {t('svc.page_sub')}
          </p>
        </div>
      </div>

      {/* ── Body: sidebar + detail ───────────────────────────── */}
      <div className="px-5 sm:px-10 lg:px-16 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="w-full lg:w-[280px] lg:flex-shrink-0 lg:sticky lg:top-[88px]">
            {/* Mobile: horizontal scroll tabs */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {SERVICE_IDS.map(id => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-[8px] text-[12px] font-semibold tracking-[0.04em] transition-colors duration-150 border
                      ${isActive
                        ? 'bg-ink text-surface border-ink'
                        : 'bg-surface-2 text-ink-soft border-rule hover:border-ink hover:text-ink'
                      }`}
                  >
                    <span className="text-[10px] tracking-[0.14em] text-muted mr-1">{t(`services.${id}.n`)}</span>
                    {t(`services.${id}.title`)}
                  </button>
                );
              })}
            </div>

            {/* Desktop: vertical list */}
            <div className="hidden lg:block">
              <div className="text-[10px] tracking-[0.18em] uppercase text-muted font-semibold mb-4 pb-3 border-b border-rule">
                {t('svc.sidebar_label')}
              </div>
              <nav className="flex flex-col gap-1">
                {SERVICE_IDS.map(id => {
                  const isActive = active === id;
                  const acc = ACCENT_CLASSES[id];
                  return (
                    <button
                      key={id}
                      onClick={() => setActive(id)}
                      className={`w-full text-left px-4 py-[14px] rounded-[8px] transition-colors duration-150 group
                        ${isActive ? 'bg-ink text-surface' : 'hover:bg-surface-2 text-ink'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors
                          ${isActive ? 'bg-blue-glow' : `${acc.dot} opacity-50 group-hover:opacity-100`}`}
                        />
                        <div className="min-w-0">
                          <div className={`text-[10px] tracking-[0.14em] font-semibold mb-0.5
                            ${isActive ? 'text-white/50' : 'text-muted'}`}>
                            {t(`services.${id}.n`)}
                          </div>
                          <div className={`text-[13px] font-semibold leading-[1.3] truncate
                            ${isActive ? 'text-surface' : 'text-ink'}`}>
                            {t(`services.${id}.title`)}
                          </div>
                          <div className={`text-[11px] leading-[1.4] mt-0.5 truncate
                            ${isActive ? 'text-white/55' : 'text-ink-soft'}`}>
                            {t(`services.${id}.tag`)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar CTA */}
              <div className="mt-8 pt-6 border-t border-rule">
                <a
                  href="#"
                  className="w-full bg-accent text-white px-4 py-3.5 rounded-[8px] text-[13px] font-semibold flex items-center justify-between"
                >
                  {t('svc.cta_book')} <ArrowRight size={14} />
                </a>
                <a href="#" className="block mt-3 text-[12px] text-ink-soft text-center hover:text-ink transition-colors">
                  {t('svc.cta_learn')}
                </a>
              </div>
            </div>
          </aside>

          {/* ── Detail panel ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <ServiceDetail id={active} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Service detail component ─────────────────────────────────── */
function ServiceDetail({ id, t }) {
  const acc = ACCENT_CLASSES[id];

  return (
    <article key={id} className="animate-fade-in">

      {/* Hero illustration */}
      <div className="relative w-full rounded-[12px] overflow-hidden mb-8 lg:mb-10"
        style={{ aspectRatio: '16/7' }}>
        <img
          src={SERVICE_IMAGES[id].src}
          alt={SERVICE_IMAGES[id].alt}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Brand overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a]/55 via-[#1e3a8a]/25 to-transparent" />
        {/* Eyebrow overlay */}
        <div className="absolute top-5 left-5 z-[2] text-[10px] tracking-[0.14em] text-white/80
          bg-[rgba(11,31,58,0.55)] backdrop-blur-[6px] px-[10px] py-[6px] uppercase font-semibold rounded-[3px]">
          <Circle size={5} fill="currentColor" className="text-blue-glow mr-1 inline-block" />
          {t(`svc.${id}.hero_eyebrow`)}
        </div>
        {/* Service number */}
        <div className="absolute bottom-5 right-5 text-[11px] tracking-[0.18em] text-white/45 font-semibold">
          {t(`services.${id}.n`)}
        </div>
      </div>

      {/* Title + tag */}
      <div className="mb-6 lg:mb-8">
        {(id === 's01' || id === 's04') && (
          <div className="text-[10px] tracking-[0.16em] text-accent uppercase font-semibold mb-3">
            {t(`services.${id}.kicker`)}
          </div>
        )}
        <h2 className="text-[32px] sm:text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.035em] font-bold mb-3">
          {t(`services.${id}.title`)}
        </h2>
        <p className="text-[16px] lg:text-[18px] text-ink-soft italic leading-[1.5]">
          {t(`services.${id}.tag`)}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border-t border-ink mb-8 lg:mb-10">
        {[1, 2, 3].map(n => (
          <div key={n} className={`py-5 lg:py-7 pr-4 lg:pr-8 ${n < 3 ? 'border-r border-rule' : ''} ${n > 1 ? 'pl-4 lg:pl-8' : ''}`}>
            <div className={`text-[28px] sm:text-[36px] lg:text-[44px] leading-none font-bold tracking-[-0.04em] ${acc.num}`}>
              {t(`svc.${id}.stat${n}_num`)}
            </div>
            <div className="text-[10px] tracking-[0.14em] text-muted uppercase font-semibold mt-2 leading-[1.4]">
              {t(`svc.${id}.stat${n}_label`)}
            </div>
          </div>
        ))}
      </div>

      {/* Long description */}
      <p className="text-[15px] lg:text-[17px] leading-[1.7] text-ink-soft mb-10 lg:mb-12 max-w-[680px]">
        {t(`svc.${id}.desc_long`)}
      </p>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-10 lg:mb-12">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-surface-2 rounded-[10px] px-5 py-5 lg:px-6 lg:py-6 border border-rule">
            <div className={`text-[22px] italic font-bold leading-none mb-3 ${acc.num} opacity-60`}>
              0{n}
            </div>
            <h3 className="text-[15px] lg:text-[16px] font-bold mb-2 tracking-[-0.01em]">
              {t(`svc.${id}.feat${n}_title`)}
            </h3>
            <p className="text-[13px] lg:text-[14px] text-ink-soft leading-[1.6]">
              {t(`svc.${id}.feat${n}_desc`)}
            </p>
          </div>
        ))}
      </div>

      {/* Dark break section */}
      <div className="bg-navy text-on-dark rounded-[12px] px-6 sm:px-10 lg:px-12 py-10 lg:py-14 mb-8 relative overflow-hidden">
        <div className="app-bg-grid rounded-[12px]" />
        <div className="relative z-[1]">
          <div className="text-[60px] sm:text-[80px] leading-[0.6] text-blue-glow italic font-extrabold mb-4 select-none">"</div>
          <blockquote className="text-[20px] sm:text-[24px] lg:text-[30px] leading-[1.3] font-semibold italic tracking-[-0.02em] mb-4 max-w-[600px]">
            {t(`svc.${id}.break_quote`)}
          </blockquote>
          <p className="text-[14px] lg:text-[15px] text-white/60 max-w-[480px] leading-[1.6]">
            {t(`svc.${id}.break_sub`)}
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <a
          href="#"
          className="bg-ink text-surface px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2"
        >
          {t(`svc.${id}.cta`)} <ArrowRight size={14} />
        </a>
        <a href="#" className="text-[14px] text-ink-soft hover:text-ink transition-colors font-medium border-b border-rule pb-0.5">
          {t('svc.cta_learn')}
        </a>
      </div>

      {/* Mobile bottom CTA */}
      <div className="lg:hidden mt-8 pt-6 border-t border-rule">
        <a
          href="#"
          className="w-full bg-accent text-white px-4 py-3.5 rounded-[8px] text-[14px] font-semibold flex items-center justify-between"
        >
          {t('svc.cta_book')} <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}
