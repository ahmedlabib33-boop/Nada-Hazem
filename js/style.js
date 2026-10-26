import {
  OCCASIONS, WEATHER, VIBES, WARDROBE, PALETTE, STYLE_TIPS, QUIZ, AESTHETICS,
  UNDERTONES, EYES, SKIN, SHADES, LOOKS, EYE_SHAPES, UNDERTONE_QUIZ, BEAUTY_TIPS,
  HAIR_LENGTHS, HAIRSTYLES, HAIR_CARE, NAIL_SHAPES, NAIL_SHADES, NAIL_LOOKS, NAIL_TIPS, FACE_SHAPES,
} from "./style-data.js";

// Fashion and Beauty helpers. Shared helpers come from app.js.
export function initStyle({ $, esc, pick, store, toast, state }) {
  const chips = (list, current, attr) => list.map((o) =>
    `<button class="chip ${o.id === current ? "on" : ""}" data-${attr}="${o.id}">${o.emoji ? o.emoji + " " : ""}${esc(o.label)}</button>`).join("");
  const swatch = ([name, hex]) => `<span class="swatch"><i style="background:${hex}"></i>${esc(name)}</span>`;
  const pinterest = (q) => `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`;
  const dayIndex = Math.floor(Date.now() / 86400000);

  // ============ FASHION ============
  const fx = { occ: "brunch", weather: "mild", vibe: "sporty", outfit: null, quizStep: 0, quizScore: {} };
  const lookbook = store.get("lookbook", []);

  function renderFashionPickers() {
    $("#fx-occ").innerHTML = chips(OCCASIONS, fx.occ, "occ");
    $("#fx-weather").innerHTML = chips(WEATHER, fx.weather, "weather");
    $("#fx-vibe").innerHTML = chips(VIBES, fx.vibe, "vibe");
  }

  // Picks a piece that fits the occasion and weather, loosening the rules if nothing fits.
  function choose(items, f, weather) {
    const okWeather = ([, , , w]) => !(w === "c" && weather === "hot") && !(w === "h" && (weather === "cold" || weather === "rainy"));
    const tries = [
      items.filter((i) => f >= i[1] && f <= i[2] && okWeather(i)),
      items.filter((i) => Math.abs(f - (i[1] + i[2]) / 2) <= 1.5 && okWeather(i)),
      items.filter(okWeather),
      items,
    ];
    const list = tries.find((t) => t.length);
    return pick(list)[0];
  }

  const hasOwnColor = (name) => /^(white|black|clean white|chunky white|your|soft linen|soft cotton)/.test(name);
  const tint = (color, name) => (hasOwnColor(name) ? name : `${color.toLowerCase()} ${name}`);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  function makeOutfit() {
    const occ = OCCASIONS.find((o) => o.id === fx.occ);
    const w = WARDROBE[fx.vibe];
    const main = pick(PALETTE.colors);
    const neutral = pick(PALETTE.neutrals);
    const accent = pick(PALETTE.colors.filter((c) => c !== main));
    const pieces = [];
    const useDress = Math.random() < 0.4;
    let hero;
    if (useDress) {
      hero = tint(main[0], choose(w.dresses, occ.f, fx.weather));
      pieces.push(["👗", "Dress", hero]);
    } else {
      hero = tint(main[0], choose(w.tops, occ.f, fx.weather));
      pieces.push(["👚", "Top", hero]);
      pieces.push(["👖", "Bottom", tint(neutral[0], choose(w.bottoms, occ.f, fx.weather))]);
    }
    const layer = fx.weather === "cold" || fx.weather === "rainy" || (fx.weather === "mild" && Math.random() < 0.5);
    if (layer) pieces.push(["🧥", "Layer", tint(neutral[0], choose(w.outer, occ.f, fx.weather))]);
    pieces.push(["👠", "Shoes", choose(w.shoes, occ.f, fx.weather)]);
    pieces.push(["👜", "Bag", tint(accent[0], choose(w.bags, occ.f, fx.weather))]);
    pieces.push(["💍", "Finish", choose(w.extras, occ.f, fx.weather)]);

    const weatherNote = {
      hot: "Breathable linen and cotton will keep you cool.",
      cold: "Add a thin thermal layer underneath to stay warm without bulk.",
      rainy: "Skip suede today and pack a compact umbrella.",
      mild: "Bring the layer in case the evening gets cool.",
    }[fx.weather];
    fx.outfit = {
      title: `${occ.emoji} ${occ.label} · ${VIBES.find((v) => v.id === fx.vibe).label}`,
      pieces: pieces.map(([e, label, text]) => [e, label, cap(text)]),
      colors: [main, neutral, accent],
      why: `${main[0]} is one of your best Warm Autumn colors and lights up hazel-green eyes. ${neutral[0]} keeps it grounded, and a pop of ${accent[0].toLowerCase()} pulls it together. ${weatherNote}`,
      search: `${hero} ${occ.label.toLowerCase()} outfit`,
    };
    renderOutfit();
  }

  function outfitHtml(o) {
    return `
      <ul class="outfit">${o.pieces.map(([e, label, text]) => `<li><span class="oi">${e}</span><div><small>${esc(label)}</small>${esc(text)}</div></li>`).join("")}</ul>
      <div class="swatches">${o.colors.map(swatch).join("")}</div>`;
  }

  function renderOutfit() {
    const o = fx.outfit;
    $("#fx-result").innerHTML = `
      <div class="card-head"><h3>${esc(o.title)}</h3></div>
      ${outfitHtml(o)}
      <p class="why">${esc(o.why)}</p>
      <div class="row">
        <button class="primary" id="fx-again">🔁 Another look</button>
        <button class="ghost" id="fx-save">♡ Save to lookbook</button>
        <a class="ghost" href="${pinterest(o.search)}" target="_blank" rel="noopener">📌 Find it on Pinterest</a>
      </div>`;
    $("#fx-again").onclick = makeOutfit;
    $("#fx-save").onclick = () => {
      lookbook.unshift({ ...o, id: Date.now() });
      store.set("lookbook", lookbook);
      renderLookbook();
      toast("Saved to your lookbook 👗");
    };
  }

  function renderLookbook() {
    $("#fx-lookbook-empty").hidden = lookbook.length > 0;
    $("#fx-lookbook").innerHTML = lookbook.map((o) => `
      <article class="card look-card">
        <div class="card-head"><h3>${esc(o.title)}</h3><button class="icon-btn small" data-unsave="${o.id}" aria-label="Remove look">✕</button></div>
        ${outfitHtml(o)}
      </article>`).join("");
  }
  $("#fx-lookbook").addEventListener("click", (e) => {
    const b = e.target.closest("[data-unsave]");
    if (!b) return;
    const i = lookbook.findIndex((o) => String(o.id) === b.dataset.unsave);
    if (i >= 0) lookbook.splice(i, 1);
    store.set("lookbook", lookbook);
    renderLookbook();
  });

  $("#view-fashion").addEventListener("click", (e) => {
    const t = e.target.closest("[data-occ],[data-weather],[data-vibe]");
    if (!t) return;
    if (t.dataset.occ) fx.occ = t.dataset.occ;
    if (t.dataset.weather) fx.weather = t.dataset.weather;
    if (t.dataset.vibe) fx.vibe = t.dataset.vibe;
    renderFashionPickers();
    makeOutfit();
  });
  $("#fx-go").onclick = makeOutfit;

  function renderPalette() {
    $("#fx-palette").innerHTML = `
      <p class="muted">${esc(PALETTE.why)}</p>
      <h4>Your neutrals</h4><div class="swatches big">${PALETTE.neutrals.map(swatch).join("")}</div>
      <h4>Your power colors</h4><div class="swatches big">${PALETTE.colors.map(swatch).join("")}</div>
      <h4>Wear with care</h4><div class="swatches big faded">${PALETTE.careful.map(swatch).join("")}</div>`;
  }

  function renderQuiz() {
    const box = $("#fx-quiz");
    if (fx.quizStep < QUIZ.length) {
      const q = QUIZ[fx.quizStep];
      box.innerHTML = `
        <div class="quiz-progress"><i style="width:${(fx.quizStep / QUIZ.length) * 100}%"></i></div>
        <p class="eyebrow">Question ${fx.quizStep + 1} of ${QUIZ.length}</p>
        <h3>${esc(q.q)}</h3>
        <div class="quiz-answers">${q.a.map(([text, key]) => `<button class="answer" data-ans="${key}">${esc(text)}</button>`).join("")}</div>`;
      return;
    }
    const top = Object.entries(fx.quizScore).sort((a, b) => b[1] - a[1])[0][0];
    const r = AESTHETICS[top];
    store.set("aesthetic", top);
    box.innerHTML = `
      <div class="quiz-result">
        <span class="big-emoji">${r.emoji}</span>
        <p class="eyebrow">Your style aesthetic</p>
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.text)}</p>
        <div class="row">
          <a class="primary" href="${pinterest(r.search)}" target="_blank" rel="noopener">📌 See ${esc(r.name)} looks</a>
          <button class="ghost" id="quiz-again">↺ Take it again</button>
        </div>
      </div>`;
    $("#quiz-again").onclick = () => { fx.quizStep = 0; fx.quizScore = {}; renderQuiz(); };
  }
  $("#fx-quiz").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ans]");
    if (!b) return;
    fx.quizScore[b.dataset.ans] = (fx.quizScore[b.dataset.ans] || 0) + 1;
    fx.quizStep++;
    renderQuiz();
  });

  // ============ BEAUTY ============
  const bx = {
    profile: { undertone: "warm", eyes: "hazel", skin: "medium", shape: "almond", ...store.get("beauty", {}) },
    look: "date",
    done: new Set(),
    quiz: null,
  };
  const LIP_KIND = { everyday: 0, nomakeup: 0, office: 0, date: 1, wedding: 1, party: 2, eid: 2 };

  function shadesFor(lookId) {
    const p = bx.profile;
    const shadow = SHADES.shadow[p.eyes];
    const lips = SHADES.lip[p.undertone];
    const lipOrder = { warm: [0, 3, 1], neutral: [1, 0, 2], cool: [0, 1, 2] }[p.undertone];
    return {
      shadow1: shadow[0], shadow2: shadow[1],
      blush: SHADES.blush[p.undertone][0],
      lip: lips[lipOrder[LIP_KIND[lookId]]],
      highlight: SHADES.highlight[p.undertone],
      bronzer: SHADES.bronzer[p.skin],
    };
  }

  function renderProfile() {
    const p = bx.profile;
    const opts = (list) => list.map((o) => ({ id: o.id, label: o.label }));
    $("#bx-undertone").innerHTML = chips(opts(UNDERTONES), p.undertone, "ut");
    $("#bx-eyes").innerHTML = chips(opts(EYES), p.eyes, "eye");
    $("#bx-skin").innerHTML = chips(opts(SKIN), p.skin, "skin");
    $("#bx-shape").innerHTML = chips(Object.entries(EYE_SHAPES).map(([id, s]) => ({ id, label: s.label })), p.shape, "shape");
    $("#bx-liner").textContent = EYE_SHAPES[p.shape].tip;
  }

  function renderShades() {
    const p = bx.profile;
    $("#bx-shades").innerHTML = `
      <div><h4>Eyeshadow</h4><div class="swatches big">${SHADES.shadow[p.eyes].map(swatch).join("")}</div></div>
      <div><h4>Blush</h4><div class="swatches big">${SHADES.blush[p.undertone].map(swatch).join("")}</div></div>
      <div><h4>Lips</h4><div class="swatches big">${SHADES.lip[p.undertone].map(swatch).join("")}</div></div>
      <div><h4>Glow</h4><div class="swatches big">${swatch(SHADES.highlight[p.undertone])}${swatch(SHADES.bronzer[p.skin])}</div></div>`;
  }

  function renderLook() {
    $("#bx-looks").innerHTML = LOOKS.map((l) =>
      `<button class="chip ${l.id === bx.look ? "on" : ""}" data-look="${l.id}">${l.emoji} ${esc(l.name)}</button>`).join("");
    const look = LOOKS.find((l) => l.id === bx.look);
    const s = shadesFor(look.id);
    const fill = (text) => esc(text).replace(/\{(\w+)\}/g, (_, k) =>
      `<span class="shade"><i style="background:${s[k][1]}"></i>${esc(s[k][0].toLowerCase())}</span>`);
    const pct = Math.round((bx.done.size / look.steps.length) * 100);
    const eyeLabel = EYES.find((e) => e.id === bx.profile.eyes).label.toLowerCase();
    const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${look.name} makeup tutorial ${eyeLabel} eyes ${bx.profile.undertone} undertone`)}`;
    $("#bx-steps").innerHTML = `
      <div class="card-head">
        <div><h3>${look.emoji} ${esc(look.name)}</h3><span class="muted">About ${look.mins} minutes · ${look.steps.length} steps</span></div>
        <a class="ghost" href="${yt}" target="_blank" rel="noopener">▶ Tutorials</a>
      </div>
      <div class="quiz-progress"><i style="width:${pct}%"></i></div>
      <ol class="steps">${look.steps.map(([area, text], i) => `
        <li class="${bx.done.has(i) ? "done" : ""}">
          <button class="check" data-step="${i}" aria-pressed="${bx.done.has(i)}" aria-label="Mark ${esc(area)} done">${bx.done.has(i) ? "✓" : i + 1}</button>
          <div><b>${esc(area)}</b><p>${fill(text)}</p></div>
        </li>`).join("")}</ol>
      ${pct === 100 ? `<p class="done-msg">Ready! You look amazing, ${esc(state.name)} 💖</p>` : ""}
      <div class="row"><button class="ghost" id="bx-reset">↺ Start over</button></div>`;
    $("#bx-reset").onclick = () => { bx.done.clear(); renderLook(); };
  }

  $("#bx-steps").addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    const i = Number(b.dataset.step);
    bx.done.has(i) ? bx.done.delete(i) : bx.done.add(i);
    const look = LOOKS.find((l) => l.id === bx.look);
    if (bx.done.size === look.steps.length) toast(`Gorgeous, ${state.name}! 💄✨`);
    renderLook();
  });

  $("#view-beauty").addEventListener("click", (e) => {
    const t = e.target.closest("[data-ut],[data-eye],[data-skin],[data-shape],[data-look]");
    if (!t) return;
    const d = t.dataset;
    if (d.look) { bx.look = d.look; bx.done.clear(); }
    if (d.ut) bx.profile.undertone = d.ut;
    if (d.eye) bx.profile.eyes = d.eye;
    if (d.skin) bx.profile.skin = d.skin;
    if (d.shape) bx.profile.shape = d.shape;
    store.set("beauty", bx.profile);
    renderProfile();
    renderShades();
    renderLook();
  });

  // Undertone quiz
  function renderUtQuiz() {
    const box = $("#bx-utquiz");
    if (!bx.quiz) { box.hidden = true; return; }
    box.hidden = false;
    const { step, score } = bx.quiz;
    if (step < UNDERTONE_QUIZ.length) {
      const q = UNDERTONE_QUIZ[step];
      box.innerHTML = `
        <p class="eyebrow">Question ${step + 1} of ${UNDERTONE_QUIZ.length}</p>
        <h3>${esc(q.q)}</h3>
        <div class="quiz-answers">${q.a.map(([text, key]) => `<button class="answer" data-ut-ans="${key}">${esc(text)}</button>`).join("")}</div>`;
      return;
    }
    const result = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
    bx.profile.undertone = result;
    store.set("beauty", bx.profile);
    box.innerHTML = `<p class="eyebrow">Result</p><h3>You have a ${result} undertone</h3>
      <p class="muted">I've updated your shades and every look to match.</p>
      <button class="ghost" id="ut-close">Got it</button>`;
    $("#ut-close").onclick = () => { bx.quiz = null; renderUtQuiz(); };
    renderProfile();
    renderShades();
    renderLook();
  }
  $("#bx-utquiz-start").onclick = () => { bx.quiz = { step: 0, score: {} }; renderUtQuiz(); };
  $("#bx-utquiz").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ut-ans]");
    if (!b) return;
    bx.quiz.score[b.dataset.utAns] = (bx.quiz.score[b.dataset.utAns] || 0) + 1;
    bx.quiz.step++;
    renderUtQuiz();
  });

  // ============ HAIR ============
  const hx = { length: store.get("hair", "long"), occ: "brunch" };
  const occChips = (current, attr) => chips(OCCASIONS, current, attr);

  function renderHair() {
    $("#hx-length").innerHTML = chips(HAIR_LENGTHS, hx.length, "hlen");
    $("#hx-occ").innerHTML = occChips(hx.occ, "hocc");
    const f = OCCASIONS.find((o) => o.id === hx.occ).f;
    const face = FACE_SHAPES[bx.profile.face];
    const rec = new Set(face?.hair || []);
    const list = HAIRSTYLES.filter((h) => h.lengths.includes(hx.length) && f >= h.f[0] && f <= h.f[1])
      .sort((a, b) => rec.has(b.id) - rec.has(a.id));
    $("#hx-face").innerHTML = face ? `<span class="badge">${esc(face.label)} face</span> ${esc(face.tip)}` : "";
    $("#hx-list").innerHTML = list.map((h) => `
      <article class="card idea ${rec.has(h.id) ? "rec" : ""}">
        <div class="idea-head"><span class="big-emoji sm">${h.emoji}</span><div><h3>${esc(h.name)}</h3><span class="muted">${h.mins} min${rec.has(h.id) ? " · ✓ suits your face" : ""}</span></div></div>
        <p class="vibe">${esc(h.vibe)}</p>
        <ol class="mini-steps">${h.steps.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
        <div class="row">
          <a class="ghost" href="${pinterest(h.name + " hairstyle")}" target="_blank" rel="noopener">📌 Inspo</a>
          <a class="ghost" href="https://www.youtube.com/results?search_query=${encodeURIComponent(h.name + " hair tutorial")}" target="_blank" rel="noopener">▶ Tutorial</a>
        </div>
      </article>`).join("");
  }
  $("#view-beauty").addEventListener("click", (e) => {
    const t = e.target.closest("[data-hlen],[data-hocc]");
    if (!t) return;
    if (t.dataset.hlen) { hx.length = t.dataset.hlen; store.set("hair", hx.length); }
    if (t.dataset.hocc) hx.occ = t.dataset.hocc;
    renderHair();
  });

  // ============ NAILS ============
  const nx = { shape: store.get("nailShape", "almond"), occ: "brunch", shade: NAIL_SHADES[0] };

  function nailSvg(shape, hex) {
    const paths = {
      almond: "M30 110 C12 80 10 40 30 6 C50 40 48 80 30 110 Z",
      oval: "M30 110 C8 90 8 30 30 4 C52 30 52 90 30 110 Z",
      square: "M12 110 L12 10 Q30 4 48 10 L48 110 Z",
      coffin: "M20 110 L8 14 Q30 4 52 14 L40 110 Z",
      squoval: "M12 110 L12 16 Q30 2 48 16 L48 110 Z",
    };
    return `<svg viewBox="0 0 60 120" aria-hidden="true"><path d="M4 120 L4 60 Q30 40 56 60 L56 120 Z" fill="#d9a07a"/><path d="${paths[shape]}" fill="${hex}"/><path d="M22 20 C20 40 20 60 24 85" stroke="rgba(255,255,255,0.45)" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`;
  }

  function renderNails() {
    $("#nx-shape").innerHTML = chips(NAIL_SHAPES, nx.shape, "nshape");
    $("#nx-shape-tip").textContent = NAIL_SHAPES.find((n) => n.id === nx.shape).tip;
    $("#nx-occ").innerHTML = occChips(nx.occ, "nocc");
    $("#nx-shades").innerHTML = NAIL_SHADES.map(([name, hex]) =>
      `<button class="swatch ${name === nx.shade[0] ? "on" : ""}" data-nshade="${esc(name)}"><i style="background:${hex}"></i>${esc(name)}</button>`).join("");
    $("#nx-preview").innerHTML = `<div class="hand">${[0, 1, 2, 3, 4].map(() => nailSvg(nx.shape, nx.shade[1])).join("")}</div>
      <p class="muted">${esc(nx.shade[0])} · ${esc(NAIL_SHAPES.find((n) => n.id === nx.shape).label)}</p>`;
    const f = OCCASIONS.find((o) => o.id === nx.occ).f;
    const list = NAIL_LOOKS.filter((n) => f >= n.f[0] && f <= n.f[1]);
    $("#nx-list").innerHTML = list.map((n) => {
      const shade = NAIL_SHADES.find(([name]) => name === n.shade);
      return `
      <article class="card idea">
        <div class="idea-head"><span class="big-emoji sm">${n.emoji}</span><div><h3>${esc(n.name)}</h3>${swatch(shade)}</div></div>
        <p class="vibe">${esc(n.how)}</p>
        <div class="row">
          <button class="ghost" data-try="${esc(n.shade)}">💅 Try it on</button>
          <a class="ghost" href="${pinterest(n.search)}" target="_blank" rel="noopener">📌 Inspo</a>
        </div>
      </article>`;
    }).join("");
  }
  $("#view-beauty").addEventListener("click", (e) => {
    const t = e.target.closest("[data-nshape],[data-nocc],[data-nshade],[data-try]");
    if (!t) return;
    const d = t.dataset;
    if (d.nshape) { nx.shape = d.nshape; store.set("nailShape", nx.shape); }
    if (d.nocc) nx.occ = d.nocc;
    if (d.nshade || d.try) {
      nx.shade = NAIL_SHADES.find(([name]) => name === (d.nshade || d.try));
      if (d.try) $("#nx-preview").scrollIntoView({ behavior: "smooth", block: "center" });
    }
    renderNails();
  });

  // Tips of the day (the same all day, new tomorrow)
  $("#hx-tip").textContent = HAIR_CARE[dayIndex % HAIR_CARE.length];
  $("#nx-tip").textContent = NAIL_TIPS[dayIndex % NAIL_TIPS.length];
  $("#fx-tip").textContent = STYLE_TIPS[dayIndex % STYLE_TIPS.length];
  $("#bx-tip").textContent = BEAUTY_TIPS[dayIndex % BEAUTY_TIPS.length];
  $("#home-style-tip").textContent = STYLE_TIPS[dayIndex % STYLE_TIPS.length];
  $("#home-beauty-tip").textContent = BEAUTY_TIPS[dayIndex % BEAUTY_TIPS.length];

  renderFashionPickers();
  makeOutfit();
  renderPalette();
  renderQuiz();
  renderLookbook();
  renderProfile();
  renderShades();
  renderLook();
  renderHair();
  renderNails();

  return {
    setBeautyProfile(p) {
      Object.assign(bx.profile, p);
      store.set("beauty", bx.profile);
      renderProfile(); renderShades(); renderLook(); renderHair();
    },
    beautySummary() {
      const p = bx.profile;
      return `${p.undertone} undertone, ${p.skin} skin, ${p.eyes} eyes, ${p.shape} eye shape${p.face ? `, ${p.face} face` : ""}, ${hx.length} hair`;
    },
  };
}
