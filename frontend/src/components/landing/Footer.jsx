import { useLanguage } from '../../contexts/LanguageContext';
import logo from '../../assets/images/abyride_logo.png';

const SocialX    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.738-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const SocialFb   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>;
const SocialIg   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const SocialLi   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const SocialYt   = () => <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>;

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-navy-deep text-on-dark pt-14 lg:pt-20 transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.4fr] gap-12 lg:gap-16 pb-12 lg:pb-16 border-b border-white/[0.12]">
          <div>
            <div className="mb-5">
              <img src={logo} alt="Abyride" className="h-16 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-[14px] text-white/65 leading-[1.55] max-w-[280px] mb-6 lg:mb-7">{t('footer.tagline')}</p>
            <div className="border-t border-white/[0.12] pt-5">
              <div className="text-[10px] tracking-[0.16em] text-white/45 uppercase font-semibold">{t('footer.dispatch')}</div>
              <a className="text-[20px] lg:text-[22px] block mt-[6px] font-bold tracking-[-0.02em]" href="tel:+16166337026">+1 (616) 633‑7026</a>
              <a className="text-[14px] lg:text-[15px] block mt-[2px] font-semibold text-white/65 tracking-[-0.01em]" href="tel:+2507983042">+250 798 304 2</a>
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
            {[
              { Icon: SocialX,  label: 'X (Twitter)'  },
              { Icon: SocialFb, label: 'Facebook'      },
              { Icon: SocialIg, label: 'Instagram'     },
              { Icon: SocialLi, label: 'LinkedIn'      },
              { Icon: SocialYt, label: 'YouTube'       },
            ].map(({ Icon, label }) => (
              <a key={label} aria-label={label} className="w-[30px] h-[30px] border border-white/[0.12] flex items-center justify-center text-white/65 rounded-[4px] hover:text-white hover:border-white/30 transition-colors" href="#">
                <Icon />
              </a>
            ))}
          </div>
          <div className="tracking-[0.14em] font-semibold">EN · FR · AR · ES · AM</div>
        </div>
      </div>
    </footer>
  );
}
