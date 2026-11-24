const people = {
  hero: ['assets/characters/hero-creator.png', 'Creator in black sunglasses and hoodie'],
  heroAttitude: ['assets/characters/hero-creator-attitude.png', 'Creator with attitude smile in sunglasses and hoodie'],
  creator: ['assets/characters/creator-duo.png', 'Creator duo in pink and cyan streetwear with sunglasses'],
  brandDuo: ['assets/characters/brand-duo.png', 'Executive brand duo in suits with sunglasses'],
  collaborator: ['assets/characters/brand-duo.png', 'Creative collaborator'],
  headphones: ['assets/characters/brand-creator-woman.png', 'Creator wearing headphones']
};

class MoldinButton extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || 'Get started';
    const light = this.hasAttribute('light') ? ' button--light' : '';
    const isCreator = label.toLowerCase().includes('creator');
    const href = this.getAttribute('href') || (isCreator ? 'https://forms.gle/CUitj8LUdULQovqw7' : '#demo-note');
    const target = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
    this.innerHTML = `<a class="button${light}" href="${href}"${target}>${label} <b aria-hidden="true">→</b></a>`;
  }
}

class MoldinFlowNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<nav class="flow-nav" aria-label="Page sections"><a href="#top">01 <span>Home</span></a><a href="#how-it-works">02 <span>How it works</span></a><a href="#creators">03 <span>Creators</span></a><a href="#brands">04 <span>Brands</span></a></nav>`;
  }
}

class CreatorImage extends HTMLElement {
  connectedCallback() {
    const personKey = this.getAttribute('person');
    const person = people[personKey];
    if (personKey === 'hero') {
      this.innerHTML = `
        <img class="img-normal" src="${person[0]}" alt="${person[1]}">
        <img class="img-attitude" src="${people.heroAttitude[0]}" alt="${people.heroAttitude[1]}">
      `;
    } else {
      this.innerHTML = `<img src="${person[0]}" alt="${person[1]}">`;
    }
  }
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || '';
    const isCampaigns = active === 'campaigns' ? ' active' : '';
    const isBrands = active === 'brands' ? ' active' : '';
    const isCreators = active === 'creators' ? ' active' : '';

    this.innerHTML = `
      <header class="header">
        <a class="wordmark" href="index.html">MOLDIN<span>.</span></a>
        <nav aria-label="Primary navigation">
          <a class="${isCampaigns}" href="campaigns.html">Campaigns</a>
          <a class="${isBrands}" href="brands.html">Brands</a>
          <a class="${isCreators}" href="creators.html">Creators</a>
        </nav>
        <button class="button button--header open-brand-modal-btn" type="button">Let’s Talk <b aria-hidden="true">→</b></button>
      </header>
    `;

    const talkBtn = this.querySelector('.open-brand-modal-btn');
    if (talkBtn) {
      talkBtn.addEventListener('click', () => {
        window.openMoldinModal?.('brand');
      });
    }
  }
}

class HeroSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="hero" id="top">
        <div class="hero-blue" aria-hidden="true"></div>
        <div class="hero-pink" aria-hidden="true"></div>

        <div class="hero-heading-wrap">
          <h1 class="hero-title-packed">
            <div class="hero-row-1">
              <span class="word-we">WE</span>
              <span class="word-connect">CONNECT</span>
              <span class="word-brands">BRANDS</span>
              <span class="heading-slashes" aria-hidden="true">///</span>
            </div>
            <div class="hero-row-2">
              <span class="word-with">WITH</span>
              <span class="word-creators">CREATORS<span class="dot-black">.</span></span>
            </div>
          </h1>
          <p class="hero-subline-packed">That's it.</p>
        </div>

        <!-- CREATOR TRIO (WITH BIG WHITE CIRCLE AS BACKGROUND) -->
        <div class="hero-creators-trio">
          <div class="hero-trio-circle" aria-hidden="true"></div>
          <img class="hero-girl hero-girl-left" src="assets/characters/hero-creator-girl-left.png" alt="Creator girl in cyan hoodie facing left">
          <creator-image class="hero-person" person="hero"></creator-image>
          <img class="hero-girl hero-girl-right" src="assets/characters/hero-creator-girl-right.png" alt="Creator girl in pink sweatshirt facing right">
        </div>

        <moldin-button class="hero-button" label="Join as Creator" href="https://forms.gle/CUitj8LUdULQovqw7" light></moldin-button>
        <svg class="hero-bottom-ribbon" viewBox="0 -8 1024 152" preserveAspectRatio="none" aria-hidden="true">
          <path class="ribbon-pink" d="M0 9C123-25 180 23 282 54c109 33 202-8 310-3 142 7 189 62 432 26v70H0Z"/>
          <path class="ribbon-blue" d="M0 42c91-34 175-6 278 34 118 45 217 13 323-2 155-21 269-63 423-23v33c-168-38-273 58-432 46-109-9-202 28-314-10C174 82 91 12 0 74Z"/>
          <path class="ribbon-peach" d="M0 75c116-57 205 3 302 31 115 34 194 1 297-10 152-16 282-64 425-28v80H0Z"/>
        </svg>
      </section>
    `;
  }
}

class StepsSection extends HTMLElement {
  connectedCallback() {
    const card = (number, title) => `
      <article class="step step-circle">
        <span class="step-bg-num" aria-hidden="true">${number}</span>
        <span class="step-label">${title}</span>
      </article>
    `;
    this.innerHTML = `
      <section class="steps" id="how-it-works">
        <div class="steps-inner">
          <p class="tag">How it works</p>
          <h2 class="steps-heading">
            <span class="step-line-1"><span class="word-from">FROM</span> <span class="word-signup">SIGN UP</span></span><br>
            <span class="step-line-2"><span class="word-to">TO</span> <span class="word-brand-deals">BRAND DEALS</span></span><br>
            <span class="steps-badge">IN 3 STEPS<span class="step-dot">.</span></span>
          </h2>
          <svg class="connector" viewBox="0 0 520 115" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 97C58 117 73 53 133 61s63 39 124 23c54-14 58-70 123-39 53 25 64 9 140 26"/>
          </svg>
          <div class="step-grid">
            ${card('01', 'Sign Up')}
            ${card('02', 'Get Matched')}
            ${card('03', 'Collaborate')}
          </div>
        </div>
      </section>
    `;
  }
}

class CreatorsBrandsSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="creators-brands-section" id="creators">
        <div class="split-container">
          <!-- LEFT SIDE: FOR CREATORS -->
          <div class="split-side split-side--creator">
            <div class="split-visual split-visual--creator">
              <h3 class="card-backdrop-title card-backdrop-title--creator">CREATORS</h3>
              <div class="creator-frame" aria-hidden="true"></div>
              <creator-image class="creator-person creator-duo" person="creator"></creator-image>
              <div class="rays creator-rays" aria-hidden="true"><i></i><i></i><i></i></div>
            </div>
            <div class="split-content split-content--creator">
              <h2 class="split-title-single">YOU CREATE. <span class="brand-text">WE CONNECT.</span></h2>
              <p class="split-desc-funny">Dude, it’s literally 100% free. You get real brand collabs handed to you on a silver platter and you still need a REASON? Sign up already.</p>
              <a class="button modal-trigger-creator" href="https://forms.gle/CUitj8LUdULQovqw7" target="_blank" rel="noopener">Join as Creator <b aria-hidden="true">→</b></a>
            </div>
          </div>

          <!-- RIGHT SIDE: FOR BRANDS -->
          <div class="split-side split-side--brand" id="brands">
            <div class="split-visual split-visual--brand">
              <h3 class="card-backdrop-title card-backdrop-title--brand">BRANDS</h3>
              <div class="brand-frame" aria-hidden="true"></div>
              <creator-image class="brand-person brand-duo" person="collaborator"></creator-image>
              <div class="rays brand-rays" aria-hidden="true"><i></i><i></i><i></i></div>
            </div>
            <div class="split-content split-content--brand">
              <h2 class="split-title-single">YOU SCALE. <span class="creator-text">WE DELIVER.</span></h2>
              <p class="split-desc-funny">Cold DMs are awkward, agency retainers are borderline extortion, and fake followers convert zero sales. We connect you with verified, hungry creators who actually move product.</p>
              <button class="button button--light modal-trigger-brand" type="button">Partner with MOLDIN <b aria-hidden="true">→</b></button>
            </div>
          </div>
        </div>

        <!-- THIRD BLOCK: BRANDS LET'S TALK -->
        <div class="brands-talk-banner">
          <div class="talk-inner">
            <div class="talk-heading-wrap">
              <p class="talk-tag">BRANDS</p>
              <h2 class="talk-title">LET’S TALK<span class="dot-pink">.</span></h2>
            </div>
            <p class="talk-body">Honestly? Even we don't know all the secrets, but other brands took a shot with us and they’re genuinely happy. We won't make fake promises or sell vanity numbers. We're trying our best every day, and we won't stop until you’re smiling.</p>
            <div class="talk-cta-wrap">
              <button class="button talk-cta talk-cta-floating modal-trigger-brand" type="button">Book a Chat <b aria-hidden="true">→</b></button>
            </div>
          </div>
        </div>

        <!-- FULLY VISIBLE & DYNAMICALLY FLOWING WAVE RIBBON -->
        <svg class="creator-bottom-ribbon" viewBox="0 0 1024 140" preserveAspectRatio="none" aria-hidden="true">
          <path class="lower-ribbon-pink" d="M0 12c134-21 192 47 307 36 105-9 179 10 284-22 129-39 161-12 270-31 75-13 117-65 163-50v160H0Z"/>
          <path class="lower-ribbon-blue" d="M0 45c112-24 204 13 306 31 112 20 194-20 296-13 126 8 184 64 288 10 48-25 88-15 134-5v180H0Z"/>
          <path class="lower-ribbon-peach" d="M0 80c126-16 193 16 301 21 114 5 197-37 297-34 130 4 191 48 284 24 63-16 92-50 142-34v200H0Z"/>
        </svg>
      </section>
    `;

    this.initLowerWaveFlow();
    this.querySelectorAll('.modal-trigger-brand').forEach(btn => {
      btn.addEventListener('click', () => window.openMoldinModal?.('brand'));
    });
    this.querySelectorAll('.modal-trigger-creator').forEach(btn => {
      btn.addEventListener('click', () => window.openMoldinModal?.('creator'));
    });
  }

  initLowerWaveFlow() {
    const pink = this.querySelector('.lower-ribbon-pink');
    const blue = this.querySelector('.lower-ribbon-blue');
    const peach = this.querySelector('.lower-ribbon-peach');
    if (!pink || !blue || !peach) return;

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const t = (timestamp - start) * 0.001;

      const s1 = Math.sin(t * 0.7);
      const c1 = Math.cos(t * 0.5);
      const s2 = Math.sin(t * 0.9 + 1.0);
      const c2 = Math.cos(t * 0.6 + 2.0);

      const pY0 = (12 + s1 * 2.5).toFixed(1);
      const pY1 = (36 + c1 * 3.5).toFixed(1);
      const pY2 = (-22 + s2 * 3.0).toFixed(1);
      const pY3 = (-31 + c2 * 2.8).toFixed(1);

      pink.setAttribute('d',
        `M0 ${pY0}c134-21 192 47 307 ${pY1}c105-9 179 10 284 ${pY2}c129-39 161-12 270 ${pY3}c75-13 117-65 163-50v160H0Z`
      );

      const bY0 = (45 + c2 * 2.2).toFixed(1);
      const bY1 = (31 + s1 * 3.2).toFixed(1);
      const bY2 = (-13 + c1 * 2.8).toFixed(1);
      const bY3 = (10 + s2 * 3.0).toFixed(1);

      blue.setAttribute('d',
        `M0 ${bY0}c112-24 204 13 306 ${bY1}c112 20 194-20 296 ${bY2}c126 8 184 64 288 ${bY3}c48-25 88-15 134-5v180H0Z`
      );

      const peY0 = (80 + s2 * 2.0).toFixed(1);
      const peY1 = (21 + c2 * 2.5).toFixed(1);
      const peY2 = (-34 + s1 * 2.8).toFixed(1);
      const peY3 = (24 + c1 * 2.5).toFixed(1);

      peach.setAttribute('d',
        `M0 ${peY0}c126-16 193 16 301 ${peY1}c114 5 197-37 297 ${peY2}c130 4 191 48 284 ${peY3}c63-16 92-50 142-34v200H0Z`
      );

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}

class BrandCampaignsSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="campaigns-section" id="campaigns">
        <div class="section-container">
          <div class="campaigns-header-micro">
            <h2 class="campaigns-title-micro">WE HAVE DONE SUCCESSFUL CAMPAIGNS WITH THESE BRANDS.</h2>
          </div>

          <div class="brand-results-grid">
            <!-- BRAND 1: NONSTOP ENERGY -->
            <div class="brand-result-card brand-result-card--energy">
              <div class="brand-card-top">
                <div class="brand-logo-wrap">
                  <img class="brand-card-img" src="assets/brands/nonstop.png" alt="NONSTOP ENERGY">
                  <div>
                    <h3 class="brand-name">NONSTOP ENERGY</h3>
                    <span class="brand-category">Energy &amp; Lifestyle</span>
                  </div>
                </div>
              </div>
              <div class="brand-stats-row">
                <div class="b-stat"><b>60</b><span>Reels Delivered</span></div>
                <div class="b-stat"><b>4.8M+</b><span>Total Reach</span></div>
                <div class="b-stat"><b>4.2x</b><span>Paid Ad ROAS</span></div>
              </div>
            </div>

            <!-- BRAND 2: SunoSunao -->
            <div class="brand-result-card brand-result-card--audio">
              <div class="brand-card-top">
                <div class="brand-logo-wrap">
                  <img class="brand-card-img" src="assets/brands/sunosunao.png" alt="SunoSunao">
                  <div>
                    <h3 class="brand-name">SunoSunao</h3>
                    <span class="brand-category">Audio &amp; Stories App</span>
                  </div>
                </div>
              </div>
              <div class="brand-stats-row">
                <div class="b-stat"><b>50</b><span>Story Reels</span></div>
                <div class="b-stat"><b>38.4K+</b><span>App Installs</span></div>
                <div class="b-stat"><b>₹12.40</b><span>Cost Per Install</span></div>
              </div>
            </div>

            <!-- BRAND 3: KURO STREETWEAR -->
            <div class="brand-result-card brand-result-card--kuro">
              <div class="brand-card-top">
                <div class="brand-logo-wrap">
                  <img class="brand-card-img" src="assets/brands/kuro.png" alt="KURO STREETWEAR">
                  <div>
                    <h3 class="brand-name">KURO STREETWEAR</h3>
                    <span class="brand-category">Gen-Z Fashion</span>
                  </div>
                </div>
              </div>
              <div class="brand-stats-row">
                <div class="b-stat"><b>75</b><span>Styled Reels</span></div>
                <div class="b-stat"><b>3.8x</b><span>Meta Ad ROAS</span></div>
                <div class="b-stat"><b>2 Drops</b><span>Sold Out</span></div>
              </div>
            </div>

            <!-- BRAND 4: PROMPTFLOW AI -->
            <div class="brand-result-card brand-result-card--tech">
              <div class="brand-card-top">
                <div class="brand-logo-wrap">
                  <img class="brand-card-img" src="assets/brands/promptflow.png" alt="PROMPTFLOW AI">
                  <div>
                    <h3 class="brand-name">PROMPTFLOW AI</h3>
                    <span class="brand-category">AI SaaS &amp; Tools</span>
                  </div>
                </div>
              </div>
              <div class="brand-stats-row">
                <div class="b-stat"><b>40</b><span>Tech Reviews</span></div>
                <div class="b-stat"><b>14.5K</b><span>Signups</span></div>
                <div class="b-stat"><b>22%</b><span>Paid Conversion</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

const creatorsRosterData = [
  {
    name: "Sandesh Agrawal",
    handle: "@sandeshyaar",
    link: "https://www.instagram.com/sandeshyaar/",
    img: "assets/creators_real/sandeshyaar.jpg",
    isStar: true,
    gender: "male",
    nicheBadge: "Tech & AI",
    followers: "88K"
  },
  {
    name: "Varnika",
    handle: "@v4rnikaa",
    link: "https://www.instagram.com/v4rnikaa/reels/",
    img: "assets/creators_real/v4rnikaa.jpg",
    isStar: false,
    gender: "female",
    nicheBadge: "Fashion",
    followers: "45.3K"
  },
  {
    name: "Amlendra Kumar",
    handle: "@amlendra.in",
    link: "https://www.instagram.com/amlendra.in/",
    img: "assets/creators_real/amlendra.in.jpg",
    isStar: true,
    gender: "male",
    nicheBadge: "AI & Apps",
    followers: "626K"
  },
  {
    name: "Shubham Joshi",
    handle: "@shubham_joshii",
    link: "https://www.instagram.com/shubham_joshii/",
    img: "assets/creators_real/shubham_joshii.jpg",
    isStar: false,
    gender: "male",
    nicheBadge: "Travel",
    followers: "50K"
  },
  {
    name: "Aryan H Choudharry",
    handle: "@aryann.aesthetics",
    link: "https://www.instagram.com/aryann.aesthetics/",
    img: "assets/creators_real/aryann.aesthetics.jpg",
    isStar: false,
    gender: "male",
    nicheBadge: "Fitness",
    followers: "24.9K"
  },
  {
    name: "Shree",
    handle: "@shrey_.aaaa",
    link: "https://www.instagram.com/shrey_.aaaa/",
    img: "assets/creators_real/shrey_.aaaa.jpg",
    isStar: false,
    gender: "female",
    nicheBadge: "Beauty",
    followers: "30.1K"
  },
  {
    name: "Param Jain",
    handle: "@paraamjain",
    link: "https://www.instagram.com/paraamjain/",
    img: "assets/creators_real/paraamjain.jpg",
    isStar: false,
    gender: "male",
    nicheBadge: "Travel",
    followers: "28.8K"
  },
  {
    name: "Divya Vashishtha",
    handle: "@d1vyya._",
    link: "https://www.instagram.com/d1vyya._/",
    img: "assets/creators_real/d1vyya._.jpg",
    isStar: false,
    gender: "female",
    nicheBadge: "Model",
    followers: "18.7K"
  }
];

function renderRosterCard(c) {
  const cardThemeClass = c.isStar 
    ? 'roster-card--gold' 
    : (c.gender === 'female' ? 'roster-card--female' : 'roster-card--male');

  return `
    <article class="roster-card ${cardThemeClass}">
      <span class="card-floating-tag">${c.nicheBadge}</span>
      ${c.isStar ? '<span class="card-floating-star" title="Star Performer">★</span>' : ''}
      <div class="roster-avatar-wrap">
        <img class="roster-avatar" src="${c.img}" alt="${c.name}" loading="lazy">
      </div>
      <div class="roster-info">
        <div class="roster-name-row">
          <h3 class="roster-name">${c.name}</h3>
          <span class="verified-icon" title="Verified Creator">✓</span>
        </div>
        <a class="roster-handle" href="${c.link}" target="_blank" rel="noopener">${c.handle} ↗</a>
        <div class="roster-followers-row">
          <span class="roster-followers-num">${c.followers}</span>
          <span class="roster-followers-lbl">Followers</span>
        </div>
      </div>
    </article>
  `;
}

class CreatorRosterSection extends HTMLElement {
  connectedCallback() {
    const cardsMarkup = creatorsRosterData.map(renderRosterCard).join('');
    this.innerHTML = `
      <section class="roster-section" id="roster">
        <div class="section-container">
          <div class="roster-header">
            <h2 class="roster-title">OUR <span class="highlight-pink">TOP TALENTS</span><span class="dot-accent">.</span></h2>
          </div>
        </div>

        <!-- CONTINUOUS MARQUEE TRACK (HALF-SIZE CARDS FLOATING LEFT TO RIGHT) -->
        <div class="roster-marquee-wrap">
          <div class="roster-marquee-track">
            ${cardsMarkup}
            ${cardsMarkup}
          </div>
        </div>
      </section>
    `;
  }
}

class BrandFeaturesSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="features-section" id="why-moldin">
        <div class="section-container">
          <div class="features-header">
            <h2 class="features-title">WE HELP YOU RUN WHOLE CAMPAIGNS.<br><span class="highlight-pink">NOT JUST 1 OR 2 REELS TO EARN COMMISSIONS.</span></h2>
            <p class="features-subtitle">We take your whole stress so you can focus on your product or service, not on creators.</p>
          </div>

          <!-- 3 HEADERS: NO LOGO, NO EMOJI, NO DESCRIPTION -->
          <div class="features-three-headers">
            <div class="feature-header-card feature-header-card--pink">
              <h3 class="feature-header-text">FULL CAMPAIGN OWNERSHIP</h3>
            </div>
            <div class="feature-header-card feature-header-card--blue">
              <h3 class="feature-header-text">100% MANUALLY CURATED</h3>
            </div>
            <div class="feature-header-card feature-header-card--ink">
              <h3 class="feature-header-text">ZERO ERRORS GUARANTEED</h3>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

class BrandTestimonialsSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="testimonials-section" id="testimonials">
        <div class="section-container">
          <div class="testimonials-header">
            <h2 class="testimonials-title">HEAR DIRECTLY <span class="highlight-blue">FROM BRANDS</span><span class="dot-accent">.</span></h2>
          </div>

          <!-- BRAND FEEDBACK 4-CARD GRID (NO REPRESENTATIVE NAME, 2-LINER QUOTE, DELIVERED STATS ONLY) -->
          <div class="brand-feedback-grid">
            <!-- BRAND 1: NONSTOP ENERGY -->
            <article class="brand-feedback-card brand-feedback-card--energy">
              <div class="bf-top">
                <div class="bf-logo-wrap">
                  <img class="bf-brand-img" src="assets/brands/nonstop.png" alt="NONSTOP ENERGY">
                  <h3 class="bf-brand-name">NONSTOP ENERGY</h3>
                </div>
              </div>
              <blockquote class="bf-quote">
                “MOLDIN took the whole burden off our shoulders—delivering 60 reels on schedule with zero errors. It drove our biggest sales spike to date.”
              </blockquote>
              <div class="bf-stats-row">
                <span>60 Reels Delivered • 4.2M+ Reach</span>
              </div>
            </article>

            <!-- BRAND 2: SunoSunao -->
            <article class="brand-feedback-card brand-feedback-card--audio">
              <div class="bf-top">
                <div class="bf-logo-wrap">
                  <img class="bf-brand-img" src="assets/brands/sunosunao.png" alt="SunoSunao">
                  <h3 class="bf-brand-name">SunoSunao</h3>
                </div>
              </div>
              <blockquote class="bf-quote">
                “Their team manually briefed every creator so each story felt personal. We hit over 38,000 real app installs in just 10 days with insane retention.”
              </blockquote>
              <div class="bf-stats-row">
                <span>50 Story Reels • 38K+ App Installs</span>
              </div>
            </article>

            <!-- BRAND 3: KURO STREETWEAR -->
            <article class="brand-feedback-card brand-feedback-card--kuro">
              <div class="bf-top">
                <div class="bf-logo-wrap">
                  <img class="bf-brand-img" src="assets/brands/kuro.png" alt="KURO STREETWEAR">
                  <h3 class="bf-brand-name">KURO STREETWEAR</h3>
                </div>
              </div>
              <blockquote class="bf-quote">
                “Manually inspected every creator profile and video cut. Every reel looked straight out of our lookbook with 3.8x Meta ad ROAS.”
              </blockquote>
              <div class="bf-stats-row">
                <span>75 Styled Reels • 3.8x Meta Ad ROAS</span>
              </div>
            </article>

            <!-- BRAND 4: PROMPTFLOW AI -->
            <article class="brand-feedback-card brand-feedback-card--tech">
              <div class="bf-top">
                <div class="bf-logo-wrap">
                  <img class="bf-brand-img" src="assets/brands/promptflow.png" alt="PROMPTFLOW AI">
                  <h3 class="bf-brand-name">PROMPTFLOW AI</h3>
                </div>
              </div>
              <blockquote class="bf-quote">
                “Manually guided 40 tech creators through our workflow. Zero misleading statements, flawless demonstrations, and over 14,000 product signups.”
              </blockquote>
              <div class="bf-stats-row">
                <span>40 Tech Reviews • 14.5K+ Signups</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

class FaqSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="split-faq-cta-section" id="faq">
        <div class="section-container">
          <div class="faq-cta-split-grid">
            <!-- LEFT HALF: COMPACT LEFT-ALIGNED FAQ -->
            <div class="split-faq-col">
              <h2 class="faq-compact-title">GOT QUESTIONS?<br><span class="highlight-pink">STRAIGHT ANSWERS.</span></h2>
              
              <div class="faq-compact-accordion">
                <details class="faq-c-item" open>
                  <summary class="faq-c-summary">
                    <span class="faq-c-num">01</span>
                    <span class="faq-c-question">How many reels can MOLDIN deliver per campaign?</span>
                    <span class="faq-c-icon">+</span>
                  </summary>
                  <div class="faq-c-content">
                    <p>We manage anywhere from 50 to 500+ reels per wave. We handle creator curation, shipping, script reviews, and live posting end-to-end.</p>
                  </div>
                </details>

                <details class="faq-c-item">
                  <summary class="faq-c-summary">
                    <span class="faq-c-num">02</span>
                    <span class="faq-c-question">Why manual management instead of automated AI matching?</span>
                    <span class="faq-c-icon">+</span>
                  </summary>
                  <div class="faq-c-content">
                    <p>Algorithms match brands with ghost-town bot accounts. Human directors inspect every creator profile and video cut manually—guaranteeing zero errors.</p>
                  </div>
                </details>

                <details class="faq-c-item">
                  <summary class="faq-c-summary">
                    <span class="faq-c-num">03</span>
                    <span class="faq-c-question">What is required from our brand’s team?</span>
                    <span class="faq-c-icon">+</span>
                  </summary>
                  <div class="faq-c-content">
                    <p>Just provide your campaign brief and product inventory. MOLDIN takes total ownership of creator outreach, contracts, revisions, and deliveries.</p>
                  </div>
                </details>

                <details class="faq-c-item">
                  <summary class="faq-c-summary">
                    <span class="faq-c-num">04</span>
                    <span class="faq-c-question">Is MOLDIN really 100% free for creators?</span>
                    <span class="faq-c-icon">+</span>
                  </summary>
                  <div class="faq-c-content">
                    <p>Always. Zero commission cuts, zero platform fees, and zero hidden charges. You receive 100% of your agreed brand campaign payout.</p>
                  </div>
                </details>

                <details class="faq-c-item">
                  <summary class="faq-c-summary">
                    <span class="faq-c-num">05</span>
                    <span class="faq-c-question">Do campaigns include paid ad whitelisting rights?</span>
                    <span class="faq-c-icon">+</span>
                  </summary>
                  <div class="faq-c-content">
                    <p>Yes. Every collaboration includes full organic posting and commercial ad whitelisting rights for Meta, TikTok, and YouTube ads.</p>
                  </div>
                </details>
              </div>
            </div>

            <!-- RIGHT HALF: STOP OVERTHINKING. START WINNING. -->
            <div class="split-cta-col" id="join">
              <div class="cta-side-card">
                <h2 class="cta-side-title">STOP OVERTHINKING.<br><span class="highlight-pink">START WINNING.</span></h2>
                
                <!-- COOL TWO CREATOR / BRAND ACTION BUTTONS (NO EXTRA TEXT) -->
                <div class="cta-cool-buttons">
                  <a class="cta-cool-btn cta-cool-btn--creator" id="cta-btn-creator" href="https://forms.gle/CUitj8LUdULQovqw7" target="_blank" rel="noopener">
                    <div class="cool-btn-top">
                      <span class="cool-role-label">CREATORS</span>
                      <span class="cool-arrow">→</span>
                    </div>
                    <span class="cool-action-text">JOIN AS CREATOR</span>
                  </a>

                  <button class="cta-cool-btn cta-cool-btn--brand" type="button" id="cta-btn-brand">
                    <div class="cool-btn-top">
                      <span class="cool-role-label">BRANDS</span>
                      <span class="cool-arrow">→</span>
                    </div>
                    <span class="cool-action-text">PARTNER AS BRAND</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    const creatorBtn = this.querySelector('#cta-btn-creator');
    const brandBtn = this.querySelector('#cta-btn-brand');
    if (creatorBtn) creatorBtn.addEventListener('click', () => window.openMoldinModal?.('creator'));
    if (brandBtn) brandBtn.addEventListener('click', () => window.openMoldinModal?.('brand'));
  }
}

class DualCtaSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = ``;
  }
}

class SiteFooterModern extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="minimal-footer" id="footer">
        <div class="section-container">
          <div class="footer-compact-row">
            <div class="footer-left">
              <a class="wordmark footer-wordmark-micro" href="#top">MOLDIN<span>.</span></a>
              <span class="footer-tagline-micro">Making Brand Collabs Simple</span>
            </div>

            <nav class="footer-nav-compact" aria-label="Footer links">
              <a href="campaigns.html">Campaigns</a>
              <a href="brands.html">Brands</a>
              <a href="creators.html">Creators</a>
              <a href="index.html#faq">FAQ</a>
            </nav>

            <div class="footer-social-compact">
              <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram" class="footer-social-icon" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" class="footer-social-icon" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

class MoldinPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <main class="design">
        <site-header></site-header>
        <hero-section></hero-section>
        <steps-section></steps-section>
        <creators-brands-section></creators-brands-section>
        <brand-campaigns-section></brand-campaigns-section>
        <creator-roster-section></creator-roster-section>
        <brand-features-section></brand-features-section>
        <brand-testimonials-section></brand-testimonials-section>
        <faq-section></faq-section>
        <dual-cta-section></dual-cta-section>
        <site-footer-modern></site-footer-modern>
        <moldin-flow-nav></moldin-flow-nav>
      </main>
    `;
  }
}

customElements.define('moldin-button', MoldinButton);
customElements.define('moldin-flow-nav', MoldinFlowNav);
customElements.define('creator-image', CreatorImage);
customElements.define('site-header', SiteHeader);
customElements.define('hero-section', HeroSection);
customElements.define('steps-section', StepsSection);
customElements.define('creators-brands-section', CreatorsBrandsSection);
customElements.define('brand-campaigns-section', BrandCampaignsSection);
customElements.define('creator-roster-section', CreatorRosterSection);
customElements.define('brand-features-section', BrandFeaturesSection);
customElements.define('brand-testimonials-section', BrandTestimonialsSection);
customElements.define('faq-section', FaqSection);
customElements.define('dual-cta-section', DualCtaSection);
customElements.define('site-footer-modern', SiteFooterModern);
customElements.define('moldin-page', MoldinPage);

/* ==============================================================
   GLOBAL MOLDIN POPUP MODAL (CREATOR APPLICATION & BRAND CAMPAIGN)
   ============================================================== */
function initGlobalModal() {
  if (document.getElementById('moldin-modal')) return;

  const modalHtml = `
    <div id="moldin-modal" class="moldin-modal-backdrop" style="display:none;" aria-hidden="true">
      <div class="moldin-modal-dialog" role="dialog" aria-modal="true">
        <button class="moldin-modal-close" id="modal-close-btn" type="button" aria-label="Close modal">×</button>
        
        <div class="modal-tab-header">
          <button class="modal-tab-btn modal-tab-btn--creator active" type="button" data-modal-tab="creator">
            <span>⚡</span> Creators
          </button>
          <button class="modal-tab-btn modal-tab-btn--brand" type="button" data-modal-tab="brand">
            <span>💼</span> Brands
          </button>
        </div>

        <!-- CREATOR APPLICATION FORM -->
        <div class="moldin-modal-form" id="modal-creator-form">
          <div class="modal-title-row">
            <h3 class="modal-heading">Apply For MOLDIN Roster</h3>
            <span class="modal-pill pill-pink">100% Free Forever</span>
          </div>
          <p class="modal-subtext">Join verified brand campaigns with guaranteed escrow payouts and 0% agency cut.</p>
          <div style="margin-top:24px; text-align:center;">
            <a class="modal-submit-btn submit-creator" href="https://forms.gle/CUitj8LUdULQovqw7" target="_blank" rel="noopener" style="display:inline-flex; width:auto; text-decoration:none; justify-content:center; align-items:center; gap:8px; padding:14px 28px; border-radius:999px;">
              <span>Open Creator Application Form</span> <b aria-hidden="true">→</b>
            </a>
          </div>
          <p style="margin-top:14px; font-size:12.5px; color:rgba(9,9,9,0.65); text-align:center;">Takes 60 seconds • Escrow protected payouts</p>
        </div>

        <!-- BRAND CAMPAIGN FORM -->
        <form class="moldin-modal-form" id="modal-brand-form" style="display:none;">
          <div class="modal-title-row">
            <h3 class="modal-heading">Launch Brand Campaign</h3>
            <span class="modal-pill pill-blue">100% Manual Execution</span>
          </div>
          <p class="modal-subtext">50 to 500+ reels executed turnkey with dedicated directors and zero error guarantee.</p>
          <div class="modal-inputs-grid">
            <div class="modal-group">
              <label>Brand / Company Name</label>
              <input type="text" placeholder="e.g. Nonstop Energy" required>
            </div>
            <div class="modal-group">
              <label>Work Email</label>
              <input type="email" placeholder="collabs@brand.com" required>
            </div>
            <div class="modal-group">
              <label>Target Campaign Volume</label>
              <select required>
                <option value="">Select Target Volume</option>
                <option value="50">50 Reels (Category Blitz)</option>
                <option value="100">100 Reels (Market Domination)</option>
                <option value="500">500+ Reels (Pan-India Scale)</option>
              </select>
            </div>
            <div class="modal-group">
              <label>Target Launch Window</label>
              <select required>
                <option value="">When do you plan to launch?</option>
                <option value="immediate">Immediate (Next 7-10 Days)</option>
                <option value="month">Within 30 Days</option>
                <option value="planning">Next Quarter Planning</option>
              </select>
            </div>
          </div>
          <button class="modal-submit-btn submit-brand" type="submit">Get Custom Campaign Proposal →</button>
          <div class="modal-status-alert alert-success" style="display:none;">
            🚀 Campaign brief received! A dedicated campaign director will reach out within 2 hours.
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('moldin-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const creatorTab = modal.querySelector('[data-modal-tab="creator"]');
  const brandTab = modal.querySelector('[data-modal-tab="brand"]');
  const creatorForm = document.getElementById('modal-creator-form');
  const brandForm = document.getElementById('modal-brand-form');

  window.openMoldinModal = (role = 'creator') => {
    if (role === 'creator') {
      window.open('https://forms.gle/CUitj8LUdULQovqw7', '_blank', 'noopener,noreferrer');
      return;
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    brandTab.classList.add('active');
    creatorTab.classList.remove('active');
    brandForm.style.display = 'block';
    creatorForm.style.display = 'none';
  };

  window.closeMoldinModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', window.closeMoldinModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeMoldinModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      window.closeMoldinModal();
    }
  });

  creatorTab.addEventListener('click', () => {
    window.open('https://forms.gle/CUitj8LUdULQovqw7', '_blank', 'noopener,noreferrer');
  });

  brandTab.addEventListener('click', () => {
    brandTab.classList.add('active');
    creatorTab.classList.remove('active');
    brandForm.style.display = 'block';
    creatorForm.style.display = 'none';
  });

  if (brandForm) {
    brandForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = brandForm.querySelector('.modal-submit-btn');
      const alertBox = brandForm.querySelector('.modal-status-alert');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      setTimeout(() => {
        submitBtn.style.display = 'none';
        if (alertBox) alertBox.style.display = 'block';
      }, 500);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalModal);
} else {
  initGlobalModal();
}
