import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ArrowRight, Circle, MapPin } from 'lucide-react';
import { useAddressSearch } from '../../../hooks/useAddressSearch';

const SLIDE_MS = 6000;

const IMG = (id, w = 900, h = 720) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

/* ── Inline address row for the hero widget ─────────────────── */
function WidgetAddressRow({ value, latlng, onSelect, onClear, label, dotColor, placeholder, geoLoading }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen]   = useState(false);
  const wrapRef           = useRef(null);
  const { results, loading } = useAddressSearch(open ? query : '');

  useEffect(() => { setQuery(value || ''); }, [value]);

  useEffect(() => {
    const handle = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div className="flex items-center gap-[14px] px-[14px] py-3 border-t border-rule">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
        <div className="flex-1 min-w-0">
          <div className="text-[9px] tracking-[0.14em] text-muted uppercase font-semibold">{label}</div>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (latlng) onClear();
            }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder={geoLoading ? 'Detecting your location…' : placeholder}
            autoComplete="off"
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: 'var(--c-ink)', fontFamily: 'inherit',
              fontWeight: 500, width: '100%', padding: 0, marginTop: 3,
            }}
          />
        </div>
        {(loading || geoLoading) && (
          <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--c-rule)', borderTopColor: 'var(--c-muted)', animation: 'addressSpin 0.7s linear infinite', flexShrink: 0 }} />
        )}
        {!loading && !geoLoading && latlng && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: -14, right: -14, zIndex: 400,
          backgroundColor: 'var(--c-bg)', border: '1px solid var(--c-rule)',
          borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.18)', overflow: 'hidden',
        }}>
          {results.map((r, i) => (
            <button
              key={r.id || i}
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery(r.label);
                setOpen(false);
                onSelect(r.label, r.latlng);
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', borderBottom: i < results.length - 1 ? '1px solid var(--c-rule)' : 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c-bg-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <MapPin size={13} color="var(--c-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--c-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</p>
                {r.sublabel && <p style={{ margin: '1px 0 0', fontSize: 11, color: 'var(--c-muted)' }}>{r.sublabel}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [idx, setIdx]   = useState(0);
  const [fade, setFade] = useState(false);
  const timerRef        = useRef(null);

  // Widget state
  const [mode,           setMode]          = useState('now');
  const [hPickup,        setHPickup]       = useState('');
  const [hDropoff,       setHDropoff]      = useState('');
  const [hPickupLatLng,  setHPickupLatlng] = useState(null);
  const [hDropoffLatLng, setHDropoffLatlng]= useState(null);
  const [geoLoading,     setGeoLoading]    = useState(false);

  // Auto-detect pickup on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const parts = [
            addr.road || addr.pedestrian || addr.footway,
            addr.neighbourhood || addr.suburb,
            addr.city || addr.town || addr.village,
          ].filter(Boolean);
          setHPickup(parts.join(', ') || data.display_name || 'Current location');
          setHPickupLatlng([lat, lng]);
        } catch {}
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const handleBook = () => {
    const params = new URLSearchParams();
    if (hPickup)        params.set('pu',   hPickup);
    if (hDropoff)       params.set('do',   hDropoff);
    if (hPickupLatLng)  { params.set('plat', hPickupLatLng[0]);  params.set('plng', hPickupLatLng[1]); }
    if (hDropoffLatLng) { params.set('dlat', hDropoffLatLng[0]); params.set('dlng', hDropoffLatLng[1]); }
    if (hPickupLatLng && hDropoffLatLng) params.set('step', '2');
    navigate(`${mode === 'schedule' ? '/schedule' : '/book'}?${params.toString()}`);
  };

  const SLIDES = [
    {
      badge:  'Detroit, Michigan',
      lines:  [t('hero.h1_1'), t('hero.h1_2'), t('hero.h1_3')],
      body:   t('hero.body'),
      img:    IMG('1576091160550-2173dba999ef'),
      imgAlt: 'Abyride driver assisting a medical patient',
    },
    {
      badge:  t('hero.s2_badge'),
      lines:  [t('hero.s2_h1_1'), t('hero.s2_h1_2'), t('hero.s2_h1_3')],
      body:   t('hero.s2_body'),
      img:    IMG('1559839734-2851eb3e7b7b'),
      imgAlt: 'Wheelchair-accessible van with ramp deployed',
    },
    {
      badge:  t('hero.s3_badge'),
      lines:  [t('hero.s3_h1_1'), t('hero.s3_h1_2'), t('hero.s3_h1_3')],
      body:   t('hero.s3_body'),
      img:    IMG('1436491865332-7a61a109cc05'),
      imgAlt: 'Airport terminal with passengers arriving',
    },
  ];

  const advance = (next) => {
    setFade(true);
    setTimeout(() => { setIdx(next); setFade(false); }, 380);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => { setIdx(prev => (prev + 1) % SLIDES.length); setFade(false); }, 380);
    }, SLIDE_MS);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i) => {
    if (i === idx) return;
    advance(i);
    startTimer();
  };

  const slide = SLIDES[idx];
  const canBook = Boolean(hPickup || hDropoff);

  return (
    <section className="bg-surface text-ink transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 pt-10 lg:pt-[72px] px-5 sm:px-10 lg:px-16 pb-16 lg:pb-24 items-start">

        {/* ── Left column ─────────────────────────────────────── */}
        <div className="pt-2 lg:pt-6">
          <div
            className="transition-opacity duration-[380ms] ease-in-out"
            style={{ opacity: fade ? 0 : 1 }}
          >
            <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
              <span className="text-accent text-[14px]">*</span>
              <span>{t('hero.eyebrow')}</span>
            </div>
            <h1 className="text-[40px] sm:text-[56px] lg:text-[80px] leading-none tracking-[-0.04em] font-bold mt-5 lg:mt-6 mb-5 lg:mb-7">
              {slide.lines[0]}<br />
              {slide.lines[1]}<br />
              <em className="italic text-accent font-bold">{slide.lines[2]}</em>.
            </h1>
            <p className="text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.55] text-ink-soft max-w-[540px]">
              {slide.body}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-8 lg:mt-10">
            <a
              className="bg-ink text-surface px-[22px] sm:px-[26px] py-3.5 lg:py-4 rounded-[8px] text-[14px] lg:text-[15px] font-semibold inline-flex items-center gap-2"
              href="#"
            >
              {t('hero.cta_primary')} <ArrowRight size={16} />
            </a>
            <a className="text-ink text-[14px] font-medium border-b border-ink pb-0.5" href="#">
              {t('hero.cta_secondary')}
            </a>
          </div>

          <div className="flex gap-6 sm:gap-10 mt-10 lg:mt-16 pt-6 lg:pt-8 border-t border-rule flex-wrap">
            <div>
              <div className="text-[28px] sm:text-[36px] leading-none font-bold tracking-[-0.03em]">
                4.9<span className="text-[16px] sm:text-[18px] text-ink-soft ml-1">★</span>
              </div>
              <div className="text-[10px] tracking-[0.14em] text-muted mt-2 uppercase font-medium">
                {t('hero.stat_rating_label')}
              </div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[36px] leading-none font-bold tracking-[-0.03em]">
                99.9<span className="text-[16px] sm:text-[18px] text-ink-soft">%</span>
              </div>
              <div className="text-[10px] tracking-[0.14em] text-muted mt-2 uppercase font-medium">
                {t('hero.stat_ontime_label')}
              </div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[36px] leading-none font-bold tracking-[-0.03em]">24 / 7</div>
              <div className="text-[10px] tracking-[0.14em] text-muted mt-2 uppercase font-medium">
                {t('hero.stat_dispatch_label')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[10px] mt-8 lg:mt-10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 focus:outline-none
                  ${i === idx
                    ? 'w-7 h-[7px] bg-ink'
                    : 'w-[7px] h-[7px] bg-rule hover:bg-ink-soft'
                  }`}
              />
            ))}
            <div className="flex-1 h-px bg-rule ml-2 relative overflow-hidden">
              <div
                key={idx}
                className="absolute inset-y-0 left-0 bg-accent"
                style={{ animation: `progressBar ${SLIDE_MS}ms linear forwards` }}
              />
            </div>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────── */}
        <div className="relative">

          {/* Image stack */}
          <div className="relative w-full h-[280px] sm:h-[420px] lg:h-[720px] rounded-[8px] overflow-hidden bg-navy">
            {SLIDES.map((s, i) => (
              <img
                key={i}
                src={s.img}
                alt={s.imgAlt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                onError={e => { e.currentTarget.style.display = 'none'; }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out
                  ${i === idx ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a]/60 via-[#1e3a8a]/30 to-transparent mix-blend-multiply pointer-events-none" />
            <div
              className="absolute top-4 left-4 z-[2] text-[10px] tracking-[0.14em] text-white/90 bg-[rgba(11,31,58,0.55)] backdrop-blur-[6px] px-[10px] py-[6px] uppercase font-medium rounded-[3px] transition-opacity duration-[380ms]"
              style={{ opacity: fade ? 0 : 1 }}
            >
              <Circle size={6} fill="currentColor" className="text-accent inline-block mr-1" /> {slide.badge}
            </div>
          </div>

          {/* ── Booking widget ─────────────────────────────────── */}
          <div className="lg:absolute lg:-bottom-14 lg:-left-14 w-full lg:w-[460px] bg-surface border border-rule p-4 sm:p-[22px] shadow-[0_30px_60px_-20px_rgba(11,31,58,0.35)] rounded-[12px] mt-4 lg:mt-0">

            {/* Header row */}
            <div className="flex justify-between items-center mb-4 gap-3">
              <div className="text-[16px] sm:text-[18px] leading-[1.1] tracking-[-0.02em] font-bold italic">
                {t('widget.title')}
              </div>
              <div className="flex text-[10px] tracking-[0.1em] uppercase font-semibold flex-shrink-0">
                <button
                  onClick={() => setMode('now')}
                  className={`px-[9px] py-[5px] rounded-[4px] transition-colors ${mode === 'now' ? 'text-ink bg-surface-2' : 'text-muted'}`}
                >
                  {t('widget.now')}
                </button>
                <button
                  onClick={() => setMode('schedule')}
                  className={`px-[9px] py-[5px] rounded-[4px] transition-colors ${mode === 'schedule' ? 'text-ink bg-surface-2' : 'text-muted'}`}
                >
                  {t('widget.schedule')}
                </button>
                <span className="hidden sm:inline px-[9px] py-[5px] text-muted rounded-[4px] cursor-not-allowed opacity-50">
                  {t('widget.recurring')}
                </span>
              </div>
            </div>

            {/* Pickup row */}
            <WidgetAddressRow
              value={hPickup}
              latlng={hPickupLatLng}
              label={t('widget.pickup')}
              dotColor="var(--c-ink)"
              placeholder="Current location or address"
              geoLoading={geoLoading}
              onSelect={(label, latlng) => { setHPickup(label); setHPickupLatlng(latlng); }}
              onClear={() => { setHPickup(''); setHPickupLatlng(null); }}
            />

            {/* Dropoff row */}
            <WidgetAddressRow
              value={hDropoff}
              latlng={hDropoffLatLng}
              label={t('widget.dropoff')}
              dotColor="var(--c-accent, #2546b8)"
              placeholder="Where are you going?"
              geoLoading={false}
              onSelect={(label, latlng) => { setHDropoff(label); setHDropoffLatlng(latlng); }}
              onClear={() => { setHDropoff(''); setHDropoffLatlng(null); }}
            />

            {/* CTA button */}
            <button
              onClick={handleBook}
              disabled={!canBook}
              className="w-full mt-3.5 border-0 px-4 py-3.5 text-[14px] font-semibold flex justify-between items-center rounded-lg transition-opacity"
              style={{
                backgroundColor: canBook ? 'var(--c-accent, #2546b8)' : 'var(--c-bg-3)',
                color: canBook ? '#fff' : 'var(--c-muted)',
                cursor: canBook ? 'pointer' : 'not-allowed',
                opacity: 1,
              }}
            >
              {mode === 'schedule' ? 'Schedule a ride' : t('widget.see_drivers')}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block h-20" />

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
