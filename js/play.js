import { EMOJI_QUIZ, WOULD_YOU_RATHER, WHEEL, TRUTH, DARE } from "./play-data.js";

// Game night: emoji quiz, spin the wheel, would you rather, truth or dare.
export function initPlay({ $, esc, pick, store, toast, state }) {
  const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
  const best = store.get("quizBest", 0);
  let game = "quiz";

  // ---- Emoji quiz ----
  const quiz = { round: [], i: 0, score: 0, locked: false };
  const startQuiz = () => {
    quiz.round = shuffle(EMOJI_QUIZ).slice(0, 10);
    quiz.i = 0; quiz.score = 0; quiz.locked = false;
    renderQuiz();
  };
  function renderQuiz() {
    const box = $("#game-body");
    if (quiz.i >= quiz.round.length) {
      const b = Math.max(best, quiz.score);
      store.set("quizBest", b);
      const line = quiz.score === 10 ? "Perfect! Film-buff royalty 👑" : quiz.score >= 7 ? "So good! Movie night expert 🍿" : quiz.score >= 4 ? "Not bad! A few more rewatches 🎬" : "Time for a movie marathon 😅";
      box.innerHTML = `<div class="quiz-result"><span class="big-emoji">${quiz.score >= 7 ? "🏆" : "🎬"}</span>
        <p class="eyebrow">Your score</p><h3>${quiz.score} / 10</h3><p>${esc(line)} Best: ${b}/10.</p>
        <div class="row"><button class="primary" id="quiz-restart">🔁 Play again</button></div></div>`;
      $("#quiz-restart").onclick = startQuiz;
      return;
    }
    const [emojis, answer, ...wrong] = quiz.round[quiz.i];
    const options = shuffle([answer, ...wrong]);
    box.innerHTML = `
      <div class="quiz-progress"><i style="width:${(quiz.i / 10) * 100}%"></i></div>
      <p class="eyebrow">Guess the movie or show · ${quiz.i + 1} of 10 · score ${quiz.score}</p>
      <div class="emoji-clue">${emojis}</div>
      <div class="quiz-answers">${options.map((o) => `<button class="answer" data-guess="${esc(o)}">${esc(o)}</button>`).join("")}</div>`;
  }
  $("#game-body").addEventListener("click", (e) => {
    const b = e.target.closest("[data-guess]");
    if (!b || quiz.locked) return;
    quiz.locked = true;
    const answer = quiz.round[quiz.i][1];
    const right = b.dataset.guess === answer;
    if (right) quiz.score++;
    document.querySelectorAll("#game-body [data-guess]").forEach((x) => {
      if (x.dataset.guess === answer) x.classList.add("right");
      else if (x === b) x.classList.add("wrong");
    });
    toast(right ? pick(["Yes! 🎉", "Nailed it ✨", "Correct! 🍿"]) : `It was ${answer}`);
    setTimeout(() => { quiz.i++; quiz.locked = false; renderQuiz(); }, 900);
  });

  // ---- Wheel ----
  let angle = 0;
  function renderWheel() {
    const n = WHEEL.length, step = 360 / n;
    const slices = WHEEL.map((_, i) => `hsl(${(i * 360) / n} 70% ${i % 2 ? 55 : 42}%) ${i * step}deg ${(i + 1) * step}deg`).join(", ");
    $("#game-body").innerHTML = `
      <p class="eyebrow">What are we doing tonight?</p>
      <div class="wheel-wrap">
        <div class="wheel-pin">▼</div>
        <div class="wheel" id="wheel" style="background: conic-gradient(${slices}); transform: rotate(${angle}deg)">
          ${WHEEL.map((label, i) => `<span class="wheel-label" style="transform: rotate(${i * step + step / 2}deg) translateY(-118px) rotate(90deg)">${esc(label.replace(/ \S+$/, ""))}</span>`).join("")}
        </div>
      </div>
      <p class="wheel-result" id="wheel-result">Tap spin!</p>
      <div class="row center"><button class="primary" id="spin">🎡 Spin</button></div>`;
    $("#spin").onclick = () => {
      const target = Math.floor(Math.random() * n);
      // Land the pointer (at the top) in the middle of the chosen slice.
      angle += 360 * 5 + ((360 - (target * step + step / 2)) - (angle % 360) + 360) % 360;
      $("#wheel").style.transform = `rotate(${angle}deg)`;
      $("#spin").disabled = true;
      $("#wheel-result").textContent = "Spinning…";
      setTimeout(() => {
        $("#wheel-result").textContent = `Tonight: ${WHEEL[target]}`;
        $("#spin").disabled = false;
      }, 4200);
    };
  }

  // ---- Would you rather ----
  const wyr = { i: 0, order: shuffle(WOULD_YOU_RATHER) };
  function renderWyr() {
    const [a, b] = wyr.order[wyr.i % wyr.order.length];
    $("#game-body").innerHTML = `
      <p class="eyebrow">Would you rather…</p>
      <div class="wyr">
        <button class="answer wyr-a" data-wyr="0">${esc(a)}</button>
        <span class="wyr-or">or</span>
        <button class="answer wyr-b" data-wyr="1">${esc(b)}</button>
      </div>`;
  }
  $("#game-body").addEventListener("click", (e) => {
    const b = e.target.closest("[data-wyr]");
    if (!b) return;
    toast(pick(["Same! 🙌", "Bold choice 😏", "Love that for you 💖", "Interesting… 🤔"]));
    wyr.i++;
    setTimeout(renderWyr, 300);
  });

  // ---- Truth or dare ----
  function renderTod(kind) {
    const card = kind ? `<div class="tod-card ${kind}"><p class="eyebrow">${kind === "truth" ? "Truth" : "Dare"}</p><h3>${esc(pick(kind === "truth" ? TRUTH : DARE))}</h3></div>` :
      `<p class="muted">Play with friends on a call or on the sofa. Tap a card.</p>`;
    $("#game-body").innerHTML = `
      <p class="eyebrow">Truth or dare: movie edition</p>
      ${card}
      <div class="row center"><button class="primary" id="tod-truth">💬 Truth</button><button class="primary alt" id="tod-dare">🔥 Dare</button></div>`;
    $("#tod-truth").onclick = () => renderTod("truth");
    $("#tod-dare").onclick = () => renderTod("dare");
  }

  const GAMES = { quiz: startQuiz, wheel: renderWheel, wyr: renderWyr, tod: () => renderTod() };
  $("#game-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-game]");
    if (!b) return;
    game = b.dataset.game;
    document.querySelectorAll("#game-tabs .chip").forEach((c) => c.classList.toggle("on", c === b));
    GAMES[game]();
  });
  GAMES[game]();
}
