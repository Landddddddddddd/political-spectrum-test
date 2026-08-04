const fs = require('fs');
const DIR = __dirname;
const bank = JSON.parse(fs.readFileSync(DIR+'/question_bank.json','utf8'));

// 新维优先移除顺序（最泛化的先移）：COL > SEC > TECH
const PRIORITY = ['COL:I','COL:M','SEC:E','SEC:F','TECH:K','TECH:U'];
let trimmed = 0;
for (const q of bank) {
  for (const opt of q.options) {
    while (opt.tags.length > 4) {
      let removed = false;
      for (const t of PRIORITY) {
        const i = opt.tags.indexOf(t);
        if (i >= 0) { opt.tags.splice(i,1); removed = true; trimmed++; break; }
      }
      if (!removed) { opt.tags.pop(); trimmed++; }
    }
  }
}
const maxTags = Math.max(...bank.flatMap(q=>q.options.map(o=>o.tags.length)));
fs.writeFileSync(DIR+'/question_bank.json', JSON.stringify(bank,null,0));
console.log('移除数:', trimmed, '| 修正后每选项最大标签数:', maxTags);
