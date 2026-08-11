const fs = require('fs');
const base = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const data = JSON.parse(fs.readFileSync(base+'question_bank.json','utf8'));
const figures = JSON.parse(fs.readFileSync(base+'figures_bank.json','utf8'));
const changelog = JSON.parse(fs.readFileSync(base+'changelog.json','utf8'));
const archData = JSON.parse(fs.readFileSync(base+'arch_data.json','utf8'));
const src = fs.readFileSync(base+'ideology-test-adaptive.html','utf8');

// 防止 JSON 中出现 </script> 破坏脚本
const json = JSON.stringify(data).replace(/<\//g,'<\\/');
const figJson = JSON.stringify(figures).replace(/<\//g,'<\\/');
const clJson = JSON.stringify(changelog).replace(/<\//g,'<\\/');
const archJson = JSON.stringify(archData).replace(/<\//g,'<\\/');
if(!src.includes('__BANK__')){ console.error('源码缺少 __BANK__ 占位符'); process.exit(1); }
if(!src.includes('__FIGURES__')){ console.error('源码缺少 __FIGURES__ 占位符'); process.exit(1); }
if(!src.includes('__CHANGELOG__')){ console.error('源码缺少 __CHANGELOG__ 占位符'); process.exit(1); }
if(!src.includes('__ARCH__')){ console.error('源码缺少 __ARCH__ 占位符'); process.exit(1); }
let out = src.replace('__BANK__', json);
out = out.replace('__FIGURES__', figJson);
out = out.replace('__ARCH__', archJson);
out = out.replace('__CHANGELOG__', clJson);
fs.writeFileSync(base+'deploy/index.html', out, 'utf8');
console.log('已生成 deploy/index.html，注入题数:', data.length,
  '代表人物阵营数:', Object.keys(figures).length,
  '意识形态数:', archData.length,
  '更新日志条数:', changelog.length,
  '文件大小(KB):', Math.round(out.length/1024));
