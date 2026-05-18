import { useRef, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const STORE_LINKS = [
  {
    icon: <svg width="22" height="26" viewBox="0 0 18 22" fill="#fff" aria-hidden="true"><path d="M14.5 11.5c0-2 1.5-3 1.6-3.1-.9-1.3-2.2-1.5-2.7-1.5-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.6-1.3.02-2.5.75-3.1 1.9-1.4 2.4-.3 5.9 1 7.8.7.9 1.5 2 2.4 1.9.9-.03 1.3-.6 2.5-.6s1.5.6 2.5.6c1 0 1.7-.9 2.3-1.9.7-1.1 1-2.2 1-2.3-.1-.04-2.2-.8-2.2-3.4M12.5 4.6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.5-.9 1.4-.8 2.3.9.1 1.8-.4 2.3-1z" /></svg>,
    labKey: 'app.download',
    name: 'App Store',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 20 22" fill="none" aria-hidden="true"><path d="M3 2.5v17l8.5-8.5z" fill="#7c9bff" /><path d="M3 2.5l8.5 8.5L15 7.5z" fill="#34d399" /><path d="M3 19.5L11.5 11 15 14.5z" fill="#fbbf24" /><path d="M15 7.5l-3.5 3.5 3.5 3.5 3-2c1-.7 1-1.3 0-2z" fill="#f87171" /></svg>,
    labKey: 'app.get_it',
    name: 'Google Play',
  },
];

export default function NewsBanner() {
  const { t } = useLanguage();
  const qrRef = useRef(null);

  useEffect(() => {
    const g = qrRef.current;
    if (!g) return;
    const ns = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 144; i++) {
      const r = Math.floor(i / 12), c = i % 12;
      if (((r * c + r + c * 7) % 3) === 0) {
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', c * 8 + 2);
        rect.setAttribute('y', r * 8 + 2);
        rect.setAttribute('width', 6);
        rect.setAttribute('height', 6);
        rect.setAttribute('fill', '#0b1f3a');
        g.appendChild(rect);
      }
    }
  }, []);

  return (
    <section className="bg-navy-blue text-on-dark py-14 lg:py-[72px] transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
        <div>
          <div className="text-[11px] tracking-[0.18em] text-blue-glow mb-4 lg:mb-[18px] font-semibold">{t('news.breaking')}</div>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.1] font-bold tracking-[-0.035em] mb-4 lg:mb-[18px]">
            {t('news.h2')}
          </h2>
          <p className="text-[15px] lg:text-[16.5px] leading-[1.6] text-white/65 max-w-[540px]">
            {t('news.body')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-6 lg:gap-7 lg:justify-end">
          <div className="flex flex-row sm:flex-col gap-3 lg:gap-[10px]">
            {STORE_LINKS.map(s => (
              <a key={s.name} className="flex items-center gap-3 px-4 lg:px-[22px] py-3 lg:py-[14px] bg-white/[0.06] border border-white/[0.12] min-w-[160px] lg:min-w-[200px] rounded-[8px] text-on-dark" href="#">
                {s.icon}
                <div>
                  <div className="text-[10px] text-white/45 tracking-[0.06em]">{t(s.labKey)}</div>
                  <div className="text-[14px] lg:text-[16px] font-semibold">{s.name}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-[14px] sm:pl-6 sm:border-l sm:border-white/[0.15]">
            <div className="bg-white p-[10px] rounded-[4px]">
              <svg viewBox="0 0 100 100" width="80" height="80">
                <rect width="100" height="100" fill="#fff" />
                <g ref={qrRef}></g>
                <rect x="4" y="4" width="22" height="22" fill="none" stroke="#0b1f3a" strokeWidth="3" />
                <rect x="10" y="10" width="10" height="10" fill="#0b1f3a" />
                <rect x="74" y="4" width="22" height="22" fill="none" stroke="#0b1f3a" strokeWidth="3" />
                <rect x="80" y="10" width="10" height="10" fill="#0b1f3a" />
                <rect x="4" y="74" width="22" height="22" fill="none" stroke="#0b1f3a" strokeWidth="3" />
                <rect x="10" y="80" width="10" height="10" fill="#0b1f3a" />
              </svg>
            </div>
            <div className="text-[12px] tracking-[0.08em] leading-[1.5] font-medium">
              {t('news.scan')}<br /><span className="text-white/45 text-[10px]">iOS &amp; Android · v3.2.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
