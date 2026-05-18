import { useLanguage } from '../../../contexts/LanguageContext';

export default function SuccessSection() {
  const { t } = useLanguage();

  const STATS = [
    { i: t('success.s01.n'), n: t('success.s01.number'), l: t('success.s01.label'), d: t('success.s01.desc') },
    { i: t('success.s02.n'), n: t('success.s02.number'), l: t('success.s02.label'), d: t('success.s02.desc') },
    { i: t('success.s03.n'), n: t('success.s03.number'), l: t('success.s03.label'), d: t('success.s03.desc') },
    { i: t('success.s04.n'), n: t('success.s04.number'), l: t('success.s04.label'), d: t('success.s04.desc') },
  ];

  return (
    <section className="bg-surface text-ink py-16 lg:py-[120px] transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-14 mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold lg:pt-[14px]">
            <span className="text-accent text-[18px] italic font-bold tracking-normal">IV</span>
            {t('success.eyebrow')}
          </div>
          <h2 className="text-[28px] sm:text-[38px] lg:text-[52px] leading-[1.06] tracking-[-0.04em] font-bold">
            {t('success.h2_1')} <em className="italic text-accent font-bold">{t('success.h2_em')}</em>.<br />{t('success.h2_2')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-ink mb-12 lg:mb-20">
          {STATS.map((s, idx) => (
            <div key={s.i} className={`px-4 sm:px-7 py-7 lg:py-10 border-b border-rule lg:border-b-0 ${idx % 2 === 0 ? 'border-r border-rule' : ''} ${idx < 2 ? 'lg:border-r lg:border-rule' : ''}`}>
              <div className="text-[11px] tracking-[0.18em] text-muted uppercase font-semibold">{s.i}</div>
              <div className="text-[36px] sm:text-[48px] lg:text-[64px] leading-none tracking-[-0.045em] font-bold mt-4 lg:mt-6">{s.n}</div>
              <div className="text-[14px] lg:text-[16px] font-semibold mt-3 lg:mt-4">{s.l}</div>
              <div className="text-[13px] lg:text-[13.5px] text-ink-soft mt-[6px] leading-[1.5]">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="max-w-[900px] mx-auto text-center px-4 sm:px-10">
          <div className="text-[80px] sm:text-[120px] leading-[0.5] text-accent italic font-extrabold mb-4">"</div>
          <blockquote className="text-[18px] sm:text-[22px] lg:text-[30px] leading-[1.3] font-medium italic mb-6 lg:mb-8 tracking-[-0.02em]">
            {t('success.quote')}
          </blockquote>
          <div className="text-[12px] tracking-[0.16em] uppercase font-bold">{t('success.quote_name')}</div>
          <div className="text-[13px] text-ink-soft mt-[6px]">{t('success.quote_role')}</div>
        </div>
      </div>
    </section>
  );
}
