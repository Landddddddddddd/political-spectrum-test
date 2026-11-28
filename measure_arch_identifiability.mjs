// 量化：意识形态类别数 120 → 200 对「Top-1 可辨识度」的影响
// 方法：复刻线上 contScore，对每条意识形态取其理想向量作为真值，叠加测量噪声 σ，
//       统计真值能否在全部类别中排到 Top-1（还原率）。σ 越小≈题量越多、测量越准。
import fs from 'fs';
const BASE = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const DIMS = ["ECO","GOV","CUL","NAT","ENV","TECH","SEC","COL"];
const POLES = { ECO:["L","R"], GOV:["A","L"], CUL:["T","P"], NAT:["N","C"],
                ENV:["G","S"], TECH:["K","U"], SEC:["E","F"], COL:["I","M"] };

const ARCH = JSON.parse(fs.readFileSync(BASE + 'arch_data.json', 'utf8'));

// 复刻 archIdealVec：need → -1/+1，未定义维度 → 0
function idealVec(a) {
  const v = {};
  for (const d of DIMS) {
    const need = a.need && a.need[d];
    if (!need) { v[d] = 0; continue; }
    const idx = POLES[d].indexOf(need);
    v[d] = idx === 0 ? -1 : 1;
  }
  return v;
}
// 复刻 contScore
function contScore(a, u) {
  const iv = idealVec(a);
  let sum = 0, penalty = 0;
  for (const d of DIMS) {
    const t = iv[d];
    sum += 1 - Math.abs(u[d] - t) / 2;
    if (a.need && a.need[d] && Math.abs(u[d]) > 0.3) {
      const userPole = u[d] > 0 ? POLES[d][1] : POLES[d][0];
      if (userPole !== a.need[d]) penalty += 0.01 * Math.abs(u[d]);
    }
  }
  return sum / DIMS.length + Object.keys(a.need || {}).length * 0.0005 - penalty;
}

// 简易可复现随机
let seed = 20261002;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
function gauss() { // Box-Muller
  const u1 = Math.max(rnd(), 1e-9), u2 = rnd();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function run(pool, sigma, trials) {
  let hit1 = 0, hit3 = 0, total = 0;
  const perArch = new Map();
  for (const a of pool) {
    const iv = idealVec(a);
    let h1 = 0;
    for (let t = 0; t < trials; t++) {
      const u = {};
      for (const d of DIMS) u[d] = Math.max(-1, Math.min(1, iv[d] + gauss() * sigma));
      const ranked = pool.map(x => ({ x, s: contScore(x, u) })).sort((p, q) => q.s - p.s);
      if (ranked[0].x.name === a.name) { hit1++; h1++; }
      if (ranked.slice(0, 3).some(r => r.x.name === a.name)) hit3++;
      total++;
    }
    perArch.set(a.name, h1 / trials);
  }
  return { top1: hit1 / total, top3: hit3 / total, perArch };
}

const pool120 = ARCH.slice(0, 120);
const pool200 = ARCH;

console.log('===== 意识形态可辨识度仿真（N=' + ARCH.length + ' 条，每条 60 次采样）=====');
console.log('σ 越小 ≈ 题量越多、八维测量越精确\n');
console.log('σ      | 120条 Top-1 | 200条 Top-1 | 200条 Top-3 | 差异');
console.log('-------|-------------|-------------|-------------|------');
for (const sigma of [0.15, 0.25, 0.35, 0.5, 0.7]) {
  const r120 = run(pool120, sigma, 60);
  const r200 = run(pool200, sigma, 60);
  const diff = ((r200.top1 - r120.top1) * 100).toFixed(1);
  console.log(
    String(sigma).padEnd(6) + ' | ' +
    (r120.top1 * 100).toFixed(1).padStart(10) + '% | ' +
    (r200.top1 * 100).toFixed(1).padStart(10) + '% | ' +
    (r200.top3 * 100).toFixed(1).padStart(10) + '% | ' +
    (diff > 0 ? '+' : '') + diff + ' pt'
  );
}

// 200 条里还原率最低的若干条（可能被邻近条目压住）
const r = run(pool200, 0.35, 60);
const worst = [...r.perArch.entries()].sort((a, b) => a[1] - b[1]).slice(0, 12);
console.log('\n===== 200条中 Top-1 还原率最低的 12 条（σ=0.35）=====');
for (const [n, v] of worst) {
  const a = ARCH.find(x => x.name === n);
  console.log('  ' + (v * 100).toFixed(0).padStart(3) + '%  ' + n.padEnd(12) +
    ' [' + Object.entries(a.need || {}).map(([k, p]) => k + ':' + p).join(' ') + ']');
}
