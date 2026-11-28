// 2026-09-24 响应用户反馈：给没有中立选项的题补一个真·中立选项（tags:[]，不计分）
// 语言规范：英文为源文本（t_en 原创），中文为自然翻译
import fs from 'fs';

const FILE = './question_bank.json';
const bank = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// 识别已有的「无所谓/无关」类选项（有则不重复添加）
const KW = ['无所谓','无关','不好说','说不清','跳过','无所谓','没有立场','都不代表','站不了边','宁愿不','伪选择','影响不大','不值得纠结','都行','都可以接受'];
const hasNeutral = q => (q.options||[]).some(o => KW.some(k => (o.t||'').includes(k)));

// 10 条轮换的中立话术（英文源 → 中文翻译），全部第一人称、口语自然
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

let added = 0, skipped = 0, vi = 0;
const LEGAL = new Set(['ECO:L','ECO:R','GOV:A','GOV:L','CUL:T','CUL:P','NAT:N','NAT:C','ENV:G','ENV:S','TECH:K','TECH:U','SEC:E','SEC:F','COL:I','COL:M']);

for (const q of bank) {
  if (!Array.isArray(q.options) || q.options.length === 0) throw new Error('q'+q.id+' bad options');
  if (hasNeutral(q)) { skipped++; continue; }
  const v = VARIANTS[vi % VARIANTS.length]; vi++;
  q.options.push({ t: v.t, t_en: v.t_en, tags: [], isNeutralNew: true });
  added++;
}

// 校验（历史选项只需 t；本次新增的必须 t+t_en 齐全）
for (const q of bank) {
  if (q.options.length < 2) throw new Error('q'+q.id+' has '+q.options.length+' options');
  const seen = new Set();
  for (const o of q.options) {
    if (!o.t) throw new Error('q'+q.id+' missing t');
    if (o.isNeutralNew && !o.t_en) throw new Error('q'+q.id+' new neutral missing t_en');
    if (seen.has(o.t)) throw new Error('q'+q.id+' duplicate option text');
    seen.add(o.t);
    for (const tg of o.tags) if (!LEGAL.has(tg)) throw new Error('q'+q.id+' illegal tag '+tg);
  }
}

fs.writeFileSync(FILE, JSON.stringify(bank, null, 2) + '\n', 'utf8');
console.log('added neutral option to', added, 'questions; skipped (already have one):', skipped);
console.log('total questions:', bank.length);
JSON.parse(fs.readFileSync(FILE, 'utf8'));
console.log('JSON OK');
