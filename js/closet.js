import { db } from "./db.js";
import { loadImage, dominantColor, rgbToHsl, blobToDataUrl } from "./vision.js";
import { OCCASIONS } from "./style-data.js";

// Her real wardrobe: photos of her clothes, organized on-device, with a daily
// outfit picked from them for the weather and the plan.

export const TYPES = [
  { id: "top", label: "Top", emoji: "👚", f: [0, 2], warmth: "light" },
  { id: "bottom", label: "Bottom", emoji: "👖", f: [0, 2], warmth: "mid" },
  { id: "dress", label: "Dress", emoji: "👗", f: [1, 3], warmth: "light" },
  { id: "outer", label: "Jacket / coat", emoji: "🧥", f: [0, 3], warmth: "warm" },
  { id: "shoes", label: "Shoes", emoji: "👠", f: [0, 3], warmth: "mid" },
  { id: "bag", label: "Bag", emoji: "👜", f: [0, 3], warmth: "mid" },
  { id: "accessory", label: "Accessory", emoji: "💍", f: [0, 3], warmth: "mid" },
];
const WARMTH = [{ id: "light", label: "Light / summery" }, { id: "mid", label: "All year" }, { id: "warm", label: "Warm / winter" }];
const FORMAL = ["Casual", "Smart casual", "Dressy", "Formal"];
const WEATHER_IDS = ["hot", "mild", "cold", "rainy"];

export function initCloset({ $, esc, pick, store, toast, LINK_MODE, stylist }) {
  let items = [];
  const urls = new Map(); // item id -> object URL
  const cx = { occ: store.get("closetOcc", "brunch"), weather: store.get("weatherManual", null), auto: null, outfit: null, filter: "all", editing: null };
  const imgUrl = (it) => { if (!urls.has(it.id)) urls.set(it.id, URL.createObjectURL(it.blob)); return urls.get(it.id); };
  const typeOf = (it) => TYPES.find((t) => t.id === it.type) || TYPES[0];

  // ---------- weather ----------
  async function fetchWeather() {
    if (LINK_MODE || !navigator.geolocation) return;
    const cached = store.get("weatherAuto", null);
    if (cached && Date.now() - cached.at < 3600e3) { cx.auto = cached; return; }
    try {
      const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000, maximumAge: 600e3 }));
      const { latitude, longitude } = pos.coords;
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code&daily=temperature_2m_max,precipitation_probability_max&timezone=auto&forecast_days=1`);
      const d = await r.json();
      const t = d.daily.temperature_2m_max[0], rain = d.daily.precipitation_probability_max[0];
      const id = rain >= 50 || d.current.precipitation > 0 ? "rainy" : t >= 27 ? "hot" : t < 16 ? "cold" : "mild";
      cx.auto = { id, temp: Math.round(d.current.temperature_2m), max: Math.round(t), rain, at: Date.now() };
      store.set("weatherAuto", cx.auto);
    } catch { cx.auto = null; }
  }
  const weatherId = () => cx.weather || cx.auto?.id || "mild";

  // ---------- items ----------
  async function addFiles(files) {
    if (!files.length) return;
    toast(`Adding ${files.length} item${files.length > 1 ? "s" : ""}…`);
    for (const file of files) {
      try {
        const { canvas, blob } = await loadImage(file, 640);
        const color = dominantColor(canvas);
        const it = { id: "c" + Date.now() + Math.random().toString(36).slice(2, 6), blob, color, type: null, warmth: null, f: null, fav: false, wears: [], added: Date.now() };
        await db.put("closet", it);
        items.unshift(it);
      } catch { toast("Couldn't read one of the photos"); }
    }
    renderCloset();
    renderOutfit();
    const untagged = items.filter((i) => !i.type);
    if (untagged.length) openEdit(untagged[untagged.length - 1].id);
  }

  async function save(it) { await db.put("closet", it); }
  const fRange = (it) => it.f || typeOf(it).f;
  const warmthOf = (it) => it.warmth || typeOf(it).warmth;

  // ---------- outfit picker ----------
  const hueOf = (it) => { const [h, s, l] = rgbToHsl(it.color.hex.match(/\w\w/g).map((x) => parseInt(x, 16))); return { h, s, l }; };
  const isNeutral = (it) => { const { s, l } = hueOf(it); return s < 0.22 || l < 0.16 || l > 0.9; };
  function harmony(a, b) {
    if (isNeutral(a) || isNeutral(b)) return 1;
    const d = Math.abs(hueOf(a).h - hueOf(b).h), dh = Math.min(d, 360 - d);
    if (dh < 40) return 0.9;            // same family
    if (dh > 150) return 0.85;          // complementary pop
    if (dh < 75) return 0.7;            // analogous-ish
    return 0.35;                        // likely to clash
  }
  const daysSinceWorn = (it) => (it.wears?.length ? (Date.now() - it.wears[it.wears.length - 1]) / 86400e3 : 99);

  function fit(it, f, w) {
    const [lo, hi] = fRange(it);
    let s = f >= lo && f <= hi ? 1 : 1 - Math.min(1, Math.min(Math.abs(f - lo), Math.abs(f - hi)) * 0.4);
    const wm = warmthOf(it);
    if (w === "hot" && wm === "warm") s *= 0.15;
    if ((w === "cold" || w === "rainy") && wm === "light" && it.type !== "top") s *= 0.5;
    if (daysSinceWorn(it) < 3) s *= 0.4;
    if (it.fav) s *= 1.2;
    return s;
  }
  function weightedPick(list, scoreFn) {
    const scored = list.map((it) => [it, Math.max(0.01, scoreFn(it))]);
    const total = scored.reduce((a, [, s]) => a + s, 0);
    let r = Math.random() * total;
    for (const [it, s] of scored) { r -= s; if (r <= 0) return it; }
    return scored[0]?.[0];
  }

  function makeOutfit(render = true) {
    const f = OCCASIONS.find((o) => o.id === cx.occ).f, w = weatherId();
    const by = (t) => items.filter((i) => i.type === t);
    const pieces = [];
    const dresses = by("dress"), tops = by("top"), bottoms = by("bottom");
    const useDress = dresses.length && (!tops.length || !bottoms.length || Math.random() < 0.4);
    let hero = null;
    if (useDress) { hero = weightedPick(dresses, (i) => fit(i, f, w)); pieces.push(hero); }
    else if (tops.length) {
      hero = weightedPick(tops, (i) => fit(i, f, w)); pieces.push(hero);
      if (bottoms.length) pieces.push(weightedPick(bottoms, (i) => fit(i, f, w) * harmony(i, hero)));
    } else if (bottoms.length) { hero = weightedPick(bottoms, (i) => fit(i, f, w)); pieces.push(hero); }
    const layer = w === "cold" || w === "rainy" || (w === "mild" && Math.random() < 0.5);
    if (layer && by("outer").length) pieces.push(weightedPick(by("outer"), (i) => fit(i, f, w) * (hero ? harmony(i, hero) : 1)));
    for (const t of ["shoes", "bag", "accessory"]) if (by(t).length && (t !== "accessory" || Math.random() < 0.7))
      pieces.push(weightedPick(by(t), (i) => fit(i, f, w) * (hero ? harmony(i, hero) : 1)));
    cx.outfit = pieces.filter(Boolean);
    if (render) renderOutfit();
  }

  let renderOutfit = function () {
    const box = $("#closet-outfit");
    const wx = cx.auto && !cx.weather ? `${cx.auto.temp}°, high ${cx.auto.max}° · ${cx.auto.rain}% rain` : cx.weather ? "set by you" : "pick the weather";
    const weatherChips = [["hot", "☀️ Hot"], ["mild", "🌤️ Mild"], ["cold", "❄️ Cold"], ["rainy", "🌧️ Rainy"]].map(([id, label]) =>
      `<button class="chip ${weatherId() === id ? "on" : ""}" data-cw="${id}">${label}</button>`).join("");
    const occChips = OCCASIONS.map((o) => `<button class="chip ${cx.occ === o.id ? "on" : ""}" data-cocc="${o.id}">${o.emoji} ${esc(o.label)}</button>`).join("");
    const empty = items.length < 2;
    box.innerHTML = `
      <div class="pick-row"><span class="pick-label">Weather <small>${esc(wx)}</small></span><div class="chips small">${weatherChips}${cx.weather ? `<button class="chip" data-cw="">↺ Auto</button>` : ""}</div></div>
      <div class="pick-row"><span class="pick-label">Plan</span><div class="chips small">${occChips}</div></div>
      ${empty ? `<p class="muted">Add a few clothes below and I'll put outfits together from them.</p>` : cx.outfit ? `
        <div class="outfit-photos">${cx.outfit.map((it) => `
          <figure class="op" data-open="${it.id}"><img src="${imgUrl(it)}" alt=""><figcaption>${typeOf(it).emoji} ${esc(it.color.name)} ${esc(typeOf(it).label.toLowerCase())}</figcaption></figure>`).join("")}</div>
        <div class="row">
          <button class="primary" id="closet-again">🔁 Another</button>
          <button class="ghost" id="closet-wear">✓ Wearing this</button>
          ${LINK_MODE ? "" : `<button class="ghost" id="closet-ask">✨ Ask the stylist</button>`}
        </div>` : `<div class="row"><button class="primary" id="closet-go">✨ Dress me today</button></div>`}`;
    $("#closet-go")?.addEventListener("click", makeOutfit);
    $("#closet-again")?.addEventListener("click", makeOutfit);
    $("#closet-wear")?.addEventListener("click", async () => {
      for (const it of cx.outfit) { it.wears = [...(it.wears || []), Date.now()]; await save(it); }
      toast("Logged! I'll rotate these out for a few days 💛");
    });
    $("#closet-ask")?.addEventListener("click", () => {
      stylist.open(`Here's the outfit the app picked from my closet for ${OCCASIONS.find((o) => o.id === cx.occ).label.toLowerCase()} (${weatherId()} weather): ${cx.outfit.map((it) => `${it.color.name} ${typeOf(it).label.toLowerCase()}`).join(", ")}. What do you think, and how would you style it?`);
    });
  };

  // ---------- closet grid ----------
  function renderCloset() {
    const list = cx.filter === "all" ? items : items.filter((i) => i.type === cx.filter);
    $("#closet-count").textContent = items.length ? `${items.length} item${items.length > 1 ? "s" : ""}` : "";
    $("#closet-filters").innerHTML = [{ id: "all", label: "All", emoji: "✦" }, ...TYPES].map((t) =>
      `<button class="chip ${cx.filter === t.id ? "on" : ""}" data-cf="${t.id}">${t.emoji} ${esc(t.label)}</button>`).join("");
    $("#closet-grid").innerHTML = list.map((it) => `
      <button class="citem ${it.type ? "" : "untagged"}" data-open="${it.id}">
        <img src="${imgUrl(it)}" alt="">
        <span class="cmeta"><i style="background:${it.color.hex}"></i>${esc(it.color.name)} ${it.type ? esc(typeOf(it).label.toLowerCase()) : "· tap to tag"}</span>
        ${it.fav ? `<span class="cfav">♥</span>` : ""}${it.color.yours ? `<span class="cyours">your color</span>` : ""}
      </button>`).join("");
    $("#closet-empty").hidden = items.length > 0;
    const untagged = items.filter((i) => !i.type).length;
    $("#closet-ai").hidden = LINK_MODE || !untagged;
    $("#closet-ai").textContent = `✨ Tag ${untagged} item${untagged > 1 ? "s" : ""} with AI`;
  }

  // ---------- edit dialog ----------
  function openEdit(id) {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    cx.editing = it;
    const t = it.type || "";
    $("#citem-body").innerHTML = `
      <img src="${imgUrl(it)}" alt="">
      <div class="cform">
        <p><span class="swatch"><i style="background:${it.color.hex}"></i>${esc(it.color.name)}</span> ${it.color.yours ? `<span class="badge">In your palette ✓</span>` : ""}</p>
        <p class="pick-label">What is it?</p>
        <div class="chips small">${TYPES.map((x) => `<button class="chip ${t === x.id ? "on" : ""}" data-ct="${x.id}">${x.emoji} ${esc(x.label)}</button>`).join("")}</div>
        <p class="pick-label">Season</p>
        <div class="chips small">${WARMTH.map((x) => `<button class="chip ${warmthOf(it) === x.id ? "on" : ""}" data-cwm="${x.id}">${esc(x.label)}</button>`).join("")}</div>
        <p class="pick-label">How dressy?</p>
        <div class="chips small">${FORMAL.map((x, i) => `<button class="chip ${fRange(it)[0] <= i && i <= fRange(it)[1] ? "on" : ""}" data-cfm="${i}">${esc(x)}</button>`).join("")}</div>
        <div class="row">
          <button class="ghost" id="citem-fav">${it.fav ? "♥ Favorite" : "♡ Favorite"}</button>
          <button class="ghost danger" id="citem-del">🗑 Remove</button>
          <button class="primary" id="citem-done">Done</button>
        </div>
      </div>`;
    $("#citem").showModal();
  }
  $("#citem-body").addEventListener("click", async (e) => {
    const it = cx.editing; if (!it) return;
    const b = e.target.closest("[data-ct],[data-cwm],[data-cfm],#citem-fav,#citem-del,#citem-done");
    if (!b) return;
    if (b.dataset.ct) { it.type = b.dataset.ct; if (!it.warmth) it.warmth = typeOf(it).warmth; if (!it.f) it.f = [...typeOf(it).f]; cx.dirty = true; }
    else if (b.dataset.cwm) it.warmth = b.dataset.cwm;
    else if (b.dataset.cfm) {
      const i = Number(b.dataset.cfm), [lo, hi] = fRange(it);
      it.f = lo <= i && i <= hi ? (lo === hi ? [lo, hi] : i === lo ? [lo + 1, hi] : i === hi ? [lo, hi - 1] : [lo, hi]) : [Math.min(lo, i), Math.max(hi, i)];
    }
    else if (b.id === "citem-fav") it.fav = !it.fav;
    else if (b.id === "citem-del") { await db.del("closet", it.id); items = items.filter((x) => x !== it); cx.dirty = true; $("#citem").close(); renderCloset(); return; }
    else if (b.id === "citem-done") { if (!it.type) { toast("Pick what it is first"); return; } $("#citem").close(); }
    await save(it);
    if ($("#citem").open) openEdit(it.id); else renderCloset();
  });
  // A newly tagged (or removed) piece changes what outfits are possible: pick again.
  $("#citem").addEventListener("close", () => { renderCloset(); if (cx.dirty) { cx.dirty = false; cx.outfit = null; } renderOutfit(); });

  // ---------- AI tagging (needs the stylist key) ----------
  async function aiTag() {
    const untagged = items.filter((i) => !i.type);
    if (!untagged.length) return;
    if (!stylist.hasKey()) { stylist.open(); return; }
    toast(`Looking at ${untagged.length} item${untagged.length > 1 ? "s" : ""}…`);
    const schema = {
      type: "object", additionalProperties: false, required: ["items"],
      properties: { items: { type: "array", items: {
        type: "object", additionalProperties: false, required: ["index", "type", "warmth", "formality_min", "formality_max", "name"],
        properties: {
          index: { type: "integer" }, name: { type: "string", description: "Short name, e.g. 'black satin slip skirt'" },
          type: { type: "string", enum: TYPES.map((t) => t.id) }, warmth: { type: "string", enum: WARMTH.map((w) => w.id) },
          formality_min: { type: "integer", minimum: 0, maximum: 3 }, formality_max: { type: "integer", minimum: 0, maximum: 3 },
        } } } },
    };
    for (let i = 0; i < untagged.length; i += 6) {
      const batch = untagged.slice(i, i + 6);
      try {
        const images = await Promise.all(batch.map((it) => blobToDataUrl(it.blob)));
        const out = await stylist.json(
          `These are ${batch.length} photos of clothes from a woman's wardrobe, in order (index 0 to ${batch.length - 1}). For each, give its type, season (light = summery, mid = all year, warm = winter layers), how dressy it is as a range from 0 (casual) to 3 (formal), and a short name.`,
          images, schema);
        for (const row of out.items || []) {
          const it = batch[row.index]; if (!it) continue;
          it.type = row.type; it.warmth = row.warmth; it.f = [Math.min(row.formality_min, row.formality_max), Math.max(row.formality_min, row.formality_max)]; it.name = row.name;
          await save(it);
        }
        renderCloset();
      } catch (err) { toast(err.message || "AI tagging failed"); break; }
    }
    toast("Closet organized ✨");
  }

  // ---------- events ----------
  $("#closet-add").addEventListener("change", (e) => { addFiles([...e.target.files]); e.target.value = ""; });
  $("#closet-ai").addEventListener("click", aiTag);
  $("#view-fashion").addEventListener("click", (e) => {
    const t = e.target.closest("[data-cw],[data-cocc],[data-cf],[data-open]");
    if (!t) return;
    const d = t.dataset;
    if (d.open) return openEdit(d.open);
    if (d.cf) { cx.filter = d.cf; return renderCloset(); }
    if ("cw" in d) { cx.weather = d.cw || null; store.set("weatherManual", cx.weather); }
    if (d.cocc) { cx.occ = d.cocc; store.set("closetOcc", cx.occ); }
    if (cx.outfit) makeOutfit(); else renderOutfit();
  });

  // Summary for the stylist's context.
  const summary = () => items.filter((i) => i.type).map((i) => `${i.name || `${i.color.name.toLowerCase()} ${typeOf(i).label.toLowerCase()}`} (${FORMAL[fRange(i)[0]].toLowerCase()}–${FORMAL[fRange(i)[1]].toLowerCase()}, ${warmthOf(i)})`);

  (async () => {
    items = (await db.all("closet")).sort((a, b) => b.added - a.added);
    renderCloset();
    renderOutfit();
    await fetchWeather();
    renderOutfit();
  })();

  // Home "Today" card: weather + outfit from her closet, with one-tap actions.
  const WX_LABEL = { hot: "☀️ Hot", mild: "🌤️ Mild", cold: "❄️ Cold", rainy: "🌧️ Rainy" };
  function renderToday() {
    const el = $("#today-body"); if (!el) return;
    const w = weatherId();
    $("#today-weather").textContent = cx.auto && !cx.weather ? `${WX_LABEL[w]} · ${cx.auto.temp}° now, high ${cx.auto.max}°` : WX_LABEL[w];
    const occ = OCCASIONS.find((o) => o.id === cx.occ);
    if (!items.filter((i) => i.type).length) {
      el.innerHTML = `<p class="muted">Add a few of your clothes and I'll pick what to wear each morning, for the weather.</p>
        <div class="row"><a class="primary" href="#fashion">📷 Add my clothes</a><a class="ghost" href="#beauty">💄 Get ready</a></div>`;
      return;
    }
    if (!cx.outfit) makeOutfit(false);
    el.innerHTML = `
      <p class="muted">For ${esc(occ.label.toLowerCase())} · <button class="text-btn" data-today-occ>change plan</button></p>
      <div class="outfit-photos compact">${cx.outfit.map((it) => `<figure class="op" data-open="${it.id}"><img src="${imgUrl(it)}" alt=""><figcaption>${esc(it.color.name)} ${esc(typeOf(it).label.toLowerCase())}</figcaption></figure>`).join("")}</div>
      <div class="row">
        <button class="ghost" id="today-again">🔁 Another</button>
        <button class="primary" id="today-wear">✓ Wearing this</button>
        <a class="ghost" href="#beauty">💄 Get ready</a>
      </div>`;
    $("#today-again").onclick = () => makeOutfit();
    $("#today-wear").onclick = async () => {
      for (const it of cx.outfit) { it.wears = [...(it.wears || []), Date.now()]; await save(it); }
      toast("Have a gorgeous day 💛");
    };
  }
  $("#today-body")?.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open],[data-today-occ]");
    if (!t) return;
    if (t.dataset.open) return openEdit(t.dataset.open);
    const ids = OCCASIONS.map((o) => o.id);
    cx.occ = ids[(ids.indexOf(cx.occ) + 1) % ids.length];
    store.set("closetOcc", cx.occ);
    makeOutfit();
  });
  const _render = renderOutfit;
  renderOutfit = () => { _render(); renderToday(); };

  return { summary, weather: () => (cx.auto && !cx.weather ? `${weatherId()}, ${cx.auto.temp}°C now, high ${cx.auto.max}°C, ${cx.auto.rain}% chance of rain` : weatherId()), currentOutfit: () => cx.outfit };
}
