/**
 * @fileoverview Continuous full-page chromatic neon light-strip engine.
 * Renders single-path smooth spline gradient ribbons + companion twin hairline +
 * animated energy pulses so there are zero beaded segment seams and crisp transitions
 * between dark obsidian (#02040a) and daylight white (#ffffff).
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
 * Linear interpolation between two [r, g, b] triplets.
 * @param {[number, number, number]} a
 * @param {[number, number, number]} b
 * @param {number} t
 * @returns {[number, number, number]}
 */
const lerpRgb = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/**
 * Converts RGB tuple + alpha -> rgba CSS string.
 * @param {[number, number, number]} rgb
 * @param {number} alpha
 * @returns {string}
 */
const rgbaStr = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha.toFixed(3)})`;

const COL_DARK_CYAN = [0, 232, 248];
const COL_DARK_PINK = [250, 4, 156];
const COL_WHITE_PINK = [232, 4, 140];
const COL_WHITE_CYAN = [0, 178, 224];
const COL_WHITE_VIOLET = [118, 52, 235];
const COL_WHITE_GOLD = [212, 160, 43];

/**
 * Normalized white-daylight mix (0 = pure dark obsidian, 1 = pure white section).
 * @param {number} docY
 * @param {object} bounds
 * @returns {number}
 */
const computeLightMix = (docY, bounds) => {
  const enter = smoothstep(bounds.lightTop - bounds.topBridgeSpan, bounds.lightTop + 40, docY);
  const exit = 1 - smoothstep(bounds.lightBottom - 40, bounds.lightBottom + bounds.botBridgeSpan, docY);
  return Math.max(0, Math.min(1, Math.min(enter, exit)));
};

/**
 * Computes color stop at document coordinate docY so strips switch chromatic polarity cleanly:
 * - Left: Hero Electric Cyan -> Vivid White-Mode Magenta/Violet -> Hero/FAQ Cyan
 * - Right: Hero Hot Magenta -> Vivid White-Mode Electric Cyan/Gold -> Bottom Cyan
 */
const sampleStripColor = (lane, docY, progress, bounds) => {
  const whiteMix = computeLightMix(docY, bounds);
  if (lane === 'left') {
    const whiteAccent = lerpRgb(
      COL_WHITE_PINK,
      COL_WHITE_VIOLET,
      0.5 + 0.5 * Math.sin(progress * Math.PI * 3.0),
    );
    return lerpRgb(COL_DARK_CYAN, whiteAccent, whiteMix);
  }
  const botMix = smoothstep(bounds.lightBottom - 80, bounds.lightBottom + bounds.botBridgeSpan, docY);
  const darkEndpoint = lerpRgb(COL_DARK_PINK, COL_DARK_CYAN, botMix);
  const whiteAccent = lerpRgb(
    COL_WHITE_CYAN,
    COL_WHITE_GOLD,
    0.25 * (0.5 + 0.5 * Math.cos(progress * Math.PI * 2.4)),
  );
  return lerpRgb(darkEndpoint, whiteAccent, whiteMix);
};

/**
 * Computes exact intersection point where Hero's left/right radial dome arcs cross bottom of Hero.
 * Kept tightly synchronized with hero-ribbons.js arc radii/centers.
 * @param {number} w
 * @param {number} heroH
 */
const computeHeroArcExits = (w, heroH) => {
  const leftCx = -w * 0.03;
  const leftCy = heroH * 0.67;
  const leftR = Math.min(w * 0.44, Math.max(w * 0.225, heroH * 0.34));
  const dyL = Math.max(-leftR + 2, Math.min(leftR - 2, heroH - leftCy));
  const dxFromCenterL = Math.sqrt(Math.max(1, leftR * leftR - dyL * dyL));
  const leftExitX = Math.max(10, leftCx + dxFromCenterL);
  const leftSlope = -dyL / Math.max(24, dxFromCenterL); // Exact tangent dx/dy

  const rightCx = w * 1.07;
  const rightCy = heroH * 0.61;
  const rightR = Math.min(w * 0.48, Math.max(w * 0.275, heroH * 0.42));
  const dyR = Math.max(-rightR + 2, Math.min(rightR - 2, heroH - rightCy));
  const dxFromCenterR = Math.sqrt(Math.max(1, rightR * rightR - dyR * dyR));
  const rightExitX = Math.min(w - 10, rightCx - dxFromCenterR);
  const rightSlope = dyR / Math.max(24, dxFromCenterR); // Exact tangent dx/dy

  return { leftExitX, rightExitX, leftSlope, rightSlope };
};

/**
 * Samples smooth vertical spline paths strictly inside open side gutter channels outside .container (max 1200px)
 * matching Hero's exact exit tangents with C1 curve continuity.
 * @param {number} w
 * @param {object} bounds
 */
const sampleSplinePoints = (w, bounds) => {
  const heroH = Math.max(610, bounds.heroHeight);
  const { leftExitX, rightExitX, leftSlope, rightSlope } = computeHeroArcExits(w, heroH);

  const startY = bounds.heroBottom - 2;
  const endY = Math.max(bounds.faqBottom + 20, bounds.docHeight);
  const totalSpan = Math.max(800, endY - startY);
  const STEPS = 150;

  const containerW = Math.min(1200, w - 38);
  const gutterW = (w - containerW) * 0.5;
  const leftGutterSafe = gutterW > 54 ? gutterW * 0.48 : 8;
  const rightGutterSafe = gutterW > 54 ? w - gutterW * 0.48 : w - 8;
  const waveAmp = gutterW > 110 ? Math.min(44, gutterW * 0.28) : gutterW > 54 ? 10 : 3;

  const leftPts = [];
  const rightPts = [];

  for (let i = 0; i <= STEPS; i += 1) {
    const p = i / STEPS;
    const docY = startY + p * totalSpan;
    const distY = docY - startY;
    const whiteMix = computeLightMix(docY, bounds);

    // Cubic Hermite blend from Hero exit coordinate + tangent into clean gutter flow rails
    const entryT = Math.min(1, distY / 260);
    const h00 = 2 * entryT ** 3 - 3 * entryT ** 2 + 1;
    const h10 = entryT ** 3 - 2 * entryT ** 2 + entryT;
    const h01 = -2 * entryT ** 3 + 3 * entryT ** 2;

    const targetLeftBase = leftGutterSafe + Math.sin(p * Math.PI * 5.0 + 0.3) * waveAmp * whiteMix;
    const targetRightBase = rightGutterSafe + Math.cos(p * Math.PI * 4.6 + 0.6) * waveAmp * whiteMix;

    const exitEase = smoothstep(0.84, 1.0, p);
    const lxCurve = h00 * leftExitX + h10 * (leftSlope * 220) + h01 * targetLeftBase;
    const lx = lxCurve * (1 - exitEase) + leftGutterSafe * exitEase;

    const rxCurve = h00 * rightExitX + h10 * (rightSlope * 220) + h01 * targetRightBase;
    const rx = rxCurve * (1 - exitEase) + rightGutterSafe * exitEase;

    leftPts.push({ x: Math.max(6, Math.min(lx, w * 0.38)), docY, p, whiteMix });
    rightPts.push({ x: Math.min(w - 6, Math.max(rx, w * 0.62)), docY, p, whiteMix });
  }

  return { leftPts, rightPts, startY, totalSpan };
};

/**
 * Traces a single smooth C1 quadratic Bezier path across screen coordinates in pts[startIdx..endIdx].
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<{ x: number, docY: number }>} pts
 * @param {number} scrollY
 * @param {number} offsetX
 */
const traceSmoothSpline = (ctx, pts, scrollY, offsetX = 0) => {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x + offsetX, pts[0].docY - scrollY);
  for (let i = 1; i < pts.length - 1; i += 1) {
    const xc = (pts[i].x + pts[i + 1].x) * 0.5 + offsetX;
    const yc = (pts[i].docY + pts[i + 1].docY) * 0.5 - scrollY;
    ctx.quadraticCurveTo(pts[i].x + offsetX, pts[i].docY - scrollY, xc, yc);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x + offsetX, last.docY - scrollY);
};

/**
 * Draws ONE continuous multi-stop gradient stroke per layer along the entire spline — ZERO dots/beads!
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<{ x: number, docY: number, p: number, whiteMix: number }>} pts
 * @param {'left' | 'right'} lane
 * @param {number} scrollY
 * @param {number} viewH
 * @param {number} timeSec
 * @param {object} bounds
 * @param {boolean} reducedMotion
 */
const drawUnifiedNeonSpline = (ctx, pts, lane, scrollY, viewH, timeSec, bounds, reducedMotion) => {
  // Slice only segments reasonably near viewport for clean performance + accurate linear gradient
  let firstIdx = 0;
  let lastIdx = pts.length - 1;
  for (let i = 0; i < pts.length; i += 1) {
    if (pts[i].docY - scrollY >= -160) {
      firstIdx = Math.max(0, i - 2);
      break;
    }
  }
  for (let i = pts.length - 1; i >= firstIdx; i -= 1) {
    if (pts[i].docY - scrollY <= viewH + 160) {
      lastIdx = Math.min(pts.length - 1, i + 2);
      break;
    }
  }

  const visPts = pts.slice(firstIdx, lastIdx + 1);
  if (visPts.length < 2) return;

  const yTop = visPts[0].docY - scrollY;
  const yBot = visPts[visPts.length - 1].docY - scrollY;
  if (Math.abs(yBot - yTop) < 2) return;

  // Build single vertical CanvasGradient across visible slice matching exact dark<->white color transitions
  const gradCore = ctx.createLinearGradient(0, yTop, 0, yBot);
  const gradHalo = ctx.createLinearGradient(0, yTop, 0, yBot);
  const gradCompanion = ctx.createLinearGradient(0, yTop, 0, yBot);

  const SAMPLES = 16;
  for (let k = 0; k <= SAMPLES; k += 1) {
    const frac = k / SAMPLES;
    const idx = Math.min(visPts.length - 1, Math.round(frac * (visPts.length - 1)));
    const pt = visPts[idx];
    const rgb = sampleStripColor(lane, pt.docY, pt.p, bounds);
    gradCore.addColorStop(frac, rgbaStr(rgb, 0.94));
    gradHalo.addColorStop(frac, rgbaStr(rgb, pt.whiteMix > 0.45 ? 0.16 : 0.28));
    gradCompanion.addColorStop(frac, rgbaStr(rgb, pt.whiteMix > 0.45 ? 0.42 : 0.36));
  }

  const offsetSecond = lane === 'left' ? 10 : -10;

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Wide silky chromatic atmospheric aura (zero segmented overlap artifacts)
  traceSmoothSpline(ctx, visPts, scrollY, 0);
  ctx.strokeStyle = gradHalo;
  ctx.lineWidth = 18;
  ctx.stroke();

  // 2. Smooth laser-crisp primary neon filament
  traceSmoothSpline(ctx, visPts, scrollY, 0);
  ctx.strokeStyle = gradCore;
  ctx.lineWidth = 3.0;
  ctx.shadowColor = rgbaStr(sampleStripColor(lane, scrollY + viewH * 0.5, 0.5, bounds), 0.55);
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 3. Companion twin hairline strip
  traceSmoothSpline(ctx, visPts, scrollY, offsetSecond);
  ctx.strokeStyle = gradCompanion;
  ctx.lineWidth = 1.3;
  ctx.stroke();

  // 4. Smooth continuous energy comet pulse sliding down the primary spline (single gradient dash stroke)
  if (!reducedMotion) {
    const pulseCenter = ((timeSec * (lane === 'left' ? 0.16 : -0.14)) % 1 + 1) % 1;
    const pIdx = Math.min(pts.length - 1, Math.round(pulseCenter * (pts.length - 1)));
    const packetStart = Math.max(firstIdx, pIdx - 4);
    const packetEnd = Math.min(lastIdx, pIdx + 4);
    if (packetEnd - packetStart >= 2) {
      const pPts = pts.slice(packetStart, packetEnd + 1);
      const py0 = pPts[0].docY - scrollY;
      const py1 = pPts[pPts.length - 1].docY - scrollY;
      const cometGrad = ctx.createLinearGradient(0, py0, 0, py1);
      const midPt = pPts[Math.floor(pPts.length / 2)];
      const rgb = sampleStripColor(lane, midPt.docY, midPt.p, bounds);
      cometGrad.addColorStop(0, rgbaStr(rgb, 0));
      cometGrad.addColorStop(0.5, midPt.whiteMix > 0.55 ? rgbaStr(rgb, 1) : 'rgba(255, 255, 255, 0.96)');
      cometGrad.addColorStop(1, rgbaStr(rgb, 0));

      traceSmoothSpline(ctx, pPts, scrollY, 0);
      ctx.strokeStyle = cometGrad;
      ctx.lineWidth = 4.6;
      ctx.shadowColor = rgbaStr(rgb, 0.85);
      ctx.shadowBlur = 16;
      ctx.stroke();
    }
  }

  ctx.restore();
};

/**
 * Draws gentle chromatic ambient glow halos gliding subtly behind the outer white edges
 * so the white canvas feels luminous without touching central card readability.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} viewH
 * @param {number} scrollY
 * @param {object} bounds
 */
const drawWhiteEdgeAuras = (ctx, w, viewH, scrollY, bounds) => {
  const dots = [
    { docY: bounds.lightTop + 180, x: w * 0.04, col: COL_WHITE_PINK, r: Math.min(340, w * 0.24), a: 0.085 },
    { docY: bounds.lightTop + 360, x: w * 0.96, col: COL_WHITE_CYAN, r: Math.min(360, w * 0.26), a: 0.095 },
    { docY: bounds.lightTop + 780, x: w * 0.04, col: COL_WHITE_VIOLET, r: Math.min(340, w * 0.24), a: 0.08 },
    { docY: bounds.lightBottom - 220, x: w * 0.96, col: COL_WHITE_PINK, r: Math.min(360, w * 0.25), a: 0.09 },
  ];

  for (const d of dots) {
    const sy = d.docY - scrollY;
    if (sy < -d.r || sy > viewH + d.r) continue;
    const grad = ctx.createRadialGradient(d.x, sy, 4, d.x, sy, d.r);
    grad.addColorStop(0, rgbaStr(d.col, d.a));
    grad.addColorStop(0.55, rgbaStr(d.col, d.a * 0.35));
    grad.addColorStop(1, rgbaStr(d.col, 0));
    ctx.fillStyle = grad;
    ctx.fillRect(Math.max(0, d.x - d.r), Math.max(0, sy - d.r), d.r * 2, d.r * 2);
  }
};

/**
 * Initializes the continuous cross-section neon light-strip system synced to Hero, White Stage, and FAQ.
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
      heroHeight: heroRect.height,
      heroBottom: heroRect.bottom + scrollY,
      lightTop: lightRect.top + scrollY,
      lightBottom: lightRect.bottom + scrollY,
      faqTop: faqRect.top + scrollY,
      faqBottom: faqRect.bottom + scrollY,
      docHeight: document.documentElement.scrollHeight,
      topBridgeSpan: Math.max(220, lightRect.top - heroRect.bottom),
      botBridgeSpan: Math.max(240, faqRect.top - lightRect.bottom),
    };

    ctx.clearRect(0, 0, w, viewH);
    drawWhiteEdgeAuras(ctx, w, viewH, scrollY, bounds);

    const { leftPts, rightPts } = sampleSplinePoints(w, bounds);
    drawUnifiedNeonSpline(ctx, leftPts, 'left', scrollY, viewH, timeSec, bounds, reducedMotion);
    drawUnifiedNeonSpline(ctx, rightPts, 'right', scrollY, viewH, timeSec, bounds, reducedMotion);

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};
