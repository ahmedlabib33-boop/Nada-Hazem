// On-device image analysis: colors of clothes, face landmarks, selfie scoring.
// Nothing here leaves the phone.

const MP_VERSION = "1.1.0";
const MP_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}`;
const FACE_MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// ---------- images ----------

// Downscale a photo so it's quick to analyze and small to store.
export async function loadImage(file, max = 640) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
  return { canvas, blob };
}

export const blobToDataUrl = (blob) => new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });

// ---------- colors ----------

export const NAMED_COLORS = [
  ["White", "#f4f1ec"], ["Cream", "#f1e3c6", true], ["Beige", "#d9c3a5", true], ["Camel", "#c19a6b", true], ["Tan", "#b48a60", true],
  ["Brown", "#7b4f2e", true], ["Chocolate", "#4a2c23", true], ["Black", "#17161a"], ["Charcoal", "#3a3a3f"], ["Grey", "#8d8d94"],
  ["Navy", "#1f2a52"], ["Blue", "#2f5fcf"], ["Light blue", "#9dc3e6"], ["Teal", "#1f7a7a", true], ["Green", "#2e8b57"],
  ["Olive", "#708238", true], ["Sage", "#9caf88"], ["Emerald", "#2e7d5b", true], ["Yellow", "#f2d231", true], ["Mustard", "#e1ad21", true],
  ["Orange", "#f28c28", true], ["Terracotta", "#c8553d", true], ["Rust", "#b7410e", true], ["Red", "#c8102e"], ["Burgundy", "#7b2d3b", true],
  ["Coral", "#f08a5d", true], ["Pink", "#e98ab0"], ["Blush", "#efc4c4"], ["Hot pink", "#ff2d95"], ["Lilac", "#b9a3d6"],
  ["Purple", "#6a3d9a"], ["Gold", "#d4af37", true], ["Denim", "#4a6fa5"],
];

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const rgbToHex = ([r, g, b]) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

// Perceptual-ish distance: weights hue more when both colors are saturated.
function colorDist(a, b) {
  const [ha, sa, la] = rgbToHsl(a), [hb, sb, lb] = rgbToHsl(b);
  const dh = Math.min(Math.abs(ha - hb), 360 - Math.abs(ha - hb)) / 180;
  const sat = Math.min(sa, sb);
  return dh * 2.2 * sat + Math.abs(sa - sb) * 1.1 + Math.abs(la - lb) * 1.6;
}

export function nameColor(rgb) {
  let best = NAMED_COLORS[0], bd = Infinity;
  for (const c of NAMED_COLORS) {
    const d = colorDist(rgb, hexToRgb(c[1]));
    if (d < bd) { bd = d; best = c; }
  }
  return { name: best[0], swatch: best[1], yours: !!best[2], hex: rgbToHex(rgb) };
}

// Main color of a garment photo: looks at the middle of the frame and ignores
// the background by dropping colors that also dominate the edges.
export function dominantColor(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h).data;
  const bin = (r, g, b) => `${r >> 5},${g >> 5},${b >> 5}`;
  const center = new Map(), edge = new Map(), sums = new Map();
  const step = Math.max(1, Math.floor(Math.sqrt((w * h) / 20000)));
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
    const i = (y * w + x) * 4, r = data[i], g = data[i + 1], b = data[i + 2];
    const k = bin(r, g, b);
    const inCenter = x > w * 0.2 && x < w * 0.8 && y > h * 0.2 && y < h * 0.8;
    const m = inCenter ? center : edge;
    m.set(k, (m.get(k) || 0) + 1);
    if (inCenter) { const s = sums.get(k) || [0, 0, 0, 0]; s[0] += r; s[1] += g; s[2] += b; s[3]++; sums.set(k, s); }
  }
  let bestK = null, bestScore = -1;
  for (const [k, n] of center) {
    const e = edge.get(k) || 0;
    const score = n - e * 1.5; // background colors appear on the edges too
    if (score > bestScore) { bestScore = score; bestK = k; }
  }
  const s = sums.get(bestK);
  return nameColor([s[0] / s[3], s[1] / s[3], s[2] / s[3]]);
}

// ---------- face ----------

let landmarker = null;
export async function loadFace() {
  if (landmarker) return landmarker;
  const mp = await import(`${MP_URL}/vision_bundle.mjs`);
  const files = await mp.FilesetResolver.forVisionTasks(`${MP_URL}/wasm`);
  landmarker = await mp.FaceLandmarker.createFromOptions(files, {
    baseOptions: { modelAssetPath: FACE_MODEL },
    runningMode: "IMAGE", numFaces: 1, outputFaceBlendshapes: true,
  });
  return landmarker;
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function samplePatch(ctx, w, h, x, y, radius, keep = () => true) {
  const px = Math.round(x * w), py = Math.round(y * h), r = Math.max(2, Math.round(radius * w));
  const d = ctx.getImageData(Math.max(0, px - r), Math.max(0, py - r), r * 2, r * 2).data;
  let n = 0, sum = [0, 0, 0];
  for (let i = 0; i < d.length; i += 4) {
    const p = [d[i], d[i + 1], d[i + 2]];
    if (!keep(p)) continue;
    sum[0] += p[0]; sum[1] += p[1]; sum[2] += p[2]; n++;
  }
  return n ? sum.map((v) => v / n) : null;
}

export function faceShape(lm) {
  const length = dist(lm[10], lm[152]);
  const cheeks = dist(lm[234], lm[454]);
  const jaw = dist(lm[172], lm[397]);
  const forehead = dist(lm[103], lm[332]);
  const L = length / cheeks, J = jaw / cheeks, F = forehead / cheeks;
  if (L > 1.55) return "oblong";
  if (F > J * 1.18) return "heart";
  if (J > F * 1.12) return "triangle";
  if (J > 0.88 && F > 0.88 && L < 1.4) return "square";
  if (L < 1.32 && J < 0.86) return "round";
  return "oval";
}

export function skinTone(rgb) {
  const [r, g, b] = rgb;
  const [, , l] = rgbToHsl(rgb);
  const undertone = (r - b) > 48 && (g - b) > 18 ? "warm" : (r - g) > 38 && b > g * 0.92 ? "cool" : "neutral";
  const skin = l > 0.68 ? "light" : l > 0.42 ? "medium" : "deep";
  return { undertone, skin };
}

export function eyeColor(rgb) {
  const [h, s, l] = rgbToHsl(rgb);
  if (s > 0.14 && h >= 175 && h <= 260) return "blue";
  if (s > 0.10 && h >= 62 && h <= 170) return "green";
  if (h >= 24 && h < 62 && s > 0.3 && l > 0.24) return "hazel"; // saturated golden: hazel, not plain brown
  return "brown";
}

// Everything the beauty helper wants to know from one selfie.
export async function analyzeFace(canvas) {
  const lmk = await loadFace();
  const res = lmk.detect(canvas);
  const lm = res.faceLandmarks?.[0];
  if (!lm) return null;
  const ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
  const blend = Object.fromEntries((res.faceBlendshapes?.[0]?.categories || []).map((c) => [c.categoryName, c.score]));

  const notShadow = ([r, g, b]) => (r + g + b) / 3 > 50;
  const cheekL = samplePatch(ctx, w, h, lm[50].x, lm[50].y, 0.015, notShadow);
  const cheekR = samplePatch(ctx, w, h, lm[280].x, lm[280].y, 0.015, notShadow);
  const skinRgb = cheekL && cheekR ? cheekL.map((v, i) => (v + cheekR[i]) / 2) : cheekL || cheekR;

  // Iris color: sample a ring around each iris center (the center is the pupil).
  const irisKeep = ([r, g, b]) => { const m = (r + g + b) / 3; return m > 40 && m < 200; };
  const ring = (c, edge) => {
    const rad = dist(lm[c], lm[edge]);
    const pts = [0, 90, 180, 270].map((a) => ({ x: lm[c].x + Math.cos((a * Math.PI) / 180) * rad * 0.62, y: lm[c].y + Math.sin((a * Math.PI) / 180) * rad * 0.62 }));
    const got = pts.map((p) => samplePatch(ctx, w, h, p.x, p.y, rad * 0.22, irisKeep)).filter(Boolean);
    return got.length ? got.reduce((s, v) => s.map((x, i) => x + v[i] / got.length), [0, 0, 0]) : null;
  };
  const eyeL = ring(468, 469), eyeR = ring(473, 474);
  const eyeRgb = eyeL && eyeR ? eyeL.map((v, i) => (v + eyeR[i]) / 2) : eyeL || eyeR;

  const xs = lm.map((p) => p.x), ys = lm.map((p) => p.y);
  const box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };

  return {
    shape: faceShape(lm),
    ...(skinRgb ? skinTone(skinRgb) : { undertone: "neutral", skin: "medium" }),
    skinHex: skinRgb ? rgbToHex(skinRgb) : null,
    eyes: eyeRgb ? eyeColor(eyeRgb) : "brown",
    eyeHex: eyeRgb ? rgbToHex(eyeRgb) : null,
    smile: ((blend.mouthSmileLeft || 0) + (blend.mouthSmileRight || 0)) / 2,
    eyesOpen: 1 - ((blend.eyeBlinkLeft || 0) + (blend.eyeBlinkRight || 0)) / 2,
    box,
  };
}

// ---------- selfie quality ----------

function sharpness(canvas) {
  const s = 220, c = document.createElement("canvas");
  c.width = s; c.height = Math.round((canvas.height / canvas.width) * s);
  const ctx = c.getContext("2d");
  ctx.drawImage(canvas, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  const g = new Float32Array(c.width * c.height);
  let lum = 0;
  for (let i = 0; i < g.length; i++) { g[i] = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11); lum += g[i]; }
  let sum = 0, sum2 = 0, n = 0;
  for (let y = 1; y < c.height - 1; y++) for (let x = 1; x < c.width - 1; x++) {
    const i = y * c.width + x;
    const v = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - c.width] - g[i + c.width];
    sum += v; sum2 += v * v; n++;
  }
  const mean = sum / n;
  return { sharp: sum2 / n - mean * mean, lum: lum / g.length / 255 };
}

// Scores a selfie 0..100 from sharpness, light, framing and expression.
export async function scoreSelfie(canvas) {
  const face = await analyzeFace(canvas);
  const { sharp, lum } = sharpness(canvas);
  const sharpScore = Math.min(1, sharp / 350);
  const lightScore = 1 - Math.min(1, Math.abs(lum - 0.52) * 2.2);
  let frame = 0, expr = 0;
  if (face) {
    const area = face.box.w * face.box.h;
    const size = area < 0.06 ? area / 0.06 : area > 0.6 ? 0.7 : 1;
    const cx = face.box.x + face.box.w / 2, cy = face.box.y + face.box.h / 2;
    const centered = 1 - Math.min(1, Math.hypot(cx - 0.5, cy - 0.42) * 1.8);
    frame = size * 0.6 + centered * 0.4;
    expr = face.eyesOpen * 0.5 + Math.min(1, face.smile * 1.4) * 0.5;
  }
  const score = Math.round(100 * (sharpScore * 0.3 + lightScore * 0.25 + frame * 0.25 + expr * 0.2));
  const notes = [];
  notes.push(sharpScore > 0.7 ? "sharp" : "a bit blurry");
  notes.push(lightScore > 0.7 ? "well lit" : lum < 0.4 ? "too dark" : "too bright");
  if (!face) notes.push("no face found");
  else { notes.push(frame > 0.75 ? "nicely framed" : "re-center"); if (face.smile > 0.4) notes.push("great smile"); if (face.eyesOpen < 0.6) notes.push("eyes closed?"); }
  return { score, notes, face };
}
