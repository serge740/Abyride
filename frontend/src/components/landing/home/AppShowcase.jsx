import { useLanguage } from '../../../contexts/LanguageContext';

export default function AppShowcase() {
  const { t } = useLanguage();

  const FEATURES = [
    { l: 'a.', title: t('app.feat_a_title'), desc: t('app.feat_a_desc') },
    { l: 'b.', title: t('app.feat_b_title'), desc: t('app.feat_b_desc') },
    { l: 'c.', title: t('app.feat_c_title'), desc: t('app.feat_c_desc') },
    { l: 'd.', title: t('app.feat_d_title'), desc: t('app.feat_d_desc') },
    { l: 'e.', title: t('app.feat_e_title'), desc: t('app.feat_e_desc') },
    { l: 'f.', title: t('app.feat_f_title'), desc: t('app.feat_f_desc') },
  ];

  const RECENT = [
    { icon: '✚', title: t('app.phone_recent_1_title'), desc: t('app.phone_recent_1_desc'), badge: t('app.phone_recent_1_badge') },
    { icon: '✈', title: t('app.phone_recent_2_title'), desc: t('app.phone_recent_2_desc') },
    { icon: '⌂', title: t('app.phone_recent_3_title'), desc: t('app.phone_recent_3_desc') },
  ];

  const QUICK_ACTIONS = [
    { i: '🚗', l: t('app.quick_ride') },
    { i: '✚', l: t('app.quick_medical') },
    { i: '♿', l: t('app.quick_access') },
    { i: '📅', l: t('app.quick_schedule') },
  ];

  return (
    <section className="bg-navy text-on-dark relative overflow-hidden py-16 lg:py-[120px] transition-colors duration-300">
      <div className="app-bg-grid"></div>
      <div className="px-5 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 relative z-[1] items-start">
        <div>
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/65 font-semibold">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">III</span>
            {t('app.eyebrow')}
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.02] tracking-[-0.04em] font-bold mt-5 lg:mt-6 mb-5 lg:mb-7">
            {t('app.h2_1')}<br />{t('app.h2_2')}<br />{t('app.h2_3')}<br /><em className="italic text-blue-glow">{t('app.h2_em')}</em> {t('app.h2_4')}
          </h2>
          <p className="text-[15px] lg:text-[17px] leading-[1.6] text-white/65 max-w-[520px]">
            {t('app.body')}
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-5 lg:gap-y-7 mt-10 lg:mt-14 pt-7 lg:pt-8 border-t border-white/[0.12]">
            {FEATURES.map(f => (
              <div key={f.l} className="flex gap-3">
                <span className="text-[18px] italic text-blue-glow font-bold leading-none mt-0.5 flex-shrink-0">{f.l}</span>
                <div>
                  <div className="text-[14px] lg:text-[15px] font-semibold text-on-dark">{f.title}</div>
                  <div className="text-[12px] lg:text-[13px] text-white/65 mt-1 leading-[1.5]">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Store buttons */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-[14px] mt-10 lg:mt-14">
            <div className="text-[11px] tracking-[0.16em] text-white/45 uppercase font-semibold w-full sm:w-auto">{t('app.available_on')}</div>
            <a className="flex items-center gap-3 px-[16px] lg:px-[18px] py-[10px] border border-white/[0.12] bg-white/[0.03] text-on-dark rounded-[6px]" href="#">
              <svg width="18" height="22" viewBox="0 0 18 22" fill="#fff" aria-hidden="true"><path d="M14.5 11.5c0-2 1.5-3 1.6-3.1-.9-1.3-2.2-1.5-2.7-1.5-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.6-1.3.02-2.5.75-3.1 1.9-1.4 2.4-.3 5.9 1 7.8.7.9 1.5 2 2.4 1.9.9-.03 1.3-.6 2.5-.6s1.5.6 2.5.6c1 0 1.7-.9 2.3-1.9.7-1.1 1-2.2 1-2.3-.1-.04-2.2-.8-2.2-3.4M12.5 4.6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.5-.9 1.4-.8 2.3.9.1 1.8-.4 2.3-1z" /></svg>
              <div><div className="text-[10px] text-white/45 tracking-[0.06em]">{t('app.download')}</div><div className="text-[15px] font-semibold">App Store</div></div>
            </a>
            <a className="flex items-center gap-3 px-[16px] lg:px-[18px] py-[10px] border border-white/[0.12] bg-white/[0.03] text-on-dark rounded-[6px]" href="#">
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
                <path d="M3 2.5v17l8.5-8.5z" fill="#7c9bff" />
                <path d="M3 2.5l8.5 8.5L15 7.5z" fill="#34d399" />
                <path d="M3 19.5L11.5 11 15 14.5z" fill="#fbbf24" />
                <path d="M15 7.5l-3.5 3.5 3.5 3.5 3-2c1-.7 1-1.3 0-2z" fill="#f87171" />
              </svg>
              <div><div className="text-[10px] text-white/45 tracking-[0.06em]">{t('app.get_it')}</div><div className="text-[15px] font-semibold">Google Play</div></div>
            </a>
          </div>

          {/* App stats */}
          <div className="flex items-end gap-4 lg:gap-6 mt-10 lg:mt-12 pt-7 lg:pt-8 border-t border-white/[0.12] flex-wrap">
            <div><div className="text-[26px] lg:text-[32px] leading-none font-bold tracking-[-0.03em]">50K+</div><div className="text-[10px] tracking-[0.16em] text-white/45 mt-2 uppercase font-semibold">{t('app.stat_downloads')}</div></div>
            <div className="w-px h-9 bg-white/[0.12]"></div>
            <div><div className="text-[26px] lg:text-[32px] leading-none font-bold tracking-[-0.03em]">4.9 ★</div><div className="text-[10px] tracking-[0.16em] text-white/45 mt-2 uppercase font-semibold">{t('app.stat_rating')}</div></div>
            <div className="w-px h-9 bg-white/[0.12]"></div>
            <div><div className="text-[26px] lg:text-[32px] leading-none font-bold tracking-[-0.03em]">24/7</div><div className="text-[10px] tracking-[0.16em] text-white/45 mt-2 uppercase font-semibold">{t('app.stat_support')}</div></div>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center lg:justify-center items-start pt-4 lg:pt-0">
          <div className="w-[280px] sm:w-[300px] lg:w-[320px] h-[575px] sm:h-[615px] lg:h-[660px] bg-phone-dark rounded-[44px] p-[9px] shadow-[0_40px_100px_-20px_rgba(124,155,255,0.25),0_0_0_1.5px_rgba(255,255,255,0.08)] relative">
            <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[110px] h-7 bg-phone-dark rounded-full z-[3] flex items-center justify-center">
              <div className="w-[50px] h-1 bg-white/20 rounded-sm"></div>
            </div>
            <div className="w-full h-full bg-phone-screen rounded-[36px] overflow-hidden flex flex-col text-[#0b1f3a]">
              {/* Status bar */}
              <div className="flex justify-between items-center px-7 pt-[18px] pb-[6px] text-[13px] font-semibold">
                <span>9:41</span>
                <div className="flex gap-[5px] items-center">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="#0b1f3a" aria-hidden="true"><path d="M1 8h2V6H1zm4 0h2V4H5zm4 0h2V2H9zm4 0h2V0h-2z" /></svg>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="#0b1f3a" aria-hidden="true"><path d="M7 0a8 8 0 00-7 4l1 1a6 6 0 0112 0l1-1a8 8 0 00-7-4zm0 3a4 4 0 00-3 2l1 1a2.5 2.5 0 014 0l1-1a4 4 0 00-3-2zm0 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" /></svg>
                  <span className="phone-battery w-[22px] h-[11px] border-[1.2px] border-[#0b1f3a] rounded-[3px] relative inline-block"></span>
                </div>
              </div>
              {/* Body */}
              <div className="flex-1 px-5 pb-6 flex flex-col">
                <div className="py-3 pb-[18px]">
                  <div className="text-[10px] tracking-[0.16em] text-[#8a8d96] uppercase font-semibold">{t('app.phone_date')}</div>
                  <div className="text-[22px] leading-[1.15] mt-[6px] font-bold tracking-[-0.025em]">{t('app.phone_greeting')}</div>
                </div>
                <div className="flex items-center gap-[10px] px-[14px] py-[13px] bg-white border border-[#e6e7eb] rounded-[6px]">
                  <span className="text-[16px] text-[#4b5b75]">⌕</span>
                  <span className="text-[14px] text-[#8a8d96]">{t('app.phone_search_placeholder')}</span>
                </div>
                <div className="mt-[18px]">
                  <div className="text-[9px] tracking-[0.18em] text-[#8a8d96] pt-1 pb-[10px] font-semibold uppercase">{t('app.phone_recent_label')}</div>
                  {RECENT.map(item => (
                    <div key={item.title} className="flex items-center gap-3 py-3 border-t border-[#e6e7eb]">
                      <div className="w-8 h-8 bg-[#eef0f3] text-[#2546b8] flex items-center justify-center text-[14px] rounded-[4px] flex-shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-semibold truncate">{item.title}</div>
                        <div className="text-[11px] text-[#4b5b75] mt-0.5">{item.desc}</div>
                      </div>
                      {item.badge && <div className="text-[9px] tracking-[0.1em] text-[#2546b8] border border-[#2546b8] px-[6px] py-[3px] font-bold rounded-[3px] flex-shrink-0">{item.badge}</div>}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-[6px] mt-auto pt-[14px] border-t border-[#e6e7eb]">
                  {QUICK_ACTIONS.map(a => (
                    <div key={a.l} className="bg-white border border-[#e6e7eb] pt-3 pb-[10px] text-center rounded-[4px]">
                      <div className="text-[18px] mb-1">{a.i}</div>
                      <div className="text-[10px] tracking-[0.08em] uppercase font-semibold">{a.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
