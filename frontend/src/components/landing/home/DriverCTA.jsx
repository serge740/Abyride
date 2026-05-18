import { useLanguage } from '../../../contexts/LanguageContext';

export default function DriverCTA() {
  const { t } = useLanguage();
  return (
    <section className="bg-navy text-on-dark py-16 lg:py-24 transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-12 items-end">
        <div>
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/45 font-semibold">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">VII</span>
            {t('driver.eyebrow')}
          </div>
          <h2 className="text-[32px] sm:text-[44px] lg:text-[60px] leading-[1.04] tracking-[-0.04em] font-bold my-5 lg:my-6">
            {t('driver.h2_1')}<br />{t('driver.h2_2')} <em className="italic text-blue-glow">{t('driver.h2_em')}</em>.
          </h2>
          <p className="text-[15px] lg:text-[17px] leading-[1.6] text-white/65 max-w-[520px]">
            {t('driver.body')}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mt-7 lg:mt-9">
            <a className="bg-white text-[#0b1f3a] px-[22px] sm:px-[26px] py-3.5 lg:py-4 text-[14px] lg:text-[15px] font-semibold rounded-[8px] whitespace-nowrap" href="#">{t('driver.cta')}</a>
            <span className="text-[11px] text-white/45 max-w-[280px] leading-[1.5]">{t('driver.disclaimer')}</span>
          </div>
        </div>
        <div className="flex gap-8 sm:gap-12 pb-0 lg:pb-3 flex-wrap">
          <div>
            <div className="text-[44px] sm:text-[56px] lg:text-[64px] leading-none font-bold tracking-[-0.045em]">$1,240</div>
            <div className="text-[11px] tracking-[0.14em] text-white/45 mt-2 lg:mt-3 uppercase max-w-[200px] font-semibold">{t('driver.stat1_label')}</div>
          </div>
          <div>
            <div className="text-[44px] sm:text-[56px] lg:text-[64px] leading-none font-bold tracking-[-0.045em]">+38<span className="text-[24px] sm:text-[32px] font-semibold">%</span></div>
            <div className="text-[11px] tracking-[0.14em] text-white/45 mt-2 lg:mt-3 uppercase max-w-[200px] font-semibold">{t('driver.stat2_label')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
