/**
 * Abyride blog posts data store.
 * Each post has: id, slug, tag, date, readTime, title, excerpt, body (HTML string),
 * img (Unsplash URL), imgAlt, author, authorRole, featured.
 */

export const BLOGS = [
  {
    id: 1,
    slug: 'navigating-medicaid-transport-michigan',
    tag: 'Healthcare',
    date: 'Apr 12, 2025',
    readTime: '5 min read',
    featured: true,
    title: 'Navigating Medicaid Transport in Michigan: What Every Patient Needs to Know',
    excerpt:
      'Millions of Michigan residents qualify for free non-emergency medical transport through Medicaid — but most never use it. Here\'s the complete guide to booking a covered ride.',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=680&fit=crop&auto=format&q=80',
    imgAlt: 'Medical transport driver assisting a patient',
    author: 'Sadiki Rukara',
    authorRole: 'C.E.O',
    body: `
      <p>If you or a family member has Medicaid in Michigan, you may be entitled to free, door-to-door transport to your medical appointments — including dialysis, chemotherapy, physical therapy, and specialist visits. Yet the majority of eligible patients don't claim this benefit, often because they simply don't know it exists.</p>
      <h2>Who qualifies?</h2>
      <p>Anyone enrolled in Michigan Medicaid (including Healthy Michigan Plan) who has a verified medical appointment and lacks reliable transportation qualifies for Non-Emergency Medical Transportation (NEMT). This covers rides to hospitals, clinics, pharmacies, and specialist offices.</p>
      <h2>How to book with Abyride</h2>
      <p>Abyride is a MDHHS-approved NEMT provider. To book a covered ride: (1) call our dispatch at (833) 829-7339 at least 24 hours in advance, (2) provide your Medicaid ID and appointment details, and (3) confirm your pickup address and preferred time window.</p>
      <h2>What about same-day rides?</h2>
      <p>For urgent same-day transport, call dispatch directly. We'll do our best to accommodate you, though coverage for same-day rides may vary by plan.</p>
      <p>Questions? Our bilingual dispatch team is available around the clock to help you understand your coverage and get you where you need to go.</p>
    `,
  },
  {
    id: 2,
    slug: 'wheelchair-accessible-transport-detroit',
    tag: 'Accessibility',
    date: 'Mar 28, 2025',
    readTime: '4 min read',
    featured: true,
    title: 'How Wheelchair-Accessible Transport Is Changing Lives Across Detroit',
    excerpt:
      'From dialysis runs to job interviews, our accessible van fleet is doing more than moving people — it\'s restoring independence for thousands of Detroiters.',
    img: 'https://images.unsplash.com/photo-1559839734-2851eb3e7b7b?w=1200&h=680&fit=crop&auto=format&q=80',
    imgAlt: 'Wheelchair accessible van with ramp deployed',
    author: 'Luciene Umutesi',
    authorRole: 'M.D',
    body: `
      <p>For people who use wheelchairs, getting from point A to point B is rarely as simple as opening an app. Standard rideshares can't accommodate most mobility devices. Paratransit is often unreliable and limited in scope. Private accessible transport has historically been expensive and hard to schedule.</p>
      <h2>The gap we set out to fill</h2>
      <p>When Abyride launched its accessible fleet in 2017, the goal was straightforward: provide reliable, on-time, dignified transport for wheelchair users across metro Detroit. Today, our 68 ADA-compliant vans serve patients in Detroit, Ann Arbor, Lansing, Grand Rapids, Flint, and Dearborn.</p>
      <h2>Features of our accessible vans</h2>
      <p>Every van in our accessible fleet is equipped with: power side and rear ramps, four-point wheelchair tie-down systems, securement belts, and a trained driver certified in passenger assistance techniques. All drivers complete our care-first orientation and are recertified annually.</p>
      <h2>Booking an accessible ride</h2>
      <p>Download the Abyride app and select "Accessible" when booking, or call (833) 829-7339 to speak with dispatch. We recommend booking at least 2 hours in advance for scheduled trips. Emergency rides can often be accommodated within 45 minutes.</p>
    `,
  },
  {
    id: 3,
    slug: 'airport-transfer-guide-dtw-grr',
    tag: 'Travel',
    date: 'Mar 10, 2025',
    readTime: '3 min read',
    featured: false,
    title: 'The Stress-Free Airport Transfer Guide: DTW, GRR & FNT',
    excerpt:
      'Flight delays, heavy luggage, and tight connections — airport runs require a different level of reliability. Here\'s how Abyride handles Michigan\'s busiest airports.',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=680&fit=crop&auto=format&q=80',
    imgAlt: 'Airport terminal with passengers arriving',
    author: 'Sadiki Rukara',
    authorRole: 'C.E.O',
    body: `
      <p>Missing a flight or waiting an hour for a late driver at arrivals is stressful. Abyride's airport transfer service is built from the ground up to eliminate both scenarios.</p>
      <h2>Flight tracking on every trip</h2>
      <p>When you book an airport pickup with Abyride, we automatically monitor your flight status in real time. If your flight lands 40 minutes early or is delayed by two hours, your driver adjusts automatically. You'll never wait at the curb for a driver who doesn't know your flight changed.</p>
      <h2>Airports we serve</h2>
      <ul><li>Detroit Metropolitan Wayne County Airport (DTW)</li><li>Gerald R. Ford International Airport (GRR)</li><li>Bishop International Airport (FNT)</li><li>Capital Region International Airport (LAN)</li></ul>
      <h2>Fixed fares, no surge pricing</h2>
      <p>Unlike app-based rideshares, Abyride airport fares are locked at booking. The price you see is the price you pay — regardless of weather, traffic, or time of day.</p>
    `,
  },
  {
    id: 4,
    slug: 'language-access-medical-transport',
    tag: 'Community',
    date: 'Feb 22, 2025',
    readTime: '6 min read',
    featured: false,
    title: 'Why Language Access Is a Healthcare Issue, Not a Courtesy',
    excerpt:
      'When a patient can\'t communicate with their healthcare provider, the outcomes suffer. Abyride\'s 14-language driver network is one piece of a larger solution.',
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=680&fit=crop&auto=format&q=80',
    imgAlt: 'Two people communicating across a language barrier',
    author: 'Luciene Umutesi',
    authorRole: 'M.D',
    body: `
      <p>Michigan is home to one of the most linguistically diverse populations in the Midwest. Detroit alone has significant communities speaking Arabic, Spanish, Bengali, Amharic, Somali, and dozens of other languages. For these communities, a ride to the hospital can be more than physically challenging — it can be linguistically isolating.</p>
      <h2>The evidence is clear</h2>
      <p>Studies consistently show that patients with limited English proficiency (LEP) experience worse health outcomes, higher rates of medication errors, and reduced follow-up compliance when language support is absent. A ride to the clinic that includes a driver who can explain post-visit instructions or answer a basic question in the patient's language is not a luxury — it's a health intervention.</p>
      <h2>How Abyride approaches language access</h2>
      <p>We hire and certify drivers who speak Arabic, Amharic, Spanish, French, Kinyarwanda, Somali, and eight other languages. When you book, you can request a multilingual driver or on-demand video interpretation for any language. Both options are covered under most Michigan Medicaid plans.</p>
    `,
  },
  {
    id: 5,
    slug: 'recurring-medical-rides-guide',
    tag: 'How-To',
    date: 'Feb 5, 2025',
    readTime: '4 min read',
    featured: false,
    title: 'How to Set Up Recurring Medical Rides (and Never Miss a Session)',
    excerpt:
      'If you have weekly dialysis, chemotherapy, or physical therapy, you shouldn\'t have to rebook each time. Here\'s how Abyride\'s recurring ride system works.',
    img: 'https://images.unsplash.com/photo-1519494026892-476f9e6a0e9e?w=1200&h=680&fit=crop&auto=format&q=80',
    imgAlt: 'Dispatch coordinator managing transport routes',
    author: 'Sadiki Rukara',
    authorRole: 'C.E.O',
    body: `
      <p>For patients with regular medical appointments — dialysis three times a week, oncology every Tuesday, physical therapy every Friday morning — rebooking a ride each time is friction that adds up fast. Abyride's recurring ride system eliminates that entirely.</p>
      <h2>Setting up a recurring schedule</h2>
      <p>In the Abyride app, tap "Recurring" when booking. Select the days of the week, pickup time, pickup address, and destination. Confirm with your Medicaid ID if applicable. That's it — your rides are automatically scheduled until you cancel or modify the series.</p>
      <h2>What if my appointment time changes?</h2>
      <p>You can modify or cancel any individual ride in the series without affecting the others. Tap the specific ride in your calendar, choose "Edit this ride," and adjust the time. Changes are free with at least 4 hours notice.</p>
      <h2>Caregiver booking</h2>
      <p>Family members and caregivers can set up recurring rides on behalf of a patient directly from their own Abyride account. Add a "Care Recipient" profile under Settings and book under their name. They'll receive independent pickup notifications.</p>
    `,
  },
  {
    id: 6,
    slug: 'meet-our-drivers',
    tag: 'Company',
    date: 'Jan 18, 2025',
    readTime: '5 min read',
    featured: true,
    title: 'Meet Our Drivers: The People Behind Every Abyride',
    excerpt:
      'Behind every Abyride is a driver who passed a background check, completed our care-first training, and chose a job that means something. We sat down with three of them.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=680&fit=crop&auto=format&q=80',
    imgAlt: 'Professional driver smiling in their vehicle',
    author: 'Luciene Umutesi',
    authorRole: 'M.D',
    body: `
      <p>When you book an Abyride, the driver you're matched with has been background-checked, DMV-verified, and trained in our care-first protocol — which covers passenger assistance, emergency response, and de-escalation. But numbers and checklists don't capture who these people actually are.</p>
      <h2>James, dialysis route driver — Detroit</h2>
      <p>"I've been driving the same three patients to Henry Ford on Monday, Wednesday, Friday for two years. I know their names, their families. One of them, Mr. Harris, he told me I'm part of his care team now. That means everything to me."</p>
      <h2>Amina, multilingual driver — Dearborn</h2>
      <p>"I speak Arabic and English fluently. A lot of my passengers, they don't feel comfortable speaking English at a doctor's visit. When I can explain something to them in Arabic on the way home, I can see the relief. It's not just a ride."</p>
      <h2>David, airport specialist — Grand Rapids</h2>
      <p>"I've driven the same corporate client to GRR for three years. He told me once that reliability is the most valuable thing in his life. That's what I try to give every single passenger — just show up, on time, every time."</p>
      <p>Interested in driving for Abyride? Visit our <a href="/drivers">driver page</a> to learn about opportunities.</p>
    `,
  },
];

export const getFeatured = () => BLOGS.filter(b => b.featured);
export const getBySlug   = (slug) => BLOGS.find(b => b.slug === slug);
export const getByTag    = (tag)  => BLOGS.filter(b => b.tag === tag);
