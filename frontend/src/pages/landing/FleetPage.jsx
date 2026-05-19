import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Briefcase, Package, Check, Minus, ArrowRight } from 'lucide-react';

const VEHICLES = [
  {
    id: 'x',
    filter: 'standard',
    tag: 'fleet.tag_standard',
    name: 'fleet.x_name',
    tagline: 'fleet.x_tagline',
    feats: ['fleet.x_feat1', 'fleet.x_feat2', 'fleet.x_feat3'],
    passengers: 4,
    suitcases: 3,
    smallCases: 3,
    img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=520&fit=crop&auto=format&q=80',
    imgAlt: 'Black sedan on city street',
    tagColor: 'bg-accent/15 text-accent',
    featured: false,
  },
  {
    id: 'comforts',
    filter: 'premium',
    tag: 'fleet.tag_premium',
    name: 'fleet.comforts_name',
    tagline: 'fleet.comforts_tagline',
    feats: ['fleet.comforts_feat1', 'fleet.comforts_feat2', 'fleet.comforts_feat3'],
    passengers: 4,
    suitcases: 3,
    smallCases: 3,
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=520&fit=crop&auto=format&q=80',
    imgAlt: 'Luxury car interior with leather seats',
    tagColor: 'bg-amber/20 text-amber',
    featured: true,
  },
  {
    id: 'xl',
    filter: 'group',
    tag: 'fleet.tag_group',
    name: 'fleet.xl_name',
    tagline: 'fleet.xl_tagline',
    feats: ['fleet.xl_feat1', 'fleet.xl_feat2', 'fleet.xl_feat3'],
    passengers: 6,
    suitcases: 4,
    smallCases: 4,
    img: 'https://images.unsplash.com/photo-1533473359331-0bfd4e1bdb5c?w=800&h=520&fit=crop&auto=format&q=80',
    imgAlt: 'Large SUV on a road',
    tagColor: 'bg-blue-glow/15 text-blue-glow',
    featured: false,
  },
  {
    id: 'van',
    filter: 'accessible',
    tag: 'fleet.tag_accessible',
    name: 'fleet.van_name',
    tagline: 'fleet.van_tagline',
    feats: ['fleet.van_feat1', 'fleet.van_feat2', 'fleet.van_feat3'],
    passengers: 4,
    suitcases: 2,
    smallCases: 2,
    img: 'https://images.unsplash.com/photo-1559839734-2851eb3e7b7b?w=800&h=520&fit=crop&auto=format&q=80',
    imgAlt: 'Wheelchair accessible van with ramp',
    tagColor: 'bg-green-500/15 text-green-400',
    featured: false,
  },
];

const FILTERS = [
  { key: 'all',        label: 'fleet.filter_all' },
  { key: 'standard',   label: 'fleet.filter_standard' },
  { key: 'premium',    label: 'fleet.filter_premium' },
  { key: 'group',      label: 'fleet.filter_group' },
  { key: 'accessible', label: 'fleet.filter_accessible' },
];

function VehicleCard({ v, t }) {
  return (
    <div className={`group rounded-[16px] overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] flex flex-col ${v.featured ? 'border-accent/40 shadow-[0_0_0_2px_rgba(124,155,255,0.18)]' : 'border-rule bg-surface'}`}>

      <div className="relative h-[220px] sm:h-[240px] overflow-hidden bg-surface-2">
        <img
          src={v.img}
          alt={v.imgAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.08em] backdrop-blur-sm ${v.tagColor}`}>
            {t(v.tag)}
          </span>
        </div>
        {v.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] bg-ink text-surface uppercase">
              Popular
            </span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] text-ink mb-1">{t(v.name)}</h3>
        <p className="text-[13px] text-ink-soft leading-[1.55] mb-5">{t(v.tagline)}</p>

        <div className="grid grid-cols-3 gap-2 mb-5 py-4 border-t border-b border-rule">
          {[
            { icon: <User size={14} />, count: v.passengers, label: t('fleet.passengers') },
            { icon: <Briefcase size={14} />, count: v.suitcases, label: t('fleet.suitcases') },
            { icon: <Package size={14} />, count: v.smallCases, label: t('fleet.small_cases') },
          ].map(spec => (
            <div key={spec.label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-ink-soft">{spec.icon}</span>
              <span className="text-[18px] font-bold tracking-[-0.02em] text-ink">{spec.count}</span>
              <span className="text-[10px] text-muted tracking-[0.06em] uppercase font-medium leading-tight">{spec.label}</span>
            </div>
          ))}
        </div>

        <ul className="flex flex-col gap-2 mb-6">
          {v.feats.map(k => (
            <li key={k} className="flex items-center gap-2 text-[12px] text-ink-soft">
              <Check size={14} className="text-accent flex-shrink-0" />
              {t(k)}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <a
            href="#"
            className={`block w-full text-center py-3 rounded-[8px] text-[13px] font-semibold transition-colors ${v.featured ? 'bg-ink text-surface hover:bg-ink/90' : 'bg-surface-2 text-ink hover:bg-rule border border-rule'}`}
          >
            <span className="inline-flex items-center gap-1">{t('fleet.book_now')} <ArrowRight size={14} /></span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FleetPage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const visible = activeFilter === 'all'
    ? VEHICLES
    : VEHICLES.filter(v => v.filter === activeFilter);

  return (
    <div className="bg-surface text-ink transition-colors duration-300 min-h-screen">

      <div className="bg-navy text-on-dark py-14 lg:py-20 relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-5">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">I</span>
            {t('fleet.page_eyebrow')}
          </div>
          <h1 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-none tracking-[-0.04em] font-bold mb-4">
            {t('fleet.page_title')}
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/65 max-w-[560px] leading-[1.6]">
            {t('fleet.page_sub')}
          </p>
        </div>
      </div>

      <div className="border-b border-rule bg-surface sticky top-[88px] z-30">
        <div className="px-5 sm:px-10 lg:px-16">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-[8px] text-[12px] font-semibold tracking-[0.04em] transition-colors duration-150 ${activeFilter === f.key ? 'bg-ink text-surface' : 'text-ink-soft hover:text-ink hover:bg-surface-2'}`}
              >
                {t(f.label)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-16 py-12 lg:py-16">
        <div className={`grid gap-6 ${visible.length === 1 ? 'grid-cols-1 max-w-[480px]' : visible.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-[860px]' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {visible.map(v => (
            <VehicleCard key={v.id} v={v} t={t} />
          ))}
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-16 pb-16">
        <div className="bg-surface-2 border border-rule rounded-[16px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left px-6 py-4 text-[11px] tracking-[0.14em] uppercase text-muted font-semibold w-[180px]">Feature</th>
                  {VEHICLES.map(v => (
                    <th key={v.id} className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.06em] ${v.tagColor}`}>{t(v.tag)}</div>
                      <div className="text-[13px] font-bold text-ink mt-1">{t(v.name)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: t('fleet.passengers'), values: ['4', '4', '6', '4'] },
                  { label: t('fleet.suitcases'), values: ['3', '3', '4', '2'] },
                  { label: t('fleet.small_cases'), values: ['3', '3', '4', '2'] },
                  { label: 'ADA Accessible', values: [false, false, false, true] },
                  { label: 'Insurance billing', values: [true, true, true, true] },
                  { label: 'Medical transport', values: [true, false, false, true] },
                  { label: 'Airport transfer', values: [true, true, true, true] },
                ].map((row, ri) => (
                  <tr key={ri} className={`border-b border-rule last:border-0 ${ri % 2 === 0 ? '' : 'bg-surface'}`}>
                    <td className="px-6 py-[14px] text-[12px] font-medium text-ink-soft">{row.label}</td>
                    {row.values.map((val, vi) => (
                      <td key={vi} className="px-6 py-[14px] text-center">
                        {typeof val === 'boolean'
                          ? val
                            ? <Check size={15} className="text-accent inline-block" />
                            : <Minus size={15} className="text-muted inline-block" />
                          : <span className="text-[13px] font-semibold text-ink">{val}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-navy text-on-dark relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 py-14 lg:py-20 relative z-[1]">
          <div className="max-w-[640px]">
            <div className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-semibold mb-4">{t('fleet.cta_eyebrow')}</div>
            <h2 className="text-[30px] sm:text-[40px] lg:text-[52px] font-bold tracking-[-0.035em] leading-none mb-5">
              {t('fleet.cta_h2')}
            </h2>
            <p className="text-[15px] text-white/65 leading-[1.6] mb-8 max-w-[480px]">{t('fleet.cta_body')}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-[8px] text-[14px] font-semibold hover:bg-accent/90 transition-colors">
                {t('fleet.cta_book')} <ArrowRight size={16} />
              </a>
              <a href="tel:+18338297339" className="inline-flex items-center gap-2 border border-white/25 text-white/85 px-6 py-3 rounded-[8px] text-[14px] font-semibold hover:bg-white/[0.08] transition-colors">
                {t('fleet.cta_call')}
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}