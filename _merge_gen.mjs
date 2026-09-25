// 合并 4 个并行出题批次(_gen_A~D.json) → question_bank.json（补跑共 160 题，id 651~810）
// 步骤：校验 → 动态分配 id → 补真·中立选项(从现有题库话术池轮换) → 追加 → changelog → 写回
import fs from 'fs';

const DIR = './';
const FILE = DIR + 'question_bank.json';
const CHLOG = DIR + 'changelog.json';
const BATCHES = ['_gen_A.json', '_gen_B.json', '_gen_C.json', '_gen_D.json'];

const LEGAL_TAGS = ['ECO:L','ECO:R','GOV:A','GOV:L','CUL:T','CUL:P','NAT:N','NAT:C',
  'ENV:G','ENV:S','TECH:K','TECH:U','SEC:E','SEC:F','COL:I','COL:M'];
const LEGAL_DOMAINS = ['社区邻里','职场雇佣','言论表达','经济分配','贸易产业','环境生态','学校教育',
  '移民文化','监控隐私','医疗健康','性别平权','科技AI','司法法治','宗教与信仰','住房城市','农业食品',
  '媒体信息','治安刑罚','外交国际','社会保障','家庭婚姻','动物伦理','艺术文化','体育竞技','老龄化养老',
  '消费债务','能源基建','气候灾害','数字平台','少数群体'];

const bank = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const before = bank.length;
const existingIds = new Set(bank.map(q => q.id));
console.log('[bank] 现有', before, '题，maxId=', Math.max(...existingIds));

// 1) 中立话术池（与 8ae059b 补的 627 题一致，不硬编码）
const pool = [];
for (const q of bank) {
  for (const o of (q.options || [])) {
    if (Array.isArray(o.tags) && o.tags.length === 0 && o.t && o.t_en && !pool.some(p => p.t === o.t)) {
      pool.push({ t: o.t, t_en: o.t_en });
    }
  }
}
console.log('[pool] 中立话术池:', pool.length, '条');
if (!pool.length) { console.error('!! 话术池为空，中止'); process.exit(1); }

// 2) 收集新题
let all = [];
for (const b of BATCHES) {
  if (!fs.existsSync(b)) { console.error('!! 缺少批次文件:', b); process.exit(1); }
  const arr = JSON.parse(fs.readFileSync(b, 'utf8'));
  console.log('[batch]', b, arr.length, '题');
  all = all.concat(arr);
}
console.log('[total] 待入库新题:', all.length);

// 3) 校验（不含 id，id 由本脚本动态分配）
const errs = [];
const domCount = {};
for (const q of all) {
  if (!LEGAL_DOMAINS.includes(q.domain)) errs.push(`domain 非法: ${q.domain}`);
  domCount[q.domain] = (domCount[q.domain] || 0) + 1;
  const sc = (q.scene || '').length;
  if (sc < 100 || sc > 250) errs.push(`scene 长度越界: ${sc}`);
  if (!Array.isArray(q.options) || q.options.length !== 4) errs.push(`options 数 != 4: ${(q.options || []).length}`);
  for (const o of (q.options || [])) {
    if (!Array.isArray(o.tags) || o.tags.length < 1 || o.tags.length > 3) errs.push(`选项标签数异常`);
    for (const t of (o.tags || [])) if (!LEGAL_TAGS.includes(t)) errs.push(`非法标签: ${t}`);
    const tl = (o.t || '').length;
    if (tl < 40 || tl > 160) errs.push(`选项文本长度异常: ${tl}`);
    if (!o.t_en || !String(o.t_en).trim()) errs.push(`t_en 为空`);
  }
}
if (errs.length) {
  console.error('!! 校验未通过，共', errs.length, '项：');
  errs.slice(0, 30).forEach(e => console.error('   -', e));
  process.exit(1);
}
console.log('[check] 结构/标签/长度/语言校验全部通过');
console.log('[check] 领域分布:', Object.entries(domCount).sort((a, b) => b[1] - a[1]).map(x => `${x[0]}×${x[1]}`).join(' '));

// 4) 分配 id + 补中立选项
let nextId = before + 1;
all.forEach((q, i) => {
  q.id = nextId++;
  const v = pool[i % pool.length];
  q.options.push({ t: v.t, t_en: v.t_en, tags: [] });
});
console.log('[neutral] 已为', all.length, '题各补 1 个真·中立选项');
console.log('[id] 分配区间', before + 1, '~', nextId - 1);

// 5) 写回（重读一次，防并发改动覆盖）
const fresh = JSON.parse(fs.readFileSync(FILE, 'utf8'));
if (fresh.length !== before) { console.error(`!! 题库在处理期间从 ${before} 变为 ${fresh.length}，中止`); process.exit(1); }
const out = fresh.concat(all);
fs.writeFileSync(FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('[write] 题库', before, '→', out.length, '（新增', all.length, '）');

// 6) changelog
const chlog = JSON.parse(fs.readFileSync(CHLOG, 'utf8'));
chlog.push({
  date: '2026-09-25',
  title: `每日题库扩展 +${all.length}题（补跑 2026-09-09~09-24）`,
  items: [
    '补跑 2026-09-09 ~ 2026-09-24 共 16 天每日扩展（每天 10 题，共 160 题）',
    '覆盖全部 30 个领域（每领域 +5~7 题），每题含 t_en 英文与 4 个计分选项',
    '新题统一补真·中立选项（tags:[]，不计分，从现有 627 条话术池轮换）',
  ],
  stats: { questions: out.length, ideologies: 120, domains: 30 },
});
fs.writeFileSync(CHLOG, JSON.stringify(chlog, null, 2) + '\n', 'utf8');
console.log('[changelog] 已追加第', chlog.length, '条，stats.questions =', out.length);
console.log('[done] 完成');
