import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { BLOGS } from '../../stores/blogs';
import { ArrowRight, Clock, Tag } from 'lucide-react';

const ALL_TAGS = ['All', ...Array.from(new Set(BLOGS.map(b => b.tag)))];

function PostCard({ post, featured = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col rounded-[14px] overflow-hidden border border-rule bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] ${featured ? 'lg:flex-row lg:col-span-2' : ''}`}
    >
      <div className={`relative overflow-hidden bg-surface-2 flex-shrink-0 ${featured ? 'lg:w-[55%] h-[240px] lg:h-auto' : 'h-[200px] sm:h-[220px]'}`}>
        <img
          src={post.img}
          alt={post.imgAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/50 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 text-[10px] tracking-[0.14em] text-white bg-[rgba(11,31,58,0.65)] backdrop-blur-sm px-3 py-1.5 uppercase font-bold rounded-[4px] inline-flex items-center gap-1">
          <Tag size={10} /> {post.tag}
        </span>
        {featured && (
          <span className="absolute top-4 right-4 text-[10px] tracking-[0.12em] text-white bg-accent px-3 py-1.5 uppercase font-bold rounded-[4px]">
            Featured
          </span>
        )}
      </div>
      <div className={`p-6 flex flex-col flex-1 ${featured ? 'lg:p-8 lg:py-10' : ''}`}>
        <div className="flex items-center gap-3 text-[11px] tracking-[0.1em] text-muted uppercase font-semibold mb-3">
          <span>{post.date}</span>
          <span className="w-px h-3 bg-rule" />
          <span className="inline-flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
        </div>
        <h3 className={`font-bold tracking-[-0.025em] leading-[1.2] mb-3 text-ink ${featured ? 'text-[22px] sm:text-[26px] lg:text-[30px]' : 'text-[18px] sm:text-[20px]'}`}>
          {post.title}
        </h3>
        <p className="text-[13.5px] text-ink-soft leading-[1.6] mb-5 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[11px] font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-ink">{post.author}</div>
              <div className="text-[10px] text-muted">{post.authorRole}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-accent">
            Read <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const { t } = useLanguage();
  const [activeTag, setActiveTag] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = BLOGS.filter(b => {
    const matchTag = activeTag === 'All' || b.tag === activeTag;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const featured = filtered.find(b => b.featured);
  const rest = filtered.filter(b => !b.featured || filtered.indexOf(b) > 0);

  return (
    <div className="bg-surface text-ink transition-colors duration-300 min-h-screen">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="bg-navy text-on-dark py-14 lg:py-20 relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-5">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">·</span>
            Field Notes &amp; Stories
          </div>
          <h1 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-none tracking-[-0.04em] font-bold mb-4">
            The Abyride Blog.
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/65 max-w-[540px] leading-[1.6]">
            Healthcare insights, accessibility stories, driver spotlights, and guides for getting the most out of your Abyride.
          </p>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────── */}
      <div className="border-b border-rule bg-surface sticky top-[88px] z-30">
        <div className="px-5 sm:px-10 lg:px-16 flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`flex-shrink-0 px-4 py-2 rounded-[8px] text-[12px] font-semibold tracking-[0.04em] transition-colors ${activeTag === tag ? 'bg-ink text-surface' : 'text-ink-soft hover:text-ink hover:bg-surface-2'}`}
            >
              {tag}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="bg-surface-2 border border-rule rounded-[8px] px-3 py-2 text-[12px] text-ink placeholder:text-muted focus:outline-none focus:border-accent w-[160px] sm:w-[200px] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Posts grid ───────────────────────────────────────── */}
      <div className="px-5 sm:px-10 lg:px-16 py-12 lg:py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-[48px] mb-4">📭</div>
            <div className="text-[18px] font-bold mb-2">No posts found</div>
            <p className="text-ink-soft text-[14px]">Try a different tag or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} featured={i === 0 && post.featured} />
            ))}
          </div>
        )}
      </div>

      {/* ── Newsletter CTA ───────────────────────────────────── */}
      <div className="bg-navy text-on-dark relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 py-14 lg:py-20 relative z-[1]">
          <div className="max-w-[520px]">
            <div className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-semibold mb-4">Stay in the loop</div>
            <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] font-bold tracking-[-0.035em] leading-none mb-4">
              Healthcare transport, delivered to your inbox.
            </h2>
            <p className="text-[14px] text-white/65 leading-[1.6] mb-7">
              Monthly roundups on Medicaid transport changes, accessibility news, and Abyride updates. No spam, ever.
            </p>
            <form className="flex gap-2 flex-col sm:flex-row" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-white/[0.06] border border-white/20 rounded-[8px] px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-[8px] text-[14px] font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}