/**
 * @fileoverview Hyper-optimized 3D kinetic neon glass brand ribbons, pre-cached ambient
 * planet arcs, and batched rim lasers for the MOLDIN.india® hero stage.
 * Automatically pauses when scrolled offscreen or backgrounded for instant 60fps UX.
 */

import { HERO_BRAND_RINGS } from './brands-config.js';

/**
 * Draw crisp custom vector brand badge centered inside a texture cell, falling back
 * to clean geometric wordmark typography for any user-supplied brand string.
 * Runs once during startup atlas generation (zero per-frame overhead).
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ name: string, badgeType?: string, accent?: string }} brand
 * @param {number} cx
 * @param {number} cy
 * @param {number} cellW
 * @param {number} cellH
 */
const drawBrandArtwork = (ctx, brand, cx, cy, cellW, cellH) => {
  ctx.save();
  ctx.translate(cx, cy);
  const type = (brand.badgeType || brand.name || '').toLowerCase().trim();
  const s = Math.min(cellH / 120, cellW / 290);
  ctx.scale(s, s);

  if (type === 'boat') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 50px "Outfit", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('bo', -34, 2);
    ctx.beginPath();
    ctx.moveTo(14, -18);
    ctx.lineTo(35, 19);
    ctx.lineTo(-7, 19);
    ctx.closePath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fillText('t', 50, 2);
  } else if (type === 'coca-cola') {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 700 46px Georgia, "Times New Roman", serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('Coca-Cola', 0, 2);
  } else if (type === 'netflix') {
    ctx.fillStyle = '#b20710';
    ctx.fillRect(-19, -30, 12, 60);
    ctx.fillRect(7, -30, 12, 60);
    ctx.fillStyle = '#e50914';
    ctx.beginPath();
    ctx.moveTo(-19, -30);
    ctx.lineTo(-7, -30);
    ctx.lineTo(19, 30);
    ctx.lineTo(7, 30);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'spotify') {
    ctx.fillStyle = '#1ed760';
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#07120c';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    for (const [yOff, rad, amp] of [
      [-7, 24, 0.42],
      [1, 20, 0.38],
      [9, 15, 0.34],
    ]) {
      ctx.beginPath();
      ctx.arc(-2, yOff + rad * 0.72, rad, -Math.PI / 2 - amp, -Math.PI / 2 + amp * 1.15);
      ctx.stroke();
    }
  } else if (type === 'dove') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-14, -22);
    ctx.quadraticCurveTo(0, -34, 16, -24);
    ctx.quadraticCurveTo(8, -14, -4, -14);
    ctx.quadraticCurveTo(-11, -15, -14, -22);
    ctx.fill();
    ctx.font = 'italic 700 42px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Dove', 0, 10);
  } else if (type === 'puma') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PUMA', -10, 10);
    ctx.beginPath();
    ctx.moveTo(24, -14);
    ctx.quadraticCurveTo(42, -32, 62, -24);
    ctx.quadraticCurveTo(48, -12, 34, -4);
    ctx.lineTo(24, -14);
    ctx.fill();
  } else if (type === 'sunosunao') {
    // Sleek neon-blue + gold soundwave emblem + clean studio wordmark
    const barHeights = [14, 28, 42, 24, 16];
    const barColors = ['#e6b84c', '#f5d061', '#00e8f8', '#38dfff', '#00e8f8'];
    for (let i = 0; i < barHeights.length; i += 1) {
      ctx.fillStyle = barColors[i];
      const bh = barHeights[i];
      ctx.fillRect(-108 + i * 7, -bh * 0.5, 4.5, bh);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 32px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const baseTxt = 'SunoSunao';
    const baseW = ctx.measureText(baseTxt).width;
    ctx.fillText(baseTxt, -68, 1);
    ctx.fillStyle = '#00e8f8';
    ctx.fillText('.ai', -68 + baseW + 1, 1);
  } else if (type === 'nonstop') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 35px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NON°STOP', 0, -5);
    ctx.fillStyle = '#f5c451';
    ctx.font = '800 13px "Outfit", sans-serif';
    ctx.fillText('E N E R G Y', 0, 21);
  } else if (type === 'mokobara') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 33px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MOKOBARA', 0, 1);
  } else if (type === 'ultrahuman') {
    ctx.strokeStyle = '#00e8f8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-96, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 30px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('ULTRAHUMAN', -76, 1);
  } else if (type === 'promptflow') {
    ctx.fillStyle = '#f5c451';
    ctx.beginPath();
    ctx.moveTo(-88, -16);
    ctx.lineTo(-102, 2);
    ctx.lineTo(-91, 2);
    ctx.lineTo(-97, 18);
    ctx.lineTo(-78, -2);
    ctx.lineTo(-89, -2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 33px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PromptFlow', -70, 1);
  } else {
    ctx.fillStyle = brand.accent || '#ffffff';
    const label = String(brand.name || 'BRAND');
    const fontSize = label.length > 10 ? 30 : label.length > 7 ? 35 : 40;
    ctx.font = `800 ${fontSize}px "Outfit", "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 1);
  }
  ctx.restore();
};

/**
 * Pre-renders an offscreen spacious seamless texture atlas for one orbital brand ring.
 * Uses wider 340px spacing so brand logos stay uncluttered and crisp across front arcs.
 * @param {object} ringConfig
 * @returns {HTMLCanvasElement}
 */
const buildRingTextureAtlas = (ringConfig) => {
  const sourceBrands = ringConfig.brands?.length ? ringConfig.brands : [{ name: 'MOLDIN' }];
  const brands = [];
  // Two clean repetitions (~10 wide slots around 360deg -> ~4 crisp logos visible across front)
  const targetSlots = sourceBrands.length >= 6 ? sourceBrands.length : sourceBrands.length * 2;
  while (brands.length < targetSlots) {
    brands.push(...sourceBrands);
  }
  const count = brands.length;
  const cellW = 340;
  const atlasH = 148;
  const atlasW = count * cellW;
  const canvas = document.createElement('canvas');
  canvas.width = atlasW;
  canvas.height = atlasH;
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < count; i += 1) {
    const xStart = i * cellW;
    drawBrandArtwork(ctx, brands[i], xStart + cellW * 0.5, atlasH * 0.5, cellW, atlasH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(xStart + cellW - 1, atlasH * 0.26);
    ctx.lineTo(xStart + cellW - 1, atlasH * 0.74);
    ctx.stroke();
  }
  return canvas;
};

/**
 * Computes 3D parametric point on a tilted curved ribbon orbit with smooth S-saddle curl.
 * Parameter t ∈ [0, 1):
 * - t ∈ [0, 0.5] maps front half cleanly LEFT-TO-RIGHT (theta goes π -> 0)
 * - t ∈ [0.5, 1] maps back half cleanly RIGHT-TO-LEFT (theta goes 0 -> -π)
 */
const evaluateOrbitPoint = (ring, t, w, h, mouseX, mouseY) => {
  const theta = Math.PI - t * Math.PI * 2;
  const cx = w * 0.502 + mouseX * 10;
  const cy = h * ring.centerYRatio + mouseY * 6;
  const rx = w * ring.radiusXRatio;
  const ry = h * ring.radiusYRatio;
  const rz = h * ring.radiusZRatio;
  const tiltZ = ((ring.tiltZDeg || 0) * Math.PI) / 180;

  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const localX = rx * cosT;
  const wingCurl = -ry * 0.4 * Math.cos(2 * theta);
  const localY = -ry * sinT + wingCurl;
  const depthZ = rz * sinT;

  const cosZ = Math.cos(tiltZ);
  const sinZ = Math.sin(tiltZ);
  const x = cx + localX * cosZ - localY * sinZ;
  const y = cy + localX * sinZ + localY * cosZ;

  const perspective = 1 + (depthZ / Math.max(1, w)) * 0.22;
  const baseBandH = Math.max(46, Math.min(h * ring.bandHeightRatio, w * 0.086));

  return {
    x,
    y,
    height: baseBandH * perspective,
    facing: sinT,
  };
};

/**
 * Builds an offscreen cache of the pure pitch-black (#000000) backdrop with restrained
 * Neon Blue & Gold ambient light glows cleanly away from the sitting cushion perimeter.
 * @param {number} w
 * @param {number} h
 * @param {number} dpr
 */
const buildStaticBackgroundCache = (w, h, dpr) => {
  const cache = document.createElement('canvas');
  cache.width = Math.round(w * dpr);
  cache.height = Math.round(h * dpr);
  const ctx = cache.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Pure pitch-black obsidian canvas (#000000) with crisp contrast
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // Subtle ambient Neon Blue sheen behind upper-left rings (zero stray lines near cushion)
  const leftAura = ctx.createRadialGradient(w * 0.08, h * 0.45, 10, w * 0.08, h * 0.45, w * 0.34);
  leftAura.addColorStop(0, 'rgba(0, 232, 248, 0.14)');
  leftAura.addColorStop(0.55, 'rgba(0, 180, 220, 0.04)');
  leftAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = leftAura;
  ctx.fillRect(0, 0, w, h);

  // Subtle warm Golden sheen behind upper-right rings
  const rightAura = ctx.createRadialGradient(w * 0.92, h * 0.42, 10, w * 0.92, h * 0.42, w * 0.34);
  rightAura.addColorStop(0, 'rgba(230, 184, 76, 0.12)');
  rightAura.addColorStop(0.55, 'rgba(212, 160, 43, 0.035)');
  rightAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rightAura;
  ctx.fillRect(0, 0, w, h);

  const meltH = Math.min(90, h * 0.11);
  const bottomMelt = ctx.createLinearGradient(0, h - meltH, 0, h);
  bottomMelt.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomMelt.addColorStop(0.6, 'rgba(0, 0, 0, 0.78)');
  bottomMelt.addColorStop(1, '#000000');
  ctx.fillStyle = bottomMelt;
  ctx.fillRect(0, h - meltH, w, meltH);

  return { canvas: cache };
};

/**
 * Draws lightweight cached pitch-black backdrop (zero cushion streaks or blue tint).
 */
const drawAmbientNeonFrame = (ctx, cacheObj, w, h) => {
  ctx.drawImage(cacheObj.canvas, 0, 0, w, h);
};

/**
 * Draws a contiguous glass polygon spanning index range [iStart, iEnd] in ONE GPU draw call.
 */
const fillBeltPolygon = (ctx, pts, startIdx, endIdx, fillStyle) => {
  if (endIdx <= startIdx) return;
  ctx.beginPath();
  ctx.moveTo(pts[startIdx].x, pts[startIdx].y - pts[startIdx].height * 0.5);
  for (let i = startIdx + 1; i <= endIdx; i += 1) {
    ctx.lineTo(pts[i].x, pts[i].y - pts[i].height * 0.5);
  }
  for (let i = endIdx; i >= startIdx; i -= 1) {
    ctx.lineTo(pts[i].x, pts[i].y + pts[i].height * 0.5);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
};

/**
 * Draws an atlas slice handling clean seamless wrap across atlas width edges.
 */
const drawWrappedAtlasSlice = (ctx, atlas, uStart, uSpan, destY, destW, destH) => {
  const aw = atlas.width;
  const ah = atlas.height;
  const rawSx = ((uStart % 1) + 1) % 1 * aw;
  const sw = Math.max(0.5, uSpan * aw);

  if (rawSx + sw <= aw) {
    ctx.drawImage(atlas, rawSx, 0, sw, ah, 0, destY, destW, destH);
  } else {
    const firstPart = aw - rawSx;
    const frac = firstPart / sw;
    ctx.drawImage(atlas, rawSx, 0, firstPart, ah, 0, destY, destW * frac, destH);
    ctx.drawImage(atlas, 0, 0, sw - firstPart, ah, destW * frac, destY, destW * (1 - frac), destH);
  }
};

/**
 * Batches top/bottom neon rails + soft outer bloom in just 4 stroke calls total (zero shadowBlur).
 */
const strokeBatchedRails = (ctx, pts, startIdx, endIdx, strokeGrad, isFront, pulsePhase) => {
  if (endIdx <= startIdx) return;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const sign of [-0.5, 0.5]) {
    ctx.beginPath();
    ctx.moveTo(pts[startIdx].x, pts[startIdx].y + pts[startIdx].height * sign);
    for (let i = startIdx + 1; i <= endIdx; i += 1) {
      ctx.lineTo(pts[i].x, pts[i].y + pts[i].height * sign);
    }

    if (isFront) {
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 5.5;
      ctx.stroke();

      ctx.globalAlpha = 0.86;
      ctx.lineWidth = 1.65;
      ctx.stroke();

      // Subtle traveling bright glint over 5 consecutive segments
      const span = endIdx - startIdx;
      const glintLen = 5;
      if (span > glintLen + 2) {
        const gIdx = startIdx + (Math.floor(pulsePhase * span) % (span - glintLen));
        ctx.beginPath();
        ctx.moveTo(pts[gIdx].x, pts[gIdx].y + pts[gIdx].height * sign);
        for (let k = 1; k <= glintLen; k += 1) {
          ctx.lineTo(pts[gIdx + k].x, pts[gIdx + k].y + pts[gIdx + k].height * sign);
        }
        ctx.globalAlpha = 0.92;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }
    } else {
      ctx.globalAlpha = 0.24;
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
};

/**
 * Draws one closed 3D orbital frosted neon glass ribbon with minimal GPU draw calls.
 */
const drawKineticGlassRing = (ctx, ring, atlas, railGrad, w, h, dpr, phase, timeSec, mouseX, mouseY) => {
  const SEGMENTS = 96;
  const halfSeg = SEGMENTS / 2;
  const pts = new Array(SEGMENTS + 1);
  for (let i = 0; i <= SEGMENTS; i += 1) {
    pts[i] = evaluateOrbitPoint(ring, i / SEGMENTS, w, h, mouseX, mouseY);
  }

  // Pass 1: Back half (indices halfSeg..SEGMENTS), then Pass 2: Front half (indices 0..halfSeg)
  for (const isFront of [false, true]) {
    const startIdx = isFront ? 0 : halfSeg;
    const endIdx = isFront ? halfSeg : SEGMENTS;

    fillBeltPolygon(
      ctx,
      pts,
      startIdx,
      endIdx,
      isFront ? 'rgba(6, 6, 8, 0.84)' : 'rgba(2, 2, 3, 0.50)',
    );

    const uSpan = 1 / SEGMENTS;
    for (let i = startIdx; i < endIdx; i += 1) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const minX = Math.min(p0.x, p1.x);
      const maxX = Math.max(p0.x, p1.x);
      const segW = maxX - minX;
      if (segW < 0.4) continue;

      const uStart = i * uSpan + phase;

      if (isFront) {
        const frontRatio = i / halfSeg;
        const turnFade = Math.min(0.98, Math.sin(frontRatio * Math.PI) * 1.4 + 0.16);
        const slope = (p1.y - p1.height * 0.5 - (p0.y - p0.height * 0.5)) / (p1.x - p0.x);
        ctx.globalAlpha = Math.max(0.2, turnFade);
        ctx.setTransform(dpr, dpr * slope, 0, dpr, dpr * p0.x, dpr * (p0.y - p0.height * 0.5));
        drawWrappedAtlasSlice(ctx, atlas, uStart, uSpan, p0.height * 0.13, segW + 0.85, p0.height * 0.74);
      } else {
        const uNormX = Math.max(0, Math.min(1, ((minX + maxX) * 0.5 - w * 0.08) / (w * 0.84)));
        const edgeGlow = Math.pow(Math.abs(uNormX * 2 - 1), 1.6);
        if (edgeGlow > 0.45) {
          const revSlope = (p1.y - p1.height * 0.5 - (p0.y - p0.height * 0.5)) / (p1.x - p0.x);
          ctx.globalAlpha = 0.14 * edgeGlow;
          ctx.setTransform(-dpr, -dpr * revSlope, 0, dpr, dpr * p0.x, dpr * (p0.y - p0.height * 0.5));
          drawWrappedAtlasSlice(ctx, atlas, uStart, uSpan, p0.height * 0.16, segW + 0.85, p0.height * 0.68);
        }
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;

    const pulsePhase = Math.abs((timeSec * (ring.angularSpeed >= 0 ? 0.22 : -0.18)) % 1);
    strokeBatchedRails(ctx, pts, startIdx, endIdx, railGrad, isFront, pulsePhase);
  }
};

/**
 * Bootstraps the hyper-fast 3D orbital brand strips and ambient neon engine.
 */
export const initHeroRibbons = () => {
  const stage = document.getElementById('hero-stage');
  const bgCanvas = document.getElementById('hero-bg-canvas');
  const ringsCanvas = document.getElementById('hero-rings-canvas');
  if (!stage || !bgCanvas || !ringsCanvas) return;

  const bgCtx = bgCanvas.getContext('2d', { alpha: false });
  const ringsCtx = ringsCanvas.getContext('2d');
  if (!bgCtx || !ringsCtx) return;

  const atlases = new Map();
  const railGrads = new Map();
  for (const ring of HERO_BRAND_RINGS) {
    atlases.set(ring.id, buildRingTextureAtlas(ring));
  }

  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  let stageLeft = 0;
  let stageTop = 0;
  let bgCache = null;

  let targetMouseX = 0;
  let targetMouseY = 0;
  let smoothMouseX = 0;
  let smoothMouseY = 0;

  const buildRingGradients = () => {
    for (const ring of HERO_BRAND_RINGS) {
      const grad = ringsCtx.createLinearGradient(cssW * 0.08, 0, cssW * 0.92, 0);
      grad.addColorStop(0, ring.rimLeft || '#00e8f8');
      grad.addColorStop(0.5, ring.rimMid || '#ffffff');
      grad.addColorStop(1, ring.rimRight || '#e6b84c');
      railGrads.set(ring.id, grad);
    }
  };

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    cssW = Math.max(320, Math.round(rect.width));
    cssH = Math.max(480, Math.round(rect.height));
    stageLeft = rect.left;
    stageTop = rect.top + window.scrollY;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    for (const c of [bgCanvas, ringsCanvas]) {
      c.width = Math.round(cssW * dpr);
      c.height = Math.round(cssH * dpr);
      c.style.width = `${cssW}px`;
      c.style.height = `${cssH}px`;
    }
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ringsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    bgCache = buildStaticBackgroundCache(cssW, cssH, dpr);
    buildRingGradients();
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  stage.addEventListener(
    'pointermove',
    (e) => {
      const localY = e.clientY + window.scrollY - stageTop;
      targetMouseX = ((e.clientX - stageLeft) / cssW - 0.5) * 2;
      targetMouseY = (localY / cssH - 0.5) * 2;
    },
    { passive: true },
  );

  stage.addEventListener(
    'pointerleave',
    () => {
      targetMouseX = 0;
      targetMouseY = 0;
    },
    { passive: true },
  );

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let elapsedSec = reducedMotion ? 1.2 : 0;
  let lastNow = performance.now();
  let isHeroVisible = true;
  let rafId = 0;

  const renderFrame = (now) => {
    rafId = 0;
    const dt = Math.min(0.05, Math.max(0, (now - lastNow) * 0.001));
    lastNow = now;
    if (!reducedMotion) elapsedSec += dt;

    smoothMouseX += (targetMouseX - smoothMouseX) * 0.08;
    smoothMouseY += (targetMouseY - smoothMouseY) * 0.08;

    if (bgCache) {
      drawAmbientNeonFrame(bgCtx, bgCache, cssW, cssH);
    }

    ringsCtx.clearRect(0, 0, cssW, cssH);
    for (const ring of HERO_BRAND_RINGS) {
      const atlas = atlases.get(ring.id);
      const railGrad = railGrads.get(ring.id);
      if (!atlas || !railGrad) continue;
      const phase = elapsedSec * (ring.angularSpeed / (Math.PI * 2));
      drawKineticGlassRing(
        ringsCtx,
        ring,
        atlas,
        railGrad,
        cssW,
        cssH,
        dpr,
        phase,
        elapsedSec,
        smoothMouseX,
        smoothMouseY,
      );
    }

    if (!reducedMotion && isHeroVisible && !document.hidden) {
      rafId = requestAnimationFrame(renderFrame);
    }
  };

  const syncAnimationState = () => {
    const shouldRun = isHeroVisible && !document.hidden && !reducedMotion;
    if (shouldRun && !rafId) {
      lastNow = performance.now();
      rafId = requestAnimationFrame(renderFrame);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver(
      (entries) => {
        isHeroVisible = Boolean(entries[0]?.isIntersecting);
        syncAnimationState();
      },
      { threshold: 0.01 },
    );
    io.observe(stage);
  }

  document.addEventListener('visibilitychange', syncAnimationState);
  syncAnimationState();
  if (reducedMotion) renderFrame(performance.now());
};
