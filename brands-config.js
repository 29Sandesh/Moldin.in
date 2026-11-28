/**
 * @fileoverview Editable configuration for MOLDIN.india® Hero kinetic 3D brand rings,
 * contact routing, and Featured Creators playing-card roster.
 *
 * HOW TO EDIT BRANDS IN THE HERO RINGS:
 * Simply add, remove, or rename entries inside `HERO_BRAND_RINGS[*].brands`.
 * Supported custom vector emblems: 'boat', 'coca-cola', 'netflix', 'spotify', 'dove', 'puma'.
 * Any other brand `name` (e.g. 'Nike', 'Nothing', 'Zepto', 'Red Bull') automatically renders
 * in bold studio wordmark typography matching the neon glass ribbon.
 */

export const MOLDIN_CONTACT = Object.freeze({
  creatorFormUrl: 'https://forms.gle/CUitj8LUdULQovqw7',
  instagramUrl: 'https://www.instagram.com/sandeshyaar/',
  instagramHandle: '@sandeshyaar',
  // Set your official digits with country code (e.g. '9198XXXXXXXX') for direct 1-tap wa.me routing.
  // While empty, clicking "WhatsApp Me" opens WhatsApp share composer or quick brief modal.
  whatsappDigits: '',
  defaultWhatsappGreeting:
    'Hi MOLDIN.india! We would like to launch a creator campaign. Brand & Goal:',
  brandWhatsappGreeting:
    'Hello MOLDIN.india team, we are reaching out as a brand interested in launching a creator collaboration campaign with you. Could you please share more details about how you execute campaigns and upcoming availability?',
});

/**
 * Editable 3D kinetic glass ribbon orbits rendered behind the hero creator cutout.
 * Modify `brands`, `speed`, `tiltDeg`, or `glowColors` anytime.
 */
export const HERO_BRAND_RINGS = [
  {
    id: 'upper-primary-ring',
    label: 'Primary Upper Neon Ring',
    // Clean, spacious marquee showcase of iconic consumer brands
    brands: [
      { name: 'boAt', badgeType: 'boat', accent: '#ffffff' },
      { name: 'Coca-Cola', badgeType: 'coca-cola', accent: '#ffffff' },
      { name: 'Netflix', badgeType: 'netflix', accent: '#ffffff' },
      { name: 'Spotify', badgeType: 'spotify', accent: '#00e8f8' },
      { name: 'PUMA', badgeType: 'puma', accent: '#ffffff' },
    ],
    // Physics & 3D orbit geometry
    centerYRatio: 0.615,
    radiusXRatio: 0.405,
    radiusYRatio: 0.082,
    radiusZRatio: 0.142,
    bandHeightRatio: 0.118,
    tiltZDeg: 4.0,
    tiltXDeg: 18,
    // Angular velocity (radians/sec) — positive sweeps strips smoothly left-to-right
    angularSpeed: 0.145,
    rimLeft: '#00e8f8',
    rimMid: '#ffffff',
    rimRight: '#e6b84c',
  },
  {
    id: 'lower-counter-ring',
    label: 'Secondary Lower Client Ring',
    // Active campaign & partner brands including SunoSunao.ai and Nonstop Energy
    brands: [
      { name: 'SunoSunao.ai', badgeType: 'sunosunao', accent: '#00e8f8' },
      { name: 'Nonstop Energy', badgeType: 'nonstop', accent: '#f5c451' },
      { name: 'Mokobara', badgeType: 'mokobara', accent: '#ffffff' },
      { name: 'Ultrahuman', badgeType: 'ultrahuman', accent: '#00e8f8' },
      { name: 'PromptFlow', badgeType: 'promptflow', accent: '#f5c451' },
    ],
    centerYRatio: 0.76,
    radiusXRatio: 0.398,
    radiusYRatio: 0.070,
    radiusZRatio: 0.132,
    bandHeightRatio: 0.108,
    tiltZDeg: -6.5,
    tiltXDeg: 16,
    // Counter-rotation for dynamic dual-ring motion
    angularSpeed: -0.115,
    rimLeft: '#e6b84c',
    rimMid: '#00e8f8',
    rimRight: '#e6b84c',
  },
];

/**
 * Verified 8-creator roster rendered as luxury playing cards (2 Golden Star Kings + 6 King/Queen cards).
 */
export const FEATURED_CREATORS = [
  {
    id: 'amlendra',
    name: 'Amlendra Kumar',
    handle: 'amlendra.in',
    url: 'https://www.instagram.com/amlendra.in/',
    followers: '626K Followers',
    niche: 'AI & Apps',
    rank: 'K',
    suit: '♠',
    suitColor: 'gold',
    tier: 'star',
    portrait: 'assets/creators_cards/amlendra.webp',
    fallbackPortrait: 'assets/creators_real/amlendra.in.jpg',
    bio: 'Flagship AI workflows, productivity software breakdowns, and high-retention tech reels.',
  },
  {
    id: 'sandesh',
    name: 'Sandesh Agrawal',
    handle: 'sandeshyaar',
    url: 'https://www.instagram.com/sandeshyaar/',
    followers: '88K Followers',
    niche: 'Tech & AI',
    rank: 'K',
    suit: '♥',
    suitColor: 'gold',
    tier: 'star',
    portrait: 'assets/creators_cards/sandesh.webp',
    fallbackPortrait: 'assets/creators_real/sandeshyaar.jpg',
    bio: 'Co-lead creator desk driving product storytelling, dev tools, and founder-led tech campaigns.',
  },
  {
    id: 'shubham',
    name: 'Shubham Joshi',
    handle: 'shubham_joshii',
    url: 'https://www.instagram.com/shubham_joshii/',
    followers: '50K',
    niche: 'Travel',
    rank: 'K',
    suit: '♦',
    suitColor: 'crimson',
    tier: 'roster',
    portrait: 'assets/creators_cards/shubham.webp',
    fallbackPortrait: 'assets/creators_real/shubham_joshii.jpg',
    bio: 'Cinematic visual diaries, boutique stays, and crisp lifestyle integrations.',
  },
  {
    id: 'varnika',
    name: 'Varnika',
    handle: 'v4rnikaa',
    url: 'https://www.instagram.com/v4rnikaa/reels/',
    followers: '45.3K',
    niche: 'Fashion',
    rank: 'Q',
    suit: '♣',
    suitColor: 'ink',
    tier: 'roster',
    portrait: 'assets/creators_cards/varnika.webp',
    fallbackPortrait: 'assets/creators_real/v4rnikaa.jpg',
    bio: 'Editorial lookbooks, street styling, and high-save D2C fashion reels.',
  },
  {
    id: 'shree',
    name: 'Shree',
    handle: 'shrey_.aaaa',
    url: 'https://www.instagram.com/shrey_.aaaa/',
    followers: '30.1K',
    niche: 'Beauty',
    rank: 'Q',
    suit: '♥',
    suitColor: 'crimson',
    tier: 'roster',
    portrait: 'assets/creators_cards/shree.webp',
    fallbackPortrait: 'assets/creators_real/shrey_.aaaa_face.jpg',
    bio: 'Authentic skincare rituals, beauty routines, and Gen-Z product discovery.',
  },
  {
    id: 'param',
    name: 'Param Jain',
    handle: 'paraamjain',
    url: 'https://www.instagram.com/paraamjain/',
    followers: '28.8K',
    niche: 'Travel',
    rank: 'K',
    suit: '♠',
    suitColor: 'ink',
    tier: 'roster',
    portrait: 'assets/creators_cards/param.webp',
    fallbackPortrait: 'assets/creators_real/paraamjain.jpg',
    bio: 'Raw travel narratives, youth culture POVs, and outdoor gear testing.',
  },
  {
    id: 'aryan',
    name: 'Aryan H Choudharry',
    handle: 'aryann.aesthetics',
    url: 'https://www.instagram.com/aryann.aesthetics/',
    followers: '24.9K',
    niche: 'Fitness',
    rank: 'K',
    suit: '♦',
    suitColor: 'crimson',
    tier: 'roster',
    portrait: 'assets/creators_cards/aryan.webp',
    fallbackPortrait: 'assets/creators_real/aryann.aesthetics_face.jpg',
    bio: 'Athletic conditioning, sports nutrition, and high-energy gym transformation reels.',
  },
  {
    id: 'divya',
    name: 'Divya Vashishtha',
    handle: 'd1vyya._',
    url: 'https://www.instagram.com/d1vyya._/',
    followers: '18.7K',
    niche: 'Model',
    rank: 'Q',
    suit: '♣',
    suitColor: 'ink',
    tier: 'roster',
    portrait: 'assets/creators_cards/divya.webp',
    fallbackPortrait: 'assets/creators_real/d1vyya._face.jpg',
    bio: 'Campaign stills, luxury accessories, and studio-grade commercial modeling.',
  },
];
