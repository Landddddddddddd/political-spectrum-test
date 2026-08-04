const fs = require('fs');
const DIR = __dirname;

const LEGAL = new Set([
  'ECO:L','ECO:R','GOV:A','GOV:L','CUL:T','CUL:P','NAT:N','NAT:C',
  'ENV:G','ENV:S','TECH:K','TECH:U','SEC:E','SEC:F','COL:I','COL:M'
]);
const DIMOF = t => t.split(':')[0];

const bank = JSON.parse(fs.readFileSync(DIR+'/question_bank.json','utf8'));
const patches = ['patch_tech.json','patch_sec.json','patch_col.json']
  .flatMap(f => JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')));

// 合并：按 id:o 追加，去重
const byId = new Map(bank.map(q => [q.id, q]));
let dupSkip = 0, missing = 0, added = 0;
for (const p of patches) {
  const q = byId.get(p.id);
  if (!q || !q.options[p.o]) { missing++; continue; }
  const opt = q.options[p.o];
  for (const tag of p.add) {
    if (!LEGAL.has(tag)) { console.log('非法标签被跳过:', tag); continue; }
    if (opt.tags.includes(tag)) { dupSkip++; continue; }
    opt.tags.push(tag);
    added++;
  }
}

// 校验
let errors = 0;
const dimQCount = {}; // 至少1个该维标签的题数
const dimTagCount = {}; // 该维标签总数
for (const t of LEGAL) { dimTagCount[t]=0; }
const qByDim = {};
for (const t of LEGAL) { qByDim[t]=new Set(); }

for (const q of bank) {
  if (!q.domain || !q.scene || !Array.isArray(q.options)) { console.log('结构错:',q.id); errors++; }
  if (q.options.length < 2 || q.options.length > 8) { console.log('选项数越界:',q.id,q.options.length); errors++; }
  for (const opt of q.options) {
    if (!opt.t || !Array.isArray(opt.tags)) { console.log('选项结构错:',q.id); errors++; continue; }
    if (opt.tags.length < 1 || opt.tags.length > 4) { console.log('标签数越界:',q.id,opt.tags.length); errors++; }
    for (const t of opt.tags) {
      if (!LEGAL.has(t)) { console.log('非法标签:',q.id,t); errors++; }
      else { dimTagCount[t]++; qByDim[t].add(q.id); }
    }
  }
}

const maxTags = Math.max(...bank.flatMap(q=>q.options.map(o=>o.tags.length)));
fs.writeFileSync(DIR+'/question_bank.json', JSON.stringify(bank,null,0));

console.log('=== 合并结果 ===');
console.log('补丁总条数:', patches.length, '| 实际新增标签:', added, '| 重复跳过:', dupSkip, '| 找不到目标:', missing);
console.log('每选项最大标签数:', maxTags);
console.log('校验错误数:', errors);
console.log('=== 各维度覆盖（题数 / 标签总数）===');
for (const d of ['ECO','GOV','CUL','NAT','ENV','TECH','SEC','COL']) {
  const tags = [...LEGAL].filter(t=>DIMOF(t)===d);
  const qc = Math.max(...tags.map(t=>qByDim[t].size));
  const tc = tags.reduce((s,t)=>s+dimTagCount[t],0);
  console.log(`  ${d}: ${qc} 题 / ${tc} 标签`);
}
console.log('总题数:', bank.length);
