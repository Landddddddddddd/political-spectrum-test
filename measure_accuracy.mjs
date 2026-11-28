// =============================================================
// 实测精度仿真（替换开屏 estAccuracy 的模型估算）
// -------------------------------------------------------------
// 方法：
//  1) 为每个「模拟测试者」抽取真实八维立场 truth[k] ∈ [-1,1]（均匀，保守假设）。
//  2) 用与线上完全一致的「自适应选题 + 1/k 加权计分 + dimPosOf 折算」得到估计 est[k]。
//     选题顺序依赖已作答内容（不确定性驱动），故逐题：选→答→再选。
//  3) 应答模型（Luce/softmax）：某选项对齐度 = Σ_{tag} truth[dim]·sign(pole)，
//     以 softmax(β·对齐度) 概率抽样作答；β 控制噪声（越小越随机）。
//  4) 精度指标 = 八维「符号恢复率」：sign(est) 与 sign(truth) 一致即算该维正确
//     （|x|≤0.1 判为居中，居中/居中一致算正确）。这是用户最在意的「方向有没有判对」。
//  5) 在多个题量截断点 N 上重复 NUM_RESP 次，取平均 → 实测精度曲线 MEASURED。
//
// 输出：控制台打印逐档表；并把 MEASURED 数组写入 measure_accuracy.out.json 供接入。
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

// 复刻 app：pole 方向（pole1 记 +1，pole0 记 -1）
function poleSign(dimKey, pole) {
  const d = DIMS.find(x => x.key === dimKey);
  return pole === d.poles[1].k ? 1 : -1;
}

// ---- 可复现随机数（mulberry32） ----
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

// ---- 复刻 app 计分（增量维护，等价于 recomputeDimCounts 单选取 k=1） ----
function makeState() {
  const counts = {}; DIMS.forEach(d => { counts[d.key] = {}; d.poles.forEach(p => counts[d.key][p.k] = 0); });
  const domainCounts = {};
  const used = new Set();
  return { counts, domainCounts, used, seq: [] };
}
function addAnswer(st, qid, optIdx) {
  const q = BYID[qid];
  st.domainCounts[q.domain] = (st.domainCounts[q.domain] || 0) + 1;
  const opt = q.options[optIdx];
  opt.tags.forEach(t => {
    const [dim, pole] = t.split(":");
    if (st.counts[dim] && pole in st.counts[dim]) st.counts[dim][pole] += 1; // 单选取1
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
function dimPosOf(counts, key) {
  const d = DIMS.find(x => x.key === key);
  const c = counts[key];
  const n0 = c[d.poles[0].k], n1 = c[d.poles[1].k], tot = n0 + n1;
  return tot === 0 ? 0 : (n1 - n0) / tot;
}

// ---- 模拟测试者 ----
const BETA = 1.2; // 噪声：小→更随机；大→更确定
function drawTruth() {
  const t = {};
  DIMS.forEach(d => { t[d.key] = rand() * 2 - 1; }); // 均匀 [-1,1]
  return t;
}
function answerQuestion(q, truth) {
  // 计算每个选项对齐度 → softmax 抽样
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

// ---- 符号恢复率 ----
function sgn(x) { return x > 0.1 ? 1 : x < -0.1 ? -1 : 0; }
function signRecovery(truth, est) {
  let ok = 0;
  DIMS.forEach(d => { if (sgn(est[d.key]) === sgn(truth[d.key])) ok++; });
  return ok / DIMS.length;
}

// ---- 主仿真 ----
const NS = [10, 20, 30, 50, 75, 100, 150, 200, 300, 500];
const NUM_RESP = 400;

const MEASURED = [];
console.log("题量 | 平均符号恢复率 | 维度覆盖 | 平均MAE(八维) | 耗时(s)");
for (const N of NS) {
  const t0 = Date.now();
  let accSum = 0, maeSum = 0, covSum = 0;
  for (let it = 0; it < NUM_RESP; it++) {
    const truth = drawTruth();
    const st = makeState();
    const mode = N <= 40 ? "short" : "long";
    for (let i = 0; i < N; i++) {
      const q = selectNext(st, mode);
      const ai = answerQuestion(q, truth);
      addAnswer(st, q.id, ai);
    }
    const est = {}; let mae = 0;
    DIMS.forEach(d => {
      est[d.key] = dimPosOf(st.counts, d.key);
      mae += Math.abs(est[d.key] - truth[d.key]);
    });
    mae /= DIMS.length;
    let cov = 0;
    DIMS.forEach(d => {
      const c = st.counts[d.key];
      if ((c[d.poles[0].k] || 0) + (c[d.poles[1].k] || 0) >= 2) cov++;
    });
    accSum += signRecovery(truth, est);
    maeSum += mae;
    covSum += cov / DIMS.length;
  }

  const acc = (accSum / NUM_RESP) * 100;
  const mae = maeSum / NUM_RESP;
  const dims = (covSum / NUM_RESP) * 8;
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`${String(N).padStart(4)} |   ${acc.toFixed(1).padStart(5)}%   |  ${dims.toFixed(2).padStart(4)}/8  |   ${mae.toFixed(3)}   | ${dt}`);
  MEASURED.push({ n: N, acc: Math.round(acc * 10) / 10, dims: Math.round(dims * 10) / 10, mae: Math.round(mae * 1000) / 1000 });
}

fs.writeFileSync("measure_accuracy.out.json", JSON.stringify(MEASURED, null, 2));
console.log("\nMEASURED 数组（已写入 measure_accuracy.out.json）：");
console.log(JSON.stringify(MEASURED));
