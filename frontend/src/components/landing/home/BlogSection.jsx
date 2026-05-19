import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { BLOGS } from '../../../stores/blogs';

export default function BlogSection() {
  const { t } = useLanguage();
  const POSTS = BLOGS.slice(0, 3);

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
          <Link to="/blog" className="text-[14px] font-semibold border-b border-ink pb-0.5 whitespace-nowrap">
            {t('blog.view_all')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POSTS.map(p => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="flex flex-col group">
              <div className="relative overflow-hidden rounded-[8px]" style={{ aspectRatio: '5/3' }}>
                <img
                  src={p.img}
                  alt={p.imgAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/50 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 text-[10px] tracking-[0.14em] text-white bg-[rgba(11,31,58,0.6)] backdrop-blur-[6px] px-[9px] py-[5px] uppercase font-semibold rounded-[3px]">
                  {p.tag}
                </div>
              </div>
              <div className="pt-5 lg:pt-6 px-1">
                <div className="text-[11px] tracking-[0.14em] text-muted uppercase flex gap-2 font-semibold">
                  <span>{p.date}</span>
                  <span className="text-rule">·</span>
                  <span>{p.readTime}</span>
                </div>
                <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] leading-[1.2] tracking-[-0.03em] font-bold my-3 lg:my-4">
                  {p.title}
                </h3>
                <p className="text-[13px] sm:text-[14.5px] leading-[1.55] text-ink-soft mb-4">{p.excerpt}</p>
                <span className="text-[13px] font-semibold text-accent border-b border-accent pb-0.5">
                  {t('blog.read_more')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
