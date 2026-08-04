const fs = require('fs');
const htmlPath = 'ideology-test-adaptive.html';
const patch = JSON.parse(fs.readFileSync('patch_arch.json', 'utf8'));

let html = fs.readFileSync(htmlPath, 'utf8');
const idx1 = html.indexOf('const ARCH = [');
if (idx1 < 0) { console.error('未找到 const ARCH'); process.exit(1); }
const end = html.indexOf('];', idx1);
if (end < 0) { console.error('未找到 ARCH 结尾 ];'); process.exit(1); }
const start = idx1 + 'const ARCH = '.length;
const literal = html.slice(start, end) + ']';             // 补上数组闭合 ]
const ARCH = eval('(' + literal + ')');

let matched = 0, total = 0;
ARCH.forEach(e => {
  total++;
  const p = patch[e.name];
  if (p) {
    e.detail = p.detail;
    e.tenets = p.tenets;
    matched++;
  }
});
console.log('ARCH 条目:', total, '| 匹配到画像:', matched);

const entries = ARCH.map(e => {
  let s = '  {name:' + JSON.stringify(e.name) + ', need:' + JSON.stringify(e.need) + ', desc:' + JSON.stringify(e.desc);
  if (e.detail) s += ', detail:' + JSON.stringify(e.detail);
  if (e.tenets) s += ', tenets:' + JSON.stringify(e.tenets);
  return s + '}';
});
const newBlock = 'const ARCH = [\n' + entries.join(',\n') + '\n];';
const newHtml = html.slice(0, idx1) + newBlock + html.slice(end + 2);
fs.writeFileSync(htmlPath, newHtml);
console.log('已写回', htmlPath, '| 大小', newHtml.length);

// 自检：重新读取确认 detail/tenets 存在且无语法残留
const probe = newHtml.indexOf('const ARCH = ');
const end2 = newHtml.indexOf('];', probe);
const arr2 = eval('(' + newHtml.slice(probe + 'const ARCH = '.length, end2) + '])');
const withDetail = arr2.filter(a => a.detail && a.tenets).length;
console.log('自检：含 detail+tenets 的条目 =', withDetail, '/', arr2.length);
