import { useLanguage } from '../../../contexts/LanguageContext';

// Real Unsplash photos — one per post topic
const POST_IMAGES = [
  {
    id: 'bp-0',
    src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=480&fit=crop&auto=format&q=80',
    alt: 'Caregiver helping elderly person into a vehicle',
  },
  {
    id: 'bp-1',
    src: 'https://images.unsplash.com/photo-1519494026892-476f9e6a0e9e?w=800&h=480&fit=crop&auto=format&q=80',
    alt: 'Dispatch coordinator managing transport routes',
  },
  {
    id: 'bp-2',
    src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=480&fit=crop&auto=format&q=80',
    alt: 'Two people communicating across a language barrier',
  },
];

export default function BlogSection() {
  const { t } = useLanguage();

  const POSTS = [
    {
      ...POST_IMAGES[0],
      tag: t('blog.p1.tag'),
      date: t('blog.p1.date'),
      read: t('blog.p1.read'),
      title: t('blog.p1.title'),
      excerpt: t('blog.p1.excerpt'),
    },
    {
      ...POST_IMAGES[1],
      tag: t('blog.p2.tag'),
      date: t('blog.p2.date'),
      read: t('blog.p2.read'),
      title: t('blog.p2.title'),
      excerpt: t('blog.p2.excerpt'),
    },
    {
      ...POST_IMAGES[2],
      tag: t('blog.p3.tag'),
      date: t('blog.p3.date'),
      read: t('blog.p3.read'),
      title: t('blog.p3.title'),
      excerpt: t('blog.p3.excerpt'),
    },
  ];

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
            <a key={p.id} className="flex flex-col group" href="#">
              <div className="relative overflow-hidden rounded-[8px]" style={{ aspectRatio: '5/3' }}>
                <img
                  src={p.src}
                  alt={p.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/50 via-transparent to-transparent" />
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
