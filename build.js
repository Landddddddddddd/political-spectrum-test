const fs = require('fs');
const base = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const data = JSON.parse(fs.readFileSync(base+'question_bank.json','utf8'));
const src = fs.readFileSync(base+'ideology-test-adaptive.html','utf8');

// 防止 JSON 中出现 </script> 破坏脚本
const json = JSON.stringify(data).replace(/<\//g,'<\\/');
if(!src.includes('__BANK__')){ console.error('源码缺少 __BANK__ 占位符'); process.exit(1); }
const out = src.replace('__BANK__', json);
fs.writeFileSync(base+'deploy/index.html', out, 'utf8');
console.log('已生成 deploy/index.html，注入题数:', data.length, '文件大小(KB):', Math.round(out.length/1024));
