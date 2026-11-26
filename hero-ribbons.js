/**
 * @fileoverview 3D kinetic neon glass brand ribbons, glowing ambient planet arcs,
 * and running edge light-strips for the MOLDIN.india® hero stage.
 * Reads all brand entries directly from HERO_BRAND_RINGS in ./brands-config.js.
 */

import { HERO_BRAND_RINGS } from './brands-config.js';

/**
 * Draw crisp custom vector brand badge centered inside a texture cell, falling back
 * to bold stylized wordmark for any user-supplied brand string.
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
  const s = Math.min(cellH / 120, cellW / 245);
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
    ctx.shadowColor = 'rgba(229, 9, 20, 0.55)';
    ctx.shadowBlur = 12;
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
    ctx.shadowColor = 'rgba(30, 215, 96, 0.45)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#1ed760';
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
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
  } else {
    ctx.fillStyle = brand.accent || '#ffffff';
    const label = String(brand.name || 'BRAND');
    const fontSize = label.length > 9 ? 32 : label.length > 6 ? 38 : 44;
    ctx.font = `800 ${fontSize}px "Outfit", "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 1);
  }
  ctx.restore();
};

/**
 * Pre-renders an offscreen high-resolution seamless texture atlas for one orbital brand ring.
 * @param {object} ringConfig
 * @returns {HTMLCanvasElement}
 */
const buildRingTextureAtlas = (ringConfig) => {
  const sourceBrands = ringConfig.brands?.length ? ringConfig.brands : [{ name: 'MOLDIN' }];
  // Automatically repeat configured brands to keep >= 10 even belt slots so logos stay crisp & un-stretched
  const brands = [];
  while (brands.length < 10) {
    brands.push(...sourceBrands);
  }
  const count = brands.length;
  const cellW = 240;
  const atlasH = 150;
  const atlasW = count * cellW;
  const canvas = document.createElement('canvas');
  canvas.width = atlasW;
  canvas.height = atlasH;
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < count; i += 1) {
    const xStart = i * cellW;
    drawBrandArtwork(ctx, brands[i], xStart + cellW * 0.5, atlasH * 0.5, cellW, atlasH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xStart + cellW - 1, atlasH * 0.24);
    ctx.lineTo(xStart + cellW - 1, atlasH * 0.76);
    ctx.stroke();
  }
  return canvas;
};

/**
 * Hex string (#rrggbb) -> [r, g, b].
 * @param {string} hex
 * @returns {[number, number, number]}
 */
const hexToRgb = (hex) => {
  const clean = (hex || '#ffffff').replace('#', '');
  const full = clean.length === 3 ? clean.replace(/(.)/g, '$1$1') : clean;
  const num = Number.parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

/**
 * Interpolates 3-stop neon color gradient across normalized u ∈ [0, 1].
 * @param {string} c0
 * @param {string} c1
 * @param {string} c2
 * @param {number} t
 * @returns {string}
 */
const sampleTriColor = (c0, c1, c2, t) => {
  const a = hexToRgb(t < 0.5 ? c0 : c1);
  const b = hexToRgb(t < 0.5 ? c1 : c2);
  const u = Math.max(0, Math.min(1, t < 0.5 ? t * 2 : (t - 0.5) * 2));
  const r = Math.round(a[0] + (b[0] - a[0]) * u);
  const g = Math.round(a[1] + (b[1] - a[1]) * u);
  const bl = Math.round(a[2] + (b[2] - a[2]) * u);
  return `rgb(${r}, ${g}, ${bl})`;
};

/**
 * Computes 3D parametric point on a tilted curved ribbon orbit with smooth S-saddle curl.
 * Parameter t ∈ [0, 1):
 * - t ∈ [0, 0.5] maps front half cleanly LEFT-TO-RIGHT (theta goes π -> 0 so x ascends strictly)
 * - t ∈ [0.5, 1] maps back half cleanly RIGHT-TO-LEFT (theta goes 0 -> -π)
 * @param {object} ring
 * @param {number} t Cycle fraction in [0, 1)
 * @param {number} w Viewport canvas CSS width
 * @param {number} h Viewport canvas CSS height
 * @param {number} mouseX Normalized [-1, 1] pointer X offset
 * @param {number} mouseY Normalized [-1, 1] pointer Y offset
 */
const evaluateOrbitPoint = (ring, t, w, h, mouseX, mouseY) => {
  // Theta walks clockwise from π (far-left) through π/2 (center-front) -> 0 (far-right) -> -π/2 (back) -> -π
  const theta = Math.PI - t * Math.PI * 2;
  const cx = w * 0.502 + mouseX * 12;
  const cy = h * ring.centerYRatio + mouseY * 8;
  const rx = w * ring.radiusXRatio;
  const ry = h * ring.radiusYRatio;
  const rz = w * ring.radiusZRatio;
  const tiltZ = ((ring.tiltZDeg || 0) * Math.PI) / 180;

  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const localX = rx * cosT;
  const wingCurl = -ry * 0.42 * Math.cos(2 * theta);
  const localY = -ry * sinT + wingCurl;
  const depthZ = rz * sinT;

  const x = cx + localX * Math.cos(tiltZ) - localY * Math.sin(tiltZ);
  const y = cy + localX * Math.sin(tiltZ) + localY * Math.cos(tiltZ);

  const perspective = 1 + (depthZ / Math.max(1, w)) * 0.24;
  const baseBandH = Math.max(48, Math.min(h * ring.bandHeightRatio, w * 0.088));

  return {
    x,
    y,
    z: depthZ,
    height: baseBandH * perspective,
    facing: sinT,
  };
};

/**
 * Renders glowing left cyan dome arc, right pink dome arc, and bottom-left bloom
 * seamlessly across full canvas width (zero clipping seams) plus traveling comet light strips.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {number} timeSec
 */
const drawAmbientNeonArcs = (ctx, w, h, timeSec) => {
  ctx.clearRect(0, 0, w, h);

  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.52, w * 0.04, w * 0.5, h * 0.5, w * 0.78);
  bgGrad.addColorStop(0, '#070b14');
  bgGrad.addColorStop(0.58, '#03050b');
  bgGrad.addColorStop(1, '#02040a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Full-canvas ambient glows drawn first, then melted cleanly to #02040a at bottom edge
  const leftCx = -w * 0.03;
  const leftCy = h * 0.67;
  const leftR = Math.min(w * 0.44, Math.max(w * 0.225, h * 0.34));

  const leftAura = ctx.createRadialGradient(leftCx, leftCy, leftR * 0.55, leftCx, leftCy, leftR * 1.65);
  leftAura.addColorStop(0, 'rgba(0, 232, 248, 0.02)');
  leftAura.addColorStop(0.58, 'rgba(0, 175, 255, 0.22)');
  leftAura.addColorStop(0.76, 'rgba(0, 232, 248, 0.06)');
  leftAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = leftAura;
  ctx.fillRect(0, 0, w, h);

  const rightCx = w * 1.07;
  const rightCy = h * 0.61;
  const rightR = Math.min(w * 0.48, Math.max(w * 0.275, h * 0.42));

  const rightAura = ctx.createRadialGradient(rightCx, rightCy, rightR * 0.52, rightCx, rightCy, rightR * 1.65);
  rightAura.addColorStop(0, 'rgba(250, 4, 156, 0.02)');
  rightAura.addColorStop(0.62, 'rgba(250, 4, 156, 0.20)');
  rightAura.addColorStop(0.8, 'rgba(130, 35, 240, 0.06)');
  rightAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rightAura;
  ctx.fillRect(0, 0, w, h);

  const blAura = ctx.createRadialGradient(w * 0.06, h * 0.84, 8, w * 0.06, h * 0.84, w * 0.2);
  blAura.addColorStop(0, 'rgba(250, 4, 156, 0.32)');
  blAura.addColorStop(0.55, 'rgba(160, 12, 130, 0.11)');
  blAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = blAura;
  ctx.fillRect(0, 0, w, h);

  // Melt blurred glow haze seamlessly into pure #02040a at bottom edge before crisp side rails
  const bottomMelt = ctx.createLinearGradient(0, h - Math.min(130, h * 0.16), 0, h);
  bottomMelt.addColorStop(0, 'rgba(2, 4, 10, 0)');
  bottomMelt.addColorStop(0.6, 'rgba(2, 4, 10, 0.72)');
  bottomMelt.addColorStop(1, 'rgba(2, 4, 10, 1)');
  ctx.fillStyle = bottomMelt;
  ctx.fillRect(0, h - Math.min(130, h * 0.16), w, Math.min(130, h * 0.16));

  // Crisp left cyan & right pink rim rails drawn AFTER melt so strips stay 100% continuous across edge
  ctx.save();
  ctx.beginPath();
  ctx.arc(leftCx, leftCy, leftR, -0.45 * Math.PI, 0.44 * Math.PI);
  ctx.strokeStyle = 'rgba(0, 232, 248, 0.88)';
  ctx.lineWidth = 2.8;
  ctx.shadowColor = '#00e8f8';
  ctx.shadowBlur = 20;
  ctx.stroke();

  const cometL = -0.35 * Math.PI + ((timeSec * 0.32) % 0.78) * Math.PI;
  ctx.beginPath();
  ctx.arc(leftCx, leftCy, leftR, cometL, cometL + 0.24);
  ctx.strokeStyle = 'rgba(220, 255, 255, 0.96)';
  ctx.lineWidth = 3.8;
  ctx.shadowBlur = 26;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(rightCx, rightCy, rightR, 0.56 * Math.PI, 1.38 * Math.PI);
  ctx.strokeStyle = 'rgba(250, 4, 156, 0.9)';
  ctx.lineWidth = 2.8;
  ctx.shadowColor = '#fa049c';
  ctx.shadowBlur = 22;
  ctx.stroke();

  const cometR = 0.74 * Math.PI + ((timeSec * 0.28 + 0.3) % 0.58) * Math.PI;
  ctx.beginPath();
  ctx.arc(rightCx, rightCy, rightR, cometR, cometR + 0.22);
  ctx.strokeStyle = 'rgba(255, 210, 245, 0.95)';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 28;
  ctx.stroke();
  ctx.restore();
};

/**
 * Helper to draw a slice of atlas onto the canvas handling seamless wrap across atlas.width edges.
 * Ensures brand wordmarks always render cleanly left-to-right on the front strip surface!
 */
const drawWrappedAtlasSlice = (ctx, atlas, uStart, uSpan, destX, destY, destW, destH) => {
  const aw = atlas.width;
  const ah = atlas.height;
  const rawSx = ((uStart % 1) + 1) % 1 * aw;
  const sw = Math.max(0.5, uSpan * aw);

  if (rawSx + sw <= aw) {
    ctx.drawImage(atlas, rawSx, 0, sw, ah, destX, destY, destW, destH);
  } else {
    const firstPart = aw - rawSx;
    const frac = firstPart / sw;
    ctx.drawImage(atlas, rawSx, 0, firstPart, ah, destX, destY, destW * frac, destH);
    ctx.drawImage(atlas, 0, 0, sw - firstPart, ah, destX + destW * frac, destY, destW * (1 - frac), destH);
  }
};

/**
 * Draws one closed 3D orbital frosted neon glass ribbon (back pass first, then luminous front pass)
 * with strictly readable left-to-right brand logos smoothly flowing around the 3D strip.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} ring
 * @param {HTMLCanvasElement} atlas
 * @param {number} w
 * @param {number} h
 * @param {number} phase
 * @param {number} timeSec
 * @param {number} mouseX
 * @param {number} mouseY
 */
const drawKineticGlassRing = (ctx, ring, atlas, w, h, phase, timeSec, mouseX, mouseY) => {
  const SEGMENTS = 200;
  const pts = [];
  for (let i = 0; i <= SEGMENTS; i += 1) {
    pts.push(evaluateOrbitPoint(ring, i / SEGMENTS, w, h, mouseX, mouseY));
  }

  for (const passFront of [false, true]) {
    for (let i = 0; i < SEGMENTS; i += 1) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const isFront = (p0.facing + p1.facing) * 0.5 >= 0;
      if (isFront !== passFront) continue;

      const minX = Math.min(p0.x, p1.x);
      const maxX = Math.max(p0.x, p1.x);
      const segW = maxX - minX;
      if (segW < 0.25) continue;

      const leftPt = p0.x <= p1.x ? p0 : p1;
      const rightPt = p0.x <= p1.x ? p1 : p0;
      const h0 = leftPt.height;
      const h1 = rightPt.height;
      const yTop0 = leftPt.y - h0 * 0.5;
      const yTop1 = rightPt.y - h1 * 0.5;
      const slope = (yTop1 - yTop0) / segW;

      const uNormX = Math.max(0, Math.min(1, ((minX + maxX) * 0.5 - w * 0.08) / (w * 0.84)));
      const edgeGlow = Math.pow(Math.abs(uNormX * 2 - 1), 1.6);
      const rimCol = sampleTriColor(ring.rimLeft, ring.rimMid, ring.rimRight, uNormX);

      // 1. Frosted dark obsidian glass body segment
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(minX, yTop0);
      ctx.lineTo(maxX + 0.9, yTop1);
      ctx.lineTo(maxX + 0.9, yTop1 + h1);
      ctx.lineTo(minX, yTop0 + h0);
      ctx.closePath();

      if (passFront) {
        const glassAlpha = 0.62 + edgeGlow * 0.24;
        ctx.fillStyle = `rgba(11, 15, 29, ${glassAlpha.toFixed(3)})`;
      } else {
        ctx.fillStyle = 'rgba(7, 10, 20, 0.44)';
      }
      ctx.fill();

      if (passFront && edgeGlow > 0.28) {
        ctx.fillStyle = rimCol;
        ctx.globalAlpha = 0.14 * edgeGlow;
        ctx.fill();
      }
      ctx.restore();

      // 2. Projected brand strip atlas moving smoothly inward around the 3D glass belt
      const uStart = i / SEGMENTS + phase;
      const uSpan = 1 / SEGMENTS;

      if (passFront) {
        const frontArcRatio = i / (SEGMENTS * 0.5);
        const turnFade = Math.min(1, Math.sin(frontArcRatio * Math.PI) * 1.45 + 0.15);
        ctx.save();
        ctx.globalAlpha = Math.max(0.22, Math.min(0.98, turnFade));
        ctx.transform(1, slope, 0, 1, minX, yTop0);
        drawWrappedAtlasSlice(ctx, atlas, uStart, uSpan, 0, h0 * 0.13, segW + 0.85, h0 * 0.74);
        ctx.restore();
      } else if (edgeGlow > 0.42) {
        // Back wall runs right-to-left (p0.x > p1.x), so mirror X around p0.x cleanly for seamless physical depth
        ctx.save();
        ctx.globalAlpha = 0.16 * edgeGlow;
        const revSlope = (p1.y - p1.height * 0.5 - (p0.y - p0.height * 0.5)) / (p1.x - p0.x);
        ctx.transform(-1, -revSlope, 0, 1, p0.x, p0.y - p0.height * 0.5);
        drawWrappedAtlasSlice(ctx, atlas, uStart, uSpan, 0, h0 * 0.16, segW + 0.85, h0 * 0.68);
        ctx.restore();
      }
    }

    // 3. Luminous neon rim light rails + kinetic edge laser pulses
    for (const isTop of [true, false]) {
      for (let i = 0; i < SEGMENTS; i += 1) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const isFront = (p0.facing + p1.facing) * 0.5 >= 0;
        if (isFront !== passFront) continue;

        const sign = isTop ? -0.5 : 0.5;
        const y0 = p0.y + p0.height * sign;
        const y1 = p1.y + p1.height * sign;
        const uNorm = Math.max(0, Math.min(1, ((p0.x + p1.x) * 0.5 - w * 0.08) / (w * 0.84)));
        const rimCol = sampleTriColor(ring.rimLeft, ring.rimMid, ring.rimRight, uNorm);

        const pulseWave = Math.sin((i / SEGMENTS) * Math.PI * 6 - timeSec * (passFront ? 3.2 : -2.4));
        const boost = pulseWave > 0.78 ? (pulseWave - 0.78) / 0.22 : 0;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, y0);
        ctx.lineTo(p1.x, y1);
        ctx.strokeStyle = boost > 0.25 ? '#ffffff' : rimCol;
        ctx.globalAlpha = passFront ? Math.min(1, 0.54 + boost * 0.46) : 0.22;
        ctx.lineWidth = passFront ? 1.8 + boost * 1.9 : 1.0;
        if (passFront) {
          ctx.shadowColor = rimCol;
          ctx.shadowBlur = 8 + boost * 14;
        }
        ctx.stroke();
        ctx.restore();
      }
    }
  }
};

/**
 * Bootstraps the real-physics 3D orbital brand strips and ambient neon arc engine.
 */
export const initHeroRibbons = () => {
  const stage = document.getElementById('hero-stage');
  const bgCanvas = document.getElementById('hero-bg-canvas');
  const ringsCanvas = document.getElementById('hero-rings-canvas');
  if (!stage || !bgCanvas || !ringsCanvas) return;

  const bgCtx = bgCanvas.getContext('2d');
  const ringsCtx = ringsCanvas.getContext('2d');
  if (!bgCtx || !ringsCtx) return;

  const atlases = new Map();
  for (const ring of HERO_BRAND_RINGS) {
    atlases.set(ring.id, buildRingTextureAtlas(ring));
  }

  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let smoothMouseX = 0;
  let smoothMouseY = 0;

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    cssW = Math.max(320, Math.round(rect.width));
    cssH = Math.max(480, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    for (const c of [bgCanvas, ringsCanvas]) {
      c.width = Math.round(cssW * dpr);
      c.height = Math.round(cssH * dpr);
      c.style.width = `${cssW}px`;
      c.style.height = `${cssH}px`;
    }
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ringsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  stage.addEventListener(
    'pointermove',
    (e) => {
      const rect = stage.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
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
  const startTime = performance.now();

  const renderFrame = (now) => {
    const timeSec = reducedMotion ? 1.2 : (now - startTime) * 0.001;
    smoothMouseX += (targetMouseX - smoothMouseX) * 0.06;
    smoothMouseY += (targetMouseY - smoothMouseY) * 0.06;

    drawAmbientNeonArcs(bgCtx, cssW, cssH, timeSec);

    ringsCtx.clearRect(0, 0, cssW, cssH);
    for (const ring of HERO_BRAND_RINGS) {
      const atlas = atlases.get(ring.id);
      if (!atlas) continue;
      const phase = timeSec * (ring.angularSpeed / (Math.PI * 2));
      drawKineticGlassRing(
        ringsCtx,
        ring,
        atlas,
        cssW,
        cssH,
        phase,
        timeSec,
        smoothMouseX,
        smoothMouseY,
      );
    }

    if (!reducedMotion) {
      requestAnimationFrame(renderFrame);
    }
  };

  requestAnimationFrame(renderFrame);
};
