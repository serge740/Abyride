import { useLanguage } from '../../../contexts/LanguageContext';

export default function PartnersSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-surface-2 border-t border-b border-rule text-ink transition-colors duration-300">
      <div className="px-5 sm:px-10 lg:px-16 py-5 lg:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-10">
        <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold flex-shrink-0">
          <span style={{ color: 'var(--c-cobalt-hi)' }}>↳</span>
          {t('partners.label')}
        </div>
        <div className="flex items-center gap-5 lg:gap-7 flex-wrap">
          {['MDHHS', 'Henry Ford Health', 'NMA', 'NHA', 'Molina Healthcare', 'Meridian', 'DMC'].map((name, i, arr) => (
            <span key={name} className="flex items-center gap-5 lg:gap-7">
              <span className="text-[15px] sm:text-[18px] text-ink tracking-[-0.02em] font-bold italic opacity-[0.85]">{name}</span>
              {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-rule flex-shrink-0 hidden sm:block"></span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
