import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getBySlug, BLOGS } from '../../stores/blogs';
import { ArrowLeft, ArrowRight, Clock, Tag, User } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const post = getBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = BLOGS.filter(b => b.id !== post.id && b.tag === post.tag).slice(0, 2);
  const others  = related.length < 2 ? [...related, ...BLOGS.filter(b => b.id !== post.id && !related.includes(b)).slice(0, 2 - related.length)] : related;

  return (
    <div className="bg-surface text-ink transition-colors duration-300 min-h-screen">

      {/* ── Hero image ───────────────────────────────────────── */}
      <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[520px] overflow-hidden bg-navy">
        <img
          src={post.img}
          alt={post.imgAlt}
          className="w-full h-full object-cover"
          loading="eager"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/80 via-[#0b1f3a]/30 to-transparent" />
        {/* Back link */}
        <Link
          to="/blog"
          className="absolute top-6 left-5 sm:left-10 lg:left-16 inline-flex items-center gap-2 text-white/80 text-[12px] font-semibold tracking-[0.06em] hover:text-white transition-colors bg-[rgba(11,31,58,0.45)] backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft size={14} /> Back to blog
        </Link>
        {/* Tag + meta overlay at bottom */}
        <div className="absolute bottom-6 left-5 sm:left-10 lg:left-16 right-5 sm:right-10 lg:right-16">
          <span className="inline-flex items-center gap-1 text-[11px] tracking-[0.14em] text-white bg-accent px-3 py-1.5 uppercase font-bold rounded-[4px] mb-3">
            <Tag size={10} /> {post.tag}
          </span>
          <h1 className="text-[24px] sm:text-[36px] lg:text-[52px] font-bold tracking-[-0.035em] leading-[1.1] text-white max-w-[800px]">
            {post.title}
          </h1>
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────── */}
      <div className="px-5 sm:px-10 lg:px-16 py-12 lg:py-16">
        <div className="max-w-[760px] mx-auto">

          {/* Author + meta bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-rule">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[14px] font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-ink">{post.author}</div>
                <div className="text-[11px] text-muted">{post.authorRole}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[12px] text-muted font-medium">
              <span>{post.date}</span>
              <span className="w-px h-4 bg-rule" />
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
            </div>
          </div>

          {/* Excerpt lead */}
          <p className="text-[17px] sm:text-[19px] leading-[1.65] text-ink-soft mb-8 font-medium italic border-l-4 border-accent pl-5">
            {post.excerpt}
          </p>

          {/* Body HTML */}
          <div
            className="prose-abyride"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Tags + share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-10 mt-10 border-t border-rule">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-soft border border-rule rounded-full px-4 py-1.5">
              <Tag size={12} className="text-accent" /> {post.tag}
            </span>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-accent"
            >
              <ArrowLeft size={13} /> All articles
            </Link>
          </div>
        </div>
      </div>

      {/* ── Related posts ────────────────────────────────────── */}
      {others.length > 0 && (
        <div className="bg-surface-2 border-t border-rule px-5 sm:px-10 lg:px-16 py-12 lg:py-16">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold mb-6">More to read</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {others.map(p => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group flex gap-4 bg-surface border border-rule rounded-[12px] p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
                >
                  <div className="w-[100px] h-[80px] rounded-[8px] overflow-hidden flex-shrink-0 bg-surface-2">
                    <img
                      src={p.img}
                      alt={p.imgAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] tracking-[0.1em] uppercase font-bold text-accent">{p.tag}</span>
                      <h4 className="text-[14px] font-bold leading-[1.3] mt-1 text-ink line-clamp-2">{p.title}</h4>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-accent mt-2">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="bg-navy text-on-dark relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 py-12 lg:py-16 relative z-[1] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 max-w-[1100px] mx-auto">
          <div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-semibold mb-3">Ready to ride?</div>
            <h2 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.03em] leading-none">
              Book your Abyride today.
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="tel:+18338297339" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-[8px] text-[14px] font-semibold">
              Call (833) 829-7339
            </a>
            <Link to="/blog" className="inline-flex items-center gap-2 border border-white/25 text-white/85 px-6 py-3 rounded-[8px] text-[14px] font-semibold hover:bg-white/[0.06] transition-colors">
              More articles <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}