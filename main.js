/**
 * @fileoverview Main interactive runtime for MOLDIN.india®.
 * Renders editable playing-card roster, 3D card pointer tilt, adaptive light/dark navbar,
 * straight-answers FAQ accordion, WhatsApp quick-collab dispatch, and access modal.
 */

import { FEATURED_CREATORS, MOLDIN_CONTACT } from './brands-config.js';
import { initHeroRibbons } from './hero-ribbons.js';
import { initPageLightStrips } from './page-light-strips.js';

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

  // Subtle physical playing-card 3D tilt hover & metallic highlight reflection
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
        const y = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
        card.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
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

  syncHeaderContrast();
  window.addEventListener('scroll', syncHeaderContrast, { passive: true });
  window.addEventListener('resize', syncHeaderContrast, { passive: true });
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
 * Wires WhatsApp Collab buttons, pre-filled message generator, and quick modal.
 */
export const initWhatsappCollab = () => {
  const waTriggers = document.querySelectorAll('[data-open-whatsapp]');
  const waModal = document.getElementById('whatsapp-modal');
  const waForm = document.getElementById('wa-collab-form');
  const copyBtn = document.getElementById('wa-copy-btn');
  const statusEl = document.getElementById('wa-status-msg');

  const openWhatsappTarget = (customText) => {
    const encoded = encodeURIComponent(customText);
    const digits = (MOLDIN_CONTACT.whatsappDigits || '').replace(/\D/g, '');
    const url = digits
      ? `https://wa.me/${digits}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  for (const btn of waTriggers) {
    btn.addEventListener('click', () => {
      const digits = (MOLDIN_CONTACT.whatsappDigits || '').replace(/\D/g, '');
      if (digits && !waModal) {
        openWhatsappTarget(MOLDIN_CONTACT.defaultWhatsappGreeting);
        return;
      }
      if (waModal && typeof waModal.showModal === 'function') {
        waModal.showModal();
      } else {
        openWhatsappTarget(MOLDIN_CONTACT.defaultWhatsappGreeting);
      }
    });
  }

  document.querySelectorAll('[data-close-whatsapp]').forEach((btn) => {
    btn.addEventListener('click', () => waModal?.close());
  });

  if (waModal) {
    waModal.addEventListener('click', (e) => {
      if (e.target === waModal) waModal.close();
    });
  }

  const composeText = () => {
    const brand = document.getElementById('wa-brand')?.value.trim() || 'Our Brand';
    const goal = document.getElementById('wa-goal')?.value.trim() || 'Full creator campaign takeover';
    return `Hi MOLDIN.india! We want to discuss a full creator campaign.\nBrand / Product: ${brand}\nCampaign Goal: ${goal}`;
  };

  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      openWhatsappTarget(composeText());
      if (statusEl) {
        statusEl.textContent = 'Opening WhatsApp composer with your collab note ready to send.';
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const msg = composeText();
      try {
        await navigator.clipboard.writeText(msg);
        if (statusEl) {
          statusEl.textContent = `Copied collab note! Paste directly into WhatsApp or DM ${MOLDIN_CONTACT.instagramHandle}.`;
        }
      } catch {
        if (statusEl) {
          statusEl.textContent = msg;
        }
      }
    });
  }
};

/**
 * Binds navigation modal ("Log In / Quick Access") across all pages.
 */
export const initAccessDialog = () => {
  const modal = document.getElementById('access-modal');
  const openBtns = document.querySelectorAll('[data-open-access]');
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
 * Binds optional brand brief form (on subpages like brands.html).
 */
export const initBriefForm = () => {
  const form = document.getElementById('brand-brief-form');
  const resultBox = document.getElementById('brief-result');
  const summaryText = document.getElementById('brief-summary-text');
  const copyBtn = document.getElementById('copy-brief-btn');
  const feedback = document.getElementById('copy-feedback');
  if (!form || !resultBox || !summaryText) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const brand = String(data.get('brand') || '').trim();
    const contact = String(data.get('contact') || '').trim();
    const goal = String(data.get('goal') || '').trim();
    const scope = String(data.get('budget') || '').trim();

    if (!brand || !contact) return;

    summaryText.textContent = [
      'MOLDIN Full-Campaign Brief',
      `Brand: ${brand}`,
      `Contact: ${contact}`,
      `Scale: ${scope || 'Full Multi-Creator Wave'}`,
      `Goal: ${goal || 'End-to-End Campaign Takeover'}`,
    ].join('\n');

    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summaryText.textContent);
        if (feedback) feedback.textContent = 'Copied brief! Paste via DM or WhatsApp.';
      } catch {
        if (feedback) feedback.textContent = 'Select and copy the summary above.';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroRibbons();
  initPageLightStrips();
  initPlayingCardsRoster();
  initFaqAccordion();
  initWhatsappCollab();
  initAccessDialog();
  initBriefForm();
});
