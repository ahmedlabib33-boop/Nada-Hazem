import { loadImage, analyzeFace, scoreSelfie } from "./vision.js";
import { FACE_SHAPES } from "./style-data.js";

// Beauty scan: reads her features from a selfie, on the device, and tunes the
// beauty helper to them. Also picks her best selfie out of a batch.

const SHAPES = FACE_SHAPES;
const UNDERTONE_TEXT = { warm: "golden, peachy skin that glows in gold jewelry and earthy colors", neutral: "balanced skin that can wear both warm and cool colors", cool: "pink or rosy skin that shines in silver and jewel tones" };

export function initScan({ $, esc, toast, LINK_MODE, setBeautyProfile }) {
  if (LINK_MODE) { $("#scan-section").hidden = true; return; }
  let last = null;

  async function scan(file) {
    const box = $("#scan-result");
    box.hidden = false;
    box.innerHTML = `<p class="muted">Looking at your face… (the first time loads a small model, about 4 MB)</p>`;
    try {
      const { canvas } = await loadImage(file, 900);
      const r = await analyzeFace(canvas);
      if (!r) { box.innerHTML = `<p class="muted">I couldn't find a face. Try a front-facing selfie in good light.</p>`; return; }
      last = r;
      const s = SHAPES[r.shape];
      box.innerHTML = `
        <div class="scan-grid">
          <div class="scan-card"><small>Face shape</small><b>${esc(s.label)}</b><p>${esc(s.tip)}</p></div>
          <div class="scan-card"><small>Undertone</small><b>${esc(r.undertone)} <i class="dot" style="background:${r.skinHex || "#ccc"}"></i></b><p>${esc(UNDERTONE_TEXT[r.undertone])}. Skin depth: ${esc(r.skin)}.</p></div>
          <div class="scan-card"><small>Eyes</small><b>${esc(r.eyes)} <i class="dot" style="background:${r.eyeHex || "#ccc"}"></i></b><p>${r.eyes === "hazel" || r.eyes === "green" ? "Plum, bronze and copper make them pop." : r.eyes === "blue" ? "Copper, peach and terracotta make them pop." : "Gold, navy and emerald make them pop."}</p></div>
          <div class="scan-card"><small>Expression</small><b>${r.smile > 0.45 ? "Big smile 😁" : r.smile > 0.2 ? "Soft smile 🙂" : "Serious 😌"}</b><p>${r.eyesOpen > 0.7 ? "Eyes bright and open." : "Eyes look a little closed, try again."}</p></div>
        </div>
        <div class="row">
          <button class="primary" id="scan-apply">✓ Use this for my makeup &amp; hair</button>
          <span class="muted">Analyzed on your phone. The photo isn't uploaded anywhere.</span>
        </div>`;
      $("#scan-apply").onclick = () => {
        setBeautyProfile({ undertone: r.undertone, eyes: r.eyes, skin: r.skin, face: r.shape });
        toast("Beauty profile updated from your selfie 💄");
        document.querySelector("#bx-looks")?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    } catch (err) {
      box.innerHTML = `<p class="muted">The face model couldn't load (${esc(err.message || "network")}). Check your connection and try again.</p>`;
    }
  }

  async function best(files) {
    const box = $("#best-result");
    box.hidden = false;
    box.innerHTML = `<p class="muted">Scoring ${files.length} selfies…</p>`;
    const results = [];
    for (const f of files) {
      try {
        const { canvas, blob } = await loadImage(f, 700);
        const r = await scoreSelfie(canvas);
        results.push({ ...r, url: URL.createObjectURL(blob) });
      } catch { /* skip unreadable */ }
    }
    results.sort((a, b) => b.score - a.score);
    box.innerHTML = results.length ? `<div class="best-grid">${results.map((r, i) => `
      <figure class="best ${i === 0 ? "winner" : ""}">
        <img src="${r.url}" alt="">
        <figcaption><b>${i === 0 ? "🏆 " : ""}${r.score}/100</b><span>${esc(r.notes.join(" · "))}</span></figcaption>
      </figure>`).join("")}</div>` : `<p class="muted">Couldn't read those photos.</p>`;
  }

  $("#scan-input").addEventListener("change", (e) => { if (e.target.files[0]) scan(e.target.files[0]); e.target.value = ""; });
  $("#best-input").addEventListener("change", (e) => { if (e.target.files.length) best([...e.target.files]); e.target.value = ""; });

  return { last: () => last, shapes: SHAPES };
}
