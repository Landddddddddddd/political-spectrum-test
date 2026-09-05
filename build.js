const fs = require('fs');
const base = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const data = JSON.parse(fs.readFileSync(base+'question_bank.json','utf8'));
const figures = JSON.parse(fs.readFileSync(base+'figures_bank.json','utf8'));
const changelog = JSON.parse(fs.readFileSync(base+'changelog.json','utf8'));
const archData = JSON.parse(fs.readFileSync(base+'arch_data.json','utf8'));
// C-lite：把 supabase 配置与客户端模块内联进产物（保持部署包自包含、0 外链）
const supaConfig = fs.readFileSync(base+'supabase/config.js','utf8');
const supaAuth = fs.readFileSync(base+'supabase/auth.js','utf8');
const supaJS = supaConfig + '\n' + supaAuth;
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
// 用函数式替换，避免 JSON/supaJS 中的 $ 被当作替换模式；并精准命中「= __TOKEN__」赋值，
// 防止注释里出现同名占位符时被误替换（曾因题库注释含 __BANK__ 导致实际赋值未替换、线上崩溃）
out = src.replace(/=\s*__BANK__/, () => '= ' + json);
out = out.replace(/=\s*__FIGURES__/, () => '= ' + figJson);
out = out.replace(/=\s*__ARCH__/, () => '= ' + archJson);
out = out.replace(/=\s*__CHANGELOG__/, () => '= ' + clJson);
if(!out.includes('"__SUPABASE_JS__"')){ console.error('源码缺少 __SUPABASE_JS__ 占位符'); process.exit(1); }
out = out.replace(/"__SUPABASE_JS__"/, () => supaJS);
fs.writeFileSync(base+'deploy/index.html', out, 'utf8');
console.log('已生成 deploy/index.html，注入题数:', data.length,
  '代表人物阵营数:', Object.keys(figures).length,
  '意识形态数:', archData.length,
  '更新日志条数:', changelog.length,
  '文件大小(KB):', Math.round(out.length/1024));
