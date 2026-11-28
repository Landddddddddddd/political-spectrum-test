import fs from 'fs';

const W = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55';
const FILE = W + '/question_bank.json';
const WRITE = process.argv.includes('--write');

// 30 域标准译名（以库内主流写法为准，逐域唯一权威值）
const CANON = {
  '社区邻里': 'Community & Neighborhood',
  '职场雇佣': 'Workplace & Employment',
  '言论表达': 'Speech & Expression',
  '经济分配': 'Economic Distribution',
  '贸易产业': 'Trade & Industry',
  '环境生态': 'Environment & Ecology',
  '学校教育': 'School & Education',
  '移民文化': 'Immigration & Culture',
  '监控隐私': 'Surveillance & Privacy',
  '科技AI': 'Technology & AI',
  '司法法治': 'Justice & Rule of Law',
  '宗教与信仰': 'Religion & Belief',
  '住房城市': 'Housing & Urban',
  '农业食品': 'Agriculture & Food',
  '媒体信息': 'Media & Information',
  '医疗健康': 'Healthcare',
  '性别平权': 'Gender Equality',
  '治安刑罚': 'Policing & Punishment',
  '外交国际': 'Foreign Affairs & International',
  '社会保障': 'Social Security',
  '动物伦理': 'Animal Ethics',
  '数字平台': 'Digital Platforms',
  '家庭婚姻': 'Family & Marriage',
  '老龄化养老': 'Aging & Elderly Care',
  '消费债务': 'Consumption & Debt',
  '能源基建': 'Energy & Infrastructure',
  '气候灾害': 'Climate & Disasters',
  '少数群体': 'Minority Groups',
  '艺术文化': 'Art & Culture',
  '体育竞技': 'Sports & Competition',
};

const raw = fs.readFileSync(FILE, 'utf8');
const list = JSON.parse(raw);

// 前置守卫：域必须全部在标准表内，否则中止（避免把新域误改名）
const unknown = [...new Set(list.map(q => q.domain))].filter(d => !CANON[d]);
if (unknown.length) {
  console.error('ABORT: 存在未登记域:', unknown.join(', '));
  process.exit(1);
}

const plan = [];
for (const q of list) {
  const exp = CANON[q.domain];
  if (q.domain_en !== exp) plan.push({ id: q.id, from: q.domain_en, to: exp, domain: q.domain });
}

console.log('待修正题数:', plan.length);
const byPair = {};
for (const p of plan) {
  const k = `${p.domain} | ${p.from} -> ${p.to}`;
  byPair[k] = (byPair[k] || 0) + 1;
}
Object.entries(byPair).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ', String(v).padStart(3), k));
console.log('id 范围:', plan.length ? Math.min(...plan.map(p => p.id)) + ' - ' + Math.max(...plan.map(p => p.id)) : '-');

if (!WRITE) {
  console.log('\n[DRY-RUN] 未写入。加 --write 执行。');
  process.exit(0);
}

// 备份
fs.writeFileSync(FILE + '.bak_domainen_' + Date.now(), raw, 'utf8');
for (const p of plan) {
  const q = list.find(x => x.id === p.id);
  q.domain_en = p.to;
}
const out = JSON.stringify(list, null, 2) + '\n';
fs.writeFileSync(FILE, out, 'utf8');

// 复验
const re = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const bad = re.filter(q => q.domain_en !== CANON[q.domain]);
const pairs = new Set(re.map(q => q.domain + '||' + q.domain_en));
console.log('\n[WRITE] 已写入。剩余非标准 domain_en:', bad.length, '| distinct pairs:', pairs.size, '(应为 30)');
console.log('题数:', re.length);
