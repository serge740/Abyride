import { useLanguage } from '../../../contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-surface text-ink transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 pt-10 lg:pt-[72px] px-5 sm:px-10 lg:px-16 pb-16 lg:pb-24 items-start">

        {/* Left */}
        <div className="pt-2 lg:pt-6">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
            <span className="text-accent text-[14px]">*</span>
            <span>{t('hero.eyebrow')}</span>
          </div>
          <h1 className="text-[40px] sm:text-[56px] lg:text-[80px] leading-none tracking-[-0.04em] font-bold mt-5 lg:mt-6 mb-5 lg:mb-7">
            {t('hero.h1_1')}<br />{t('hero.h1_2')}<br /><em className="italic text-accent font-bold">{t('hero.h1_3')}</em>.
          </h1>
          <p className="text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.55] text-ink-soft max-w-[540px]">
            {t('hero.body')}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-8 lg:mt-10">
            <a className="bg-ink text-surface px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2" href="#">
              {t('hero.cta_primary')} <span>→</span>
            </a>
            <a className="text-ink text-[14px] font-medium border-b border-ink pb-0.5" href="#">{t('hero.cta_secondary')}</a>
          </div>
          <div className="flex gap-6 sm:gap-10 mt-10 lg:mt-16 pt-6 lg:pt-8 border-t border-rule flex-wrap">
            <div>
              <div className="text-[28px] sm:text-[36px] leading-none font-bold tracking-[-0.03em]">4.9<span className="text-[16px] sm:text-[18px] text-ink-soft ml-1">★</span></div>
              <div className="text-[10px] tracking-[0.14em] text-muted mt-2 uppercase font-medium">{t('hero.stat_rating_label')}</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[36px] leading-none font-bold tracking-[-0.03em]">99.9<span className="text-[16px] sm:text-[18px] text-ink-soft">%</span></div>
              <div className="text-[10px] tracking-[0.14em] text-muted mt-2 uppercase font-medium">{t('hero.stat_ontime_label')}</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[36px] leading-none font-bold tracking-[-0.03em]">24 / 7</div>
              <div className="text-[10px] tracking-[0.14em] text-muted mt-2 uppercase font-medium">{t('hero.stat_dispatch_label')}</div>
            </div>
          </div>
        </div>

        {/* Right — photo + booking widget */}
        <div className="relative">
          <div className="relative w-full h-[280px] sm:h-[420px] lg:h-[720px] rounded-[8px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1559839734-2851eb3e7b7b?w=900&h=720&fit=crop&auto=format&q=80"
              alt="Abyride driver assisting a passenger into an accessible van in Detroit"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            {/* Duotone overlay to match brand palette */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a]/60 via-[#1e3a8a]/30 to-transparent mix-blend-multiply" />
            <div className="absolute top-4 left-4 z-[2] text-[10px] tracking-[0.14em] text-white/90 bg-[rgba(11,31,58,0.55)] backdrop-blur-[6px] px-[10px] py-[6px] uppercase font-medium rounded-[3px]">
              <span className="text-accent">●</span> Detroit, Michigan
            </div>
          </div>

          {/* Booking widget */}
          <div className="lg:absolute lg:-bottom-14 lg:-left-14 w-full lg:w-[460px] bg-surface border border-rule p-4 sm:p-[22px] shadow-[0_30px_60px_-20px_rgba(11,31,58,0.35)] rounded-[12px] mt-4 lg:mt-0">
            <div className="flex justify-between items-center mb-4 gap-3">
              <div className="text-[16px] sm:text-[18px] leading-[1.1] tracking-[-0.02em] font-bold italic">{t('widget.title')}</div>
              <div className="flex text-[10px] tracking-[0.1em] uppercase font-semibold flex-shrink-0">
                <span className="px-[9px] py-[5px] text-ink bg-surface-2 rounded-[4px]">{t('widget.now')}</span>
                <span className="px-[9px] py-[5px] text-muted rounded-[4px] cursor-pointer">{t('widget.schedule')}</span>
                <span className="hidden sm:inline px-[9px] py-[5px] text-muted rounded-[4px] cursor-pointer">{t('widget.recurring')}</span>
              </div>
            </div>
            <div className="flex items-center gap-[14px] px-[14px] py-3 border-t border-rule">
              <span className="w-2 h-2 rounded-full bg-ink flex-shrink-0"></span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] tracking-[0.14em] text-muted uppercase font-semibold">{t('widget.pickup')}</div>
                <div className="text-[13px] sm:text-[14px] text-ink mt-[3px] font-medium truncate">Cass Tech HS, 2501 Second Ave, Detroit</div>
              </div>
            </div>
            <div className="flex items-center gap-[14px] px-[14px] py-3 border-t border-rule">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] tracking-[0.14em] text-muted uppercase font-semibold">{t('widget.dropoff')}</div>
                <div className="text-[13px] sm:text-[14px] text-ink mt-[3px] font-medium truncate">Henry Ford Hospital · 2799 W Grand Blvd</div>
              </div>
              <div className="text-[10px] text-accent tracking-[0.06em] font-semibold flex-shrink-0">{t('widget.add_stop')}</div>
            </div>
            <div className="flex flex-wrap gap-[6px] pt-[14px] border-t border-rule">
              <span className="text-[12px] px-3 py-[7px] border border-rule text-ink-soft font-medium rounded-[4px] cursor-pointer">{t('widget.standard')}</span>
              <span className="text-[12px] px-3 py-[7px] bg-ink text-surface border border-ink font-medium rounded-[4px] cursor-pointer">{t('widget.medical_badge')}</span>
              <span className="text-[12px] px-3 py-[7px] border border-rule text-ink-soft font-medium rounded-[4px] cursor-pointer">{t('widget.accessible')}</span>
            </div>
            <button className="w-full mt-[14px] bg-accent text-white border-0 px-4 py-[14px] text-[14px] font-semibold flex justify-between items-center rounded-[8px]">
              {t('widget.see_drivers')} <span>→</span>
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block h-20"></div>
    </section>
  );
}