import fs from 'fs';
import vm from 'vm';
import { execSync } from 'child_process';
const html = fs.readFileSync('deploy/index.html','utf8');

// 抽取含 estAccuracy 的主内联脚本
const parts = html.split(/<script>/i);
let target = null;
for(const p of parts){ if(p.includes('function estAccuracy')){ target = p.split(/<\/script>/i)[0]; break; } }
if(!target){ console.error('未找到含 estAccuracy 的脚本'); process.exit(2); }
fs.writeFileSync('/tmp/_main.js', target);

// 1) 语法检查（整段主脚本）
try { execSync('C:/Users/xiaol/.workbuddy/binaries/node/versions/22.22.2/node.exe --check /tmp/_main.js'); console.log('[OK] 主脚本语法检查通过'); }
catch(e){ console.error('[FAIL] 语法检查失败'); process.exit(3); }

// 2) 只抽取本次新增的「实测精度」代码块（MEASURED + fits + estAccuracy + estDims），隔离求值
const m = target.match(/const MEASURED = \[[\s\S]*?function estDims\(n\)\{[^}]*\}/);
if(!m){ console.error('[FAIL] 未能抽取 MEASURED 代码块'); process.exit(4); }
const sandbox = {}; vm.createContext(sandbox);
// const/let 在 vm 中不挂到 sandbox 全局，需显式导出到 globalThis(=sandbox)
const code = m[0] + '\n;globalThis.MEASURED=MEASURED;globalThis.estAccuracy=estAccuracy;globalThis.estDims=estDims;globalThis.ACC_FIT=ACC_FIT;globalThis.DIM_FIT=DIM_FIT;';
vm.runInContext(code, sandbox);
const { estAccuracy, estDims, MEASURED, ACC_FIT, DIM_FIT } = sandbox;
console.log('MEASURED 点数:', MEASURED.length, '| ACC_FIT:', JSON.stringify(ACC_FIT), '| DIM_FIT:', JSON.stringify(DIM_FIT));

const ns = [5,10,15,30,50,100,150,200,300,500,1000];
let prevA=-1, monoOK=true;
console.log('\n  n   estAccuracy  estDims');
for(const n of ns){
  const a = estAccuracy(n), d = estDims(n);
  if(a < prevA - 1e-9) monoOK=false; prevA=a;
  console.log(String(n).padStart(4), '   ', a.toFixed(1).padStart(6), '   ', d.toFixed(2));
}
const checks = {
  'estAccuracy(10)≈63': Math.abs(estAccuracy(10)-63.3)<1.5,
  'estAccuracy(100)≈74': Math.abs(estAccuracy(100)-74.3)<1.5,
  'estAccuracy(500)≈76': Math.abs(estAccuracy(500)-76.3)<1.5,
  'estAccuracy 落在[55,80]': ns.every(n=>estAccuracy(n)>=55 && estAccuracy(n)<=80),
  'estDims 不超8': ns.every(n=>estDims(n)>=0 && estDims(n)<=8),
  'estAccuracy 单调不降': monoOK,
  'MEASURED 含 10 点': MEASURED.length===10,
};
let allOK=true;
for(const k in checks){ if(!checks[k]) allOK=false; console.log((checks[k]?'[OK] ':'[FAIL] ')+k); }
console.log(allOK?'\nALL CHECKS PASSED':'\nSOME CHECKS FAILED');
process.exit(allOK?0:1);
