// =============================================================
// 实测精度仿真 · 120 类意识形态 Top-k 命中率
// -------------------------------------------------------------
// 完全复用线上当前算法（与 ideology-test-adaptive.html v1.14+ 一致）：
//   · 八维 DIMS / archIdealVec / contScore(V5 误匹配惩罚) / dominantPoles /
//     binaryScore / rankArch / recomputeDimCounts(1/k 多选加权) / selectNext
//   · 自适应双模式：TOTAL<=40 走 short(二值签名)，否则 long(连续坐标)
// 方法：
//   1) 抽真实八维立场 truth[k]∈[-1,1]（均匀，与开屏仿真一致）。
//   2) 真值标签 = 与该 truth 最契合的意识形态（用 contScore 在同一 truth 上求值）。
//   3) 用同一 truth 跑真实自适应测试（选题→softmax 应答→计分），逐题推进，
//      在题量截断点 {15,30,50,100,200,540} 冻结状态、做 rankArch 排序。
//   4) 命中 = 真值标签是否落在 Top-k（k=1/5/10）。
//   5) 每截断点 NUM_RESP 次均值 → 实测 Top-k 命中率。
// 单次模拟跑满 540 题，在各截断点检查点采样（避免重复模拟），节省算力。
// 输出：控制台逐档表 + measure_topk.out.json
// =============================================================

import fs from "fs";

const BANK = JSON.parse(fs.readFileSync("question_bank.json", "utf8"));
const ARCH = JSON.parse(fs.readFileSync("arch_data.json", "utf8"));
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
function dimPosOf(counts, key) {
  const d = DIMS.find(x => x.key === key);
  const c = counts[key];
  const n0 = c[d.poles[0].k], n1 = c[d.poles[1].k], tot = n0 + n1;
  return tot === 0 ? 0 : (n1 - n0) / tot;
}
function uncertainty(dim, c) {
  const d = DIMS.find(x => x.key === dim);
  const a = c[d.poles[0].k], b = c[d.poles[1].k];
  const tot = a + b; return tot === 0 ? 1 : 1 - Math.abs(a - b) / (tot + 1);
}
function archIdealVec(a) {
  const v = {};
  DIMS.forEach(d => {
    const need = a.need ? a.need[d.key] : undefined;
    if (!need) { v[d.key] = 0; return; }
    const idx = d.poles.findIndex(p => p.k === need);
    v[d.key] = idx === 0 ? -1 : 1;
  });
  return v;
}
// 连续相似度（复刻 contScore；可吃任意 counts 或 truth 向量）
function contScore(a, posOf) {
  const iv = archIdealVec(a);
  let sum = 0, mismatchPenalty = 0;
  DIMS.forEach(d => {
    const u = posOf(d.key), t = iv[d.key];
    sum += 1 - Math.abs(u - t) / 2;
    if (a.need && a.need[d.key] && Math.abs(u) > 0.3) {
      const userPole = u > 0 ? d.poles[1].k : d.poles[0].k;
      if (userPole !== a.need[d.key]) mismatchPenalty += 0.01 * Math.abs(u);
    }
  });
  const baseScore = sum / DIMS.length;
  const specificityBonus = Object.keys(a.need || {}).length * 0.0005;
  return baseScore + specificityBonus - mismatchPenalty;
}
function dominantPoles(counts) {
  const res = {};
  const EPS = 0.001;
  DIMS.forEach(d => {
    const c = counts[d.key]; let best = null, bestN = -1e9, tie = false;
    d.poles.forEach(p => { const n = c[p.k];
      if (n > bestN + EPS) { bestN = n; best = p.k; tie = false; }
      else if (Math.abs(n - bestN) < EPS && n > EPS) tie = true; });
    res[d.key] = (bestN <= EPS || tie) ? "混合" : best;
  });
  return res;
}
function binaryScore(a, res) {
  let s = 0;
  for (const k in a.need) {
    const u = res[k];
    if (u === "混合") continue;
    if (u === a.need[k]) s++; else s--;
  }
  return s;
}
function rankArch(counts, TOTAL) {
  const res = dominantPoles(counts);
  if (TOTAL <= 40) {
    return ARCH.map(a => ({ a, score: binaryScore(a, res) })).sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score;
      return Object.keys(y.a.need).length - Object.keys(x.a.need).length;
    });
  }
  return ARCH.map(a => ({ a, score: contScore(a, k => dimPosOf(counts, k)) }))
             .sort((x, y) => y.score - x.score);
}

// ---- 可复现随机（mulberry32） ----
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

// ---- 自适应选题（复刻 selectNext，operate on st） ----
function buildDomainCounts(st) {
  const m = {}; st.seq.forEach(id => { const d = BYID[id].domain; m[d] = (m[d] || 0) + 1; }); return m;
}
function recomputeDimCounts(st) {
  const counts = {}; DIMS.forEach(d => { counts[d.key] = {}; d.poles.forEach(p => counts[d.key][p.k] = 0); });
  st.seq.forEach(id => {
    const sel = st.answers[id] || [];
    if (!sel.length) return;
    const w = 1 / sel.length;
    sel.forEach(ai => BYID[id].options[ai].tags.forEach(t => {
      const [dim, pole] = t.split(":");
      if (counts[dim] && pole in counts[dim]) counts[dim][pole] += w;
    }));
  });
  return counts;
}
function selectNext(st) {
  const dcount = buildDomainCounts(st);
  const dimc = recomputeDimCounts(st);
  const used = st.used;
  const maxD = Math.max(1, ...Object.values(dcount));
  const unc = {}; DIMS.forEach(d => unc[d.key] = uncertainty(d.key, dimc[d.key]));
  const mode = st.total <= 40 ? "short" : "long";
  const infoWeight = mode === "long" ? 12 : 5;
  let best = null, bestScore = -1e9;
  BANK.forEach(q => {
    if (used.has(q.id)) return;
    const dc = dcount[q.domain] || 0;
    const domainScore = dc === 0 ? 1000 : (maxD - dc) * 10;
    const covered = new Set();
    q.options.forEach(o => o.tags.forEach(t => covered.add(t.split(":")[0])));
    let info = 0; covered.forEach(dim => info += unc[dim]);
    const score = domainScore + info * infoWeight + rand() * 0.01;
    if (score > bestScore) { bestScore = score; best = q; }
  });
  used.add(best.id); st.seq.push(best.id);
  return best;
}

// ---- 模拟测试者 ----
const BETA = 1.2;
function drawTruth() {
  const t = {};
  DIMS.forEach(d => { t[d.key] = rand() * 2 - 1; });
  return t;
}
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
function trueLabel(truth) {
  let best = null, bestS = -1e9;
  ARCH.forEach(a => {
    const s = contScore(a, k => truth[k] || 0);
    if (s > bestS) { bestS = s; best = a; }
  });
  return best;
}

// ---- 主仿真 ----
const CHECKPOINTS = [15, 30, 50, 100, 200, 540];
const NUM_RESP = 220;
const MAXN = 540;

// hits[k] = 每截断点的命中数累计；k=1/5/10
const hits = {}; [1, 5, 10].forEach(k => hits[k] = {});
CHECKPOINTS.forEach(N => [1, 5, 10].forEach(k => hits[k][N] = 0));

console.log("Top-k 命中率仿真（复刻当前线上算法 · seed=20260815 · 候答β=1.2）");
console.log("题量 |  Top-1   |  Top-5   |  Top-10  | 耗时(s)");

for (let it = 0; it < NUM_RESP; it++) {
  const truth = drawTruth();
  const label = trueLabel(truth);
  const st = { seq: [], answers: {}, used: new Set(), total: MAXN };
  for (let i = 0; i < MAXN; i++) {
    const q = selectNext(st);
    const ai = answerQuestion(q, truth);
    st.answers[q.id] = [ai];
    const done = i + 1;
    if (CHECKPOINTS.includes(done)) {
      const counts = recomputeDimCounts(st);
      const ranked = rankArch(counts, done);
      const idx = ranked.findIndex(x => x.a === label);
      [1, 5, 10].forEach(k => { if (idx >= 0 && idx < k) hits[k][done]++; });
    }
  }
}

const OUT = [];
const t0 = Date.now();
console.log("\n========== 实测 Top-k 命中率（%）==========");
console.log("题量 |  Top-1   |  Top-5   |  Top-10");
for (const N of CHECKPOINTS) {
  const t1 = ((N === 540 ? (Date.now() - t0) : 0) / 1000).toFixed(1);
  const r1 = (hits[1][N] / NUM_RESP * 100);
  const r5 = (hits[5][N] / NUM_RESP * 100);
  const r10 = (hits[10][N] / NUM_RESP * 100);
  console.log(`${String(N).padStart(4)} | ${r1.toFixed(1).padStart(6)}% | ${r5.toFixed(1).padStart(6)}% | ${r10.toFixed(1).padStart(6)}%${N === 540 ? " | " + t1 : ""}`);
  OUT.push({ n: N, top1: Math.round(r1 * 10) / 10, top5: Math.round(r5 * 10) / 10, top10: Math.round(r10 * 10) / 10 });
}
fs.writeFileSync("measure_topk.out.json", JSON.stringify(OUT, null, 2));
console.log("\nTOPK 数组（已写入 measure_topk.out.json）：");
console.log(JSON.stringify(OUT));
