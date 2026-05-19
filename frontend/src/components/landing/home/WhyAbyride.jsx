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
          {/* Card 01 — dark / Secure */}
          <div className="bg-card-dark text-white px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px] overflow-hidden relative">
            <div className="text-[32px] leading-none italic font-bold text-white/55 relative z-[1]">01</div>
            <div className="relative h-[160px] lg:h-[210px] mt-4 mb-auto rounded-[8px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&h=420&fit=crop&auto=format&q=80"
                alt="Trusted professional driver"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-[#0b1f3a]/55 mix-blend-multiply" />
            </div>
            <h3 className="text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.025em] font-bold mt-5 lg:mt-6 mb-[10px]">{t('why.01_title')}</h3>
            <p className="text-[13.5px] leading-[1.5] opacity-[0.85] mb-4">{t('why.01_body')}</p>
            <a className="text-[12px] font-semibold tracking-[0.04em] border-b border-white/60 pb-0.5 self-start" href="#">{t('why.read_more')}</a>
          </div>

          {/* Card 02 — cobalt / Multilingual */}
          <div className="bg-card-cobalt text-white px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px] overflow-hidden relative">
            <div className="text-[32px] leading-none italic font-bold text-white/55 relative z-[1]">02</div>
            <div className="relative h-[160px] lg:h-[210px] mt-4 mb-auto rounded-[8px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=420&fit=crop&auto=format&q=80"
                alt="Multilingual communication"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-[#1e3a8a]/50 mix-blend-multiply" />
            </div>
            <h3 className="text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.025em] font-bold mt-5 lg:mt-6 mb-[10px]">{t('why.02_title')}</h3>
            <p className="text-[13.5px] leading-[1.5] opacity-[0.85] mb-4">{t('why.02_body')}</p>
            <a className="text-[12px] font-semibold tracking-[0.04em] border-b border-white/60 pb-0.5 self-start" href="#">{t('why.read_more')}</a>
          </div>

          {/* Card 03 — paper / Health */}
          <div className="bg-surface-2 text-ink px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px] overflow-hidden relative">
            <div className="text-[32px] leading-none italic font-bold text-accent relative z-[1]">03</div>
            <div className="relative h-[160px] lg:h-[210px] mt-4 mb-auto rounded-[8px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=420&fit=crop&auto=format&q=80"
                alt="Medical transport service"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
            </div>
            <h3 className="text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.025em] font-bold mt-5 lg:mt-6 mb-[10px]">{t('why.03_title')}</h3>
            <p className="text-[13.5px] leading-[1.5] opacity-[0.85] mb-4">{t('why.03_body')}</p>
            <a className="text-[12px] font-semibold tracking-[0.04em] border-b border-ink pb-0.5 self-start" href="#">{t('why.read_more')}</a>
          </div>

          {/* Card 04 — ink / Family */}
          <div className="bg-ink text-surface px-6 pt-6 pb-7 min-h-[360px] lg:min-h-[480px] flex flex-col rounded-[10px] overflow-hidden relative">
            <div className="text-[32px] leading-none italic font-bold text-white/55 relative z-[1]">04</div>
            <div className="relative h-[160px] lg:h-[210px] mt-4 mb-auto rounded-[8px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1531983955800-cbec30f15bff?w=600&h=420&fit=crop&auto=format&q=80"
                alt="Family using Abyride together"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-[#0b1f3a]/50 mix-blend-multiply" />
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
