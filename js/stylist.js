import { loadImage, blobToDataUrl } from "./vision.js";

// Her AI stylist: a chat with Claude that knows her colors, her beauty profile,
// her closet and today's weather, and can look at her photos.

const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.133.0/+esm";
const MODEL = "claude-opus-5-5";
const QUICK = [
  ["👗 Rate my outfit", "Here's what I'm wearing. Be honest but kind: what works, and 2 quick changes that would make it better?", true],
  ["💄 Makeup for tonight", "I'm going out tonight. Plan my makeup step by step using shades that suit me."],
  ["🧥 What goes with this?", "What should I wear with this piece from my closet? Give me 3 outfit ideas.", true],
  ["📅 Plan my week", "Plan 5 outfits for my week from my closet, one per day, for the weather you know. Keep each one to one line."],
  ["💇 Hair for today", "Suggest a hairstyle for today that suits my face shape and takes under 10 minutes."],
];

export function initStylist({ $, esc, store, toast, state, LINK_MODE, context }) {
  const api = { open: () => {}, hasKey: () => false, json: async () => ({}) };
  if (LINK_MODE) { $("#stylist-fab").hidden = true; return api; }

  let Anthropic = null, client = null;
  let history = store.get("chat", []); // [{role, text}] text only; photos aren't kept
  let pendingImage = null; // { dataUrl, mediaType, data }
  let busy = false;

  const key = () => store.get("apiKey", "");
  api.hasKey = () => !!key();

  async function getClient() {
    if (!Anthropic) ({ default: Anthropic } = await import(SDK_URL));
    if (!client || client._key !== key()) {
      client = new Anthropic({ apiKey: key(), dangerouslyAllowBrowser: true });
      client._key = key();
    }
    return client;
  }

  function system() {
    const c = context();
    return [
      `You are ${state.name}'s personal stylist, makeup artist and hype friend inside her app "Nada's Lounge". Warm, fun, specific, never preachy. Short answers: a few lines, or a short list. No long essays. Use her real pieces by name when you can.`,
      `Today: ${new Date().toDateString()}. Weather: ${c.weather || "unknown"}.`,
      `Her coloring: Warm Autumn palette. Best colors: olive, mustard, terracotta, rust, teal, emerald, burgundy, coral; neutrals cream, camel, chocolate, warm taupe. Gold jewelry over silver.`,
      `Beauty profile: ${c.beauty}.`,
      c.closet.length ? `Her closet (${c.closet.length} items): ${c.closet.join("; ")}.` : "Her closet is empty so far; suggest she photographs her clothes in the Fashion tab.",
      c.outfit ? `The app's outfit pick right now: ${c.outfit}.` : "",
      `When she sends a photo, say what you see first in one line, then advise. If a photo shows something unsafe or unrelated, just say you can't help with that one.`,
    ].filter(Boolean).join("\n");
  }

  // ---------- UI ----------
  function render() {
    const log = $("#chat-log");
    const setup = !api.hasKey();
    $("#chat-setup").hidden = !setup;
    $("#chat-form").hidden = setup;
    $("#chat-quick").hidden = setup;
    if (setup) return;
    $("#chat-quick").innerHTML = QUICK.map(([label, prompt, photo], i) => `<button class="chip" data-quick="${i}">${esc(label)}${photo ? " 📷" : ""}</button>`).join("");
    log.innerHTML = history.length ? history.map((m) => bubble(m)).join("") :
      `<div class="msg bot">Hi ${esc(state.name)}! ✨ I know your colors, your closet and today's weather. Ask me anything, or send me a photo of an outfit.</div>`;
    log.scrollTop = log.scrollHeight;
  }
  const bubble = (m) => `<div class="msg ${m.role === "user" ? "me" : "bot"}">${m.image ? `<img src="${m.image}" alt="">` : ""}${esc(m.text).replace(/\n/g, "<br>")}</div>`;

  function openChat(prefill) {
    render();
    if (prefill) $("#chat-input").value = prefill;
    $("#stylist").showModal();
    setTimeout(() => $("#chat-input").focus(), 50);
  }
  api.open = openChat;

  async function send(text) {
    if (busy || (!text && !pendingImage)) return;
    if (!api.hasKey()) { render(); return; }
    busy = true;
    const img = pendingImage; pendingImage = null; $("#chat-attach").classList.remove("on");
    const userMsg = { role: "user", text: text || "What do you think?", image: img?.dataUrl };
    history.push(userMsg);
    const log = $("#chat-log");
    log.insertAdjacentHTML("beforeend", bubble(userMsg) + `<div class="msg bot typing" id="chat-typing">…</div>`);
    log.scrollTop = log.scrollHeight;
    $("#chat-input").value = "";

    const messages = history.slice(-12, -1).map((m) => ({ role: m.role, content: m.text }));
    messages.push({ role: "user", content: img
      ? [{ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } }, { type: "text", text: userMsg.text }]
      : userMsg.text });

    let reply = "";
    const out = $("#chat-typing");
    try {
      const c = await getClient();
      const stream = c.beta.messages.stream({
        model: MODEL,
        max_tokens: 2048,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system: [{ type: "text", text: system(), cache_control: { type: "ephemeral" } }],
        messages,
      });
      stream.on("text", (t) => { reply += t; out.classList.remove("typing"); out.innerHTML = esc(reply).replace(/\n/g, "<br>"); log.scrollTop = log.scrollHeight; });
      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal") reply = reply || "I'd rather not help with that one. Ask me about clothes, makeup or hair!";
      if (final.stop_reason === "max_tokens") reply += " …";
    } catch (err) {
      reply = errorText(err);
    }
    out.classList.remove("typing");
    out.innerHTML = esc(reply).replace(/\n/g, "<br>");
    out.removeAttribute("id");
    history.push({ role: "assistant", text: reply });
    history = history.slice(-30);
    store.set("chat", history.map(({ role, text }) => ({ role, text })));
    busy = false;
  }

  function errorText(err) {
    if (Anthropic && err instanceof Anthropic.APIConnectionError) return "I can't reach the stylist right now. Check your internet and try again.";
    if (Anthropic && err instanceof Anthropic.AuthenticationError) return "That API key doesn't work. Open ⚙︎ Settings and check it.";
    if (Anthropic && err instanceof Anthropic.RateLimitError) return "Too many requests right now. Give me a minute and try again.";
    if (Anthropic && err instanceof Anthropic.APIError) return `Something went wrong (${err.status}): ${err.message}`;
    return `Couldn't reach the stylist: ${err.message || err}`;
  }

  // One-shot structured answer (used by the closet to tag clothes).
  api.json = async (prompt, imageDataUrls, schema) => {
    const c = await getClient();
    const content = imageDataUrls.map((d) => ({ type: "image", source: { type: "base64", media_type: d.slice(5, d.indexOf(";")), data: d.slice(d.indexOf(",") + 1) } }));
    content.push({ type: "text", text: prompt });
    const res = await c.beta.messages.create({
      model: MODEL, max_tokens: 4096,
      betas: ["server-side-fallback-2026-07-01"], fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema } },
      messages: [{ role: "user", content }],
    });
    if (res.stop_reason === "refusal") throw new Error("The AI declined to look at those photos.");
    const text = res.content.find((b) => b.type === "text")?.text || "{}";
    return JSON.parse(text);
  };

  // ---------- events ----------
  $("#stylist-fab").addEventListener("click", () => openChat());
  $("#stylist-close").addEventListener("click", () => $("#stylist").close());
  $("#chat-form").addEventListener("submit", (e) => { e.preventDefault(); send($("#chat-input").value.trim()); });
  $("#chat-quick").addEventListener("click", (e) => {
    const b = e.target.closest("[data-quick]"); if (!b) return;
    const [, prompt, photo] = QUICK[b.dataset.quick];
    $("#chat-input").value = prompt;
    if (photo && !pendingImage) { $("#chat-photo").click(); return; }
    send(prompt);
  });
  $("#chat-attach").addEventListener("click", () => $("#chat-photo").click());
  $("#chat-photo").addEventListener("change", async (e) => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    const { blob } = await loadImage(f, 1024);
    const dataUrl = await blobToDataUrl(blob);
    pendingImage = { dataUrl, mediaType: "image/jpeg", data: dataUrl.split(",")[1] };
    $("#chat-attach").classList.add("on");
    toast("Photo attached. Add a question and send.");
    $("#chat-input").focus();
  });
  $("#chat-clear").addEventListener("click", () => { history = []; store.set("chat", []); render(); });
  $("#chat-key-save").addEventListener("click", () => {
    const k = $("#chat-key").value.trim();
    if (!k.startsWith("sk-ant-")) { toast("That doesn't look like an Anthropic key"); return; }
    store.set("apiKey", k); $("#chat-key").value = ""; toast("Stylist is ready ✨"); render();
  });

  return api;
}
