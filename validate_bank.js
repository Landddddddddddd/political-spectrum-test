const fs = require('fs');
const path = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/question_bank.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const DOMAINS = ["社区邻里","职场雇佣","言论表达","经济分配","贸易产业","环境生态","学校教育","移民文化","监控隐私","医疗健康","性别平权","科技AI","司法法治","宗教与信仰","住房城市","农业食品","媒体信息","治安刑罚","外交国际","社会保障","家庭婚姻","动物伦理","艺术文化","体育竞技","老龄化养老","消费债务","能源基建","气候灾害","数字平台","少数群体"];
const TAGS = new Set(["ECO:L","ECO:R","GOV:A","GOV:L","CUL:T","CUL:P","NAT:N","NAT:C","ENV:G","ENV:S"]);

let errors = [];
let warns = [];
const domCount = {};
const optCount = {};
let idSet = new Set();

if(!Array.isArray(data)) errors.push("根不是数组");
if(data.length !== 300) errors.push("总数="+data.length+" 应为300");

data.forEach((q,idx)=>{
  if(typeof q.id !== 'number') errors.push(`#${idx} 缺id`);
  else { if(idSet.has(q.id)) errors.push(`重复id ${q.id}`); idSet.add(q.id); }
  if(!DOMAINS.includes(q.domain)) errors.push(`#${q.id||idx} 非法domain: ${q.domain}`);
  else domCount[q.domain]=(domCount[q.domain]||0)+1;
  if(typeof q.scene !== 'string' || q.scene.length<5) errors.push(`#${q.id} scene异常`);
  if(!Array.isArray(q.options)) errors.push(`#${q.id} options非数组`);
  else {
    if(q.options.length<2 || q.options.length>8) errors.push(`#${q.id} options数=${q.options.length} 超出2-8`);
    optCount[q.options.length]=(optCount[q.options.length]||0)+1;
    const tagSets = [];
    q.options.forEach((o,oi)=>{
      if(typeof o.t !== 'string' || o.t.length<2) errors.push(`#${q.id} 选项${oi} 文本异常`);
      if(!Array.isArray(o.tags) || o.tags.length<1 || o.tags.length>3) errors.push(`#${q.id} 选项${oi} tags数异常`);
      else {
        o.tags.forEach(t=>{ if(!TAGS.has(t)) errors.push(`#${q.id} 选项${oi} 非法tag: ${t}`); });
        tagSets.push(o.tags.join(','));
      }
    });
    const uniq = new Set(tagSets);
    if(uniq.size < q.options.length) warns.push(`#${q.id} 选项标签组合有重复 (${q.options.length}选项/${uniq.size}种)`);
  }
});

console.log("=== 校验结果 ===");
console.log("总题数:", data.length);
console.log("每领域题数:");
DOMAINS.forEach(d=>{ const n=domCount[d]||0; if(n!==10) warns.push(`领域[${d}] 题数=${n} 不为10`); console.log(`  ${d}: ${n}`); });
console.log("选项数分布(2-8):", JSON.stringify(optCount));
console.log("错误数:", errors.length);
errors.slice(0,40).forEach(e=>console.log("  ✗", e));
console.log("警告数:", warns.length);
warns.slice(0,40).forEach(w=>console.log("  ⚠", w));
console.log(errors.length===0 ? "✅ 校验通过" : "❌ 存在错误需修复");
