/**
 * @fileoverview Ambient chromatic neon light-strip texture overlay for MOLDIN.india®.
 * Renders smooth angled frosted-neon ribbon sweeps and soft chromatic edge blooms
 * transitioning color gracefully from obsidian Hero (#02040a) across daylight white (#ffffff)
 * sections and into the bottom Neon WhatsApp FAQ Hero—without vertical side wires.
 */

/**
 * Hermite smoothstep interpolation across [edge0, edge1].
 * @param {number} edge0
 * @param {number} edge1
 * @param {number} x
 * @returns {number}
 */
const smoothstep = (edge0, edge1, x) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/**
 * Draws one sleek translucent curved neon glass ribbon strip at document Y position `docY`,
 * gently sweeping diagonally across background open space behind cards.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w Viewport width
 * @param {number} viewH Viewport height
 * @param {number} scrollY Current window scrollY
 * @param {{
 *   docY: number,
 *   amplitudeY: number,
 *   tiltY: number,
 *   bandHeight: number,
 *   cLeft: string,
 *   cMid: string,
 *   cRight: string,
 *   alphaScale: number,
 *   speed: number,
 * }} cfg
 * @param {number} timeSec
 * @param {boolean} reducedMotion
 */
const drawNeonTextureBand = (ctx, w, viewH, scrollY, cfg, timeSec, reducedMotion) => {
  const sy = cfg.docY - scrollY;
  const maxSpan = Math.abs(cfg.tiltY) + cfg.amplitudeY + cfg.bandHeight + 90;
  if (sy < -maxSpan || sy > viewH + maxSpan) return;

  const STEPS = 64;
  const xStart = -w * 0.08;
  const xSpan = w * 1.16;

  ctx.save();
  // Smooth sweeping bezier ribbon band
  const buildPath = (halfThick) => {
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i += 1) {
      const t = i / STEPS;
      const x = xStart + t * xSpan;
      const center =
        sy +
        (t - 0.5) * cfg.tiltY +
        Math.sin(t * Math.PI * 1.65 + cfg.phaseSeed) * cfg.amplitudeY;
      if (i === 0) ctx.moveTo(x, center - halfThick);
      else ctx.lineTo(x, center - halfThick);
    }
    for (let i = STEPS; i >= 0; i -= 1) {
      const t = i / STEPS;
      const x = xStart + t * xSpan;
      const center =
        sy +
        (t - 0.5) * cfg.tiltY +
        Math.sin(t * Math.PI * 1.65 + cfg.phaseSeed) * cfg.amplitudeY;
      ctx.lineTo(x, center + halfThick);
    }
    ctx.closePath();
  };

  // Translucent neon pastel glass strip body
  const fillGrad = ctx.createLinearGradient(0, sy - 60, w, sy + 60);
  fillGrad.addColorStop(0, cfg.cLeft);
  fillGrad.addColorStop(0.5, cfg.cMid);
  fillGrad.addColorStop(1, cfg.cRight);

  ctx.globalAlpha = 0.085 * cfg.alphaScale;
  buildPath(cfg.bandHeight * 0.5);
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // Subtle glowing upper & lower neon hairline bevel rails on the ribbon strip
  const strokeEdge = (sign) => {
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i += 1) {
      const t = i / STEPS;
      const x = xStart + t * xSpan;
      const center =
        sy +
        (t - 0.5) * cfg.tiltY +
        Math.sin(t * Math.PI * 1.65 + cfg.phaseSeed) * cfg.amplitudeY;
      const y = center + sign * cfg.bandHeight * 0.5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = fillGrad;
    ctx.globalAlpha = 0.24 * cfg.alphaScale;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Animated drifting shimmer highlight gliding along the glass bevel
    if (!reducedMotion) {
      const pulseCenter = ((timeSec * cfg.speed + cfg.phaseSeed * 0.2) % 1 + 1) % 1;
      const pulseGrad = ctx.createLinearGradient(
        w * (pulseCenter - 0.14),
        0,
        w * (pulseCenter + 0.14),
        0,
      );
      pulseGrad.addColorStop(0, 'rgba(255,255,255,0)');
      pulseGrad.addColorStop(0.5, cfg.cMid);
      pulseGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = pulseGrad;
      ctx.globalAlpha = 0.55 * cfg.alphaScale;
      ctx.lineWidth = 2.4;
      ctx.stroke();
    }
  };

  strokeEdge(-1);
  strokeEdge(1);
  ctx.restore();
};

/**
 * Draws atmospheric soft chromatic corner glow orbs & partial curved side orbital arcs
 * across the white canvas so light switches seamlessly between cyan, magenta, violet, and gold.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} viewH
 * @param {number} scrollY
 * @param {object} bounds
 */
const drawAmbientLightHalos = (ctx, w, viewH, scrollY, bounds) => {
  const halos = [
    { docY: bounds.lightTop + 140, x: w * 0.08, rgba: 'rgba(232, 4, 140, 0.095)', r: Math.min(360, w * 0.3) },
    { docY: bounds.lightTop + 320, x: w * 0.92, rgba: 'rgba(0, 188, 228, 0.105)', r: Math.min(390, w * 0.32) },
    { docY: bounds.lightTop + 760, x: w * 0.12, rgba: 'rgba(212, 160, 43, 0.075)', r: Math.min(350, w * 0.28) },
    { docY: bounds.lightBottom - 260, x: w * 0.90, rgba: 'rgba(130, 52, 235, 0.09)', r: Math.min(380, w * 0.3) },
    { docY: bounds.lightBottom - 120, x: w * 0.10, rgba: 'rgba(0, 198, 238, 0.095)', r: Math.min(360, w * 0.28) },
  ];

  for (const h of halos) {
    const sy = h.docY - scrollY;
    if (sy < -h.r || sy > viewH + h.r) continue;
    const g = ctx.createRadialGradient(h.x, sy, 8, h.x, sy, h.r);
    g.addColorStop(0, h.rgba);
    g.addColorStop(0.55, h.rgba.replace(/[\d.]+\)$/, '0.03)'));
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(Math.max(0, h.x - h.r), Math.max(0, sy - h.r), h.r * 2, h.r * 2);
  }
};

/**
 * Initializes the ambient neon strip texture engine across light and transition bands.
 */
export const initPageLightStrips = () => {
  const canvas = document.getElementById('flow-light-strips');
  const hero = document.getElementById('hero-stage');
  const lightStage = document.querySelector('.light-canvas-stage');
  const faq = document.getElementById('faq');
  if (!canvas || !hero || !lightStage || !faq) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0;
  let viewH = 0;
  let dpr = 1;

  const resize = () => {
    w = Math.max(320, window.innerWidth);
    viewH = Math.max(400, window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(viewH * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${viewH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startTime = performance.now();

  const render = (now) => {
    const timeSec = reducedMotion ? 0 : (now - startTime) * 0.001;
    const scrollY = window.scrollY;

    const heroRect = hero.getBoundingClientRect();
    const lightRect = lightStage.getBoundingClientRect();
    const faqRect = faq.getBoundingClientRect();

    const bounds = {
      heroBottom: heroRect.bottom + scrollY,
      lightTop: lightRect.top + scrollY,
      lightBottom: lightRect.bottom + scrollY,
      faqTop: faqRect.top + scrollY,
    };

    ctx.clearRect(0, 0, w, viewH);
    drawAmbientLightHalos(ctx, w, viewH, scrollY, bounds);

    // Sleek angled neon texture strips weaving smoothly behind section zones on white
    const lightHeight = Math.max(800, bounds.lightBottom - bounds.lightTop);
    const textureBands = [
      {
        docY: bounds.lightTop + 26,
        amplitudeY: 42,
        tiltY: -65,
        bandHeight: 54,
        cLeft: '#00e8f8',
        cMid: '#7c3aed',
        cRight: '#fa049c',
        alphaScale: 0.95,
        speed: 0.12,
        phaseSeed: 0.4,
      },
      {
        docY: bounds.lightTop + lightHeight * 0.44,
        amplitudeY: 48,
        tiltY: 85,
        bandHeight: 62,
        cLeft: '#fa049c',
        cMid: '#00b4e6',
        cRight: '#d4a02b',
        alphaScale: 0.85,
        speed: -0.1,
        phaseSeed: 1.7,
      },
      {
        docY: bounds.lightTop + lightHeight * 0.78,
        amplitudeY: 44,
        tiltY: -78,
        bandHeight: 58,
        cLeft: '#00b4e6',
        cMid: '#e8048c',
        cRight: '#00e8f8',
        alphaScale: 0.9,
        speed: 0.11,
        phaseSeed: 2.9,
      },
      {
        docY: bounds.lightBottom + smoothstep(0, 1, 0.4) * Math.max(60, bounds.faqTop - bounds.lightBottom),
        amplitudeY: 36,
        tiltY: 60,
        bandHeight: 48,
        cLeft: '#e8048c',
        cMid: '#00e8f8',
        cRight: '#00e8f8',
        alphaScale: 0.92,
        speed: -0.13,
        phaseSeed: 4.1,
      },
    ];

    for (const band of textureBands) {
      drawNeonTextureBand(ctx, w, viewH, scrollY, band, timeSec, reducedMotion);
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};
