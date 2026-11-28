import fs from 'fs';
const f = 'gen_60.mjs';
let s = fs.readFileSync(f, 'utf8');

// [uniqueChineseSuffix, oldTagsStr, newTagsStr]
const map = [
  ["规则清楚最省口舌。", '["GOV:A"]', '["GOV:A","CUL:T"]'],
  ["靠制度保护住户安全。", '["GOV:A"]', '["GOV:A","CUL:T"]'],
  ["自己多留神。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["由平台把关。", '["GOV:A"]', '["GOV:A","COL:M"]'],
  ["不想把精力耗在争辩上。", '["COL:I"]', '["COL:I","CUL:P"]'],
  ["别人的恩怨我不掺和。", '["COL:I"]', '["COL:I","GOV:L"]'],
  ["税基反而缩水。", '["ECO:R"]', '["ECO:R","GOV:L"]'],
  ["别人的账随他们争。", '["COL:I"]', '["COL:I","ECO:R"]'],
  ["逼出来的转型才有效率。", '["ECO:R"]', '["ECO:R","GOV:L"]'],
  ["把主动权捏自己手里。", '["COL:I"]', '["COL:I","ECO:R"]'],
  ["没有干净水什么都没意义。", '["ENV:S"]', '["ENV:S","GOV:L"]'],
  ["不纠结政策。", '["COL:I"]', '["COL:I","CUL:P"]'],
  ["别的影响不到我。", '["COL:I"]', '["COL:I","GOV:L"]'],
  ["摊位加不加跟我关系不大。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["愿意用点数据换方便。", '["TECH:K"]', '["TECH:K","COL:I"]'],
  ["写啥不影响我们怎么做。", '["COL:I"]', '["COL:I","CUL:P"]'],
  ["最后我自己定稿就行。", '["TECH:K"]', '["TECH:K","COL:I"]'],
  ["朋友的事让他自己依法处理。", '["COL:I"]', '["COL:I","GOV:L"]'],
  ["学校那点不影响根基。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["营养自己兜底。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["不同观点我刷到也划走，不费那神。", '["COL:I"]', '["COL:I","TECH:U"]'],
  ["拆不拆跟我买菜关系不大，懒得掺和。", '["COL:I"]', '["COL:I","GOV:L"]'],
  ["处置交给专门的人。", '["COL:I"]', '["COL:I","GOV:A"]'],
  ["先把当下保费凑齐。", '["COL:I"]', '["COL:I","ECO:R"]'],
  ["别为这事闹僵两家。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["怎么处理都行。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["用脚投票最实在。", '["COL:I"]', '["COL:I","CUL:P"]'],
  ["老人那层我替他们叹句可惜。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["剧团自己负责它的观众。", '["COL:I"]', '["COL:I","GOV:L"]'],
  ["教练专业判断我尊重。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["谁免单都随你们，我不出这份力。", '["COL:I"]', '["COL:I","GOV:L"]'],
  ["位置无所谓。", '["COL:I"]', '["COL:I","CUL:T"]'],
  ["别把我家屋顶弄漏就行。", '["COL:I"]', '["COL:I","ENV:G"]'],
  ["学校怎么定我配合，不掺和争论。", '["COL:I"]', '["COL:I","GOV:L"]'],
  ["平台内部账我不操心。", '["COL:I"]', '["COL:I","ECO:R"]'],
  ["残障的事交给公司政策去管，我不越位。", '["COL:I"]', '["COL:I","GOV:A"]'],
  ["只要别闹出矛盾、影响上课。", '["COL:I"]', '["COL:I","CUL:T"]'],
];

for (const [suf, oldT, newT] of map) {
  const find = suf + '",' + oldT + ',';
  const repl = suf + '",' + newT + ',';
  const n = s.split(find).length - 1;
  if (n !== 1) { console.error("ANCHOR ISSUE:", suf, "count=", n); process.exit(1); }
  s = s.replace(find, repl);
}
fs.writeFileSync(f, s, 'utf8');
console.log("Patched", map.length, "option tag arrays in", f);
