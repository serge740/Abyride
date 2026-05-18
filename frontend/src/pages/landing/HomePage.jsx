import { useState, useEffect, useRef } from 'react';
import './landing.css';

export default function HomePage() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('abyride-theme') || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('abyride-theme', next); } catch {}
  };

  const qrRef = useRef(null);
  useEffect(() => {
    const g = qrRef.current;
    if (!g) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 144; i++) {
      const r = Math.floor(i / 12), c = i % 12;
      if (((r * c + r + c * 7) % 3) === 0) {
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', c * 8 + 2);
        rect.setAttribute('y', r * 8 + 2);
        rect.setAttribute('width', 6);
        rect.setAttribute('height', 6);
        rect.setAttribute('fill', '#0b1f3a');
        g.appendChild(rect);
      }
    }
  }, []);

  return (
    <>
      {/* UTILITY BAR */}
      <div className="utility">
        <div className="utility__inner">
          <div className="utility__left">
            <span><b className="utility__strong">(833) 829‑7339</b> · 24 / 7 dispatch</span>
            <span className="utility__sep">·</span>
            <span>Serving Michigan</span>
          </div>
          <div className="utility__right">
            <a className="utility__link" href="#">Member login</a>
            <span className="utility__sep">·</span>
            <a className="utility__link" href="#">Driver login</a>
            <span className="utility__sep">·</span>
            <a className="utility__link" href="#">EN</a>
            <span className="utility__dim">/ FR / AR / ES</span>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <span className="knob"></span>
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NAV */}
      <header className="nav">
        <div className="nav__inner">
          <a className="brand" href="#">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <rect width="34" height="34" rx="6" fill="var(--ink)" />
              <path d="M9 24 L17 8 L25 24" stroke="var(--bg)" strokeWidth="2.4" fill="none" strokeLinejoin="miter" />
              <path d="M13 18 H21" stroke="var(--bg)" strokeWidth="2.4" />
              <circle cx="17" cy="27" r="1.6" fill="var(--cobalt-hi)" />
            </svg>
            <span className="brand__word">Abyride<span className="dot">.</span></span>
          </a>
          <nav className="nav__links">
            <a className="nav__link" href="#">Services <span className="nav__caret">↓</span></a>
            <a className="nav__link" href="#">Medical transport</a>
            <a className="nav__link" href="#">For drivers</a>
            <a className="nav__link" href="#">Fleet</a>
            <a className="nav__link" href="#">About</a>
            <a className="nav__link" href="#">Contact</a>
          </nav>
          <div className="nav__ctas">
            <a className="btn-ghost" href="#">Schedule a ride</a>
            <a className="btn-primary" href="#">Book now <span>→</span></a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__left">
            <div className="eyebrow">
              <span className="hero__eyebrow-mark">※</span>
              <span>Michigan's care‑first ride service · est. 2014</span>
            </div>
            <h1>A ride for the<br />appointment that<br /><em className="italic-cobalt">can't be missed</em>.</h1>
            <p className="hero__sub">Abyride is non‑emergency medical transport, wheelchair‑accessible vans, airport pickups, and everyday rides — under one roof. Dispatched 24/7, billed direct to most insurers, driven by people trained for the moments that matter.</p>
            <div className="hero__cta-row">
              <a className="btn-cta" href="#">Book a ride <span>→</span></a>
              <a className="btn-ghost-line" href="#">Watch the 60‑second tour</a>
            </div>
            <div className="hero__foot">
              <div>
                <div className="hero__foot-big">4.9<span className="sm" style={{ marginLeft: '4px' }}>★</span></div>
                <div className="hero__foot-lab">App Store · 12,400 reviews</div>
              </div>
              <div>
                <div className="hero__foot-big">99.9<span className="sm">%</span></div>
                <div className="hero__foot-lab">On‑time pickups · YTD</div>
              </div>
              <div>
                <div className="hero__foot-big">24 / 7</div>
                <div className="hero__foot-lab">Live dispatch · MDHHS approved</div>
              </div>
            </div>
          </div>

          <div className="hero__right">
            <div className="hero__photo">
              <div className="hero__photo-label"><span className="accent">●</span> HERO IMAGE · driver assisting rider into accessible van, Detroit</div>
              <svg className="hero__photo-svg" viewBox="0 0 600 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <linearGradient id="duo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#0b1f3a" />
                    <stop offset="0.5" stopColor="#1e3a8a" />
                    <stop offset="1" stopColor="#3b5bcc" />
                  </linearGradient>
                  <pattern id="halftone" width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="0.6" fill="rgba(255,255,255,0.18)" />
                  </pattern>
                </defs>
                <rect width="600" height="720" fill="url(#duo)" />
                <rect width="600" height="720" fill="url(#halftone)" />
                <g opacity="0.22" fill="#ffffff">
                  <path d="M60 480 L60 380 Q60 340 100 330 L200 310 Q260 290 320 310 L460 350 Q520 360 540 400 L540 480 Z" />
                  <rect x="100" y="350" width="80" height="60" rx="6" />
                  <rect x="200" y="340" width="100" height="70" rx="6" />
                  <rect x="320" y="350" width="120" height="60" rx="6" />
                  <circle cx="150" cy="500" r="40" fill="#0b1f3a" />
                  <circle cx="150" cy="500" r="22" fill="#ffffff" />
                  <circle cx="450" cy="500" r="40" fill="#0b1f3a" />
                  <circle cx="450" cy="500" r="22" fill="#ffffff" />
                </g>
                <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.12)" />
                <line x1="0" y1="660" x2="600" y2="660" stroke="rgba(255,255,255,0.12)" />
              </svg>
              <div className="hero__slidedots">
                <span className="num">04 / 06</span>
                <span className="dot is-active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>

            <div className="widget">
              <div className="widget__head">
                <div className="widget__title">Where are we taking you?</div>
                <div className="widget__tabs">
                  <span className="widget__tab is-active">Now</span>
                  <span className="widget__tab">Schedule</span>
                  <span className="widget__tab">Recurring</span>
                </div>
              </div>
              <div className="widget__field">
                <span className="widget__dot"></span>
                <div className="widget__field-inner">
                  <div className="widget__field-lab">Pickup</div>
                  <div className="widget__field-val">Cass Tech HS, 2501 Second Ave, Detroit</div>
                </div>
              </div>
              <div className="widget__field">
                <span className="widget__dot widget__dot--end"></span>
                <div className="widget__field-inner">
                  <div className="widget__field-lab">Drop‑off</div>
                  <div className="widget__field-val">Henry Ford Hospital · 2799 W Grand Blvd</div>
                </div>
                <div className="widget__hint">+ add stop</div>
              </div>
              <div className="widget__types">
                <span className="chip">Standard</span>
                <span className="chip is-sel">Medical · $22</span>
                <span className="chip">Accessible</span>
              </div>
              <button className="widget__cta">See available drivers <span>→</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners">
        <div className="partners__inner">
          <div className="eyebrow">
            <span style={{ color: 'var(--cobalt-hi)' }}>↳</span>
            Contracted &amp; trusted by Michigan's health network
          </div>
          <div className="partners__logos">
            <span className="partners__logo">MDHHS</span>
            <span className="partners__sep"></span>
            <span className="partners__logo">Henry Ford Health</span>
            <span className="partners__sep"></span>
            <span className="partners__logo">NMA</span>
            <span className="partners__sep"></span>
            <span className="partners__logo">NHA</span>
            <span className="partners__sep"></span>
            <span className="partners__logo">Molina Healthcare</span>
            <span className="partners__sep"></span>
            <span className="partners__logo">Meridian</span>
            <span className="partners__sep"></span>
            <span className="partners__logo">DMC</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <div className="container">
          <div className="services__header">
            <div className="eyebrow">
              <span className="eyebrow__num">I</span>
              <span>What we do</span>
              <span className="eyebrow__dim">· five services, one app</span>
            </div>
            <h2>Most ride apps optimize for the<br />fastest pickup. We optimize<br />for the one that <em className="italic-cobalt">matters</em>.</h2>
          </div>

          <ol className="services__list">
            <li className="svc-row">
              <div className="svc-row__n">S/01</div>
              <div>
                <div className="svc-row__kicker">● Most requested</div>
                <h3 className="svc-row__title">Non‑Emergency Medical</h3>
                <div className="svc-row__tagline">On time, on rhythm, on the same schedule every week.</div>
              </div>
              <p className="svc-row__body">Dialysis, oncology, rehab. We coordinate directly with your case manager and bill MDHHS / Medicaid / Molina / Meridian — no paperwork on your end.</p>
              <div className="svc-row__meta">
                <div className="svc-row__meta-val">~3,200 trips / month</div>
                <a className="svc-row__arrow" href="#">Learn more →</a>
              </div>
            </li>
            <li className="svc-row">
              <div className="svc-row__n">S/02</div>
              <div>
                <h3 className="svc-row__title">Wheelchair‑Accessible Vans</h3>
                <div className="svc-row__tagline">ADA‑compliant fleet across six cities.</div>
              </div>
              <p className="svc-row__body">Side &amp; rear ramps, dual‑position lifts, four‑point securement. Every driver is trained in safe transfer technique and re‑certified annually.</p>
              <div className="svc-row__meta">
                <div className="svc-row__meta-val">68 vans · all certified</div>
                <a className="svc-row__arrow" href="#">Learn more →</a>
              </div>
            </li>
            <li className="svc-row">
              <div className="svc-row__n">S/03</div>
              <div>
                <h3 className="svc-row__title">Airport Pickup</h3>
                <div className="svc-row__tagline">Flight‑tracked rides to DTW, GRR &amp; FNT.</div>
              </div>
              <p className="svc-row__body">Meet‑and‑greet at baggage claim. Multilingual drivers on request. Flat fares quoted at booking — no surge, no surprises if your flight is late.</p>
              <div className="svc-row__meta">
                <div className="svc-row__meta-val">4 airports served</div>
                <a className="svc-row__arrow" href="#">Learn more →</a>
              </div>
            </li>
            <li className="svc-row">
              <div className="svc-row__n">S/04</div>
              <div>
                <div className="svc-row__kicker">● Unique to Abyride</div>
                <h3 className="svc-row__title">Live Language Translation</h3>
                <div className="svc-row__tagline">A driver who speaks your language.</div>
              </div>
              <p className="svc-row__body">In‑car interpretation in Amharic, Arabic, Spanish, French, ASL and nine more. On‑demand video interpreter for any other language, billable to medical plans.</p>
              <div className="svc-row__meta">
                <div className="svc-row__meta-val">14 languages · live</div>
                <a className="svc-row__arrow" href="#">Learn more →</a>
              </div>
            </li>
            <li className="svc-row">
              <div className="svc-row__n">S/05</div>
              <div>
                <h3 className="svc-row__title">Everyday Rides</h3>
                <div className="svc-row__tagline">Commutes, errands, the school run.</div>
              </div>
              <p className="svc-row__body">Flat‑rate pricing across Detroit, Ann Arbor, Lansing, Flint, Grand Rapids and Dearborn. No surge. Pay through the app or in cash with the driver.</p>
              <div className="svc-row__meta">
                <div className="svc-row__meta-val">6 cities live</div>
                <a className="svc-row__arrow" href="#">Learn more →</a>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* WHY ABYRIDE */}
      <section className="why">
        <div className="container">
          <div className="why__header">
            <div className="eyebrow">
              <span className="eyebrow__num">II</span>
              Why people stay with Abyride
            </div>
            <div>
              <h2>Four reasons, in plain English.</h2>
              <p className="why__lede">The boring stuff done right — safety, language, healthcare, family. We don't dress it up because we don't need to.</p>
            </div>
          </div>

          <div className="why__grid">
            <div className="why-card why-card--dark">
              <div className="why-card__n">01</div>
              <div className="why-card__photo">
                <svg viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <pattern id="htn-01" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="240" height="240" fill="url(#htn-01)" />
                  <circle cx="120" cy="130" r="60" fill="currentColor" opacity="0.6" />
                </svg>
              </div>
              <h3 className="why-card__title">Safe &amp; Secure</h3>
              <p className="why-card__body">Background‑checked drivers, GPS on every trip, in‑app emergency line direct to dispatch.</p>
              <a className="why-card__link" href="#">Read more →</a>
            </div>

            <div className="why-card why-card--cobalt">
              <div className="why-card__n">02</div>
              <div className="why-card__photo">
                <svg viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <pattern id="htn-02" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="240" height="240" fill="url(#htn-02)" />
                  <path d="M40 200 Q120 60 200 200" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.9" />
                </svg>
              </div>
              <h3 className="why-card__title">Multilingual</h3>
              <p className="why-card__body">Interpreters in 14 languages — Amharic, Arabic, French, Spanish, ASL and more.</p>
              <a className="why-card__link" href="#">Read more →</a>
            </div>

            <div className="why-card why-card--paper">
              <div className="why-card__n">03</div>
              <div className="why-card__photo">
                <svg viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <pattern id="htn-03" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="240" height="240" fill="url(#htn-03)" />
                  <path d="M120 50 V200 M70 125 H170" stroke="currentColor" strokeWidth="6" opacity="0.9" />
                </svg>
              </div>
              <h3 className="why-card__title">Healthcare</h3>
              <p className="why-card__body">Direct insurance billing. Trained medical transport. Wheelchair‑accessible fleet.</p>
              <a className="why-card__link" href="#">Read more →</a>
            </div>

            <div className="why-card why-card--ink">
              <div className="why-card__n">04</div>
              <div className="why-card__photo">
                <svg viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <pattern id="htn-04" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.55" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="240" height="240" fill="url(#htn-04)" />
                  <g opacity="0.7" fill="currentColor">
                    <circle cx="90" cy="100" r="22" />
                    <circle cx="150" cy="100" r="22" />
                    <path d="M50 200 Q90 150 120 150 Q150 150 190 200 Z" />
                  </g>
                </svg>
              </div>
              <h3 className="why-card__title">Family Care</h3>
              <p className="why-card__body">Book on behalf of a parent. Share the ride. Get pickup &amp; drop‑off notifications.</p>
              <a className="why-card__link" href="#">Read more →</a>
            </div>
          </div>
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section className="app">
        <div className="app__bg-grid"></div>
        <div className="app__inner container">
          <div>
            <div className="eyebrow app__eyebrow">
              <span className="eyebrow__num">III</span>
              The Abyride app
            </div>
            <h2>Your driver,<br />dispatch, and<br />insurance — in<br /><em>one</em> place.</h2>
            <p className="app__sub">Book a ride, track your driver, replay any past trip, message in your language, or share your live location with a family member. The app does what we used to need six phone calls to do.</p>

            <div className="app__feat-grid">
              <div className="app__feat"><span className="app__feat-n">a.</span><div><div className="app__feat-t">Book a ride</div><div className="app__feat-d">One‑tap pickup or schedule weeks ahead.</div></div></div>
              <div className="app__feat"><span className="app__feat-n">b.</span><div><div className="app__feat-t">Track driver</div><div className="app__feat-d">Live ETA · driver photo · plate number.</div></div></div>
              <div className="app__feat"><span className="app__feat-n">c.</span><div><div className="app__feat-t">Share location</div><div className="app__feat-d">Send live trip link to family.</div></div></div>
              <div className="app__feat"><span className="app__feat-n">d.</span><div><div className="app__feat-t">History</div><div className="app__feat-d">Re‑book recurring trips in two taps.</div></div></div>
              <div className="app__feat"><span className="app__feat-n">e.</span><div><div className="app__feat-t">24/7 Support</div><div className="app__feat-d">Call, chat, or video — your language.</div></div></div>
              <div className="app__feat"><span className="app__feat-n">f.</span><div><div className="app__feat-t">Profile</div><div className="app__feat-d">Insurance, accessibility &amp; saved places.</div></div></div>
            </div>

            <div className="app__stores">
              <div className="app__stores-label">Available on</div>
              <a className="store" href="#">
                <svg width="18" height="22" viewBox="0 0 18 22" fill="#fff" aria-hidden="true"><path d="M14.5 11.5c0-2 1.5-3 1.6-3.1-.9-1.3-2.2-1.5-2.7-1.5-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.6-1.3.02-2.5.75-3.1 1.9-1.4 2.4-.3 5.9 1 7.8.7.9 1.5 2 2.4 1.9.9-.03 1.3-.6 2.5-.6s1.5.6 2.5.6c1 0 1.7-.9 2.3-1.9.7-1.1 1-2.2 1-2.3-.1-.04-2.2-.8-2.2-3.4M12.5 4.6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.5-.9 1.4-.8 2.3.9.1 1.8-.4 2.3-1z" /></svg>
                <div><div className="store__lab">Download on the</div><div className="store__name">App Store</div></div>
              </a>
              <a className="store" href="#">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
                  <path d="M3 2.5v17l8.5-8.5z" fill="#7c9bff" />
                  <path d="M3 2.5l8.5 8.5L15 7.5z" fill="#34d399" />
                  <path d="M3 19.5L11.5 11 15 14.5z" fill="#fbbf24" />
                  <path d="M15 7.5l-3.5 3.5 3.5 3.5 3-2c1-.7 1-1.3 0-2z" fill="#f87171" />
                </svg>
                <div><div className="store__lab">Get it on</div><div className="store__name">Google Play</div></div>
              </a>
            </div>

            <div className="app__stats">
              <div><div className="app__stat-num">50K+</div><div className="app__stat-lab">Downloads</div></div>
              <div className="app__stat-rule"></div>
              <div><div className="app__stat-num">4.9 ★</div><div className="app__stat-lab">App Store rating</div></div>
              <div className="app__stat-rule"></div>
              <div><div className="app__stat-num">24/7</div><div className="app__stat-lab">Live support</div></div>
            </div>
          </div>

          <div className="app__right">
            <div className="phone">
              <div className="phone__notch"><div className="phone__speaker"></div></div>
              <div className="phone__screen">
                <div className="phone__sbar">
                  <span>9:41</span>
                  <div className="phone__sbar-right">
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="#0b1f3a" aria-hidden="true"><path d="M1 8h2V6H1zm4 0h2V4H5zm4 0h2V2H9zm4 0h2V0h-2z" /></svg>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="#0b1f3a" aria-hidden="true"><path d="M7 0a8 8 0 00-7 4l1 1a6 6 0 0112 0l1-1a8 8 0 00-7-4zm0 3a4 4 0 00-3 2l1 1a2.5 2.5 0 014 0l1-1a4 4 0 00-3-2zm0 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" /></svg>
                    <span className="phone__battery"></span>
                  </div>
                </div>
                <div className="phone__body">
                  <div className="phone__greet">
                    <div className="phone__greet-time">Tuesday, 9:41 AM</div>
                    <div className="phone__greet-name">Hi Sarah — where to?</div>
                  </div>
                  <div className="phone__search">
                    <span className="phone__search-icon">⌕</span>
                    <span className="phone__search-txt">Where are you going?</span>
                  </div>
                  <div className="phone__recents">
                    <div className="phone__recents-lab">RECENT &amp; SAVED</div>
                    <div className="phone__recent">
                      <div className="phone__rec-icon">✚</div>
                      <div style={{ flex: 1 }}>
                        <div className="phone__rec-t">Henry Ford Hospital</div>
                        <div className="phone__rec-d">Recurring · every Mon, Wed, Fri</div>
                      </div>
                      <div className="phone__rec-badge">MEDICAL</div>
                    </div>
                    <div className="phone__recent">
                      <div className="phone__rec-icon">✈</div>
                      <div style={{ flex: 1 }}>
                        <div className="phone__rec-t">Detroit Metro · DTW</div>
                        <div className="phone__rec-d">Last used Mar 12</div>
                      </div>
                    </div>
                    <div className="phone__recent">
                      <div className="phone__rec-icon">⌂</div>
                      <div style={{ flex: 1 }}>
                        <div className="phone__rec-t">Home · 1842 Trumbull Ave</div>
                        <div className="phone__rec-d">Saved</div>
                      </div>
                    </div>
                  </div>
                  <div className="phone__actbar">
                    <div className="phone__act"><div className="phone__act-icon">🚗</div><div className="phone__act-lab">Ride</div></div>
                    <div className="phone__act"><div className="phone__act-icon">✚</div><div className="phone__act-lab">Medical</div></div>
                    <div className="phone__act"><div className="phone__act-icon">♿</div><div className="phone__act-lab">Access</div></div>
                    <div className="phone__act"><div className="phone__act-icon">📅</div><div className="phone__act-lab">Schedule</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS */}
      <section className="success">
        <div className="container">
          <div className="success__head">
            <div className="eyebrow">
              <span className="eyebrow__num">IV</span>
              Success stories that inspire trust
            </div>
            <h2>11 years. <em className="italic-cobalt">One mission</em>.<br />A few numbers that matter.</h2>
          </div>

          <div className="success__stats">
            <div className="success__stat">
              <div className="success__stat-idx">01</div>
              <div className="success__stat-num">5,000+</div>
              <div className="success__stat-lab">Happy clients</div>
              <div className="success__stat-desc">Riders and family bookers across MI.</div>
            </div>
            <div className="success__stat">
              <div className="success__stat-idx">02</div>
              <div className="success__stat-num">99.9%</div>
              <div className="success__stat-lab">On‑time rate</div>
              <div className="success__stat-desc">Measured at the pickup curb, YTD.</div>
            </div>
            <div className="success__stat">
              <div className="success__stat-idx">03</div>
              <div className="success__stat-num">24 / 7</div>
              <div className="success__stat-lab">Live dispatch</div>
              <div className="success__stat-desc">Real people answer in ≤90 seconds.</div>
            </div>
            <div className="success__stat">
              <div className="success__stat-idx">04</div>
              <div className="success__stat-num">10+</div>
              <div className="success__stat-lab">Years on the road</div>
              <div className="success__stat-desc">Family‑owned since 2014.</div>
            </div>
          </div>

          <div className="pullquote">
            <div className="pullquote__mark">"</div>
            <blockquote>Reliable, on time, and the drivers treat my mother like family. After eight years of dialysis rides, I don't think about transport anymore. That's the highest praise I can give.</blockquote>
            <div>
              <div className="pullquote__name">Ivana C.</div>
              <div className="pullquote__role">Family caregiver · Dearborn · client since 2017</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="news">
        <div className="news__inner container">
          <div>
            <div className="news__tag">● BREAKING · Mar 2026</div>
            <h2>The new Abyride app<br />is now live on iOS &amp; Android.</h2>
            <p className="news__sub">Rebuilt from the ground up — faster booking, live driver tracking, in‑app translation, recurring trips, and direct insurance billing. Free download, no account required to browse.</p>
          </div>
          <div className="news__right">
            <div className="news__stores">
              <a className="store store--big" href="#">
                <svg width="22" height="26" viewBox="0 0 18 22" fill="#fff" aria-hidden="true"><path d="M14.5 11.5c0-2 1.5-3 1.6-3.1-.9-1.3-2.2-1.5-2.7-1.5-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.6-1.3.02-2.5.75-3.1 1.9-1.4 2.4-.3 5.9 1 7.8.7.9 1.5 2 2.4 1.9.9-.03 1.3-.6 2.5-.6s1.5.6 2.5.6c1 0 1.7-.9 2.3-1.9.7-1.1 1-2.2 1-2.3-.1-.04-2.2-.8-2.2-3.4M12.5 4.6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.5-.9 1.4-.8 2.3.9.1 1.8-.4 2.3-1z" /></svg>
                <div><div className="store__lab">Download on the</div><div className="store__name">App Store</div></div>
              </a>
              <a className="store store--big" href="#">
                <svg width="26" height="26" viewBox="0 0 20 22" fill="none" aria-hidden="true">
                  <path d="M3 2.5v17l8.5-8.5z" fill="#7c9bff" />
                  <path d="M3 2.5l8.5 8.5L15 7.5z" fill="#34d399" />
                  <path d="M3 19.5L11.5 11 15 14.5z" fill="#fbbf24" />
                  <path d="M15 7.5l-3.5 3.5 3.5 3.5 3-2c1-.7 1-1.3 0-2z" fill="#f87171" />
                </svg>
                <div><div className="store__lab">Get it on</div><div className="store__name">Google Play</div></div>
              </a>
            </div>
            <div className="news__qr">
              <div className="qr-box" aria-hidden="true">
                <svg viewBox="0 0 100 100" width="80" height="80">
                  <rect width="100" height="100" fill="#fff" />
                  <g ref={qrRef}></g>
                  <rect x="4" y="4" width="22" height="22" fill="none" stroke="#0b1f3a" strokeWidth="3" />
                  <rect x="10" y="10" width="10" height="10" fill="#0b1f3a" />
                  <rect x="74" y="4" width="22" height="22" fill="none" stroke="#0b1f3a" strokeWidth="3" />
                  <rect x="80" y="10" width="10" height="10" fill="#0b1f3a" />
                  <rect x="4" y="74" width="22" height="22" fill="none" stroke="#0b1f3a" strokeWidth="3" />
                  <rect x="10" y="80" width="10" height="10" fill="#0b1f3a" />
                </svg>
              </div>
              <div className="news__qr-text">Scan to download<br /><span className="news__qr-sub">iOS &amp; Android · v3.2.0</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials__head">
            <div className="eyebrow">
              <span className="eyebrow__num">V</span>
              What riders say
            </div>
            <h2>Real people, real stories.</h2>
          </div>
          <div className="testimonials__grid">
            <figure className="tcard tcard--featured">
              <div className="tcard__stars">★★★★★</div>
              <blockquote className="tcard__q">Incredibly reliable, especially for medical timing. The driver was punctual and professional — exactly what I needed for my early morning pickups.</blockquote>
              <figcaption className="tcard__cap">
                <div className="tcard__avatar">I</div>
                <div>
                  <div className="tcard__name">Ivana C.</div>
                  <div className="tcard__role">Family caregiver · Dearborn</div>
                </div>
              </figcaption>
            </figure>
            <figure className="tcard">
              <div className="tcard__stars">★★★★★</div>
              <blockquote className="tcard__q">Outstanding driving service when I needed it most. Professional, on time, and great conversation. Clean, spacious ride when other apps had failed me.</blockquote>
              <figcaption className="tcard__cap">
                <div className="tcard__avatar">S</div>
                <div>
                  <div className="tcard__name">Steve H.</div>
                  <div className="tcard__role">Local guide · Detroit</div>
                </div>
              </figcaption>
            </figure>
            <figure className="tcard">
              <div className="tcard__stars">★★★★★</div>
              <blockquote className="tcard__q">This is how taxi service should be. Door‑to‑door conversation, the courteous approach, the option to share with the driver with superior service.</blockquote>
              <figcaption className="tcard__cap">
                <div className="tcard__avatar">B</div>
                <div>
                  <div className="tcard__name">Ben R.</div>
                  <div className="tcard__role">Rider · Ann Arbor</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="blog">
        <div className="container">
          <div className="blog__head">
            <div className="eyebrow">
              <span className="eyebrow__num">VI</span>
              Field notes
            </div>
            <div>
              <h2>Latest stories &amp; updates.</h2>
              <p>Insights and updates from our latest blog post. Learn more about our services and industry trends.</p>
            </div>
            <a className="blog__viewall" href="#">View all posts →</a>
          </div>
          <div className="blog__grid">
            <a className="post" href="#">
              <div className="post__photo">
                <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <linearGradient id="bp-0" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#0b1f3a" /><stop offset="1" stopColor="#1a2b47" />
                    </linearGradient>
                    <pattern id="bpp-0" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.5" fill="rgba(255,255,255,0.3)" />
                    </pattern>
                  </defs>
                  <rect width="400" height="240" fill="url(#bp-0)" />
                  <rect width="400" height="240" fill="url(#bpp-0)" />
                </svg>
                <div className="post__tag">Home Care, Lifestyle</div>
              </div>
              <div className="post__body">
                <div className="post__meta"><span>Jan 8, 2026</span><span className="dot">·</span><span>5 min read</span></div>
                <h3 className="post__title">Why home care services are essential for modern living</h3>
                <p className="post__excerpt">How everyday transportation shapes independence for older adults — and what families can do about it.</p>
                <span className="post__readmore">Read more →</span>
              </div>
            </a>

            <a className="post" href="#">
              <div className="post__photo">
                <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <linearGradient id="bp-1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#2546b8" /><stop offset="1" stopColor="#0f2768" />
                    </linearGradient>
                    <pattern id="bpp-1" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.5" fill="rgba(255,255,255,0.3)" />
                    </pattern>
                  </defs>
                  <rect width="400" height="240" fill="url(#bp-1)" />
                  <rect width="400" height="240" fill="url(#bpp-1)" />
                </svg>
                <div className="post__tag">Transportation</div>
              </div>
              <div className="post__body">
                <div className="post__meta"><span>Jan 2, 2026</span><span className="dot">·</span><span>7 min read</span></div>
                <h3 className="post__title">Behind the on‑time rate: how dispatch actually works at Abyride</h3>
                <p className="post__excerpt">A look at the routing, the trained dispatchers, and the unglamorous spreadsheets behind 99.9%.</p>
                <span className="post__readmore">Read more →</span>
              </div>
            </a>

            <a className="post" href="#">
              <div className="post__photo">
                <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <linearGradient id="bp-2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#0b1f3a" /><stop offset="1" stopColor="#1a2b47" />
                    </linearGradient>
                    <pattern id="bpp-2" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.5" fill="rgba(255,255,255,0.3)" />
                    </pattern>
                  </defs>
                  <rect width="400" height="240" fill="url(#bp-2)" />
                  <rect width="400" height="240" fill="url(#bpp-2)" />
                </svg>
                <div className="post__tag">Translation</div>
              </div>
              <div className="post__body">
                <div className="post__meta"><span>Dec 22, 2025</span><span className="dot">·</span><span>4 min read</span></div>
                <h3 className="post__title">Breaking language barriers: the role of our translation service</h3>
                <p className="post__excerpt">Why a multilingual driver isn't a luxury for newcomers in Michigan — it's the difference between a ride and isolation.</p>
                <span className="post__readmore">Read more →</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* DRIVER CTA */}
      <section className="driver">
        <div className="driver__inner container">
          <div>
            <div className="eyebrow">
              <span className="eyebrow__num">VII</span>
              For drivers
            </div>
            <h2>Drive with purpose.<br />Earn with <em>predictability</em>.</h2>
            <p className="driver__sub">Recurring medical routes, no surge volatility, and a dispatch team that actually picks up. Average driver earns $1,240/wk. Bring your own vehicle or join the accessible fleet.</p>
            <div className="driver__row">
              <a className="btn-light" href="#">Apply to drive →</a>
              <span className="driver__note">Application takes ~10 minutes. Driving record &amp; insurance required.</span>
            </div>
          </div>
          <div className="driver__right">
            <div>
              <div className="driver__stat-big">$1,240</div>
              <div className="driver__stat-lab">Avg weekly · full‑time driver</div>
            </div>
            <div>
              <div className="driver__stat-big">+38<span className="sm">%</span></div>
              <div className="driver__stat-lab">Less surge volatility vs. competitors</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div>
              <div className="footer__brand-mark">
                <svg width="56" height="56" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                  <rect width="34" height="34" rx="6" fill="#fff" />
                  <path d="M9 24 L17 8 L25 24" stroke="#0b1f3a" strokeWidth="2.4" fill="none" />
                  <path d="M13 18 H21" stroke="#0b1f3a" strokeWidth="2.4" />
                  <circle cx="17" cy="27" r="1.6" fill="#2546b8" />
                </svg>
              </div>
              <div className="footer__brand-name">Abyride<span className="dot">.</span></div>
              <p className="footer__brand-line">Michigan's care‑first ride service. Family‑owned since 2014.</p>
              <div className="footer__dial">
                <div className="footer__dial-lab">Dispatch · 24 / 7</div>
                <a className="footer__dial-num" href="tel:+18338297339">(833) 829‑7339</a>
              </div>
            </div>

            <div className="footer__cols">
              <div>
                <div className="footer__col-h">Services</div>
                <ul className="footer__col-list">
                  <li><a className="footer__col-link" href="#">Medical transport</a></li>
                  <li><a className="footer__col-link" href="#">Wheelchair‑accessible vans</a></li>
                  <li><a className="footer__col-link" href="#">Airport pickup</a></li>
                  <li><a className="footer__col-link" href="#">Language translation</a></li>
                  <li><a className="footer__col-link" href="#">Everyday rides</a></li>
                  <li><a className="footer__col-link" href="#">Group &amp; corporate</a></li>
                </ul>
              </div>
              <div>
                <div className="footer__col-h">Explore</div>
                <ul className="footer__col-list">
                  <li><a className="footer__col-link" href="#">Our story</a></li>
                  <li><a className="footer__col-link" href="#">Our drivers</a></li>
                  <li><a className="footer__col-link" href="#">Cities served</a></li>
                  <li><a className="footer__col-link" href="#">Our fleet</a></li>
                  <li><a className="footer__col-link" href="#">Press</a></li>
                  <li><a className="footer__col-link" href="#">Field notes</a></li>
                </ul>
              </div>
              <div>
                <div className="footer__col-h">Help</div>
                <ul className="footer__col-list">
                  <li><a className="footer__col-link" href="#">Book a ride</a></li>
                  <li><a className="footer__col-link" href="#">For caregivers</a></li>
                  <li><a className="footer__col-link" href="#">For drivers</a></li>
                  <li><a className="footer__col-link" href="#">Insurance billing</a></li>
                  <li><a className="footer__col-link" href="#">Lost &amp; found</a></li>
                  <li><a className="footer__col-link" href="#">Contact dispatch</a></li>
                </ul>
              </div>
              <div>
                <div className="footer__col-h">Legal</div>
                <ul className="footer__col-list">
                  <li><a className="footer__col-link" href="#">Terms</a></li>
                  <li><a className="footer__col-link" href="#">Privacy</a></li>
                  <li><a className="footer__col-link" href="#">Accessibility</a></li>
                  <li><a className="footer__col-link" href="#">HIPAA notice</a></li>
                  <li><a className="footer__col-link" href="#">MDHHS license #4421</a></li>
                  <li><a className="footer__col-link" href="#">Copyright</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer__giant" aria-hidden="true">
            <svg viewBox="0 0 1320 200" preserveAspectRatio="xMaxYMax meet">
              <text x="0" y="180" fontFamily="Poppins, sans-serif" fontSize="240" fontStyle="italic" fontWeight="800" fill="#fff" letterSpacing="-12" opacity="0.9">Abyride<tspan fill="#7c9bff">.</tspan></text>
            </svg>
          </div>

          <div className="footer__bottom">
            <div>© 2014–2026 Abyride LLC · A Michigan corporation · All rights reserved.</div>
            <div className="footer__socials">
              <a className="footer__social" href="#">Tw</a>
              <a className="footer__social" href="#">Fb</a>
              <a className="footer__social" href="#">Ig</a>
              <a className="footer__social" href="#">Li</a>
              <a className="footer__social" href="#">Yt</a>
            </div>
            <div className="footer__lang">EN · FR · AR · ES · AM</div>
          </div>
        </div>
      </footer>
    </>
  );
}
