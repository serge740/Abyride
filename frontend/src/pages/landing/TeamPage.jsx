import { useLanguage } from '../../contexts/LanguageContext';
import { ExternalLink, Mail, ArrowRight } from 'lucide-react';
import imgSadiki  from '../../assets/images/landing/team/sadiki.png';
import imgLuciene from '../../assets/images/landing/team/Luciene.png';

const TEAM = [
  {
    id: 'sadiki',
    name: 'Sadiki Rukara',
    role: 'C.E.O',
    title: 'Chief Executive Officer & Co-Founder',
    bio: 'Sadiki founded Abyride in 2014 after recognizing that Michigan\'s most vulnerable residents — elderly patients, people with disabilities, and non-English speakers — were missing critical medical appointments due to unreliable transport. With a background in logistics and community health advocacy, he built Abyride from a 3-van operation in Detroit into a statewide network serving six cities.',
    img: imgSadiki,
    imgAlt: 'Sadiki Rukara, CEO of Abyride',
    accent: 'bg-accent',
    stat1: { n: '11+', l: 'Years leading Abyride' },
    stat2: { n: '3,200+', l: 'Medical trips per month' },
  },
  {
    id: 'luciene',
    name: 'Luciene Umutesi',
    role: 'M.D',
    title: 'Managing Director',
    bio: 'Luciene brings over a decade of experience in operations and community health management to Abyride. As Managing Director, she oversees the day-to-day operations of the company, driver training protocols, patient safety standards, and our HIPAA compliance program. She is a passionate advocate for health equity and sits on the MDHHS Non-Emergency Medical Transportation advisory board.',
    img: imgLuciene,
    imgAlt: 'Luciene Umutesi, Managing Director of Abyride',
    accent: 'bg-blue-glow',
    stat1: { n: '10+', l: 'Years in operations' },
    stat2: { n: '100%', l: 'Driver certification rate' },
  },
];

const VALUES = [
  {
    num: '01',
    title: 'Dignity first',
    body: 'Every passenger deserves to feel safe, seen, and respected — regardless of their mobility, language, or insurance status.',
  },
  {
    num: '02',
    title: 'Radical reliability',
    body: 'We don\'t optimize for average. We optimize for the one patient who cannot afford to miss their appointment.',
  },
  {
    num: '03',
    title: 'Community roots',
    body: 'We live in the communities we serve. Our drivers, dispatchers, and leadership reflect the diversity of Michigan.',
  },
  {
    num: '04',
    title: 'Health as access',
    body: 'Transport is healthcare. If you can\'t get to your appointment, the best care in the world means nothing.',
  },
];

function TeamCard({ member }) {
  return (
    <div className="group bg-surface border border-rule rounded-[16px] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      {/* Photo */}
      <div className="relative h-[360px] sm:h-[760px] object-cover object-center overflow-hidden bg-surface-2">
        <img
          src={member.img}
          alt={member.imgAlt}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/70 via-[#0b1f3a]/10 to-transparent" />
        {/* Role badge */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-white ${member.accent} mb-3`}>
            {member.role}
          </div>
          <div className="text-white text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] leading-none">
            {member.name}
          </div>
          <div className="text-white/70 text-[13px] mt-1">{member.title}</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <p className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.7] mb-6 flex-1">
          {member.bio}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-5 border-t border-b border-rule mb-6">
          {[member.stat1, member.stat2].map(s => (
            <div key={s.l}>
              <div className="text-[26px] font-bold tracking-[-0.03em] text-ink">{s.n}</div>
              <div className="text-[11px] text-muted uppercase tracking-[0.08em] font-medium mt-1 leading-tight">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex gap-2">
          <a
            href="#"
            aria-label="LinkedIn profile"
            className="w-9 h-9 border border-rule rounded-[6px] flex items-center justify-center text-ink-soft hover:text-accent hover:border-accent transition-colors"
          >
            <ExternalLink size={15} />
          </a>
          <a
            href="#"
            aria-label="Email"
            className="w-9 h-9 border border-rule rounded-[6px] flex items-center justify-center text-ink-soft hover:text-accent hover:border-accent transition-colors"
          >
            <Mail size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-surface text-ink transition-colors duration-300 min-h-screen">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="bg-navy text-on-dark py-14 lg:py-20 relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-5">
            <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">·</span>
            The people behind Abyride
          </div>
          <h1 className="text-[36px] sm:text-[52px] lg:text-[72px] leading-none tracking-[-0.04em] font-bold mb-4">
            Our team.
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/65 max-w-[540px] leading-[1.6]">
            Abyride is built by clinicians, logistics experts, and community advocates who believe transport is healthcare.
          </p>
        </div>
      </div>

      {/* ── Leadership ───────────────────────────────────────── */}
      <section className="px-5 sm:px-10 lg:px-16 py-16 lg:py-[100px]">
        <div className="mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold mb-3">
            <span className="text-accent text-[18px] italic font-bold tracking-normal">I</span>
            Leadership
          </div>
          <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-none tracking-[-0.035em] font-bold">
            The founders.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {TEAM.map(m => <TeamCard key={m.id} member={m} />)}
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section className="bg-navy text-on-dark py-16 lg:py-[100px] relative overflow-hidden">
        <div className="app-bg-grid" />
        <div className="px-5 sm:px-10 lg:px-16 relative z-[1]">
          <div className="mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.18em] uppercase text-white/50 font-semibold mb-3">
              <span className="text-blue-glow text-[18px] italic font-bold tracking-normal">II</span>
              What we believe
            </div>
            <h2 className="text-[28px] sm:text-[38px] lg:text-[48px] leading-none tracking-[-0.035em] font-bold">
              Our values.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map(v => (
              <div key={v.num} className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-6">
                <div className="text-[40px] italic font-extrabold text-blue-glow/40 leading-none mb-4">{v.num}</div>
                <h3 className="text-[17px] font-bold mb-2">{v.title}</h3>
                <p className="text-[13.5px] text-white/65 leading-[1.65]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join us CTA ──────────────────────────────────────── */}
      <section className="px-5 sm:px-10 lg:px-16 py-16 lg:py-24">
        <div className="bg-surface-2 border border-rule rounded-[16px] px-8 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-[520px]">
            <div className="text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold mb-3">Join the team</div>
            <h2 className="text-[26px] sm:text-[34px] lg:text-[42px] font-bold tracking-[-0.03em] leading-none mb-4">
              We're always looking for people who care.
            </h2>
            <p className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.65]">
              Dispatchers, developers, operations managers, and care coordinators. If you want to work somewhere that does something real, we'd love to talk.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-ink text-surface px-6 py-3.5 rounded-[8px] text-[14px] font-semibold hover:bg-ink/90 transition-colors"
            >
              Get in touch <ArrowRight size={16} />
            </a>
            <a
              href="/drivers"
              className="inline-flex items-center gap-2 border border-rule text-ink px-6 py-3.5 rounded-[8px] text-[14px] font-semibold hover:bg-surface-2 transition-colors"
            >
              Drive for us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}