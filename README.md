# ☕ J2EE Quiz Arena

A gamified revision game for **ST0510 J2EE Application Development (JAD)** — built from the lecture slides (Topics 1–4) and Practicals 1–4.

**Live app:** open `index.html` in any browser, or host the folder anywhere static (GitHub Pages works out of the box).

---

## What's inside

| Topic | Questions |
|---|---|
| 🏛️ Jakarta EE & Architecture | 15 |
| 📄 JSP Basics | 20 |
| 📝 Forms & Implicit Objects | 20 |
| 🗄️ JDBC & Database Access | 27 |
| 🍪 Session Management | 24 |
| 🧪 Practicals & Code Traps | 20 |
| **Total** | **126** |

### Question types (all of them)

- **MCQ** — single correct answer, options shuffled each run
- **Multiple answers** — select all that apply, exact set required
- **Ordering** — drag & drop (or ▲▼ buttons) to arrange steps correctly
- **Typing** — free-text answer, normalised (case/space tolerant)
- **Code fill** — complete a real JSP/JDBC snippet, e.g. `request.______("id")`
- **Matching** — pair implicit objects to their Java types, cookie attributes to effects

### Game modes

| Mode | Lives | Timer | Length |
|---|---|---|---|
| **Focus** | 5 ❤️ | none | 12 questions |
| **Mixed Mock** | 5 ❤️ | none | 12 questions from every topic |
| **Blitz** | 3 ❤️ | 20s per question | 15 questions |
| **Endless** | 3 ❤️ | none | until you drop |
| **Review** | 5 ❤️ | none | only the questions you got wrong |

### Progression

- **XP** — 10 + (difficulty × 4) per correct answer, plus a streak bonus (capped at +20)
- **First-time mastery bonus** — +10 XP the first time a question is answered correctly
- **Levels** — `level = floor(sqrt(XP / 60)) + 1`
- **Streaks** — per-run combo counter and an all-time best
- **Mastery bars** — each topic shows how many of its questions you've answered correctly
- **Wrong-answer bank** — anything missed goes back into rotation and into Review
- Everything persists in `localStorage`, so progress survives a refresh and a phone restart

### Mobile first

- Responsive from 320px up; safe-area insets for notched phones
- Big tap targets, no hover-only affordances
- Ordering works with **touch drag** and with ▲▼ buttons
- `Add to Home Screen` friendly (theme colour + web-app meta tags)
- Sound effects via WebAudio (no audio files), toggleable; respects `prefers-reduced-motion`

---

## Files

```
index.html            entry point
data/questions.js     the whole question bank (edit this to add questions)
src/app.js            game engine (vanilla JS, no dependencies)
src/styles.css        all styling
sources/              the original lecture decks and practicals the questions came from
```

No build step, no npm install, no framework. Just open it.

---

## Adding your own questions

Append to the `questions` array in `data/questions.js`:

```js
{
  id: "my1", topic: "db", type: "mcq", difficulty: 2,
  q: "Your question text?",
  options: ["Correct", "Wrong A", "Wrong B", "Wrong C"],
  answer: 0,                       // index of the correct option
  explain: "Why that is right."
}
```

Other shapes:

```js
// multiple answers — answer is an array of indexes
{ id:"m1", topic:"jsp", type:"multi", difficulty:2, q:"...", options:[...], answer:[0,2], explain:"..." }

// ordering — items are listed in the CORRECT order; the game shuffles them
{ id:"o1", topic:"db", type:"order", difficulty:2, q:"...", items:["first","second","third"], explain:"..." }

// typing — any listed answer matches (case/space insensitive)
{ id:"t1", topic:"forms", type:"type", difficulty:1, q:"...", answers:["out"], explain:"..." }

// code fill — blanks in `code` are written as ______
{ id:"c1", topic:"db", type:"code", difficulty:1, code:"rs.______()", answers:["next"], explain:"..." }

// matching — pairs are shuffled on the right
{ id:"x1", topic:"forms", type:"match", difficulty:2, q:"...", pairs:[{left:"request",right:"HttpServletRequest"}], explain:"..." }
```

Topic ids: `javaee`, `jsp`, `forms`, `db`, `session`, `pract`.

---

## Publishing on GitHub Pages

1. Push this folder to the repo.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
3. Open `https://<user>.github.io/<repo>/` on your phone.

---

## Source material

`sources/` holds the decks and practicals the bank was written from:

- `Topic1-Intro to Java EE.pptx` — Jakarta EE, two-tier vs multi-tier, layers
- `Topic2-Intro to JSP Technology_v3.pptx` — translation, scripting elements, directives, implicit objects, form processing
- `Topic3-Database Access_v2.pptx` — the 7 JDBC steps, ResultSet, CRUD SQL, PreparedStatement, stored procedures
- `Topic4-Session Management_v2.pptx` — cookies, URL rewriting, HttpSession, timeouts, session security
- `ST0510-JAD-Practical1_20261018.doc` — Eclipse/TomEE setup, MySQL schema, member table
- `ST0510-JAD-Practical2_20261018.docx` — JSP login form, `getParameter`, redirect with `errCode`, multiplication table
- `ST0510-JAD-Practical3_20251016.pdf` — checkboxes, expression tags, include directive, page directive import
- `ST0510-JAD-Practical4_20250411.pdf` — JDBC in JSP, login against DB, dynamic HTML tables, edit/update flow
