/* Test the typed/code answer matching exactly as the app does it.
 * The grading functions are READ OUT OF src/app.js, not copied, so this test
 * can never drift away from the real implementation. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, 'src', 'app.js'), 'utf8');

/* Pull the helper definitions out of the real source and eval them. */
function grab(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('cannot find ' + name + ' in src/app.js');
  let depth = 0, i = src.indexOf('{', start), inRe = false, inStr = null;
  // skip the parameter list so a default like { pre: "", post: "" } is not counted
  let pDepth = 0, k = src.indexOf('(', start);
  for (; k < src.length; k++) {
    if (src[k] === '(') pDepth++;
    else if (src[k] === ')') { pDepth--; if (pDepth === 0) break; }
  }
  i = src.indexOf('{', k);
  for (let j = i; j < src.length; j++) {
    const c = src[j], prev = src[j - 1];
    if (inRe) { if (c === '/' && prev !== '\\') inRe = false; continue; }
    if (inStr) { if (c === inStr && prev !== '\\') inStr = null; continue; }
    if (c === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); if (j < 0) break; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '/' && /[=(,:!&|?{};\n]\s*$/.test(src.slice(Math.max(0, j - 6), j))) { inRe = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(start, j + 1); }
  }
  throw new Error('unbalanced braces for ' + name);
}

const helperNames = ["norm","blankAffix","stripTrail","looseCode","codeMatches","callMatches","synonymMatch","containsMatch","editDistance","gradeTyped"];
let helpers = helperNames.map(n => (src.includes('function ' + n + '(') ? grab(n) : null)).filter(Boolean).join('\n');
// constant tables (SYNONYMS, KNOWN_OBJECTS) are var blocks - copy them verbatim
['var SYNONYMS = {', 'var KNOWN_OBJECTS = ['].forEach(function (marker) {
  const st = src.indexOf(marker);
  if (st < 0) return;
  const open = src[st + marker.length - 1];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  for (let j = st + marker.length - 1; j < src.length; j++) {
    if (src[j] === open) depth++;
    else if (src[j] === close) { depth--; if (depth === 0) { helpers = src.slice(st, j + 1) + '\n' + helpers; break; } }
  }
});

global.window = {};
require('./data/questions.js');
const QS = window.QUESTION_BANK.questions;
const sandbox = { console, q: null };
vm.createContext(sandbox);
vm.runInContext(helpers, sandbox);

/* gradeTyped(q, raw) is the single entry point the UI uses. */
function grade(q, raw) {
  sandbox.q = q;
  return vm.runInContext('gradeTyped(__q, __raw)', Object.assign(sandbox, { __q: q, __raw: raw }));
}

const q = id => QS.filter(x => x.id === id)[0];

const cases = [
  // [question id, typed answer, should it be accepted?]
  ["db8", "next", true],
  ["db8", "next()", true],
  ["db8", " next ", true],
  ["db8", "NEXT", true],
  ["db8", "next();", true],
  ["db8", "rs.next()", true],
  ["db8", "previous", false],
  ["db8", "hasNext", false],

  ["fo12", "getParameter", true],
  ["fo12", "getParameter()", true],
  ["fo12", "Getparameter", true],
  ["fo12", "getParameter(\"loginid\")", true],
  ["fo12", "getParameterValues", false],

  ["db2", "getConnection", true],
  ["db2", "DriverManager.getConnection", true],
  ["db2", "getConnection()", true],
  ["db2", "createStatement", false],

  ["jsp6", "<%=", true],
  ["jsp6", "<% =", true],
  ["jsp6", "<%", false],
  ["jsp6", "=", false],

  ["jsp5", "<%!", true],
  ["jsp5", "<%", true],
  ["jsp5", "<% ", true],
  ["jsp5", "<%=", false],

  ["pr9", "%", true],
  ["pr9", "%>", true],
  ["pr9", "page", false],

  ["se3", "setAttribute", true],
  ["se3", "setAttribute()", true],
  ["se3", "session.setAttribute", true],
  ["se3", "getAttribute", false],

  ["se10", "60", true],
  ["se10", "60;", true],
  ["se10", "1000", false],

  ["db13", "?", true],
  ["db13", "?, ?", true],
  ["db13", "?,?", true],
  ["db13", "??", true],
  ["db13", "'?'", true],
  ["db13", "*", false],

  ["db18", "jspg", true],
  ["db18", "JSPG", true],
  ["db18", "jspg;", true],
  ["db18", "db1", false],

  ["db21", "prepareCall", true],
  ["db21", "prepareCall()", true],
  ["db21", "prepareStatement", false],

  ["se22", "displayinmyjsp1.jsp", true],
  ["se22", "\"displayinmyjsp1.jsp\"", true],
  ["se22", "displayinmyjsp1.jsp;", true],
  ["se22", "displayinmyjsp2.jsp", false],

  ["jsp19", "contentType", true],
  ["jsp19", "contentType;", true],
  ["jsp19", "pageEncoding", false],

  ["je9", "tier", true],
  ["je9", "Tier", true],
  ["je9", "tiers", true],
  ["je9", "layer", false],

  ["jsp10", "jspf", true],
  ["jsp10", ".jspf", true],
  ["jsp10", "jsp", false],

  ["jsp17", "JspWriter", true],
  ["jsp17", "jakarta.servlet.jsp.JspWriter", true],
  ["jsp17", "PrintWriter", false],

  ["fo15", "out", true],
  ["fo15", "Out", true],
  ["fo15", "system.out", false],

  ["fo19", "setCharacterEncoding", true],
  ["fo19", "setCharacterEncoding(\"UTF-8\")", true],
  ["fo19", "setEncoding", false],

  ["db11", "WHERE", true],
  ["db11", "where", true],
  ["db11", "set", false],

  ["db27", "sql", true],
  ["db27", "java.sql", true],
  ["db27", "jdbc", false],

  ["se21", "sessionScope", true],
  ["se21", "${sessionScope.favColor}", true],
  ["se21", "requestScope", false],

  ["pr14", "sendRedirect", true],
  ["pr14", "sendRedirect()", true],
  ["pr14", "forward", false],

  ["pr19", "db1", true],
  ["pr19", "jspg", true],
  ["pr19", "member", false],

  // typo tolerance applies to plain words only
  ["fo19", "setCharacterEncodign", true],
  ["je9", "teir", false],

  // empty input is never accepted
  ["db8", "", false],
  ["db8", "   ", false],
];

let fail = 0;
for (const [id, typed, want] of cases) {
  const qq = q(id);
  if (!qq) { console.log("MISSING QUESTION", id); fail++; continue; }
  let got;
  try { got = grade(qq, typed); } catch (e) { got = "ERROR: " + e.message; }
  if (got !== want) {
    fail++;
    console.log(`FAIL  ${id} (${qq.type})  typed=${JSON.stringify(typed)}  expected=${want}  got=${got}`);
  }
}
console.log(fail === 0 ? `All ${cases.length} grading cases passed.` : `${fail} of ${cases.length} FAILED`);
process.exit(fail === 0 ? 0 : 1);
