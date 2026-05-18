import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-navy-deep text-on-dark pt-14 lg:pt-20 transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.4fr] gap-12 lg:gap-16 pb-12 lg:pb-16 border-b border-white/[0.12]">
          <div>
            <div className="mb-4">
              <svg width="48" height="48" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <rect width="34" height="34" rx="6" fill="#fff" />
                <path d="M9 24 L17 8 L25 24" stroke="#0b1f3a" strokeWidth="2.4" fill="none" />
                <path d="M13 18 H21" stroke="#0b1f3a" strokeWidth="2.4" />
                <circle cx="17" cy="27" r="1.6" fill="#2546b8" />
              </svg>
            </div>
            <div className="text-[26px] lg:text-[32px] tracking-[-0.03em] mb-3 font-bold italic">Abyride<span className="text-blue-glow">.</span></div>
            <p className="text-[14px] text-white/65 leading-[1.55] max-w-[280px] mb-6 lg:mb-7">{t('footer.tagline')}</p>
            <div className="border-t border-white/[0.12] pt-5">
              <div className="text-[10px] tracking-[0.16em] text-white/45 uppercase font-semibold">{t('footer.dispatch')}</div>
              <a className="text-[22px] lg:text-[26px] block mt-[6px] font-bold tracking-[-0.02em]" href="tel:+18338297339">(833) 829‑7339</a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { h: 'Services', links: ['Medical transport', 'Wheelchair‑accessible vans', 'Airport pickup', 'Language translation', 'Everyday rides', 'Group & corporate'] },
              { h: 'Explore', links: ['Our story', 'Our drivers', 'Cities served', 'Our fleet', 'Press', 'Field notes'] },
              { h: 'Help', links: ['Book a ride', 'For caregivers', 'For drivers', 'Insurance billing', 'Lost & found', 'Contact dispatch'] },
              { h: 'Legal', links: ['Terms', 'Privacy', 'Accessibility', 'HIPAA notice', 'MDHHS license #4421', 'Copyright'] },
            ].map(col => (
              <div key={col.h}>
                <div className="text-[11px] tracking-[0.18em] text-white/45 uppercase mb-4 lg:mb-[18px] pb-[10px] border-b border-white/[0.12] font-bold">{col.h}</div>
                <ul className="flex flex-col gap-[10px]">
                  {col.links.map(l => <li key={l}><a className="text-[13px] lg:text-[14px] text-white/65" href="#">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="py-8 lg:py-14 overflow-hidden" aria-hidden="true">
          <svg viewBox="0 0 1320 200" preserveAspectRatio="xMaxYMax meet" className="w-full h-auto">
            <text x="0" y="180" fontFamily="Poppins, sans-serif" fontSize="240" fontStyle="italic" fontWeight="800" fill="#fff" letterSpacing="-12" opacity="0.9">
              Abyride<tspan fill="#7c9bff">.</tspan>
            </text>
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 lg:py-6 pb-7 lg:pb-9 border-t border-white/[0.12] text-[11px] text-white/45 tracking-[0.04em] gap-4">
          <div>{t('footer.copyright')}</div>
          <div className="flex gap-2">
            {['Tw', 'Fb', 'Ig', 'Li', 'Yt'].map(s => (
              <a key={s} className="w-[30px] h-[30px] border border-white/[0.12] flex items-center justify-center text-[11px] rounded-[4px]" href="#">{s}</a>
            ))}
          </div>
          <div className="tracking-[0.14em] font-semibold">EN · FR · AR · ES · AM</div>
        </div>
      </div>
    </footer>
  );
}
