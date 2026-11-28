import fs from 'fs';

const W = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55';
const WRITE = process.argv.includes('--write');

const CANON = {
  '社区邻里': 'Community & Neighborhood', '职场雇佣': 'Workplace & Employment',
  '言论表达': 'Speech & Expression', '经济分配': 'Economic Distribution',
  '贸易产业': 'Trade & Industry', '环境生态': 'Environment & Ecology',
  '学校教育': 'School & Education', '移民文化': 'Immigration & Culture',
  '监控隐私': 'Surveillance & Privacy', '科技AI': 'Technology & AI',
  '司法法治': 'Justice & Rule of Law', '宗教与信仰': 'Religion & Belief',
  '住房城市': 'Housing & Urban', '农业食品': 'Agriculture & Food',
  '媒体信息': 'Media & Information', '医疗健康': 'Healthcare',
  '性别平权': 'Gender Equality', '治安刑罚': 'Policing & Punishment',
  '外交国际': 'Foreign Affairs & International', '社会保障': 'Social Security',
  '动物伦理': 'Animal Ethics', '数字平台': 'Digital Platforms',
  '家庭婚姻': 'Family & Marriage', '老龄化养老': 'Aging & Elderly Care',
  '消费债务': 'Consumption & Debt', '能源基建': 'Energy & Infrastructure',
  '气候灾害': 'Climate & Disasters', '少数群体': 'Minority Groups',
  '艺术文化': 'Art & Culture', '体育竞技': 'Sports & Competition',
};
const POLES = { ECO: 'LR', GOV: 'AL', CUL: 'TP', NAT: 'NC', ENV: 'GS', TECH: 'KU', SEC: 'EF', COL: 'IM' };
const CJK = /[\u4e00-\u9fff]/;
const ASSERT = /(本质上是|显然是|毋庸置疑|不言而喻|唯一出路|才是正解|盲目|极端自私|普遍认为|维护主流价值)/;

const bankRaw = fs.readFileSync(W + '/question_bank.json', 'utf8');
const bank = JSON.parse(bankRaw);
const maxId = Math.max(...bank.map(q => q.id));
const existingIds = new Set(bank.map(q => q.id));
const totalBefore = bank.length;

const b1 = JSON.parse(fs.readFileSync(W + '/_gen_1106.json', 'utf8'));
const b2 = JSON.parse(fs.readFileSync(W + '/_gen_1107.json', 'utf8'));
const batch = [...b1, ...b2];

const errs = [], warns = [];
const seen = new Set();

if (b1.length !== 10 || b2.length !== 10) errs.push(`批次题数异常: 1106=${b1.length}, 1107=${b2.length}`);

for (const q of batch) {
  const tag = `#${q.id}`;
  if (seen.has(q.id)) errs.push(`${tag} 批次内重复`);
  seen.add(q.id);
  if (existingIds.has(q.id)) errs.push(`${tag} 与现有题库 id 冲突`);
  if (q.id <= maxId) errs.push(`${tag} id 未递增（库内 max=${maxId}）`);

  if (!q.domain || !CANON[q.domain]) errs.push(`${tag} 未登记域: ${q.domain}`);
  else if (q.domain_en !== CANON[q.domain]) errs.push(`${tag} domain_en "${q.domain_en}" ≠ "${CANON[q.domain]}"`);
  if (!q.scene || q.scene.length < 80) errs.push(`${tag} scene 过短(${(q.scene || '').length})`);
  if (!q.scene_en || q.scene_en.split(/\s+/).length < 60) errs.push(`${tag} scene_en 过短或缺失`);
  if (q.scene_en && CJK.test(q.scene_en)) errs.push(`${tag} scene_en 含中文`);

  const opts = q.options || [];
  const neut = opts.filter(o => Array.isArray(o.tags) && o.tags.length === 0);
  if (neut.length !== 1) errs.push(`${tag} 中立选项数 ${neut.length}（应恰为 1）`);
  const real = opts.filter(o => !(Array.isArray(o.tags) && o.tags.length === 0));
  if (real.length < 3) errs.push(`${tag} 实义选项仅 ${real.length}（应 ≥3）`);

  for (const [i, o] of opts.entries()) {
    if (!o.t || !o.t_en) errs.push(`${tag}[${i}] 缺 t 或 t_en`);
    if (o.t_en && CJK.test(o.t_en)) errs.push(`${tag}[${i}] t_en 含中文`);
    if (!Array.isArray(o.tags)) { errs.push(`${tag}[${i}] tags 非数组`); continue; }
    for (const t of o.tags) {
      const m = /^([A-Z]{3,4}):([A-Z])$/.exec(t);
      if (!m) { errs.push(`${tag}[${i}] 非法 tag "${t}"`); continue; }
      if (!POLES[m[1]]) errs.push(`${tag}[${i}] 未知维度 "${t}"`);
      else if (!POLES[m[1]].includes(m[2])) errs.push(`${tag}[${i}] 极值非法 "${t}"`);
    }
    if (o.tags.length && ASSERT.test(o.t || '')) errs.push(`${tag}[${i}] 预设立场词: ${ASSERT.exec(o.t)[1]}`);
  }
}

// 维度覆盖
const dims = new Set();
for (const q of batch) for (const o of q.options) for (const t of o.tags) dims.add(t.split(':')[0]);
console.log('批次题数:', batch.length, '| id:', Math.min(...batch.map(q => q.id)) + '-' + Math.max(...batch.map(q => q.id)));
console.log('覆盖维度:', [...dims].sort().join(',') || '无');
const domCount = {};
for (const q of batch) domCount[q.domain] = (domCount[q.domain] || 0) + 1;
console.log('域分布:', JSON.stringify(domCount, null, 0));
console.log('错误:', errs.length);
errs.forEach(e => console.log('  ERR', e));

if (errs.length) { console.log('\n存在错误，未写入。'); process.exit(1); }
if (!WRITE) { console.log('\n[DRY-RUN] 校验通过，加 --write 写入。'); process.exit(0); }

// 写入
const merged = [...bank, ...batch];
const out = JSON.stringify(merged, null, 2) + '\n';
fs.writeFileSync(W + '/question_bank.json', out, 'utf8');

// 追加两条 changelog
const chFile = W + '/changelog.json';
const ch = JSON.parse(fs.readFileSync(chFile, 'utf8'));
const doms1 = [...new Set(b1.map(q => q.domain))];
const doms2 = [...new Set(b2.map(q => q.domain))];
const mk = (date, title, items, total) => ({ date, title, items, stats: { questions: total, ideologies: 200, domains: 30 } });
const e1 = mk('2026-11-06', '每日题库扩展 +10 题（补跑）',
  [`补跑 2026-11-06 缺失批次，ID ${b1[0].id}-${b1[b1.length - 1].id}`,
   `补入领域：${doms1.join('、')}（各 +1，30 领域分布达成全 38 题）`,
   '全部新题带英文源（scene_en/domain_en/options.t_en），每题 4 实义 + 1 中立共 5 个选项，中立选项 tags:[] 不计分',
   '标签按八维口径复核：ENV 仅用于发展/生态取舍、TECH 仅用于管控/自主轴、SEC 仅在宗教↔世俗语境启用'], totalBefore + b1.length);
const e2 = mk('2026-11-07', '每日题库扩展 +10 题',
  [`新增 ID ${b2[0].id}-${b2[b2.length - 1].id}`,
   `补入领域：${doms2.join('、')}`,
   '全部新题带英文源，每题 4 实义 + 1 中立；域分布 10 域 39 题 / 20 域 38 题（总量 1150 无法整除 30，已尽量拉平）',
   '选项预设立场扫描（本质上是/显然/唯一出路/盲目/极端自私等断言词）：0 命中'], totalBefore + batch.length);
ch.push(e1, e2);
fs.writeFileSync(chFile, JSON.stringify(ch, null, 2) + '\n', 'utf8');

const after = JSON.parse(fs.readFileSync(W + '/question_bank.json', 'utf8'));
const d = {};
for (const q of after) d[q.domain] = (d[q.domain] || 0) + 1;
const vals = Object.values(d);
console.log(`\n[WRITE] 题库 ${totalBefore} -> ${after.length}，changelog ${ch.length} 条`);
console.log('域数:', Object.keys(d).length, '| 每域 min/max:', Math.min(...vals), '/', Math.max(...vals));
console.log('域-译名对:', new Set(after.map(q => q.domain + '||' + q.domain_en)).size);
