import { useLanguage } from '../../../contexts/LanguageContext';

const POSTS = [
  { grad: ['#0b1f3a', '#1a2b47'], id: 'bp-0', pp: 'bpp-0', tag: 'Home Care, Lifestyle', date: 'Jan 8, 2026', read: '5 min read', title: 'Why home care services are essential for modern living', excerpt: 'How everyday transportation shapes independence for older adults — and what families can do about it.' },
  { grad: ['#2546b8', '#0f2768'], id: 'bp-1', pp: 'bpp-1', tag: 'Transportation', date: 'Jan 2, 2026', read: '7 min read', title: 'Behind the on‑time rate: how dispatch actually works at Abyride', excerpt: 'A look at the routing, the trained dispatchers, and the unglamorous spreadsheets behind 99.9%.' },
  { grad: ['#0b1f3a', '#1a2b47'], id: 'bp-2', pp: 'bpp-2', tag: 'Translation', date: 'Dec 22, 2025', read: '4 min read', title: 'Breaking language barriers: the role of our translation service', excerpt: "Why a multilingual driver isn't a luxury for newcomers in Michigan — it's the difference between a ride and isolation." },
];

export default function BlogSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-surface py-16 lg:py-[120px] text-ink transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr_auto] gap-4 lg:gap-14 items-start lg:items-end mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold pb-2">
            <span className="text-accent text-[18px] italic font-bold tracking-normal">VI</span>
            {t('blog.eyebrow')}
          </div>
          <div>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.06] tracking-[-0.035em] font-bold mb-2 lg:mb-3">{t('blog.h2')}</h2>
            <p className="text-[14px] lg:text-[16px] text-ink-soft leading-[1.55] max-w-[540px]">{t('blog.sub')}</p>
          </div>
          <a className="text-[14px] font-semibold border-b border-ink pb-0.5 whitespace-nowrap" href="#">{t('blog.view_all')}</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4">
          {POSTS.map(p => (
            <a key={p.id} className="flex flex-col" href="#">
              <div className="relative overflow-hidden rounded-[8px]" style={{ aspectRatio: '5/3' }}>
                <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
                  <defs>
                    <linearGradient id={p.id} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={p.grad[0]} /><stop offset="1" stopColor={p.grad[1]} />
                    </linearGradient>
                    <pattern id={p.pp} width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.5" fill="rgba(255,255,255,0.3)" />
                    </pattern>
                  </defs>
                  <rect width="400" height="240" fill={`url(#${p.id})`} />
                  <rect width="400" height="240" fill={`url(#${p.pp})`} />
                </svg>
                <div className="absolute top-4 left-4 text-[10px] tracking-[0.14em] text-white bg-[rgba(11,31,58,0.6)] backdrop-blur-[6px] px-[9px] py-[5px] uppercase font-semibold rounded-[3px]">{p.tag}</div>
              </div>
              <div className="pt-5 lg:pt-6 px-1">
                <div className="text-[11px] tracking-[0.14em] text-muted uppercase flex gap-2 font-semibold">
                  <span>{p.date}</span><span className="text-rule">·</span><span>{p.read}</span>
                </div>
                <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] leading-[1.2] tracking-[-0.03em] font-bold my-3 lg:my-4">{p.title}</h3>
                <p className="text-[13px] sm:text-[14.5px] leading-[1.55] text-ink-soft mb-4">{p.excerpt}</p>
                <span className="text-[13px] font-semibold text-accent border-b border-accent pb-0.5">{t('blog.read_more')}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
