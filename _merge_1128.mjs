import fs from 'fs';
const W = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55';
const WRITE = process.argv.includes('--write');

const CANON = {
  '医疗健康': 'Healthcare', '性别平权': 'Gender Equality', '治安刑罚': 'Policing & Punishment',
  '外交国际': 'Foreign Affairs & International', '社区邻里': 'Community & Neighborhood',
  '职场雇佣': 'Workplace & Employment', '言论表达': 'Speech & Expression',
  '经济分配': 'Economic Distribution', '贸易产业': 'Trade & Industry', '环境生态': 'Environment & Ecology',
};
const P = { ECO: 'LR', GOV: 'AL', CUL: 'TP', NAT: 'NC', ENV: 'GS', TECH: 'KU', SEC: 'EF', COL: 'IM' };
const CJK = /[\u4e00-\u9fff]/;
const NEU = ['说实话这几个说法都不代表我','这事我没啥代入感','这题我站不了边','我觉得这题是个伪选择','我确实无所谓','这题我反复摇摆','这取决于情景里没交代的细节','这说不上和我有关','可以弃权的话我就弃权','我对这事没有固定立场'];
const BANNED = ['本质上是','显然是','毋庸置疑','显而易见','唯一出路','才是正解','普遍认为','维护主流'];

const bankRaw = fs.readFileSync(W + '/question_bank.json', 'utf8');
const bank = JSON.parse(bankRaw);
const chRaw = fs.readFileSync(W + '/changelog.json', 'utf8');
const ch = JSON.parse(chRaw);
const errors = [], warns = [];

const fresh = JSON.parse(fs.readFileSync(W + '/_gen_1128.json', 'utf8'));
if (!Array.isArray(fresh) || fresh.length !== 10) errors.push('题数非10');
const ids = fresh.map(q => q.id);
if (JSON.stringify(ids) !== JSON.stringify(Array.from({ length: 10 }, (_, i) => 1351 + i))) errors.push('id 序列非 1351-1360');
const existing = new Set(bank.map(q => q.id));
if (fresh.some(q => existing.has(q.id))) errors.push('id 冲突');
if (bank.length !== 1350 || Math.max(...bank.map(q => q.id)) !== 1350) errors.push('基线非 1350：可能被并发线改写，ABORT');

const prefix = new Map(bank.map(q => [(q.scene || '').slice(0, 24), q.id]));
const doms = {};
fresh.forEach((q, qi) => {
  const t = '#' + q.id;
  doms[q.domain] = (doms[q.domain] || 0) + 1;
  if (CANON[q.domain] !== q.domain_en) errors.push(t + ' domain_en 错: ' + q.domain_en);
  if (q.scene.length < 150 || q.scene.length > 230) warns.push(t + ' scene ' + q.scene.length + ' 字');
  if (!q.scene_en || CJK.test(q.scene_en)) errors.push(t + ' scene_en 缺或含中文');
  if (q.scene_en.length < 200) warns.push(t + ' scene_en 仅 ' + q.scene_en.length + ' 字符');
  if (!Array.isArray(q.options) || q.options.length !== 5) { errors.push(t + ' 选项数非5'); return; }
  const neu = q.options.filter(o => Array.isArray(o.tags) && o.tags.length === 0);
  if (neu.length !== 1) { errors.push(t + ' 中立项数 ' + neu.length); return; }
  if (!neu[0].t.startsWith(NEU[qi])) errors.push(t + ' 中立话术轮次不符: ' + neu[0].t.slice(0, 16));
  if (!neu[0].t_en || CJK.test(neu[0].t_en)) errors.push(t + ' 中立 t_en 缺或含中文');
  for (const o of q.options) {
    if (!o.t_en || CJK.test(o.t_en)) errors.push(t + ' t_en 缺或含中文');
    if (!Array.isArray(o.tags)) { errors.push(t + ' tags 非数组'); continue; }
    if (o.tags.length === 0) continue;
    for (const tag of o.tags) {
      const m = /^([A-Z]{3,4}):([A-Z])$/.exec(tag);
      if (!m || !P[m[1]] || !P[m[1]].includes(m[2])) errors.push(t + ' 非法 tag: ' + tag);
    }
    for (const w of BANNED) if ((o.t || '').includes(w)) errors.push(t + ' 预设立场词: ' + w);
  }
  const k = q.scene.slice(0, 24);
  if (prefix.has(k)) errors.push(t + ' 场景前缀与 #' + prefix.get(k) + ' 重复');
  prefix.set(k, q.id);
});
const dm = Object.keys(doms).length;
if (dm !== 10 || Object.values(doms).some(n => n !== 1)) errors.push('域覆盖异常: ' + JSON.stringify(doms));

console.log('=== 合并前严检 (11-28) ===');
console.log('题数:', fresh.length, '| id:', ids[0], '-', ids[ids.length - 1], '| 域数:', dm);
console.log('错误:', errors.length, errors.slice(0, 20).join(' | '));
console.log('警告:', warns.length, warns.slice(0, 10).join(' | '));
if (errors.length) { console.log('ABORT'); process.exit(1); }
if (!WRITE) { console.log('DRY-RUN 完成'); process.exit(0); }

if (fs.readFileSync(W + '/question_bank.json', 'utf8') !== bankRaw) { console.log('ABORT: 写入前检测到并发改写'); process.exit(1); }
const crlf = bankRaw.includes('\r\n');
const ser = (o, c) => { const s = JSON.stringify(o, null, 2); return c ? s.replace(/\n/g, '\r\n') + '\r\n' : s + '\n'; };
bank.push(...fresh);
fs.writeFileSync(W + '/question_bank.json', ser(bank, crlf), 'utf8');

if (!ch.some(e => e.date === '2026-11-28' && e.title.includes('题库扩展'))) {
  ch.push({ date: '2026-11-28', title: '每日题库扩展 +10 题', items: [
    '新增 10 题（id 1351-1360），覆盖 10 个领域各 1 题；每题含中英双语情境与选项、恰 1 个 tags:[] 中立项',
    'domain_en 按 30 域标准译名表填写；标签使用八维 16 标签冒号格式；预设立场扫描 0 命中',
  ], stats: { questions: 1360, ideologies: 200, domains: 30 } });
  fs.writeFileSync(W + '/changelog.json', ser(ch, chRaw.includes('\r\n')), 'utf8');
}
const back = JSON.parse(fs.readFileSync(W + '/question_bank.json', 'utf8'));
console.log('WRITE 完成:', back.length, '题 / maxID', Math.max(...back.map(q => q.id)), '| changelog', ch.length, '| CRLF:', crlf);
