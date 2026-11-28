// 结构缺口补齐（本地、零网络、可重复跑）：
//  1) 为所有缺 domain_en 的题从静态映射表补 domain_en（不依赖网络）
//  2) 为所有缺少「真·中立选项」（tags:[]）的题补一个预译好的中立选项（t + t_en 齐全）
// 说明：scene_en / 选项 t_en 仍依赖 MyMemory 网络回填（见 backfill_en.mjs），本脚本不动它们。
import fs from 'fs';

const BASE = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const FILE = BASE + 'question_bank.json';
const bank = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const DOMAIN_EN = {
  '社区邻里': 'Community & Neighborhood', '职场雇佣': 'Workplace & Employment',
  '言论表达': 'Speech & Expression', '经济分配': 'Economic Distribution',
  '贸易产业': 'Trade & Industry', '环境生态': 'Environment & Ecology',
  '学校教育': 'School & Education', '移民文化': 'Immigration & Culture',
  '监控隐私': 'Surveillance & Privacy', '医疗健康': 'Healthcare',
  '性别平权': 'Gender Equality', '科技AI': 'Technology & AI',
  '司法法治': 'Justice & Rule of Law', '宗教与信仰': 'Religion & Belief',
  '住房城市': 'Housing & Urban', '农业食品': 'Agriculture & Food',
  '媒体信息': 'Media & Information', '治安刑罚': 'Policing & Punishment',
  '外交国际': 'Foreign Affairs & International', '社会保障': 'Social Security',
  '家庭婚姻': 'Family & Marriage', '动物伦理': 'Animal Ethics',
  '艺术文化': 'Art & Culture', '体育竞技': 'Sports & Competition',
  '老龄化养老': 'Aging & Elderly Care', '消费债务': 'Consumption & Debt',
  '能源基建': 'Energy & Infrastructure', '气候灾害': 'Climate & Disasters',
  '数字平台': 'Digital Platforms', '少数群体': 'Minority Groups',
};

const VARIANTS = [
  { t_en: "Honestly, none of these speaks for me on this one — I'd rather just skip it.",
    t:    "说实话这几个说法都不代表我，这题我宁愿跳过。" },
  { t_en: "I don't feel personally involved in this issue; any of these outcomes would be fine with me.",
    t:    "这事我没啥代入感，哪种结果我都能接受。" },
  { t_en: "I can't really take a side here — I don't know enough about this to judge.",
    t:    "这题我站不了边，了解得不够，判断不了。" },
  { t_en: "This feels like a false choice to me; if it actually came up, I'd handle it some other way entirely.",
    t:    "我觉得这题是个伪选择，真到那一步我会用别的方式处理。" },
  { t_en: "I'm genuinely indifferent — this barely affects my life either way.",
    t:    "我确实无所谓，这事对生活影响不大。" },
  { t_en: "I keep going back and forth on this; neither direction feels quite right to me.",
    t:    "这题我反复摇摆，哪个方向都觉得不太对。" },
  { t_en: "It would depend on details this scenario doesn't give, so I can't commit to any of these.",
    t:    "这取决于情景里没交代的细节，我没法锁定任何一项。" },
  { t_en: "It's really none of my business — I'd let the people involved sort it out themselves.",
    t:    "这说不上和我有关，让当事各方自己去定就好。" },
  { t_en: "I'd abstain if I could — the way this is framed forces a stance I don't actually hold.",
    t:    "可以弃权的话我就弃权，这题的问法有点替我表态的意思。" },
  { t_en: "I don't hold a fixed view on this; my answer would probably change from one day to the next.",
    t:    "我对这事没有固定立场，换个日子答案可能就不一样。" },
];

const KW = ['无所谓','无关','不好说','说不清','跳过','没有立场','都不代表','站不了边','宁愿不','伪选择','影响不大','不值得纠结','都行','都可以接受'];
const hasEmptyNeutral = q => (q.options||[]).some(o => (o.tags||[]).length === 0);

let domainFilled = 0, domainMissingMap = new Set();
let neutralAdded = 0, vi = 0;
const LEGAL = new Set(['ECO:L','ECO:R','GOV:A','GOV:L','CUL:T','CUL:P','NAT:N','NAT:C','ENV:G','ENV:S','TECH:K','TECH:U','SEC:E','SEC:F','COL:I','COL:M']);

for (const q of bank) {
  // 1) domain_en from static map
  if (!q.domain_en || !(q.domain_en||'').trim()) {
    const en = DOMAIN_EN[q.domain];
    if (en) { q.domain_en = en; domainFilled++; }
    else domainMissingMap.add(q.domain);
  }
  // 2) true neutral
  if (!hasEmptyNeutral(q)) {
    const v = VARIANTS[vi % VARIANTS.length]; vi++;
    q.options.push({ t: v.t, t_en: v.t_en, tags: [] });
    neutralAdded++;
  }
}

// 校验
let bad = 0;
for (const q of bank) {
  if ((q.options||[]).length < 2) { console.error('q'+q.id+' <2 options'); bad++; }
  for (const o of (q.options||[])) {
    if (!o.t) { console.error('q'+q.id+' missing t'); bad++; }
    for (const tg of (o.tags||[])) if (!LEGAL.has(tg)) { console.error('q'+q.id+' illegal tag '+tg); bad++; }
  }
}
if (bad) { console.error('校验失败，已中止写入'); process.exit(1); }

fs.writeFileSync(FILE, JSON.stringify(bank, null, 2) + '\n', 'utf8');
console.log('✅ 写入完成');
console.log('  补 domain_en:', domainFilled, '| 仍缺映射的 domain:', [...domainMissingMap].join(',') || '(无)');
console.log('  补真·中立选项(题数):', neutralAdded);
console.log('  当前 domain_en 全齐:', bank.every(q => (q.domain_en||'').trim().length>0));
console.log('  当前每题均有 tags:[] 中立选项:', bank.every(q => (q.options||[]).some(o => (o.tags||[]).length===0)));
