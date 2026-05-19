import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import logo from '../../assets/images/abyride_logo.png';

function LangDropdown() {
  const { lang, setLanguage, LANGUAGES } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find(l => l.code === lang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-white/85 text-[11px] font-semibold tracking-[0.06em] px-2 py-1 rounded hover:text-white transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current?.label}
        <svg
          width="8" height="5" viewBox="0 0 8 5" fill="currentColor"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M0 0l4 5 4-5z" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 bg-[#0b1f3a] border border-white/[0.15] rounded-[6px] overflow-hidden z-[100] min-w-[140px] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {LANGUAGES.map(l => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                onClick={() => { setLanguage(l.code); setOpen(false); }}
                className={`w-full text-left px-4 py-[10px] text-[12px] font-medium flex items-center justify-between gap-6 transition-colors
                  ${l.code === lang
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
                  }`}
              >
                <span className="font-bold tracking-[0.06em]">{l.label}</span>
                <span className="text-white/45 text-[11px]">{l.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { key: 'nav.about',    to: '/about'    },
    { key: 'nav.services', to: '/services' },
    { key: 'nav.fleet',    to: '/fleet'    },
    { key: 'nav.drivers',  to: '/drivers'  },
    { key: 'nav.team',     to: '/team'     },
    { key: 'nav.blog',     to: '/blog'     },
    { key: 'nav.contact',  to: '/contact'  },
  ];

  return (
    <>
      {/* UTILITY BAR */}
      <div className="bg-navy-deep text-white/70 text-[11px]">
        <div className="px-5 sm:px-10 lg:px-16 py-[9px] flex justify-between items-center">
          <div className="hidden md:flex items-center gap-3">
            <span><b className="text-white font-semibold">+1 (616) 633‑7026</b> · {t('util.dispatch')}</span>
            <span className="text-white/30">·</span>
            <span>{t('util.serving')}</span>
          </div>
          <div className="flex items-center gap-[10px] ml-auto">
            <Link className="hidden sm:inline text-white/85" to="/login">{t('util.member_login')}</Link>
            <span className="hidden sm:inline text-white/30">·</span>
            <Link className="hidden sm:inline text-white/85" to="/driver-login">{t('util.driver_login')}</Link>
            <span className="hidden sm:inline text-white/30">·</span>
            <LangDropdown />
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex items-center gap-[6px] bg-transparent border border-white/25 text-white/85 px-[10px] py-1 rounded-full text-[11px] font-medium tracking-[0.06em] ml-2 hover:bg-white/[0.08] transition-colors duration-150"
            >
              <span className={`inline-block w-3 h-3 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-slate-cool' : 'bg-amber'}`}></span>
              <span className="hidden sm:inline">{theme === 'dark' ? t('util.theme_dark') : t('util.theme_light')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NAV */}
      <header className="bg-surface border-b border-rule sticky top-0 z-50 transition-colors duration-300">
        <div className="px-5 sm:px-10 lg:px-16 py-4 lg:py-[18px] flex items-center justify-between gap-6">
          <Link className="flex items-center flex-shrink-0" to="/">
            <img src={logo} alt="Abyride" className="h-14 lg:h-16 w-auto object-contain transition-transform duration-200 hover:scale-105" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => {
              const isActive = l.to && location.pathname.startsWith(l.to);
              const cls = `text-[14px] font-medium whitespace-nowrap transition-colors ${isActive ? 'text-accent' : 'text-ink'}`;
              return l.to ? (
                <Link key={l.key} to={l.to} className={cls}>
                  {t(l.key)}
                </Link>
              ) : (
                <a key={l.key} className={cls} href="#">
                  {t(l.key)}
                </a>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-[10px]">
            <Link className="text-[14px] text-ink px-4 py-[11px] font-medium whitespace-nowrap" to="/schedule">{t('nav.schedule')}</Link>
            <Link className="text-[14px] text-surface bg-ink px-[18px] py-3 rounded-[6px] font-semibold inline-flex items-center gap-[6px] whitespace-nowrap" to="/book">
              {t('nav.book_now')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link className="text-[13px] text-surface bg-ink px-4 py-2.5 rounded-[6px] font-semibold hidden sm:inline-flex items-center gap-1 whitespace-nowrap" to="/book">
              {t('nav.book_now')} <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="w-10 h-10 flex items-center justify-center text-ink rounded-[6px] border border-rule hover:bg-surface-2 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {menuOpen ? (
                  <><path d="M4 4l12 12"/><path d="M16 4L4 16"/></>
                ) : (
                  <><path d="M3 6h14"/><path d="M3 10h14"/><path d="M3 14h14"/></>
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-rule bg-surface">
            <nav className="px-5 sm:px-10 py-4 flex flex-col gap-1">
              {navLinks.map(l => {
                const isActive = l.to && location.pathname.startsWith(l.to);
                const cls = `text-[15px] font-medium py-3 border-b border-rule-dim last:border-0 transition-colors ${isActive ? 'text-accent' : 'text-ink'}`;
                return l.to ? (
                  <Link key={l.key} to={l.to} className={cls} onClick={() => setMenuOpen(false)}>
                    {t(l.key)}
                  </Link>
                ) : (
                  <a key={l.key} className={cls} href="#" onClick={() => setMenuOpen(false)}>
                    {t(l.key)}
                  </a>
                );
              })}
              <div className="pt-4 flex flex-col gap-3">
                <Link className="text-[14px] text-ink font-medium" to="/schedule" onClick={() => setMenuOpen(false)}>{t('nav.schedule')}</Link>
                <Link className="text-[15px] text-surface bg-ink px-5 py-3 rounded-[6px] font-semibold inline-flex items-center justify-center gap-2" to="/book" onClick={() => setMenuOpen(false)}>
                  {t('nav.book_now')} <ArrowRight size={14} />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}