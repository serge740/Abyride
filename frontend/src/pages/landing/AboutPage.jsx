import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

/* ── Reusable section eyebrow ─────────────────────────────────── */
function Eyebrow({ roman, text, light = false }) {
  return (
    <div className={`inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase font-semibold
      ${light ? 'text-white/55' : 'text-ink-soft'}`}>
      <span className={`text-[18px] italic font-bold tracking-normal ${light ? 'text-blue-glow' : 'text-accent'}`}>
        {roman}
      </span>
      {text}
    </div>
  );
}

/* ── Team member card ─────────────────────────────────────────── */
function TeamCard({ initial, name, role, bio, dark = false }) {
  return (
    <div className={`rounded-[10px] px-6 pt-6 pb-7 flex flex-col gap-4 border
      ${dark ? 'bg-card-dark text-white border-white/[0.08]' : 'bg-surface-2 text-ink border-rule'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[20px] italic font-bold
        ${dark ? 'bg-white/10 text-blue-glow' : 'bg-accent text-white'}`}>
        {initial}
      </div>
      <div>
        <div className="text-[16px] font-bold tracking-[-0.01em]">{name}</div>
        <div className={`text-[12px] tracking-[0.06em] mt-0.5 font-semibold uppercase
          ${dark ? 'text-blue-glow' : 'text-accent'}`}>{role}</div>
      </div>
      <p className={`text-[13.5px] leading-[1.6] ${dark ? 'text-white/65' : 'text-ink-soft'}`}>{bio}</p>
    </div>
  );
}

/* ── Value card ───────────────────────────────────────────────── */
function ValueCard({ num, title, body, variant }) {
  const variants = {
    dark:   'bg-card-dark text-white',
    cobalt: 'bg-card-cobalt text-white',
    paper:  'bg-surface-2 text-ink',
    ink:    'bg-ink text-surface',
  };
  const numColor = (variant === 'paper') ? 'text-accent' : 'text-white/40';
  const bodyOpacity = 'opacity-[0.85]';

  return (
    <div className={`${variants[variant]} rounded-[10px] px-6 pt-6 pb-7 flex flex-col min-h-[280px] lg:min-h-[320px]`}>
      <div className={`text-[28px] italic font-bold leading-none mb-4 ${numColor}`}>{num}</div>
      <h3 className="text-[20px] lg:text-[22px] leading-[1.1] tracking-[-0.02em] font-bold mb-3">{title}</h3>
      <p className={`text-[13.5px] leading-[1.55] ${bodyOpacity}`}>{body}</p>
    </div>
  );
}

/* ── Timeline item ────────────────────────────────────────────── */
function TimelineItem({ year, title, body, isLast }) {
  return (
    <div className="flex gap-6 lg:gap-8">
      {/* Left: year + line */}
      <div className="flex flex-col items-center flex-shrink-0 w-[56px]">
        <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0 mt-1" />
        {!isLast && <div className="w-px flex-1 bg-rule mt-2" />}
      </div>
      {/* Right: content */}
      <div className={`pb-10 lg:pb-12 ${isLast ? '' : ''}`}>
        <div className="text-[11px] tracking-[0.18em] text-accent font-bold uppercase mb-1">{year}</div>
        <h3 className="text-[18px] lg:text-[20px] font-bold tracking-[-0.02em] mb-2">{title}</h3>
        <p className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.6]">{body}</p>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function AboutPage() {
  const { t } = useLanguage();

  const STATS = [
    { num: t('about.stat1_num'), label: t('about.stat1_label'), desc: t('about.stat1_desc') },
    { num: t('about.stat2_num'), label: t('about.stat2_label'), desc: t('about.stat2_desc') },
    { num: t('about.stat3_num'), label: t('about.stat3_label'), desc: t('about.stat3_desc') },
    { num: t('about.stat4_num'), label: t('about.stat4_label'), desc: t('about.stat4_desc') },
  ];

  const VALUES = [
    { num: '01', title: t('about.val1_title'), body: t('about.val1_body'), variant: 'dark' },
    { num: '02', title: t('about.val2_title'), body: t('about.val2_body'), variant: 'cobalt' },
    { num: '03', title: t('about.val3_title'), body: t('about.val3_body'), variant: 'paper' },
    { num: '04', title: t('about.val4_title'), body: t('about.val4_body'), variant: 'ink' },
  ];

  const TEAM = [
    { initial: 'O', name: t('about.team_m1_name'), role: t('about.team_m1_role'), bio: t('about.team_m1_bio'), dark: true },
    { initial: 'F', name: t('about.team_m2_name'), role: t('about.team_m2_role'), bio: t('about.team_m2_bio'), dark: false },
    { initial: 'J', name: t('about.team_m3_name'), role: t('about.team_m3_role'), bio: t('about.team_m3_bio'), dark: false },
    { initial: 'P', name: t('about.team_m4_name'), role: t('about.team_m4_role'), bio: t('about.team_m4_bio'), dark: true },
  ];

  const TIMELINE = [
    { year: t('about.tl1_year'), title: t('about.tl1_title'), body: t('about.tl1_body') },
    { year: t('about.tl2_year'), title: t('about.tl2_title'), body: t('about.tl2_body') },
    { year: t('about.tl3_year'), title: t('about.tl3_title'), body: t('about.tl3_body') },
    { year: t('about.tl4_year'), title: t('about.tl4_title'), body: t('about.tl4_body') },
    { year: t('about.tl5_year'), title: t('about.tl5_title'), body: t('about.tl5_body') },
    { year: t('about.tl6_year'), title: t('about.tl6_title'), body: t('about.tl6_body') },
  ];

  const PARTNERS = ['MDHHS', 'Henry Ford Health', 'NMA', 'NHA', 'Molina Healthcare', 'Meridian', 'DMC'];

  return (
    <div className="bg-surface text-ink transition-colors duration-300">

      {/* ══════════════════════════════════════════════════════════
          HERO — dark navy, full-width
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-navy text-on-dark py-14 lg:py-20 relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-5">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">·</span>
            {t('about.page_eyebrow')}
          </div>
          <h1 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-none tracking-[-0.04em] font-bold mb-4">
            {t('about.page_title_1')}{' '}
            <em className="italic text-blue-glow">{t('about.page_title_2')}</em>
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/65 max-w-[540px] leading-[1.6]">
            {t('about.page_sub')}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ORIGIN STORY
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[120px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 items-start">
            {/* Left */}
            <div className="lg:pt-2">
              <Eyebrow roman="I" text={t('about.origin_eyebrow').replace('I · ', '')} />
              <div className="mt-8 lg:mt-12 border-t border-ink pt-6 lg:pt-8">
                <div className="text-[64px] lg:text-[80px] leading-none font-bold tracking-[-0.05em] text-accent">
                  {t('about.origin_year')}
                </div>
                <div className="text-[11px] tracking-[0.18em] text-muted uppercase font-semibold mt-2">
                  {t('about.origin_year_label')}
                </div>
              </div>
            </div>
            {/* Right */}
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[52px] leading-[1.06] tracking-[-0.04em] font-bold mb-6 lg:mb-8">
                {t('about.origin_h2')}
              </h2>
              <p className="text-[15px] lg:text-[17px] leading-[1.7] text-ink-soft mb-5">
                {t('about.origin_body1')}
              </p>
              <p className="text-[15px] lg:text-[17px] leading-[1.7] text-ink-soft mb-8">
                {t('about.origin_body2')}
              </p>
              {/* Origin photo */}
              <div className="rounded-[12px] overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=506&fit=crop&auto=format&q=80"
                  alt="Caregiver and patient — the kind of moment Abyride was built for"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS — dark break
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-navy text-on-dark py-14 lg:py-20 transition-colors duration-300">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/[0.15]">
            {STATS.map((s, i) => (
              <div key={i} className={`py-8 lg:py-12 pr-4 lg:pr-10
                ${i < STATS.length - 1 ? 'border-r border-white/[0.1]' : ''}
                ${i > 0 ? 'pl-4 lg:pl-10' : ''}`}>
                <div className="text-[40px] sm:text-[52px] lg:text-[64px] leading-none font-bold tracking-[-0.045em] text-blue-glow">
                  {s.num}
                </div>
                <div className="text-[14px] lg:text-[16px] font-semibold mt-3">{s.label}</div>
                <div className="text-[12px] text-white/45 mt-1 font-medium">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MISSION
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[120px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 items-start">
            <div className="lg:pt-2">
              <Eyebrow roman="II" text={t('about.mission_eyebrow').replace('II · ', '')} />
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[40px] lg:text-[56px] leading-[1.05] tracking-[-0.04em] font-bold mb-6 lg:mb-8">
                {t('about.mission_h2_1')}{' '}
                <em className="italic text-accent">{t('about.mission_h2_em')}</em>{' '}
                {t('about.mission_h2_2')}
              </h2>
              <p className="text-[15px] lg:text-[18px] leading-[1.7] text-ink-soft max-w-[640px]">
                {t('about.mission_body')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface-2 py-16 lg:py-[120px] transition-colors duration-300">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 mb-10 lg:mb-14 items-start">
            <div className="lg:pt-2">
              <Eyebrow roman="III" text={t('about.values_eyebrow').replace('III · ', '')} />
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('about.values_h2')}
              </h2>
              <p className="text-[15px] lg:text-[16px] text-ink-soft leading-[1.6] max-w-[520px]">
                {t('about.values_body')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {VALUES.map(v => (
              <ValueCard key={v.num} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[120px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 mb-10 lg:mb-14 items-start">
            <div className="lg:pt-2">
              <Eyebrow roman="IV" text={t('about.team_eyebrow').replace('IV · ', '')} />
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('about.team_h2')}
              </h2>
              <p className="text-[15px] lg:text-[16px] text-ink-soft leading-[1.6] max-w-[520px]">
                {t('about.team_body')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map(m => (
              <TeamCard key={m.name} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TIMELINE — alternating light/dark feel
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface-2 py-16 lg:py-[120px] transition-colors duration-300">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 items-start">
            {/* Left: sticky label */}
            <div className="lg:sticky lg:top-[100px]">
              <Eyebrow roman="V" text={t('about.timeline_eyebrow').replace('V · ', '')} />
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.06] tracking-[-0.035em] font-bold mt-5">
                {t('about.timeline_h2')}
              </h2>
              {/* Mini map decoration */}
              <div className="mt-8 lg:mt-10 hidden lg:block">
                <svg viewBox="0 0 240 160" className="w-full max-w-[240px] opacity-40" aria-hidden="true">
                  <defs>
                    <linearGradient id="tl-map-g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="var(--c-cobalt-hi)" stopOpacity="0.3" />
                      <stop offset="1" stopColor="var(--c-cobalt-hi)" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect width="240" height="160" rx="8" fill="url(#tl-map-g)" />
                  {/* Michigan outline simplified */}
                  <path d="M60 30 L80 20 L120 25 L150 40 L170 60 L165 90 L140 110 L100 120 L70 110 L50 80 L55 50 Z"
                    fill="none" stroke="var(--c-cobalt-hi)" strokeWidth="1.5" opacity="0.6" />
                  {/* City dots */}
                  {[[95,75,'Detroit'],[80,65,'Dearborn'],[75,55,'Ann Arbor'],[110,50,'Lansing'],[85,45,'Flint'],[65,40,'Grand Rapids']].map(([x,y,city]) => (
                    <g key={city}>
                      <circle cx={x} cy={y} r="3" fill="var(--c-cobalt-hi)" opacity="0.8" />
                      <text x={x+5} y={y+4} fontSize="7" fill="var(--c-cobalt-hi)" opacity="0.7">{city}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
            {/* Right: timeline */}
            <div className="pt-2">
              {TIMELINE.map((item, i) => (
                <TimelineItem
                  key={item.year}
                  {...item}
                  isLast={i === TIMELINE.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PARTNERS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-[120px]">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 mb-10 lg:mb-14 items-start">
            <div className="lg:pt-2">
              <Eyebrow roman="VI" text={t('about.partners_eyebrow').replace('VI · ', '')} />
            </div>
            <div>
              <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-3">
                {t('about.partners_h2')}
              </h2>
              <p className="text-[15px] lg:text-[16px] text-ink-soft leading-[1.6] max-w-[520px]">
                {t('about.partners_body')}
              </p>
            </div>
          </div>
          {/* Partner logos grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 border-t border-ink">
            {PARTNERS.map((name, i) => (
              <div key={name}
                className={`py-8 lg:py-10 flex items-center justify-center
                  ${i < PARTNERS.length - 1 ? 'border-r border-rule' : ''}
                  ${i >= 3 ? 'border-t border-rule lg:border-t-0' : ''}`}>
                <span className="text-[15px] sm:text-[17px] font-bold italic text-ink opacity-70 text-center px-2">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA — dark navy close
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-navy text-on-dark py-16 lg:py-24 relative overflow-hidden transition-colors duration-300">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-end">
            <div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-white/45 font-semibold mb-5">
                {t('about.cta_eyebrow')}
              </div>
              <h2 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-[1.0] tracking-[-0.045em] font-bold">
                {t('about.cta_h2_1')}<br />
                <em className="italic text-blue-glow">{t('about.cta_h2_em')}</em>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:gap-4 lg:items-end lg:pb-2">
              <a href="#"
                className="bg-white text-[#0b1f3a] px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2 whitespace-nowrap">
                {t('about.cta_book')}
              </a>
              <Link to="/services"
                className="border border-white/25 text-white px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2 whitespace-nowrap hover:bg-white/[0.06] transition-colors">
                {t('about.cta_drivers')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
