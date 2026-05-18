import { useLanguage } from '../../../contexts/LanguageContext';

export default function ServicesSection() {
  const { t } = useLanguage();

  const SERVICES = [
    {
      n: t('services.s01.n'),
      kicker: t('services.s01.kicker'),
      title: t('services.s01.title'),
      tag: t('services.s01.tag'),
      body: t('services.s01.body'),
      meta: t('services.s01.meta'),
    },
    {
      n: t('services.s02.n'),
      title: t('services.s02.title'),
      tag: t('services.s02.tag'),
      body: t('services.s02.body'),
      meta: t('services.s02.meta'),
    },
    {
      n: t('services.s03.n'),
      title: t('services.s03.title'),
      tag: t('services.s03.tag'),
      body: t('services.s03.body'),
      meta: t('services.s03.meta'),
    },
    {
      n: t('services.s04.n'),
      kicker: t('services.s04.kicker'),
      title: t('services.s04.title'),
      tag: t('services.s04.tag'),
      body: t('services.s04.body'),
      meta: t('services.s04.meta'),
    },
    {
      n: t('services.s05.n'),
      title: t('services.s05.title'),
      tag: t('services.s05.tag'),
      body: t('services.s05.body'),
      meta: t('services.s05.meta'),
    },
  ];

  return (
    <section className="bg-surface text-ink pt-16 lg:pt-[120px] transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 lg:gap-14 mb-10 lg:mb-16 items-start">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold lg:pt-4">
            <span className="text-accent text-[18px] italic font-bold tracking-normal">I</span>
            <span>{t('services.eyebrow')}</span>
            <span className="text-muted font-normal">{t('services.eyebrow_sub')}</span>
          </div>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[56px] leading-[1.05] tracking-[-0.035em] font-bold">
            {t('services.h2_1')}<br className="hidden sm:block" />{t('services.h2_2')}<br className="hidden sm:block" />{t('services.h2_3')} <em className="italic text-accent font-bold">{t('services.h2_em')}</em>.
          </h2>
        </div>

        <ol className="border-t border-ink">
          {SERVICES.map(s => (
            <li key={s.n} className="grid grid-cols-1 lg:grid-cols-[70px_280px_1fr_180px] gap-3 lg:gap-8 py-6 lg:py-9 border-b border-rule">
              <div className="text-[11px] tracking-[0.14em] text-ink-soft font-semibold lg:pt-[6px]">{s.n}</div>
              <div>
                {s.kicker && <div className="text-[10px] tracking-[0.16em] text-accent uppercase mb-2 lg:mb-[10px] font-semibold">{s.kicker}</div>}
                <h3 className="text-[22px] sm:text-[26px] lg:text-[32px] leading-[1.1] tracking-[-0.03em] font-bold">{s.title}</h3>
                <div className="text-[14px] lg:text-[15px] text-ink-soft mt-[8px] lg:mt-[10px] italic">{s.tag}</div>
              </div>
              <p className="text-[14px] lg:text-[14.5px] leading-[1.6] text-ink-soft">{s.body}</p>
              <div className="flex lg:flex-col gap-4 lg:gap-3 lg:items-end lg:text-right">
                <div className="text-[11px] tracking-[0.14em] text-muted uppercase font-semibold">{s.meta}</div>
                <a className="text-[13px] text-ink font-semibold border-b border-ink pb-0.5 whitespace-nowrap" href="#">{t('services.learn_more')}</a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
