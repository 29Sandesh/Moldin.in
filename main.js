/**
 * @fileoverview Main interactive runtime for MOLDIN.india®.
 * Renders editable playing-card roster, 3D card pointer tilt, adaptive light/dark navbar,
 * straight-answers FAQ accordion, WhatsApp quick-collab dispatch, and access modal.
 */

import { FEATURED_CREATORS, MOLDIN_CONTACT } from './brands-config.js';
import { initHeroRibbons } from './hero-ribbons.js';

/**
 * Generates clean SVG vector crown markup tailored for King (Golden/Charcoal) or Queen cards.
 * @param {'star' | 'K' | 'Q'} variant
 * @returns {string}
 */
const buildCrownSvg = (variant) => {
  if (variant === 'Q') {
    return `
      <svg class="card-crown" viewBox="0 0 88 40" fill="none" aria-hidden="true">
        <path d="M12 33L8 12L25 22L36 6L44 21L52 6L63 22L80 12L76 33H12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="8" cy="10" r="2.2" fill="currentColor"/>
        <circle cx="36" cy="4.5" r="2.5" fill="currentColor"/>
        <circle cx="52" cy="4.5" r="2.5" fill="currentColor"/>
        <circle cx="80" cy="10" r="2.2" fill="currentColor"/>
        <path d="M14 37H74" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
  }
  return `
    <svg class="card-crown" viewBox="0 0 88 40" fill="none" aria-hidden="true">
      <path d="M10 33L7 10L25 22L44 5L63 22L81 10L78 33H10Z" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/>
      <circle cx="7" cy="8.5" r="2.3" fill="currentColor"/>
      <circle cx="44" cy="4" r="3" fill="currentColor"/>
      <circle cx="81" cy="8.5" r="2.3" fill="currentColor"/>
      <path d="M13 37H75" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
    </svg>`;
};

/**
 * Escapes HTML special characters for safe DOM template rendering.
 * @param {string} value
 * @returns {string}
 */
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Populates the 2 Golden Star King cards and 6 King/Queen playing cards from FEATURED_CREATORS.
 */
export const initPlayingCardsRoster = () => {
  const starsContainer = document.getElementById('stars-deck');
  const rosterContainer = document.getElementById('roster-deck');
  if (!starsContainer && !rosterContainer) return;

  const stars = FEATURED_CREATORS.filter((c) => c.tier === 'star');
  const roster = FEATURED_CREATORS.filter((c) => c.tier !== 'star');

  if (starsContainer) {
    starsContainer.innerHTML = stars
      .map(
        (creator) => `
      <article class="playing-card playing-card-gold tilt-card" data-creator-id="${escapeHtml(creator.id)}">
        <div class="playing-card-gold-inner">
          <div class="card-corner card-corner-tl">
            <span class="corner-rank">${escapeHtml(creator.rank)}</span>
            <span class="corner-suit" aria-hidden="true">${escapeHtml(creator.suit)}</span>
          </div>
          <div class="card-corner card-corner-br" aria-hidden="true">
            <span class="corner-rank">${escapeHtml(creator.rank)}</span>
            <span class="corner-suit">${escapeHtml(creator.suit)}</span>
          </div>

          <div class="gold-portrait-stage">
            ${buildCrownSvg('star')}
            <div class="portrait-frame">
              <img
                src="${escapeHtml(creator.portrait)}"
                alt="${escapeHtml(creator.name)} — MOLDIN Golden Star Creator"
                width="512"
                height="512"
                loading="lazy"
                decoding="async"
                data-fallback="${escapeHtml(creator.fallbackPortrait)}"
              >
            </div>
          </div>

          <div class="gold-info-col">
            <span class="gold-star-badge">★ Golden Star Creator</span>
            <h3>
              ${escapeHtml(creator.name)}
              <span class="verified-check" title="Verified MOLDIN Star" aria-label="Verified">✓</span>
            </h3>
            <a
              class="card-handle-link"
              href="${escapeHtml(creator.url)}"
              target="_blank"
              rel="noopener noreferrer"
            >@${escapeHtml(creator.handle)} ↗</a>
            <div class="card-meta-row">
              <strong class="card-followers">${escapeHtml(creator.followers)}</strong>
              <span class="card-niche-pill">${escapeHtml(creator.niche)}</span>
            </div>
            <p class="card-bio">${escapeHtml(creator.bio)}</p>
          </div>
        </div>
      </article>`,
      )
      .join('');
  }

  if (rosterContainer) {
    rosterContainer.innerHTML = roster
      .map(
        (creator) => `
      <article
        class="playing-card playing-card-royal tilt-card suit-${escapeHtml(creator.suitColor)}"
        data-creator-id="${escapeHtml(creator.id)}"
      >
        <div class="card-corner card-corner-tl">
          <span class="corner-rank">${escapeHtml(creator.rank)}</span>
          <span class="corner-suit" aria-hidden="true">${escapeHtml(creator.suit)}</span>
        </div>
        <div class="card-corner card-corner-br" aria-hidden="true">
          <span class="corner-rank">${escapeHtml(creator.rank)}</span>
          <span class="corner-suit">${escapeHtml(creator.suit)}</span>
        </div>

        <div class="royal-portrait-box">
          <div class="royal-frame-brackets" aria-hidden="true"></div>
          ${buildCrownSvg(creator.rank === 'Q' ? 'Q' : 'K')}
          <div class="portrait-frame">
            <img
              src="${escapeHtml(creator.portrait)}"
              alt="${escapeHtml(creator.name)} — ${escapeHtml(creator.niche)} Creator"
              width="512"
              height="512"
              loading="lazy"
              decoding="async"
              data-fallback="${escapeHtml(creator.fallbackPortrait)}"
            >
          </div>
        </div>

        <div class="royal-info-col">
          <h3>
            <span>${escapeHtml(creator.name)}</span>
            <span class="verified-check" title="Verified Creator" aria-label="Verified">✓</span>
          </h3>
          <a
            class="card-handle-link"
            href="${escapeHtml(creator.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >@${escapeHtml(creator.handle)} ↗</a>
          <div class="card-meta-row">
            <strong class="card-followers">${escapeHtml(creator.followers)}</strong>
            <span class="card-niche-pill">${escapeHtml(creator.niche)}</span>
          </div>
        </div>
      </article>`,
      )
      .join('');
  }

  // Fallback swap if an image asset fails to decode
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const fb = img.dataset.fallback;
      if (fb && !img.src.endsWith(fb)) {
        img.src = fb;
      }
    });
  });

  // Subtle physical playing-card 3D tilt hover & metallic highlight reflection (desktop fine pointer only)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reducedMotion && finePointer) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      let framePending = false;
      let lastEvt = null;
      card.addEventListener(
        'pointermove',
        (e) => {
          lastEvt = e;
          if (framePending) return;
          framePending = true;
          requestAnimationFrame(() => {
            framePending = false;
            if (!lastEvt) return;
            const rect = card.getBoundingClientRect();
            const x = (lastEvt.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
            const y = (lastEvt.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
            card.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
            card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
            card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
            card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
          });
        },
        { passive: true },
      );
      card.addEventListener('pointerleave', () => {
        lastEvt = null;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
};

/**
 * Controls mobile menu drawer and dynamic light/dark header adaptation based on viewport surface.
 */
export const initHeader = () => {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  if (!header) return;

  const syncHeaderContrast = () => {
    const lightZones = document.querySelectorAll('[data-surface="light"]');
    const bridgeZones = document.querySelectorAll('.obsidian-to-white-bridge');
    const yCheck = header.getBoundingClientRect().bottom * 0.72;
    let overLight = false;
    for (const zone of lightZones) {
      const rect = zone.getBoundingClientRect();
      if (rect.top <= yCheck && rect.bottom >= yCheck) {
        overLight = true;
        break;
      }
    }
    if (!overLight) {
      for (const b of bridgeZones) {
        const rect = b.getBoundingClientRect();
        // Switch smoothly in lower bright half of top bridge
        const midpoint = rect.top + rect.height * 0.56;
        if (midpoint <= yCheck && rect.bottom >= yCheck) {
          overLight = true;
          break;
        }
      }
    }
    header.classList.toggle('is-light', overLight);
    header.classList.toggle('is-scrolled', window.scrollY > 28);
  };

  let headerTicking = false;
  const scheduleHeaderSync = () => {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(() => {
      headerTicking = false;
      syncHeaderContrast();
    });
  };

  syncHeaderContrast();
  window.addEventListener('scroll', scheduleHeaderSync, { passive: true });
  window.addEventListener('resize', scheduleHeaderSync, { passive: true });
};

/**
 * Binds accessible FAQ accordion toggles for "Straight Answers." section.
 */
export const initFaqAccordion = () => {
  const items = Array.from(document.querySelectorAll('[data-faq-item]'));
  if (!items.length) return;

  for (const item of items) {
    const btn = item.querySelector('[data-faq-trigger]');
    const panel = item.querySelector('[data-faq-panel]');
    if (!btn || !panel) continue;

    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');

      for (const peer of items) {
        peer.classList.remove('is-open');
        const peerBtn = peer.querySelector('[data-faq-trigger]');
        const peerIcon = peer.querySelector('[data-faq-symbol]');
        const peerPanel = peer.querySelector('[data-faq-panel]');
        if (peerBtn) peerBtn.setAttribute('aria-expanded', 'false');
        if (peerIcon) peerIcon.textContent = '+';
        if (peerPanel) peerPanel.hidden = true;
      }

      if (willOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        const icon = item.querySelector('[data-faq-symbol]');
        if (icon) icon.textContent = '−';
        panel.hidden = false;
      }
    });
  }
};

/**
 * Wires WhatsApp Collab buttons directly to native WhatsApp chat / Web intent ("Skip the form").
 */
export const initWhatsappCollab = () => {
  const waTriggers = document.querySelectorAll('[data-open-whatsapp]');
  if (!waTriggers.length) return;

  const digits = (MOLDIN_CONTACT.whatsappDigits || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(MOLDIN_CONTACT.defaultWhatsappGreeting);
  const waUrl = digits
    ? `https://wa.me/${digits}?text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;

  for (const el of waTriggers) {
    if (el.tagName === 'A') {
      el.setAttribute('href', waUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else {
      el.addEventListener('click', () => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }
  }
};

/**
 * Wires interactive category filter tabs on the Blogs & Brand Playbooks hub.
 */
export const initBlogFilters = () => {
  const filterBtns = Array.from(document.querySelectorAll('[data-blog-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-blog-category]'));
  if (!filterBtns.length || !cards.length) return;

  for (const btn of filterBtns) {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.blogFilter || 'all';
      for (const b of filterBtns) {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      }
      for (const card of cards) {
        const match = cat === 'all' || card.dataset.blogCategory === cat;
        card.hidden = !match;
      }
    });
  }
};

/**
 * Binds dual Creator & Brand path selector modal across all pages.
 */
export const initAccessDialog = () => {
  const modal = document.getElementById('access-modal');
  const openBtns = document.querySelectorAll('[data-open-access], [data-open-start]');
  const closeBtns = document.querySelectorAll('[data-close-access]');

  if (!modal) return;

  for (const btn of openBtns) {
    btn.addEventListener('click', () => {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    });
  }

  for (const btn of closeBtns) {
    btn.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
};

/**
 * Binds brand campaign brief form on For Brands page (zero pricing assumptions, instant WhatsApp/DM export).
 */
export const initBriefForm = () => {
  const form = document.getElementById('brand-brief-form');
  const resultBox = document.getElementById('brief-result');
  const summaryText = document.getElementById('brief-summary-text');
  const copyBtn = document.getElementById('copy-brief-btn');
  const waSendBtn = document.getElementById('brief-wa-btn');
  const feedback = document.getElementById('copy-feedback');
  if (!form || !resultBox || !summaryText) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const brand = String(data.get('brand') || '').trim();
    const contact = String(data.get('contact') || '').trim();
    const website = String(data.get('website') || '').trim();
    const scope = String(data.get('scope') || '').trim();
    const goal = String(data.get('goal') || '').trim();

    if (!brand || !contact) return;

    const lines = [
      'MOLDIN.india Full-Campaign Brief',
      `Brand: ${brand}`,
      website ? `Handle / Site: ${website}` : '',
      `Contact: ${contact}`,
      `Focus: ${scope || 'Full Multi-Creator Campaign'}`,
      `Notes: ${goal || 'Managed end-to-end creator rollout'}`,
    ].filter(Boolean);

    summaryText.textContent = lines.join('\n');
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  if (waSendBtn) {
    waSendBtn.addEventListener('click', () => {
      const encoded = encodeURIComponent(summaryText.textContent || MOLDIN_CONTACT.defaultWhatsappGreeting);
      const digits = (MOLDIN_CONTACT.whatsappDigits || '').replace(/\D/g, '');
      const url = digits
        ? `https://wa.me/${digits}?text=${encoded}`
        : `https://api.whatsapp.com/send?text=${encoded}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summaryText.textContent);
        if (feedback) feedback.textContent = 'Copied brief! Paste directly in WhatsApp or IG DM.';
      } catch {
        if (feedback) feedback.textContent = 'Select and copy the brief text above.';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroRibbons();
  initPlayingCardsRoster();
  initFaqAccordion();
  initWhatsappCollab();
  initAccessDialog();
  initBriefForm();
  initBlogFilters();
});
