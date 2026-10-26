import { MOODS, VAULT, SERVICES, JUSTWATCH, SOCIALS, SNACKS, VIBES } from "./data.js";

// ---------- storage (fails soft in private mode) ----------
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("lounge:" + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("lounge:" + key, JSON.stringify(value)); } catch { /* ignore */ }
  },
};

const state = {
  name: store.get("name", "Nada"),
  country: store.get("country", "us"),
  handles: store.get("handles", {}),
  favs: store.get("favs", ["instagram", "tiktok", "facebook", "whatsapp"]),
  list: store.get("list", []),
  mood: null,
  vaultFilter: "all",
  listFilter: "todo",
};

// ---------- helpers ----------
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const thumb = (id) => `https://archive.org/services/img/${encodeURIComponent(id)}`;
const filmKey = (f) => (f.id ? "ia:" + f.id : "t:" + f.title.toLowerCase());

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

function logo(s, size = "") {
  return `<span class="logo ${size}" style="background:${s.color};color:${s.ink || "#fff"}">${esc(s.name[0])}</span>`;
}

// ---------- watchlist ----------
const inList = (f) => state.list.some((i) => i.key === filmKey(f));

function toggleSave(f) {
  const key = filmKey(f);
  if (inList(f)) {
    state.list = state.list.filter((i) => i.key !== key);
    toast("Removed from My List");
  } else {
    state.list.unshift({ key, title: f.title, year: f.year || "", id: f.id || null, done: false, rating: 0 });
    toast("Saved to My List ♡");
  }
  store.set("list", state.list);
  renderAllHearts();
  renderList();
}

// ---------- film tiles ----------
function tile(f) {
  const on = inList(f);
  return `
    <div class="tile" data-film="${esc(f.id)}">
      <button class="heart ${on ? "on" : ""}" data-heart="${esc(f.id)}" aria-label="${on ? "Remove from" : "Save to"} My List">${on ? "♥" : "♡"}</button>
      <button class="tile-btn" data-play="${esc(f.id)}" aria-label="Play ${esc(f.title)}">
        <div class="poster"><img loading="lazy" src="${thumb(f.id)}" alt=""><span class="play">▶</span></div>
        <div class="t">${esc(f.title)}</div>
        <div class="y">${esc(f.year || "")}</div>
      </button>
    </div>`;
}

// Films found via search aren't in VAULT, so keep them around for play/save lookups.
const seen = new Map(VAULT.map((f) => [f.id, f]));
const film = (id) => seen.get(id);

function renderAllHearts() {
  document.querySelectorAll("[data-heart]").forEach((b) => {
    const f = film(b.dataset.heart);
    if (!f) return;
    const on = inList(f);
    b.classList.toggle("on", on);
    b.textContent = on ? "♥" : "♡";
  });
}

// ---------- player ----------
let current = null;
function play(f) {
  current = f;
  $("#player-title").textContent = f.title;
  $("#player-meta").textContent = [f.year, "Free from the Internet Archive"].filter(Boolean).join(" · ");
  $("#player-frame").src = `https://archive.org/embed/${encodeURIComponent(f.id)}`;
  $("#player-save").textContent = inList(f) ? "♥ Saved" : "♡ Save";
  $("#player").showModal();
}
$("#player-close").onclick = () => $("#player").close();
$("#player").addEventListener("close", () => { $("#player-frame").src = "about:blank"; });
$("#player-save").onclick = () => { toggleSave(current); $("#player-save").textContent = inList(current) ? "♥ Saved" : "♡ Save"; };
$("#player-share").onclick = () => share(current);

async function share(f) {
  const url = f.id ? `https://archive.org/details/${f.id}` : location.href;
  const text = `Watching ${f.title}${f.year ? ` (${f.year})` : ""} tonight 🍿`;
  if (navigator.share) {
    try { await navigator.share({ title: f.title, text, url }); } catch { /* cancelled */ }
  } else {
    try { await navigator.clipboard.writeText(`${text} ${url}`); toast("Link copied — paste it anywhere"); }
    catch { window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank", "noopener"); }
  }
}

document.addEventListener("click", (e) => {
  const heart = e.target.closest("[data-heart]");
  if (heart) { toggleSave(film(heart.dataset.heart)); return; }
  const p = e.target.closest("[data-play]");
  if (p) play(film(p.dataset.play));
});

// ---------- home ----------
function renderGreeting() {
  const h = new Date().getHours();
  const part = h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  $("#greeting").textContent = `${part}, ${state.name} ✨`;
  $("#brand-name").textContent = state.name;
  document.title = `${state.name}'s Lounge`;
  $("#today").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

function renderMoods() {
  $("#mood-chips").innerHTML = MOODS.map((m) =>
    `<button class="chip ${state.mood === m.id ? "on" : ""}" data-mood="${m.id}">${m.emoji} ${esc(m.label)}</button>`).join("");
}
$("#mood-chips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-mood]");
  if (!b) return;
  state.mood = state.mood === b.dataset.mood ? null : b.dataset.mood;
  renderMoods();
  renderRail();
  renderTonight();
});

const moodFilms = () => (state.mood ? VAULT.filter((f) => f.moods.includes(state.mood)) : VAULT);

function renderRail() {
  const m = MOODS.find((x) => x.id === state.mood);
  $("#mood-title").textContent = m ? `${m.emoji} ${m.label}` : "Play right here, free";
  $("#home-rail").innerHTML = moodFilms().map(tile).join("");
}

function renderTonight() {
  const f = pick(moodFilms());
  $("#tonight-body").innerHTML = `
    <div class="pick-body">
      <img src="${thumb(f.id)}" alt="">
      <div>
        <h3>${esc(f.title)}</h3>
        <span class="muted">${f.year}</span>
        <p>${esc(f.blurb)}</p>
        <div class="row">
          <button class="primary" data-play="${esc(f.id)}">▶ Watch now</button>
          <button class="ghost" data-heart="${esc(f.id)}">${inList(f) ? "♥" : "♡"}</button>
        </div>
      </div>
    </div>`;
}
$("#reroll").onclick = renderTonight;

function renderKit() {
  const f = pick(moodFilms());
  $("#kit").innerHTML = `
    <li><span class="k">🍿</span><div><small>Snack</small>${esc(pick(SNACKS))}</div></li>
    <li><span class="k">🕯️</span><div><small>Vibe</small>${esc(pick(VIBES))}</div></li>
    <li><span class="k">🎬</span><div><small>Film</small><button class="text-btn" data-play="${esc(f.id)}">${esc(f.title)}</button></div></li>`;
}
$("#kit-reroll").onclick = renderKit;

// ---------- watch ----------
function renderVault() {
  const filters = [{ id: "all", label: "All", emoji: "✦" }, ...MOODS];
  $("#vault-filters").innerHTML = filters.map((m) =>
    `<button class="chip ${state.vaultFilter === m.id ? "on" : ""}" data-vf="${m.id}">${m.emoji} ${esc(m.label)}</button>`).join("");
  const list = state.vaultFilter === "all" ? VAULT : VAULT.filter((f) => f.moods.includes(state.vaultFilter));
  $("#vault").innerHTML = list.map(tile).join("");
}
$("#vault-filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-vf]");
  if (b) { state.vaultFilter = b.dataset.vf; renderVault(); }
});

function renderServices() {
  $("#services").innerHTML = SERVICES.map((s) => `
    <a class="service" href="${s.home}" target="_blank" rel="noopener">
      <div><span class="dot" style="background:${s.color}"></span><b>${esc(s.name)}</b></div>
      <p>${esc(s.has)}</p>
      <span class="badge">${esc(s.tag)}</span>
    </a>`).join("");
}

$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("#search-input").value.trim();
  if (q) search(q);
});

let searchToken = 0;
async function search(q) {
  $("#search-results").hidden = false;
  $("#q-echo").textContent = q;
  const jw = JUSTWATCH.replace("/us/", `/${state.country}/`);
  const buttons = [{ name: "JustWatch — who has it?", color: "#ffd27a", ink: "#111", url: jw + encodeURIComponent(q) },
    ...SERVICES.map((s) => ({ ...s, url: s.search + encodeURIComponent(q + (s.suffix || "")) }))];
  $("#svc-buttons").innerHTML = buttons.map((b) =>
    `<a class="svc-btn" style="background:${b.color};color:${b.ink || "#fff"}" href="${b.url}" target="_blank" rel="noopener">${esc(b.name)}</a>`).join("");

  // Live search of the Internet Archive's free film collections — playable in-app.
  const token = ++searchToken;
  $("#ia-status").textContent = "Searching…";
  $("#ia-results").innerHTML = "";
  const query = `title:(${q}) AND mediatype:movies AND collection:(feature_films OR classic_cinema OR silent_films OR classic_tv OR animationandcartoons)`;
  const url = "https://archive.org/advancedsearch.php?" + new URLSearchParams({
    q: query, "fl[]": "identifier", rows: "24", output: "json", "sort[]": "downloads desc",
  }) + "&fl[]=title&fl[]=year";
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (token !== searchToken) return;
    const docs = data.response.docs.map((d) => ({
      id: d.identifier, title: Array.isArray(d.title) ? d.title[0] : d.title || d.identifier, year: d.year || "",
    }));
    docs.forEach((f) => { if (!seen.has(f.id)) seen.set(f.id, f); });
    $("#ia-status").textContent = docs.length ? `${docs.length} free classics found` :
      "No public-domain matches — try the free services above.";
    $("#ia-results").innerHTML = docs.map((d) => tile(seen.get(d.id))).join("");
  } catch {
    if (token === searchToken) $("#ia-status").textContent = "Couldn't reach the archive — check your connection.";
  }
}

// ---------- social ----------
function socialUrl(s) {
  const h = (state.handles[s.id] || "").trim().replace(/^@/, "");
  return h && s.url ? s.url + encodeURIComponent(h) : s.app;
}

function renderHomeSocials() {
  const favs = SOCIALS.filter((s) => state.favs.includes(s.id));
  $("#home-socials").innerHTML = favs.length
    ? favs.map((s) => `<a class="social-pill" href="${socialUrl(s)}" target="_blank" rel="noopener">${logo(s)}${esc(s.name)}</a>`).join("")
    : `<p class="empty-pill">Star your favorites in <a href="#social">Social</a> to pin them here.</p>`;
}

function renderSocialGrid() {
  $("#social-grid").innerHTML = SOCIALS.map((s) => {
    const fav = state.favs.includes(s.id);
    return `
      <div class="social-card">
        <div class="top">${logo(s)}<b>${esc(s.name)}</b>
          <button class="star ${fav ? "on" : ""}" data-star="${s.id}" aria-label="${fav ? "Unpin" : "Pin"} ${esc(s.name)}">${fav ? "★" : "☆"}</button>
        </div>
        ${s.url ? `<div class="handle"><input data-handle="${s.id}" placeholder="@username" value="${esc(state.handles[s.id] || "")}" aria-label="${esc(s.name)} username"></div>` : ""}
        <a class="primary" data-open="${s.id}" href="${socialUrl(s)}" target="_blank" rel="noopener">Open ${esc(s.name)}</a>
      </div>`;
  }).join("");
}
$("#social-grid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-star]");
  if (!b) return;
  const id = b.dataset.star;
  state.favs = state.favs.includes(id) ? state.favs.filter((x) => x !== id) : [...state.favs, id];
  store.set("favs", state.favs);
  renderSocialGrid();
  renderHomeSocials();
});
$("#social-grid").addEventListener("input", (e) => {
  const id = e.target.dataset.handle;
  if (!id) return;
  state.handles[id] = e.target.value;
  store.set("handles", state.handles);
  const s = SOCIALS.find((x) => x.id === id);
  document.querySelector(`[data-open="${id}"]`).href = socialUrl(s);
  renderHomeSocials();
});

// ---------- my list ----------
function renderList() {
  const items = state.list.filter((i) => (state.listFilter === "done" ? i.done : !i.done));
  $("#list-empty").hidden = items.length > 0;
  $("#watchlist").innerHTML = items.map((i) => `
    <li data-key="${esc(i.key)}">
      ${i.id ? `<img src="${thumb(i.id)}" alt="">` : `<span class="ph">🎬</span>`}
      <div class="info">
        <b>${esc(i.title)}</b><span class="muted">${esc(i.year || "")}</span>
        ${i.done ? `<div class="stars">${[1, 2, 3, 4, 5].map((n) =>
          `<button data-rate="${n}" class="${n <= i.rating ? "on" : ""}" aria-label="${n} hearts">♥</button>`).join("")}</div>` : ""}
      </div>
      <div class="actions">
        ${i.id ? `<button data-act="play">▶ Play</button>` : `<button data-act="find">🔎 Find free</button>`}
        <button data-act="done">${i.done ? "↺ Unwatch" : "✓ Watched"}</button>
        <button data-act="share">↗</button>
        <button data-act="remove" aria-label="Remove">✕</button>
      </div>
    </li>`).join("");
}

$("#watchlist").addEventListener("click", (e) => {
  const li = e.target.closest("li[data-key]");
  if (!li) return;
  const item = state.list.find((i) => i.key === li.dataset.key);
  const rate = e.target.closest("[data-rate]");
  const act = e.target.closest("[data-act]")?.dataset.act;
  if (rate) item.rating = Number(rate.dataset.rate);
  else if (act === "play") return play(seen.get(item.id) || item);
  else if (act === "find") { location.hash = "#watch"; $("#search-input").value = item.title; return search(item.title); }
  else if (act === "share") return share(item);
  else if (act === "done") { item.done = !item.done; toast(item.done ? "Nice! Rate it with hearts ♥" : "Back on the list"); }
  else if (act === "remove") state.list = state.list.filter((i) => i !== item);
  else return;
  store.set("list", state.list);
  renderList();
  renderAllHearts();
});

$("#list-filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-f]");
  if (!b) return;
  state.listFilter = b.dataset.f;
  document.querySelectorAll("#list-filters .chip").forEach((c) => c.classList.toggle("on", c === b));
  renderList();
});

$("#add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = $("#add-input").value.trim();
  if (!title) return;
  const f = { title };
  if (!inList(f)) toggleSave(f);
  $("#add-input").value = "";
});

// ---------- settings ----------
$("#settings-btn").onclick = () => {
  $("#set-name").value = state.name;
  $("#set-country").value = state.country;
  $("#settings").showModal();
};
$("#settings").addEventListener("close", () => {
  if ($("#settings").returnValue !== "save") return;
  state.name = $("#set-name").value.trim() || "Nada";
  state.country = $("#set-country").value;
  store.set("name", state.name);
  store.set("country", state.country);
  renderGreeting();
  toast("Saved");
});

// ---------- routing ----------
function route() {
  const tab = (location.hash || "#home").slice(1);
  const valid = ["home", "watch", "social", "list"].includes(tab) ? tab : "home";
  document.querySelectorAll(".view").forEach((v) => (v.hidden = v.id !== "view-" + valid));
  document.querySelectorAll("[data-tab]").forEach((a) => a.classList.toggle("active", a.dataset.tab === valid));
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

// ---------- boot ----------
renderGreeting();
renderMoods();
renderRail();
renderTonight();
renderKit();
renderVault();
renderServices();
renderHomeSocials();
renderSocialGrid();
renderList();
route();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
