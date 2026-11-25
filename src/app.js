/* ============================================================
   J2EE Quiz Arena - game engine
   Vanilla JS, no build step. Mobile first.
   ============================================================ */
(function () {
  "use strict";

  var BANK = window.QUESTION_BANK;
  var TOPICS = BANK.topics;
  var ALL = BANK.questions;

  /* ---------- persistence ---------- */
  var KEY = "j2eeArena.v1";
  var save = loadState();

  function loadState() {
    var blank = { xp: 0, streak: 0, best: {}, seen: {}, wrong: {}, mastered: {}, runs: 0, sound: true, totalCorrect: 0, totalAsked: 0, daily: {} };
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank;
      var s = JSON.parse(raw);
      for (var k in blank) if (!(k in s)) s[k] = blank[k];
      return s;
    } catch (e) { return blank; }
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} }

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function levelOf(xp) { return Math.floor(Math.sqrt(xp / 60)) + 1; }
  function xpForLevel(l) { return Math.pow(l - 1, 2) * 60; }
  function today() { return new Date().toISOString().slice(0, 10); }

  /* ---------- sound (tiny WebAudio blips, no files) ---------- */
  var actx = null;
  function blip(freq, dur, type) {
    if (!save.sound) return;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.16, actx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(); o.stop(actx.currentTime + dur + 0.02);
    } catch (e) {}
  }
  var SFX = {
    correct: function () { blip(660, 0.1); setTimeout(function () { blip(990, 0.12); }, 90); },
    wrong: function () { blip(180, 0.18, "square"); },
    tick: function () { blip(1200, 0.03, "triangle"); },
    level: function () { [523, 659, 784, 1046].forEach(function (f, i) { setTimeout(function () { blip(f, 0.15); }, i * 110); }); },
    tap: function () { blip(440, 0.04, "triangle"); }
  };

  /* ---------- question shaping ---------- */
  function prepare(q) {
    var out = JSON.parse(JSON.stringify(q));
    if (out.type === "mcq" || out.type === "multi") {
      var idx = out.options.map(function (_, i) { return i; });
      out._order = shuffle(idx);
      out._shuffled = out._order.map(function (i) { return out.options[i]; });
      if (out.type === "mcq") out._answerShuffled = out._order.indexOf(out.answer);
      else out._answerShuffled = out.answer.map(function (a) { return out._order.indexOf(a); }).sort(function (a, b) { return a - b; });
    }
    if (out.type === "order") out._correctOrder = out.items.slice();
    if (out.type === "match") {
      out._rights = shuffle(out.pairs.map(function (p) { return p.right; }));
    }
    return out;
  }

  function norm(s) {
    return String(s == null ? "" : s)
      .trim().toLowerCase()
      .replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
      .replace(/\s+/g, " ");
  }

  /* ---------- build a run ---------- */
  var MODES = {
    focus: { label: "Focus", lives: 5, timer: 0, count: 12 },
    blitz: { label: "Blitz", lives: 3, timer: 20, count: 15 },
    endless: { label: "Endless", lives: 3, timer: 0, count: 999 }
  };

  function pickQuestions(topicId, count) {
    var pool = topicId === "mixed" ? ALL.slice() : ALL.filter(function (q) { return q.topic === topicId; });
    if (!pool.length) return [];
    // weight: unseen and previously-wrong first, then mastered last
    var scored = pool.map(function (q) {
      var s = Math.random() * 2;
      if (!save.seen[q.id]) s += 3;
      if (save.wrong[q.id]) s += 2;
      if (save.mastered[q.id]) s -= 2.5;
      return { q: q, s: s };
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    var picked = scored.slice(0, Math.min(count, scored.length)).map(function (x) { return x.q; });
    return shuffle(picked).map(prepare);
  }

  /* ---------- screen routing ---------- */
  var app = $("#app");
  var run = null; // current run state

  function screen(html) { app.innerHTML = html; window.scrollTo(0, 0); }

  function header() {
    var lvl = levelOf(save.xp), cur = save.xp - xpForLevel(lvl), need = xpForLevel(lvl + 1) - xpForLevel(lvl);
    var pct = Math.min(100, Math.round((cur / need) * 100));
    return (
      '<header class="top">' +
        '<div class="brand"><span class="logo">☕</span><span>J2EE Arena</span></div>' +
        '<div class="hud">' +
          '<div class="xp" title="XP">' +
            '<div class="lvl">Lv ' + lvl + '</div>' +
            '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
            '<div class="xpnum">' + save.xp + ' XP</div>' +
          '</div>' +
          '<div class="streak" title="Best streak">🔥 ' + (save.best.global || 0) + '</div>' +
        '</div>' +
      '</header>'
    );
  }

  function home() {
    var lvl = levelOf(save.xp);
    var due = ALL.filter(function (q) { return save.wrong[q.id]; }).length;
    var mastered = ALL.filter(function (q) { return save.mastered[q.id]; }).length;

    var cards = TOPICS.map(function (t) {
      var qs = ALL.filter(function (q) { return q.topic === t.id; });
      var done = qs.filter(function (q) { return save.mastered[q.id]; }).length;
      var pct = qs.length ? Math.round((done / qs.length) * 100) : 0;
      return (
        '<button class="topic" data-topic="' + t.id + '">' +
          '<div class="ticon">' + t.icon + '</div>' +
          '<div class="tbody">' +
            '<div class="tname">' + esc(t.name) + '</div>' +
            '<div class="tblurb">' + esc(t.blurb) + '</div>' +
            '<div class="tbar"><i style="width:' + pct + '%"></i></div>' +
            '<div class="tmeta">' + done + '/' + qs.length + ' mastered</div>' +
          '</div>' +
          '<div class="tgo">▶</div>' +
        '</button>'
      );
    }).join("");

    screen(
      header() +
      '<main>' +
        '<section class="hero">' +
          '<div class="heroText">' +
            '<h1>Level ' + lvl + ' Java EE Scholar</h1>' +
            '<p>6 topics · ' + ALL.length + ' questions · MCQ, multi-answer, ordering, typing &amp; code.</p>' +
          '</div>' +
          '<div class="heroStats">' +
            '<div><b>' + save.totalCorrect + '</b><span>correct</span></div>' +
            '<div><b>' + mastered + '</b><span>mastered</span></div>' +
            '<div><b>' + due + '</b><span>to review</span></div>' +
          '</div>' +
        '</section>' +

        '<section class="modes">' +
          '<button class="mode mixed" data-topic="mixed" data-mode="focus">' +
            '<span class="mIcon">🎲</span><span class="mName">Mixed Mock</span>' +
            '<span class="mDesc">12 questions from every topic</span>' +
          '</button>' +
          '<button class="mode" data-mode="blitz">' +
            '<span class="mIcon">⚡</span><span class="mName">Blitz</span>' +
            '<span class="mDesc">20s per question</span>' +
          '</button>' +
          '<button class="mode" data-mode="endless">' +
            '<span class="mIcon">♾️</span><span class="mName">Endless</span>' +
            '<span class="mDesc">3 lives, go until you drop</span>' +
          '</button>' +
          '<button class="mode" id="reviewBtn">' +
            '<span class="mIcon">🔁</span><span class="mName">Review ' + due + '</span>' +
            '<span class="mDesc">Only questions you got wrong</span>' +
          '</button>' +
        '</section>' +

        '<h2 class="secTitle">Pick a topic</h2>' +
        '<section class="topics">' + cards + '</section>' +

        '<footer class="foot">' +
          '<button class="link" id="soundBtn">' + (save.sound ? "🔊 Sound on" : "🔇 Sound off") + '</button>' +
          '<button class="link danger" id="resetBtn">Reset progress</button>' +
        '</footer>' +
      '</main>'
    );

    $$(".topic").forEach(function (b) {
      b.addEventListener("click", function () { startRun(b.dataset.topic, "focus"); });
    });
    $$(".mode[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { startRun(b.dataset.topic || "mixed", b.dataset.mode); });
    });
    $("#reviewBtn").addEventListener("click", function () {
      var wrong = ALL.filter(function (q) { return save.wrong[q.id]; });
      if (!wrong.length) { toast("Nothing to review yet - play a round first!"); return; }
      startRun("review", "focus");
    });
    $("#soundBtn").addEventListener("click", function () { save.sound = !save.sound; persist(); home(); });
    $("#resetBtn").addEventListener("click", function () {
      if (confirm("Reset all XP, streaks and mastered questions?")) {
        save = { xp: 0, streak: 0, best: {}, seen: {}, wrong: {}, mastered: {}, runs: 0, sound: save.sound, totalCorrect: 0, totalAsked: 0, daily: {} };
        persist(); home();
      }
    });
  }

  /* ---------- run ---------- */
  function startRun(topicId, modeName) {
    var mode = MODES[modeName] || MODES.focus;
    var qs;
    if (topicId === "review") {
      var wrong = ALL.filter(function (q) { return save.wrong[q.id]; });
      qs = shuffle(wrong).slice(0, mode.count).map(prepare);
    } else {
      qs = pickQuestions(topicId, mode.count);
    }
    if (!qs.length) { toast("No questions here yet."); return; }
    run = {
      topic: topicId, mode: modeName, modeCfg: mode,
      qs: qs, i: 0, lives: mode.lives, score: 0, streak: 0, bestStreak: 0,
      correct: 0, answered: 0, startTime: Date.now(), results: [], timerId: null, timeLeft: 0
    };
    save.runs++;
    renderQuestion();
  }

  function topicName(id) {
    if (id === "mixed") return "Mixed Mock";
    if (id === "review") return "Review";
    var t = TOPICS.filter(function (x) { return x.id === id; })[0];
    return t ? t.name : id;
  }

  function questionShell(q, inner) {
    var pct = Math.round((run.i / run.qs.length) * 100);
    var typeLabel = { mcq: "Choose one", multi: "Choose all that apply", order: "Put in order", type: "Type the answer", code: "Fill the blank", match: "Match pairs" }[q.type] || "";
    var hearts = "";
    for (var i = 0; i < run.modeCfg.lives; i++) hearts += i < run.lives ? "❤️" : "🖤";
    return (
      header() +
      '<main class="play">' +
        '<div class="runbar">' +
          '<button class="x" id="quitBtn" aria-label="Quit">✕</button>' +
          '<div class="progress"><i style="width:' + pct + '%"></i></div>' +
          '<div class="lives">' + hearts + '</div>' +
        '</div>' +
        (run.modeCfg.timer ? '<div class="timer" id="timerBar"><i style="width:100%"></i></div>' : "") +
        '<div class="qhead">' +
          '<span class="chip">' + esc(topicName(q.topic)) + '</span>' +
          '<span class="chip ghost">' + typeLabel + '</span>' +
          '<span class="chip ghost">' + "★".repeat(q.difficulty) + "</span>" +
          '<span class="qcount">' + (run.i + 1) + '/' + run.qs.length + '</span>' +
        '</div>' +
        '<h2 class="qtext">' + esc(q.q) + '</h2>' +
        inner +
        '<div class="feedback" id="fb" hidden></div>' +
        '<div class="actions" id="actions"></div>' +
      '</main>'
    );
  }

  function renderQuestion() {
    var q = run.qs[run.i];
    if (!q) return endRun();
    if (q.type === "mcq") return renderMcq(q);
    if (q.type === "multi") return renderMulti(q);
    if (q.type === "order") return renderOrder(q);
    if (q.type === "type" || q.type === "code") return renderType(q);
    if (q.type === "match") return renderMatch(q);
    return endRun();
  }

  function bindQuit() {
    $("#quitBtn").addEventListener("click", function () {
      if (confirm("Quit this round? Progress so far is kept.")) { stopTimer(); endRun(true); }
    });
  }

  /* --- MCQ --- */
  function renderMcq(q) {
    var opts = q._shuffled.map(function (o, i) {
      return '<button class="opt" data-i="' + i + '"><span class="key">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>';
    }).join("");
    screen(questionShell(q, '<div class="opts">' + opts + '</div>'));
    bindQuit();
    var picked = false;
    $$(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        if (picked) return;
        picked = true; stopTimer();
        var i = +b.dataset.i, ok = i === q._answerShuffled;
        $$(".opt").forEach(function (x) { x.classList.add("locked"); });
        b.classList.add(ok ? "right" : "wrong");
        if (!ok) {
          var rb = $('.opt[data-i="' + q._answerShuffled + '"]');
          if (rb) rb.classList.add("right");
        }
        resolve(q, ok, ok ? "" : "Correct answer: " + q.options[q.answer]);
      });
    });
    startTimerIfNeeded(function () { if (!picked) { picked = true; $$(".opt").forEach(function (x) { x.classList.add("locked"); }); $('.opt[data-i="' + q._answerShuffled + '"]').classList.add("right"); resolve(q, false, "Out of time!"); } });
  }

  /* --- MULTI --- */
  function renderMulti(q) {
    var opts = q._shuffled.map(function (o, i) {
      return '<button class="opt multi" data-i="' + i + '"><span class="key box"></span><span>' + esc(o) + '</span></button>';
    }).join("");
    screen(questionShell(q, '<div class="opts">' + opts + '</div>'));
    bindQuit();
    var chosen = {};
    $$(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +b.dataset.i;
        chosen[i] = !chosen[i];
        b.classList.toggle("sel", !!chosen[i]);
        b.querySelector(".key").textContent = chosen[i] ? "✓" : "";
        SFX.tap();
      });
    });
    var btn = document.createElement("button");
    btn.className = "primary"; btn.textContent = "Submit answer";
    $("#actions").appendChild(btn);
    var done = false;
    btn.addEventListener("click", function () {
      if (done) return; done = true; stopTimer();
      var got = Object.keys(chosen).filter(function (k) { return chosen[k]; }).map(Number).sort(function (a, b) { return a - b; });
      var want = q._answerShuffled;
      var ok = got.length === want.length && got.every(function (v, i) { return v === want[i]; });
      $$(".opt").forEach(function (x) {
        var i = +x.dataset.i, isRight = want.indexOf(i) >= 0, isSel = got.indexOf(i) >= 0;
        x.classList.add("locked");
        if (isRight) x.classList.add("right");
        else if (isSel) x.classList.add("wrong");
      });
      var correctText = "Correct: " + q.answer.map(function (a) { return q.options[a]; }).join(" · ");
      resolve(q, ok, ok ? "" : correctText);
    });
    startTimerIfNeeded(function () { if (!done) { done = true; btn.click(); } });
  }

  /* --- ORDER --- */
  function renderOrder(q) {
    var items = shuffle(q.items);
    var list = items.map(function (it, i) {
      return '<li class="ordItem" data-t="' + esc(it) + '"><span class="drag">⠿</span><span class="otxt">' + esc(it) + '</span>' +
        '<span class="omove"><button class="mv" data-dir="-1" aria-label="Move up">▲</button><button class="mv" data-dir="1" aria-label="Move down">▼</button></span></li>';
    }).join("");
    screen(questionShell(q, '<p class="hint">Drag, or use ▲ ▼ to reorder from first to last.</p><ul class="ordList" id="ordList">' + list + '</ul>'));
    bindQuit();
    var ul = $("#ordList");
    function refresh() {
      $$(".ordItem", ul).forEach(function (li, i) {
        li.querySelector(".mv[data-dir='-1']").disabled = i === 0;
        li.querySelector(".mv[data-dir='1']").disabled = i === ul.children.length - 1;
      });
    }
    ul.addEventListener("click", function (e) {
      var b = e.target.closest(".mv"); if (!b) return;
      var li = b.closest(".ordItem"), dir = +b.dataset.dir;
      if (dir < 0 && li.previousElementSibling) ul.insertBefore(li, li.previousElementSibling);
      if (dir > 0 && li.nextElementSibling) ul.insertBefore(li.nextElementSibling, li);
      SFX.tap(); refresh();
    });
    // pointer drag
    var dragEl = null;
    ul.addEventListener("pointerdown", function (e) {
      var li = e.target.closest(".ordItem"); if (!li) return;
      if (e.target.closest(".mv")) return;
      dragEl = li; li.classList.add("dragging");
      try { li.setPointerCapture(e.pointerId); } catch (err) {}
    });
    ul.addEventListener("pointermove", function (e) {
      if (!dragEl) return;
      e.preventDefault();
      var after = null;
      $$(".ordItem", ul).forEach(function (el) {
        if (el === dragEl) return;
        var r = el.getBoundingClientRect();
        if (e.clientY > r.top && e.clientY < r.bottom) {
          after = (e.clientY < r.top + r.height / 2) ? el : el.nextElementSibling;
        }
      });
      if (after !== dragEl) ul.insertBefore(dragEl, after);
    });
    ul.addEventListener("pointerup", function () { if (dragEl) { dragEl.classList.remove("dragging"); dragEl = null; SFX.tap(); refresh(); } });
    ul.addEventListener("pointercancel", function () { if (dragEl) { dragEl.classList.remove("dragging"); dragEl = null; } });
    refresh();

    var btn = document.createElement("button");
    btn.className = "primary"; btn.textContent = "Lock in order";
    $("#actions").appendChild(btn);
    var done = false;
    btn.addEventListener("click", function () {
      if (done) return; done = true; stopTimer();
      var got = $$(".ordItem", ul).map(function (li) { return li.dataset.t; });
      var ok = got.length === q._correctOrder.length && got.every(function (v, i) { return v === q._correctOrder[i]; });
      $$(".ordItem", ul).forEach(function (li, i) {
        li.classList.add("locked");
        li.classList.add(li.dataset.t === q._correctOrder[i] ? "right" : "wrong");
      });
      resolve(q, ok, ok ? "" : "Correct order: " + q._correctOrder.map(function (x, i) { return (i + 1) + ". " + x; }).join(" → "));
    });
    startTimerIfNeeded(function () { if (!done) btn.click(); });
  }

  /* --- TYPE / CODE --- */
  function renderType(q) {
    var isCode = q.type === "code";
    var body = isCode
      ? '<pre class="code"><code>' + esc(q.code).replace(/_{2,}/g, '<span class="blank">____</span>') + '</code></pre>'
      : "";
    screen(questionShell(q, body +
      '<form class="typeForm" id="typeForm" autocomplete="off">' +
        '<input id="typeInput" class="typeInput' + (isCode ? " mono" : "") + '" placeholder="' + (isCode ? "the missing code" : "your answer") + '" autocapitalize="off" autocorrect="off" spellcheck="false" />' +
      '</form>' +
      '<p class="hint">Enter to submit. Close enough counts.</p>'
    ));
    bindQuit();
    var input = $("#typeInput");
    setTimeout(function () { input.focus(); }, 60);
    var done = false;
    $("#typeForm").addEventListener("submit", function (e) {
      e.preventDefault();
      if (done) return; done = true; stopTimer();
      var v = norm(input.value);
      var ok = !!v && q.answers.some(function (a) { return norm(a) === v; });
      if (!ok && v) {
        // tolerate surrounding punctuation / partial code answers
        ok = q.answers.some(function (a) {
          var na = norm(a);
          return na.length > 2 && (v === na.replace(/[;{}()"']/g, "") || na === v.replace(/[;{}()"']/g, ""));
        });
      }
      input.classList.add(ok ? "right" : "wrong");
      input.disabled = true;
      resolve(q, ok, ok ? "" : "Accepted: " + q.answers[0]);
    });
    startTimerIfNeeded(function () { if (!done) { done = true; input.disabled = true; resolve(q, false, "Out of time! Accepted: " + q.answers[0]); } });
  }

  /* --- MATCH --- */
  function renderMatch(q) {
    var lefts = q.pairs.map(function (p, i) {
      return '<div class="mLeft" data-i="' + i + '"><span class="ml">' + esc(p.left) + '</span><span class="slot" data-i="' + i + '">?</span></div>';
    }).join("");
    var rights = q._rights.map(function (r) {
      return '<button class="mRight" data-r="' + esc(r) + '">' + esc(r) + '</button>';
    }).join("");
    screen(questionShell(q, '<p class="hint">Tap a left item, then tap its match.</p>' +
      '<div class="matchWrap"><div class="mLefts">' + lefts + '</div><div class="mRights">' + rights + '</div></div>'));
    bindQuit();
    var sel = null, assigned = {};
    $$(".mLeft").forEach(function (el) {
      el.addEventListener("click", function () {
        if (el.classList.contains("locked")) return;
        $$(".mLeft").forEach(function (x) { x.classList.remove("sel"); });
        el.classList.add("sel"); sel = el; SFX.tap();
      });
    });
    $$(".mRight").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!sel) { toast("Pick a left item first"); return; }
        var i = sel.dataset.i;
        // free previous holder of this right
        Object.keys(assigned).forEach(function (k) { if (assigned[k] === b.dataset.r) { delete assigned[k]; $('.slot[data-i="' + k + '"]').textContent = "?"; } });
        assigned[i] = b.dataset.r;
        $('.slot[data-i="' + i + '"]').textContent = b.dataset.r;
        sel.classList.remove("sel"); sel = null; SFX.tap();
      });
    });
    var btn = document.createElement("button");
    btn.className = "primary"; btn.textContent = "Check matches";
    $("#actions").appendChild(btn);
    var done = false;
    btn.addEventListener("click", function () {
      if (done) return;
      if (Object.keys(assigned).length < q.pairs.length) { toast("Match every item first"); return; }
      done = true; stopTimer();
      var ok = true;
      q.pairs.forEach(function (p, i) {
        var el = $('.mLeft[data-i="' + i + '"]');
        var right = assigned[i] === p.right;
        el.classList.add("locked", right ? "right" : "wrong");
        if (!right) ok = false;
      });
      resolve(q, ok, ok ? "" : "Correct pairs: " + q.pairs.map(function (p) { return p.left + " → " + p.right; }).join(" | "));
    });
    startTimerIfNeeded(function () { if (!done) btn.click(); });
  }

  /* --- timer --- */
  function startTimerIfNeeded(onTimeout) {
    stopTimer();
    if (!run.modeCfg.timer) return;
    run.timeLeft = run.modeCfg.timer;
    var bar = $("#timerBar");
    var total = run.timeLeft;
    run.timerId = setInterval(function () {
      run.timeLeft -= 0.1;
      if (bar) {
        var i = bar.firstElementChild;
        i.style.width = Math.max(0, (run.timeLeft / total) * 100) + "%";
        if (run.timeLeft < 5) bar.classList.add("low");
      }
      if (run.timeLeft <= 0) { stopTimer(); onTimeout && onTimeout(); }
    }, 100);
  }
  function stopTimer() { if (run && run.timerId) { clearInterval(run.timerId); run.timerId = null; } }

  /* --- resolve a question --- */
  function resolve(q, ok, extra) {
    stopTimer();
    var fb = $("#fb");
    var gained = 0;
    save.totalAsked++;
    save.seen[q.id] = (save.seen[q.id] || 0) + 1;

    if (ok) {
      run.streak++;
      run.bestStreak = Math.max(run.bestStreak, run.streak);
      save.totalCorrect++;
      var base = 10 + q.difficulty * 4;
      var bonus = Math.min(20, run.streak * 2);
      gained = base + bonus;
      if (!save.mastered[q.id]) { gained += 10; save.mastered[q.id] = true; }
      delete save.wrong[q.id];
      SFX.correct();
    } else {
      run.streak = 0;
      run.lives--;
      save.wrong[q.id] = true;
      delete save.mastered[q.id];
      SFX.wrong();
      if (navigator.vibrate) { try { navigator.vibrate(60); } catch (e) {} }
    }
    save.xp += gained;
    save.best[q.topic] = Math.max(save.best[q.topic] || 0, run.streak);
    save.best.global = Math.max(save.best.global || 0, run.streak);
    var d = today();
    save.daily[d] = (save.daily[d] || 0) + 1;
    persist();

    run.answered++; if (ok) run.correct++;
    run.results.push({ id: q.id, ok: ok });

    var combo = run.streak >= 3 ? '<span class="combo">🔥 ' + run.streak + ' streak</span>' : "";
    fb.hidden = false;
    fb.className = "feedback " + (ok ? "good" : "bad");
    fb.innerHTML =
      '<div class="fbHead">' + (ok ? "✅ Correct! <b>+" + gained + " XP</b>" : "❌ Not quite") + combo + '</div>' +
      (extra ? '<div class="fbExtra">' + esc(extra) + '</div>' : "") +
      (q.explain ? '<div class="fbExplain">💡 ' + esc(q.explain) + '</div>' : "");

    var actions = $("#actions");
    actions.innerHTML = "";
    var isLast = run.i >= run.qs.length - 1;
    var outOfLives = run.lives <= 0;
    var next = document.createElement("button");
    next.className = "primary";
    next.textContent = (outOfLives || isLast) ? "See results →" : "Next →";
    actions.appendChild(next);
    next.focus();
    next.addEventListener("click", function () {
      if (outOfLives || isLast) return endRun();
      run.i++; renderQuestion();
    });
    // keyboard shortcut: space / enter
    document.onkeydown = function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.onkeydown = null; next.click(); }
    };
  }

  /* --- end --- */
  function endRun(quit) {
    stopTimer();
    document.onkeydown = null;
    var secs = Math.round((Date.now() - run.startTime) / 1000);
    var acc = run.answered ? Math.round((run.correct / run.answered) * 100) : 0;
    var isBest = run.score === undefined;
    var title = acc >= 90 ? "Untouchable! 🏆" : acc >= 75 ? "Sharp work! 🎯" : acc >= 50 ? "Getting there 💪" : "Keep grinding 🔁";
    if (quit) title = "Round ended";

    var wrongIds = run.results.filter(function (r) { return !r.ok; }).map(function (r) { return r.id; });
    var reviewList = wrongIds.slice(0, 8).map(function (id) {
      var q = ALL.filter(function (x) { return x.id === id; })[0];
      return q ? '<li>' + esc(q.q) + '</li>' : "";
    }).join("");

    screen(
      header() +
      '<main class="results">' +
        '<div class="resCard">' +
          '<h1>' + title + '</h1>' +
          '<div class="resGrid">' +
            '<div><b>' + run.correct + '/' + run.answered + '</b><span>correct</span></div>' +
            '<div><b>' + acc + '%</b><span>accuracy</span></div>' +
            '<div><b>' + run.bestStreak + '</b><span>best streak</span></div>' +
            '<div><b>' + secs + 's</b><span>time</span></div>' +
          '</div>' +
          '<p class="resTopic">' + esc(topicName(run.topic)) + ' · ' + run.modeCfg.label + '</p>' +
          (reviewList ? '<div class="review"><h3>Worth another look</h3><ul>' + reviewList + '</ul></div>' : '<p class="allgood">Flawless - nothing to review 🎉</p>') +
          '<div class="resActions">' +
            '<button class="primary" id="againBtn">Play again</button>' +
            '<button class="ghost" id="homeBtn">Home</button>' +
          '</div>' +
        '</div>' +
      '</main>'
    );
    if (acc >= 90) SFX.level();
    $("#againBtn").addEventListener("click", function () { startRun(run.topic, run.mode); });
    $("#homeBtn").addEventListener("click", home);
  }

  /* --- toast --- */
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 1900);
  }

  /* --- level-up watcher --- */
  var lastLevel = levelOf(save.xp);
  setInterval(function () {
    var l = levelOf(save.xp);
    if (l > lastLevel) { lastLevel = l; toast("🎉 Level " + l + "!"); SFX.level(); }
  }, 1200);

  /* --- boot --- */
  home();
})();
