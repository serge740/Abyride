import { useLanguage } from '../../../contexts/LanguageContext';

const SERVICES = [
  { n: 'S/01', kicker: '● Most requested', title: 'Non‑Emergency Medical', tag: 'On time, on rhythm, on the same schedule every week.', body: 'Dialysis, oncology, rehab. We coordinate directly with your case manager and bill MDHHS / Medicaid / Molina / Meridian — no paperwork on your end.', meta: '~3,200 trips / month' },
  { n: 'S/02', title: 'Wheelchair‑Accessible Vans', tag: 'ADA‑compliant fleet across six cities.', body: 'Side & rear ramps, dual‑position lifts, four‑point securement. Every driver is trained in safe transfer technique and re‑certified annually.', meta: '68 vans · all certified' },
  { n: 'S/03', title: 'Airport Pickup', tag: 'Flight‑tracked rides to DTW, GRR & FNT.', body: 'Meet‑and‑greet at baggage claim. Multilingual drivers on request. Flat fares quoted at booking — no surge, no surprises if your flight is late.', meta: '4 airports served' },
  { n: 'S/04', kicker: '● Unique to Abyride', title: 'Live Language Translation', tag: 'A driver who speaks your language.', body: 'In‑car interpretation in Amharic, Arabic, Spanish, French, ASL and nine more. On‑demand video interpreter for any other language, billable to medical plans.', meta: '14 languages · live' },
  { n: 'S/05', title: 'Everyday Rides', tag: 'Commutes, errands, the school run.', body: 'Flat‑rate pricing across Detroit, Ann Arbor, Lansing, Flint, Grand Rapids and Dearborn. No surge. Pay through the app or in cash with the driver.', meta: '6 cities live' },
];

export default function ServicesSection() {
  const { t } = useLanguage();
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
