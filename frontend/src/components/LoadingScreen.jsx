import logo from '../assets/images/abyride_logo.png';

const STARS = [
  { top: '8%',  left: '12%', size: 2,   dur: '3.1s', delay: '0.0s' },
  { top: '15%', left: '28%', size: 1.5, dur: '4.2s', delay: '0.7s' },
  { top: '6%',  left: '45%', size: 1,   dur: '2.8s', delay: '1.2s' },
  { top: '22%', left: '61%', size: 2,   dur: '3.7s', delay: '0.3s' },
  { top: '10%', left: '74%', size: 1.5, dur: '5.0s', delay: '1.8s' },
  { top: '18%', left: '88%', size: 1,   dur: '2.4s', delay: '0.6s' },
  { top: '32%', left: '7%',  size: 1,   dur: '3.5s', delay: '2.1s' },
  { top: '28%', left: '35%', size: 2,   dur: '4.8s', delay: '0.9s' },
  { top: '38%', left: '55%', size: 1,   dur: '3.2s', delay: '1.5s' },
  { top: '25%', left: '80%', size: 1.5, dur: '2.9s', delay: '0.2s' },
  { top: '42%', left: '20%', size: 1,   dur: '4.1s', delay: '1.1s' },
  { top: '5%',  left: '93%', size: 2,   dur: '2.6s', delay: '1.4s' },
  { top: '14%', left: '3%',  size: 1.5, dur: '3.9s', delay: '2.3s' },
  { top: '20%', left: '50%', size: 1,   dur: '5.2s', delay: '0.4s' },
  { top: '34%', left: '68%', size: 1,   dur: '3.6s', delay: '1.0s' },
  { top: '46%', left: '40%', size: 1.5, dur: '4.4s', delay: '0.8s' },
  { top: '12%', left: '83%', size: 2,   dur: '2.7s', delay: '1.6s' },
  { top: '40%', left: '92%', size: 1,   dur: '4.0s', delay: '2.0s' },
];

export default function LoadingScreen() {
  return (
    <div className="ls-root">
      <style>{`
        /* ── Root ───────────────────────────────────────────── */
        .ls-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
          /* light = bright sky blue */
          background-color: #2e8fe8;
        }
        [data-theme="dark"] .ls-root {
          background-color: var(--c-break-bg);
        }

        /* ── Sky ────────────────────────────────────────────── */
        .ls-sky {
          position: absolute;
          inset: 0 0 45% 0;
          /* light = midday blue sky, lighter at horizon */
          background: radial-gradient(ellipse 100% 70% at 50% 100%, #a8d8f8 0%, #4ba3e8 40%, #1a7ad4 100%);
        }
        [data-theme="dark"] .ls-sky {
          background: radial-gradient(ellipse 80% 60% at 50% 100%, #0f2768 0%, var(--c-break-bg) 52%, var(--c-break-bg-2) 100%);
        }

        /* ── Stars ──────────────────────────────────────────── */
        .ls-star {
          position: absolute;
          border-radius: 50%;
          background: transparent; /* hidden in light / midday */
          animation: ls-star-float var(--dur, 3s) ease-in-out var(--delay, 0s) infinite;
        }
        [data-theme="dark"] .ls-star {
          background: #ffffff;
        }

        /* ── Horizon glow ───────────────────────────────────── */
        .ls-horizon {
          position: absolute;
          top: 55%; left: 50%;
          transform: translateX(-50%);
          width: 82%; height: 2px;
          filter: blur(3px);
          /* light = warm golden sun haze */
          background: linear-gradient(90deg, transparent 0%, #fde68a 22%, rgba(255,255,255,0.98) 50%, #fde68a 78%, transparent 100%);
          animation: ls-horizon-pulse 3.2s ease-in-out infinite;
        }
        [data-theme="dark"] .ls-horizon {
          background: linear-gradient(90deg, transparent 0%, #7c9bff 22%, rgba(255,255,255,0.95) 50%, #7c9bff 78%, transparent 100%);
        }

        /* ── 3D grid stage ──────────────────────────────────── */
        .ls-grid-stage {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 45%;
          perspective: 280px;
          perspective-origin: 50% 0%;
          overflow: hidden;
        }

        /* ── Grid floor — uses actual web color tokens ──────── */
        .ls-grid-floor {
          position: absolute;
          inset: 0;
          transform: rotateX(72deg);
          transform-origin: center top;
          animation: ls-grid-scroll 1.6s linear infinite;
          background-size: 120px 120px;
          background-position: center 0px;
          /* light = website's light surface color */
          background-color: var(--c-bg-3);
          background-image:
            linear-gradient(rgba(37, 70, 184, 0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 70, 184, 0.18) 1px, transparent 1px);
        }
        [data-theme="dark"] .ls-grid-floor {
          /* dark = website's dark break section color */
          background-color: var(--c-break-bg-2);
          background-image:
            linear-gradient(rgba(124, 155, 255, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 155, 255, 0.22) 1px, transparent 1px);
        }

        /* ── Logo wrap ──────────────────────────────────────── */
        .ls-logo-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ls-logo-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ── Logo halo ──────────────────────────────────────── */
        .ls-logo-halo {
          position: absolute;
          inset: -28px -52px;
          filter: blur(28px);
          animation: ls-logo-glow 2.8s ease-in-out infinite;
          pointer-events: none;
          /* light = white sun glow */
          background: radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, transparent 70%);
        }
        [data-theme="dark"] .ls-logo-halo {
          background: radial-gradient(ellipse, rgba(124,155,255,0.72) 0%, transparent 70%);
        }

        /* ── Logo image ─────────────────────────────────────── */
        .ls-logo-img {
          position: relative;
          z-index: 1;
          height: 58px;
          width: auto;
          object-fit: contain;
          /* always white — readable on both sky blue and navy */
          filter: brightness(0) invert(1);
        }

        /* ── Tagline ────────────────────────────────────────── */
        .ls-tagline {
          margin-top: 14px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          animation: ls-tagline-in 0.8s ease-out 0.35s both;
          color: rgba(255, 255, 255, 0.90);
        }
        [data-theme="dark"] .ls-tagline {
          color: rgba(255, 255, 255, 0.55);
        }

        /* ── Progress bar ───────────────────────────────────── */
        .ls-bar-track {
          position: relative;
          overflow: hidden;
          width: 200px; height: 2px;
          border-radius: 999px;
          margin-top: 28px;
          background: rgba(255, 255, 255, 0.25);
        }
        [data-theme="dark"] .ls-bar-track {
          background: rgba(255, 255, 255, 0.10);
        }

        .ls-bar-fill {
          position: absolute;
          inset: 0; width: 50%;
          animation: ls-bar-shimmer 1.8s ease-in-out 0.5s infinite;
          /* light = warm golden shimmer */
          background: linear-gradient(90deg, transparent 0%, #fde68a 38%, rgba(255,255,255,0.98) 50%, #fde68a 62%, transparent 100%);
        }
        [data-theme="dark"] .ls-bar-fill {
          background: linear-gradient(90deg, transparent 0%, #7c9bff 38%, rgba(255,255,255,0.95) 50%, #7c9bff 62%, transparent 100%);
        }

        /* ── Keyframes ──────────────────────────────────────── */
        @keyframes ls-logo-in {
          from { opacity: 0; transform: translateY(14px) scale(0.97); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0);   }
        }
        @keyframes ls-logo-glow {
          0%, 100% { opacity: 0.35; transform: scale(0.96); filter: blur(28px); }
          50%       { opacity: 0.70; transform: scale(1.10); filter: blur(22px); }
        }
        @keyframes ls-tagline-in {
          from { opacity: 0; letter-spacing: 0.38em; }
          to   { opacity: 1; letter-spacing: 0.22em; }
        }
        @keyframes ls-grid-scroll {
          from { background-position: center 0px;   }
          to   { background-position: center 120px; }
        }
        @keyframes ls-horizon-pulse {
          0%, 100% { opacity: 0.45; transform: translateX(-50%) scaleX(0.88); }
          50%       { opacity: 0.85; transform: translateX(-50%) scaleX(1.00); }
        }
        @keyframes ls-bar-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%);  }
        }
        @keyframes ls-star-float {
          0%, 100% { opacity: 0.12; transform: translateY(0);    }
          50%       { opacity: 0.85; transform: translateY(-4px); }
        }

        /* ── Reduced motion ─────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .ls-grid-floor  { animation: none; }
          .ls-logo-halo   { animation: none; opacity: 0.42; filter: blur(28px); }
          .ls-bar-fill    { animation: none; transform: translateX(75%); }
          .ls-horizon     { animation: none; opacity: 0.65; transform: translateX(-50%); }
          .ls-star        { animation: none; opacity: 0.30; }
          .ls-tagline     { animation: none; opacity: 0.85; letter-spacing: 0.22em; }
        }
      `}</style>

      {/* Sky */}
      <div className="ls-sky">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="ls-star"
            style={{
              top: s.top, left: s.left,
              width: `${s.size}px`, height: `${s.size}px`,
              '--dur': s.dur, '--delay': s.delay,
            }}
          />
        ))}
      </div>

      {/* Horizon glow */}
      <div className="ls-horizon" />

      {/* 3D grid road */}
      <div className="ls-grid-stage">
        <div className="ls-grid-floor" />
      </div>

      {/* Center: logo + tagline + bar */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingBottom: '5%',
      }}>
        <div className="ls-logo-wrap">
          <div className="ls-logo-halo" />
          <img src={logo} alt="Abyride" className="ls-logo-img" />
        </div>
        <p className="ls-tagline">Michigan Medical Transport</p>
        <div className="ls-bar-track">
          <div className="ls-bar-fill" />
        </div>
      </div>
    </div>
  );
}
