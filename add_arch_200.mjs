// 将新增 80 条意识形态合并进 arch_data.json（120 → 200）
// 用法：node add_arch_200.mjs --write    （不带 --write 只做冲突校验，不写入）
import fs from 'fs';
const BASE = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const DIMS = ["ECO","GOV","CUL","NAT","ENV","TECH","SEC","COL"];

// 维度极 → 英文描述短语（与现有 120 条 desc_en 的句式一致）
const PH = {
 "ECO:L":"economic equality and redistribution", "ECO:R":"free-market economics",
 "GOV:A":"centralized authority and order", "GOV:L":"liberty and decentralized governance",
 "CUL:T":"traditional cultural values", "CUL:P":"culturally progressive pluralism",
 "NAT:N":"national priority", "NAT:C":"international openness",
 "ENV:G":"development-first pragmatism", "ENV:S":"ecology-first stewardship",
 "TECH:K":"centralized technological control", "TECH:U":"privacy autonomy in technology",
 "SEC:E":"secular public life", "SEC:F":"faith in public life",
 "COL:I":"individual priority", "COL:M":"community priority",
};
const sig = a => DIMS.map(d => (a.need && a.need[d]) || '-').join('|');
const mkDescEn = a => {
  const ps = DIMS.filter(d => a.need && a.need[d]).map(d => PH[d + ':' + a.need[d]]);
  return 'Advocates ' + ps.join(', ') + '.';
};

const cur = JSON.parse(fs.readFileSync(BASE + 'arch_data.json', 'utf8'));
const b1 = (await import('./_arch_new_batch1.js')).default;
const b2 = (await import('./_arch_new_batch2.js')).default;
const added = [...b1, ...b2];
console.log('现有 =', cur.length, ' 新增 =', added.length, ' 合并后 =', cur.length + added.length);

// ---- 校验 1：中文名重复 ----
const curNames = new Set(cur.map(x => x.name));
const dupName = added.filter(x => curNames.has(x.name)).map(x => x.name);
const seen = new Set();
const innerDup = added.filter(x => (seen.has(x.name) ? true : (seen.add(x.name), false))).map(x => x.name);

// ---- 校验 2：英文名重复 ----
const curEn = new Set(cur.map(x => (x.name_en || '').toLowerCase()));
const dupEn = added.filter(x => curEn.has((x.name_en || '').toLowerCase())).map(x => x.name_en);

// ---- 校验 3：need 组合冲突（与现有 / 内部）----
const curSig = new Set(cur.map(sig));
const conflictCur = added.filter(x => curSig.has(sig(x))).map(x => x.name + ' -> ' + sig(x));
const sigMap = new Map();
const conflictInner = [];
for (const x of added) {
  const s = sig(x);
  if (sigMap.has(s)) conflictInner.push(sigMap.get(s) + ' 与 ' + x.name + ' -> ' + s);
  else sigMap.set(s, x.name);
}

// ---- 校验 4：字段完整性 / 非法极 ----
const LEGAL = { ECO:'LR', GOV:'AL', CUL:'TP', NAT:'NC', ENV:'GS', TECH:'KU', SEC:'EF', COL:'IM' };
const badField = [], badPole = [];
for (const x of added) {
  for (const f of ['name','name_en','need','desc','detail','tenets','tenets_en']) if (!x[f]) badField.push(x.name + ' 缺 ' + f);
  for (const [d, p] of Object.entries(x.need || {})) {
    if (!LEGAL[d]) badPole.push(x.name + ' 非法维度 ' + d);
    else if (!LEGAL[d].includes(p)) badPole.push(x.name + ' 非法极 ' + d + ':' + p);
  }
  if (x.tenets_en && x.tenets_en.some(t => /[\u4e00-\u9fa5]/.test(t))) badField.push(x.name + ' tenets_en 混入中文');
}

console.log('\n===== 校验结果 =====');
console.log('与现有重名 =', dupName.length, dupName.join('、'));
console.log('内部重名   =', innerDup.length, innerDup.join('、'));
console.log('英文名重复 =', dupEn.length, dupEn.join('、'));
console.log('need 与现有冲突 =', conflictCur.length);
conflictCur.forEach(s => console.log('   ⚠ ' + s));
console.log('need 内部冲突   =', conflictInner.length);
conflictInner.forEach(s => console.log('   ⚠ ' + s));
console.log('字段缺失/异常 =', badField.length); badField.forEach(s => console.log('   ⚠ ' + s));
console.log('非法维度或极   =', badPole.length); badPole.forEach(s => console.log('   ⚠ ' + s));

const block = conflictCur.length || conflictInner.length || dupName.length || innerDup.length || dupEn.length || badPole.length;
if (!process.argv.includes('--write')) {
  console.log('\n[dry-run] 未写入。' + (block ? '⚠ 存在阻断性问题，需先修正。' : '✅ 无阻断问题，可加 --write 写入。'));
  process.exit(0);
}
if (block) { console.log('\n⚠ 存在阻断性问题，已中止写入。'); process.exit(1); }

const out = [...cur, ...added.map(x => ({ ...x, desc_en: mkDescEn(x) }))];
fs.copyFileSync(BASE + 'arch_data.json', BASE + 'arch_data.json.bak_before_200');
fs.writeFileSync(BASE + 'arch_data.json', JSON.stringify(out, null, 2));
console.log('\n✅ 已写入 arch_data.json，条目数 =', out.length, '（备份 arch_data.json.bak_before_200）');
