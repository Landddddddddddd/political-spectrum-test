const fs=require('fs');
const BANK=JSON.parse(fs.readFileSync('C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/question_bank.json','utf8'));
const BYID={}; BANK.forEach(q=>BYID[q.id]=q);
const DIMS=[
 {key:"ECO",poles:[{k:"L"},{k:"R"}]},{key:"GOV",poles:[{k:"A"},{k:"L"}]},
 {key:"CUL",poles:[{k:"T"},{k:"P"}]},{key:"NAT",poles:[{k:"N"},{k:"C"}]},
 {key:"ENV",poles:[{k:"G"},{k:"S"}]}];
const TOTAL=50;

function buildDomainCounts(seq){const m={};seq.forEach(id=>{const d=BYID[id].domain;m[d]=(m[d]||0)+1;});return m;}
function recomputeDimCounts(seq,answers){const c={};DIMS.forEach(d=>{c[d.key]={};d.poles.forEach(p=>c[d.key][p.k]=0);});
 seq.forEach(id=>{const ai=answers[id];if(ai==null)return;BYID[id].options[ai].tags.forEach(t=>{const[dim,pole]=t.split(":");if(c[dim]&&pole in c[dim])c[dim][pole]++;});});return c;}
function uncertainty(dim,c){const a=c[DIMS.find(d=>d.key===dim).poles[0].k];const b=c[DIMS.find(d=>d.key===dim).poles[1].k];const tot=a+b;return tot===0?1:1-Math.abs(a-b)/(tot+1);}
function selectNext(seq,answers){
 const dcount=buildDomainCounts(seq);const dimc=recomputeDimCounts(seq,answers);const used=new Set(seq);
 const maxD=Math.max(1,...Object.values(dcount));const unc={};DIMS.forEach(d=>unc[d.key]=uncertainty(d.key,dimc[d.key]));
 let best=null,bs=-1e9;
 BANK.forEach(q=>{if(used.has(q.id))return;const dc=dcount[q.domain]||0;const ds=dc===0?1000:(maxD-dc)*10;
  const cov=new Set();q.options.forEach(o=>o.tags.forEach(t=>cov.add(t.split(":")[0])));let info=0;cov.forEach(d=>info+=unc[d]);
  const sc=ds+info*5+Math.random()*0.01;if(sc>bs){bs=sc;best=q;}});
 seq.push(best.id);
}

// 模拟 N 次完整测试
const N=200; let domainHist={}; let allDistinct=true; const archs={};
for(let t=0;t<N;t++){
 const seq=[];const answers={};
 selectNext(seq,answers);
 for(let p=0;p<TOTAL;p++){
   if(p>0){ if(seq[p]===undefined) selectNext(seq,answers); }
   // 随机作答
   answers[seq[p]]=Math.floor(Math.random()*BYID[seq[p]].options.length);
   if(p<TOTAL-1 && seq[p+1]===undefined) selectNext(seq,answers);
 }
 // 检查领域分布
 const dc=buildDomainCounts(seq);
 Object.entries(dc).forEach(([k,v])=>domainHist[k]=(domainHist[k]||0)+v);
 if(new Set(seq).size!==TOTAL) allDistinct=false;
 // 结果
 const counts=recomputeDimCounts(seq,answers);const res={};
 DIMS.forEach(d=>{const c=counts[d.key];let best=null,bn=-1,tie=false;d.poles.forEach(p=>{const n=c[p.k];if(n>bn){bn=n;best=p.k;tie=false;}else if(n===bn&&n>0)tie=true;});res[d.key]=(bn<=0||tie)?"混合":best;});
 // 简单归属（仅验证不崩溃）
 const sig=DIMS.map(d=>res[d.key]==="混合"?"·":res[d.key]).join("");
 archs[sig]=(archs[sig]||0)+1;
}
console.log("模拟次数:",N,"每次均为不同题:",allDistinct);
// 领域平均出现次数（理想：50题/30领域≈1.67，重复尽量少）
const vals=Object.values(domainHist).sort((a,b)=>a-b);
console.log("领域出现次数 最小/中位/最大:", vals[0], vals[Math.floor(vals.length/2)], vals[vals.length-1]);
console.log("出现≥3次（即被重复抽到）的领域数:", vals.filter(v=>v>=3).length, "/ 30");
console.log("维度签名分布(去重后种类):", Object.keys(archs).length);
console.log("示例签名:", Object.keys(archs).slice(0,5).join(" "));
console.log("✅ 模拟通过");
