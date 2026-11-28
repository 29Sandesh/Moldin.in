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
 * Attaches shared image-fallback swapping and physical 3D hover tilt to rendered playing cards.
 * @param {ParentNode} root
 */
const attachCardInteractions = (root) => {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const fb = img.dataset.fallback;
      if (fb && !img.src.endsWith(fb)) {
        img.src = fb;
      }
    });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reducedMotion && finePointer) {
    root.querySelectorAll('.tilt-card').forEach((card) => {
      if (card.dataset.tiltBound === '1') return;
      card.dataset.tiltBound = '1';
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
 * Populates the homepage playing-card sections (2 horizontal Golden Stars + 6 roster cards).
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

  attachCardInteractions(document);
};

/**
 * Populates the uniform physical-proportion (5:7) real playing-card deck exclusively on creators.html.
 * Renders all 8 creators identically with face portraits—only Golden Star players get gold card colors.
 */
export const initCreatorPageDeck = () => {
  const realDeck = document.getElementById('creators-real-deck');
  if (!realDeck) return;

  realDeck.innerHTML = FEATURED_CREATORS.map((creator) => {
    const isGold = creator.tier === 'star';
    const cardToneClass = isGold
      ? 'real-poker-card--gold'
      : `real-poker-card--classic suit-${escapeHtml(creator.suitColor)}`;
    return `
      <article
        class="real-poker-card tilt-card ${cardToneClass}"
        data-creator-id="${escapeHtml(creator.id)}"
      >
        <div class="real-card-corner real-card-corner-tl" aria-hidden="true">
          <span class="real-rank">${escapeHtml(creator.rank)}</span>
          <span class="real-suit">${escapeHtml(creator.suit)}</span>
        </div>
        <div class="real-card-corner real-card-corner-br" aria-hidden="true">
          <span class="real-rank">${escapeHtml(creator.rank)}</span>
          <span class="real-suit">${escapeHtml(creator.suit)}</span>
        </div>

        <div class="real-card-inner-frame">
          <div class="real-card-face-window">
            ${buildCrownSvg(creator.rank === 'Q' ? 'Q' : 'K')}
            <img
              class="real-card-portrait"
              src="${escapeHtml(creator.portrait)}"
              alt="${escapeHtml(creator.name)} — ${escapeHtml(creator.niche)}"
              width="512"
              height="512"
              loading="lazy"
              decoding="async"
              data-fallback="${escapeHtml(creator.fallbackPortrait)}"
            >
          </div>

          <div class="real-card-nameplate">
            <h3>
              <span>${escapeHtml(creator.name)}</span>
              <span class="verified-check" title="Verified" aria-label="Verified">✓</span>
            </h3>
            <div class="real-card-sub">
              <a
                class="real-card-handle"
                href="${escapeHtml(creator.url)}"
                target="_blank"
                rel="noopener noreferrer"
              >@${escapeHtml(creator.handle)} ↗</a>
              <span class="real-card-tag">${escapeHtml(creator.niche)}</span>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');

  attachCardInteractions(realDeck);
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
  const digits = (MOLDIN_CONTACT.whatsappDigits || '').replace(/\D/g, '');
  const buildWaUrl = (message) => {
    const encoded = encodeURIComponent(message);
    return digits ? `https://wa.me/${digits}?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
  };

  const bindTriggers = (selector, message) => {
    const triggers = document.querySelectorAll(selector);
    if (!triggers.length) return;
    const url = buildWaUrl(message);
    for (const el of triggers) {
      if (el.tagName === 'A') {
        el.setAttribute('href', url);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      } else {
        el.addEventListener('click', () => {
          window.open(url, '_blank', 'noopener,noreferrer');
        });
      }
    }
  };

  bindTriggers('[data-open-whatsapp]', MOLDIN_CONTACT.defaultWhatsappGreeting);
  bindTriggers(
    '[data-brand-whatsapp]',
    MOLDIN_CONTACT.brandWhatsappGreeting || MOLDIN_CONTACT.defaultWhatsappGreeting,
  );
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
 * Loads the 1,000-article JSON catalog dynamically on blogs.html for instant filtering & pagination.
 */
export const initBlogExplorer = async () => {
  const root = document.getElementById('playbook-explorer');
  const grid = document.getElementById('explorer-grid');
  const statusEl = document.getElementById('explorer-status');
  const searchInput = document.getElementById('exp-search');
  const indSelect = document.getElementById('exp-industry');
  const objSelect = document.getElementById('exp-objective');
  const mktSelect = document.getElementById('exp-market');
  const prevBtn = document.getElementById('exp-prev');
  const nextBtn = document.getElementById('exp-next');
  const pageInfo = document.getElementById('exp-page-info');
  if (!root || !grid || !statusEl) return;

  try {
    const response = await fetch('data/blogs-catalog.json');
    if (!response.ok) return;
    const catalog = await response.json();
    const allPosts = Array.isArray(catalog.posts) ? catalog.posts : [];
    if (!allPosts.length) return;

    if (indSelect && Array.isArray(catalog.industries)) {
      for (const ind of catalog.industries) {
        const opt = document.createElement('option');
        opt.value = ind.slug;
        opt.textContent = ind.name;
        indSelect.appendChild(opt);
      }
    }
    if (objSelect && Array.isArray(catalog.objectives)) {
      for (const obj of catalog.objectives) {
        const opt = document.createElement('option');
        opt.value = obj.slug;
        opt.textContent = obj.name;
        objSelect.appendChild(opt);
      }
    }
    if (mktSelect && Array.isArray(catalog.markets)) {
      for (const mkt of catalog.markets) {
        const opt = document.createElement('option');
        opt.value = mkt.slug;
        opt.textContent = mkt.label;
        mktSelect.appendChild(opt);
      }
    }

    const PAGE_SIZE = 12;
    let currentPage = 1;
    let filtered = allPosts;

    const renderPage = () => {
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      const startIdx = (currentPage - 1) * PAGE_SIZE;
      const slice = filtered.slice(startIdx, startIdx + PAGE_SIZE);

      if (!slice.length) {
        grid.innerHTML =
          '<p style="grid-column:1/-1;color:#52525b;padding:1rem 0;">No guides match that filter yet. Try clearing one dropdown or keyword.</p>';
        statusEl.textContent = '0 matching playbooks';
      } else {
        grid.innerHTML = slice
          .map(
            (p) => `
          <a class="explorer-card" href="blog/${escapeHtml(p.s)}/">
            <div>
              <div class="explorer-card-meta">
                <span class="explorer-pill">${escapeHtml(p.in)}</span>
                <span class="explorer-market-pill">${escapeHtml(p.ml)}</span>
              </div>
              <h3 style="margin-top:0.55rem;">${escapeHtml(p.t)}</h3>
              <p style="margin-top:0.4rem;">${escapeHtml(p.d)}</p>
            </div>
            <div class="explorer-card-foot">
              <span>${escapeHtml(String(p.r))} min read</span>
              <span class="explorer-card-read">Read Guide →</span>
            </div>
          </a>`,
          )
          .join('');
        statusEl.textContent = `Showing ${startIdx + 1}–${startIdx + slice.length} of ${total.toLocaleString()} Playbooks`;
      }

      if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    };

    const applyFilters = () => {
      const q = (searchInput?.value || '').trim().toLowerCase();
      const ind = indSelect?.value || '';
      const obj = objSelect?.value || '';
      const mkt = mktSelect?.value || '';

      filtered = allPosts.filter((p) => {
        if (ind && p.i !== ind) return false;
        if (obj && p.o !== obj) return false;
        if (mkt && p.m !== mkt) return false;
        if (q) {
          const hay = `${p.t} ${p.d} ${p.in} ${p.on} ${p.ml}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      currentPage = 1;
      renderPage();
    };

    searchInput?.addEventListener('input', applyFilters);
    indSelect?.addEventListener('change', applyFilters);
    objSelect?.addEventListener('change', applyFilters);
    mktSelect?.addEventListener('change', applyFilters);
    prevBtn?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderPage();
      }
    });
    nextBtn?.addEventListener('click', () => {
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage < totalPages) {
        currentPage += 1;
        renderPage();
      }
    });

    renderPage();
  } catch {
    // Preserve static SSR fallback cards gracefully if catalog cannot load
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
  initCreatorPageDeck();
  initFaqAccordion();
  initWhatsappCollab();
  initAccessDialog();
  initBriefForm();
  initBlogFilters();
  initBlogExplorer();
});
