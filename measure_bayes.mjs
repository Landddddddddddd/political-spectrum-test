// =============================================================
// 贝叶斯收缩估计器对比仿真（方案 A 验证）
// -------------------------------------------------------------
// 复刻 measure_accuracy 的"自适应选题 + 1/k 加权计分 + 应答模型"，
// 但最后一步的八维坐标估计换成 dimPosOfBayes(counts,key,α)=(n1-n0)/(tot+2α)。
//
// 关键：selectNext 选题只依赖 counts 的 uncertainty（与 α 无关），
// 所以每轮 (N, 测试者) 只跑一次流程，事后用不同 α 复用同一份 counts 算指标 ——
// 不增加流程成本即可得到整条 α 扫描曲线。
//
// α=0 即原朴素估计 (n1-n0)/tot，作为 baseline。
// 指标：八维符号恢复率（用户最在意的"方向判对"）+ 八维 MAE（连续坐标精度）。
// =============================================================

import fs from "fs";

const BANK = JSON.parse(fs.readFileSync("question_bank.json", "utf8"));
const BYID = {}; BANK.forEach(q => BYID[q.id] = q);

const DIMS = [
  { key: "ECO", poles: [{ k: "L" }, { k: "R" }] },
  { key: "GOV", poles: [{ k: "A" }, { k: "L" }] },
  { key: "CUL", poles: [{ k: "T" }, { k: "P" }] },
  { key: "NAT", poles: [{ k: "N" }, { k: "C" }] },
  { key: "ENV", poles: [{ k: "G" }, { k: "S" }] },
  { key: "TECH", poles: [{ k: "K" }, { k: "U" }] },
  { key: "SEC", poles: [{ k: "E" }, { k: "F" }] },
  { key: "COL", poles: [{ k: "I" }, { k: "M" }] },
];

function poleSign(dimKey, pole) {
  const d = DIMS.find(x => x.key === dimKey);
  return pole === d.poles[1].k ? 1 : -1;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260815);
function rand() { return rng(); }

function makeState() {
  const counts = {}; DIMS.forEach(d => { counts[d.key] = {}; d.poles.forEach(p => counts[d.key][p.k] = 0); });
  return { counts, domainCounts: {}, used: new Set(), seq: [] };
}
function addAnswer(st, qid, optIdx) {
  const q = BYID[qid];
  st.domainCounts[q.domain] = (st.domainCounts[q.domain] || 0) + 1;
  const opt = q.options[optIdx];
  opt.tags.forEach(t => {
    const [dim, pole] = t.split(":");
    if (st.counts[dim] && pole in st.counts[dim]) st.counts[dim][pole] += 1;
  });
}
function uncertainty(dim, c) {
  const d = DIMS.find(x => x.key === dim);
  const a = c[d.poles[0].k], b = c[d.poles[1].k];
  const tot = a + b; return tot === 0 ? 1 : 1 - Math.abs(a - b) / (tot + 1);
}
function selectNext(st, mode) {
  const dcount = st.domainCounts;
  const maxD = Math.max(1, ...Object.values(dcount));
  const unc = {}; DIMS.forEach(d => unc[d.key] = uncertainty(d.key, st.counts[d.key]));
  const infoWeight = mode === "long" ? 12 : 5;
  let best = null, bestScore = -1e9;
  for (const q of BANK) {
    if (st.used.has(q.id)) continue;
    const dc = dcount[q.domain] || 0;
    const domainScore = dc === 0 ? 1000 : (maxD - dc) * 10;
    const covered = new Set();
    q.options.forEach(o => o.tags.forEach(t => covered.add(t.split(":")[0])));
    let info = 0; covered.forEach(dim => info += unc[dim]);
    const score = domainScore + info * infoWeight + rand() * 0.01;
    if (score > bestScore) { bestScore = score; best = q; }
  }
  st.used.add(best.id); st.seq.push(best.id);
  return best;
}
function drawTruth() {
  const t = {}; DIMS.forEach(d => { t[d.key] = rand() * 2 - 1; });
  return t;
}
const BETA = 1.2;
function answerQuestion(q, truth) {
  const prefs = q.options.map(o =>
    o.tags.reduce((s, t) => {
      const [dim, pole] = t.split(":");
      return s + (truth[dim] || 0) * poleSign(dim, pole);
    }, 0)
  );
  const maxP = Math.max(...prefs);
  const exps = prefs.map(p => Math.exp(BETA * (p - maxP)));
  const sum = exps.reduce((a, b) => a + b, 0);
  let r = rand() * sum, idx = 0;
  for (; idx < exps.length; idx++) { r -= exps[idx]; if (r <= 0) break; }
  return Math.min(idx, exps.length - 1);
}
function sgn(x) { return x > 0.1 ? 1 : x < -0.1 ? -1 : 0; }
function signRecovery(truth, est) {
  let ok = 0;
  DIMS.forEach(d => { if (sgn(est[d.key]) === sgn(truth[d.key])) ok++; });
  return ok / DIMS.length;
}
// 贝叶斯收缩估计器：α=0 退化为原版 (n1-n0)/tot
function dimPosOfBayes(counts, key, alpha) {
  const d = DIMS.find(x => x.key === key);
  const c = counts[key];
  const n0 = c[d.poles[0].k], n1 = c[d.poles[1].k], tot = n0 + n1;
  return tot === 0 ? 0 : (n1 - n0) / (tot + 2 * alpha);
}

const ALPHAS = [0, 0.5, 1, 2, 4];
const NS = [10, 20, 30, 50, 75, 100, 150, 200, 300, 500];
const NUM_RESP = 400;

console.log("N  | " + ALPHAS.map(a => `acc_a${a}`).join("  ") + "  |  " + ALPHAS.map(a => `mae_a${a}`).join("  "));
const out = [];
for (const N of NS) {
  const sums = {}; ALPHAS.forEach(a => sums[a] = { acc: 0, mae: 0, cov: 0 });
  for (let it = 0; it < NUM_RESP; it++) {
    const truth = drawTruth();
    const st = makeState();
    const mode = N <= 40 ? "short" : "long";
    for (let i = 0; i < N; i++) {
      const q = selectNext(st, mode);
      const ai = answerQuestion(q, truth);
      addAnswer(st, q.id, ai);
    }
    ALPHAS.forEach(a => {
      const est = {}; let m = 0;
      DIMS.forEach(d => { est[d.key] = dimPosOfBayes(st.counts, d.key, a); m += Math.abs(est[d.key] - truth[d.key]); });
      m /= DIMS.length;
      let cv = 0;
      DIMS.forEach(d => { const c = st.counts[d.key]; if ((c[d.poles[0].k] || 0) + (c[d.poles[1].k] || 0) >= 2) cv++; });
      sums[a].acc += signRecovery(truth, est);
      sums[a].mae += m;
      sums[a].cov += cv / DIMS.length;
    });
  }
  const accStr = ALPHAS.map(a => (sums[a].acc / NUM_RESP * 100).toFixed(1).padStart(5)).join("  ");
  const maeStr = ALPHAS.map(a => (sums[a].mae / NUM_RESP).toFixed(3)).join("  ");
  console.log(`${String(N).padStart(4)} | ${accStr}  |  ${maeStr}`);
  const row = { n: N };
  ALPHAS.forEach(a => { row['acc_a' + a] = Math.round(sums[a].acc / NUM_RESP * 1000) / 10; row['mae_a' + a] = Math.round(sums[a].mae / NUM_RESP * 1000) / 1000; });
  out.push(row);
}
fs.writeFileSync("measure_bayes.out.json", JSON.stringify(out, null, 2));
console.log("\n已写入 measure_bayes.out.json");
