import { useLanguage } from '../../../contexts/LanguageContext';

export default function WhyAbyride() {
  const { t } = useLanguage();
  return (
    <section className="bg-surface py-16 lg:py-[120px] transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-14 mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold lg:pt-[14px]">
            <span className="text-accent text-[18px] italic font-bold tracking-normal">II</span>
            {t('why.eyebrow')}
          </div>
          <div>
            <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.08] tracking-[-0.035em] font-bold mb-3 lg:mb-4">{t('why.h2')}</h2>
            <p className="text-[15px] lg:text-[16px] leading-[1.55] text-ink-soft max-w-[560px]">{t('why.body')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 01 — dark */}
          <div className="bg-card-dark text-white px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px]">
            <div className="text-[32px] leading-none italic font-bold text-white/55">01</div>
            <div className="relative h-[140px] lg:h-[200px] mt-4 mb-auto">
              <svg className="w-full h-full opacity-[0.32]" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs><pattern id="htn-01" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" /></pattern></defs>
                <rect width="240" height="240" fill="url(#htn-01)" />
                <circle cx="120" cy="130" r="60" fill="currentColor" opacity="0.6" />
              </svg>
            </div>
            <h3 className="text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.025em] font-bold mt-5 lg:mt-6 mb-[10px]">{t('why.01_title')}</h3>
            <p className="text-[13.5px] leading-[1.5] opacity-[0.85] mb-4">{t('why.01_body')}</p>
            <a className="text-[12px] font-semibold tracking-[0.04em] border-b border-white/60 pb-0.5 self-start" href="#">{t('why.read_more')}</a>
          </div>
          {/* Card 02 — cobalt */}
          <div className="bg-card-cobalt text-white px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px]">
            <div className="text-[32px] leading-none italic font-bold text-white/55">02</div>
            <div className="relative h-[140px] lg:h-[200px] mt-4 mb-auto">
              <svg className="w-full h-full opacity-[0.32]" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs><pattern id="htn-02" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" /></pattern></defs>
                <rect width="240" height="240" fill="url(#htn-02)" />
                <path d="M40 200 Q120 60 200 200" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.9" />
              </svg>
            </div>
            <h3 className="text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.025em] font-bold mt-5 lg:mt-6 mb-[10px]">{t('why.02_title')}</h3>
            <p className="text-[13.5px] leading-[1.5] opacity-[0.85] mb-4">{t('why.02_body')}</p>
            <a className="text-[12px] font-semibold tracking-[0.04em] border-b border-white/60 pb-0.5 self-start" href="#">{t('why.read_more')}</a>
          </div>
          {/* Card 03 — paper */}
          <div className="bg-surface-2 text-ink px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px]">
            <div className="text-[32px] leading-none italic font-bold text-accent">03</div>
            <div className="relative h-[140px] lg:h-[200px] mt-4 mb-auto">
              <svg className="w-full h-full opacity-[0.32]" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs><pattern id="htn-03" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" /></pattern></defs>
                <rect width="240" height="240" fill="url(#htn-03)" />
                <path d="M120 50 V200 M70 125 H170" stroke="currentColor" strokeWidth="6" opacity="0.9" />
              </svg>
            </div>
            <h3 className="text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.025em] font-bold mt-5 lg:mt-6 mb-[10px]">{t('why.03_title')}</h3>
            <p className="text-[13.5px] leading-[1.5] opacity-[0.85] mb-4">{t('why.03_body')}</p>
            <a className="text-[12px] font-semibold tracking-[0.04em] border-b border-ink pb-0.5 self-start" href="#">{t('why.read_more')}</a>
          </div>
          {/* Card 04 — ink */}
          <div className="bg-ink text-surface px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px]">
            <div className="text-[32px] leading-none italic font-bold text-white/55">04</div>
            <div className="relative h-[140px] lg:h-[200px] mt-4 mb-auto">
              <svg className="w-full h-full opacity-[0.32]" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs><pattern id="htn-04" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" /></pattern></defs>
                <rect width="240" height="240" fill="url(#htn-04)" />
                <g opacity="0.7" fill="currentColor">
                  <circle cx="90" cy="100" r="22" />
                  <circle cx="150" cy="100" r="22" />
                  <path d="M50 200 Q90 150 120 150 Q150 150 190 200 Z" />
                </g>
              </svg>
            </div>
            <h3 className="text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.025em] font-bold mt-5 lg:mt-6 mb-[10px]">{t('why.04_title')}</h3>
            <p className="text-[13.5px] leading-[1.5] opacity-[0.85] mb-4">{t('why.04_body')}</p>
            <a className="text-[12px] font-semibold tracking-[0.04em] border-b border-white/60 pb-0.5 self-start" href="#">{t('why.read_more')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
