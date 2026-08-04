const fs = require('fs');
const html = fs.readFileSync(__dirname+'/deploy/index.html','utf8');

// 抽取题库
const bi = html.indexOf('const QUESTION_BANK = ');
const bj = html.indexOf(';\nconst BANK', bi);
const BANK = JSON.parse(html.slice(bi + 'const QUESTION_BANK = '.length, bj));
const BYID = {}; BANK.forEach(q=>BYID[q.id]=q);

// 抽取 DIMS / ARCH
function extract(name){
  const i = html.indexOf('const '+name+' = ');
  const j = html.indexOf('];', i);
  return eval(html.slice(i + ('const '+name+' = ').length, j+1));
}
const DIMS = extract('DIMS');
const ARCH = extract('ARCH');
console.log('维度数:', DIMS.length, '| 子类型数:', ARCH.length, '| 题库:', BANK.length);

const TOTAL=50;
function buildDomainCounts(seq){const m={};seq.forEach(id=>{const d=BYID[id].domain;m[d]=(m[d]||0)+1;});return m;}
function recomputeDimCounts(seq,answers){const c={};DIMS.forEach(d=>{c[d.key]={};d.poles.forEach(p=>c[d.key][p.k]=0);});
  seq.forEach(id=>{const ai=answers[id];if(ai==null)return;BYID[id].options[ai].tags.forEach(t=>{const[dim,pole]=t.split(":");if(c[dim]&&pole in c[dim])c[dim][pole]++;});});return c;}
function uncertainty(dim,c){const a=c[DIMS.find(d=>d.key===dim).poles[0].k];const b=c[DIMS.find(d=>d.key===dim).poles[1].k];const tot=a+b;return tot===0?1:1-Math.abs(a-b)/(tot+1);}
function selectNext(seq,answers){
  const dcount=buildDomainCounts(seq);const dimc=recomputeDimCounts(seq,answers);const used=new Set(seq);
  const maxD=Math.max(1,...Object.values(dcount));const unc={};DIMS.forEach(d=>unc[d.key]=uncertainty(d.key,dimc[d.key]));
  let best=null,bestScore=-1e9;
  BANK.forEach(q=>{if(used.has(q.id))return;const dc=dcount[q.domain]||0;const domainScore=dc===0?1000:(maxD-dc)*10;
    const covered=new Set();q.options.forEach(o=>o.tags.forEach(t=>covered.add(t.split(":")[0])));
    let info=0;covered.forEach(dim=>info+=unc[dim]);const score=domainScore+info*5+Math.random()*0.01;
    if(score>bestScore){bestScore=score;best=q;}});
  seq.push(best.id);
}
function tallyDims(seq,answers){const c={};DIMS.forEach(d=>{c[d.key]={};d.poles.forEach(p=>c[d.key][p.k]=0);});
  seq.forEach(id=>{const ai=answers[id];if(ai==null)return;BYID[id].options[ai].tags.forEach(t=>{const[dim,pole]=t.split(":");if(c[dim]&&pole in c[dim])c[dim][pole]++;});});return c;}
function dominantPoles(counts){const res={};DIMS.forEach(d=>{const c=counts[d.key];let best=null,bestN=-1,tie=false;
  d.poles.forEach(p=>{const n=c[p.k];if(n>bestN){bestN=n;best=p.k;tie=false;}else if(n===bestN&&n>0){tie=true;}});
  res[d.key]=(bestN<=0||tie)?"混合":best;});return res;}
function matchArch(res){let best=null,bestScore=-1e9;ARCH.forEach(a=>{let s=0;for(const k in a.need){const u=res[k];
  if(u==="混合")continue;if(u===a.need[k])s++;else s--;}
  if(s>bestScore||(s===bestScore&&Object.keys(a.need).length>(best?Object.keys(best.need).length:0))){bestScore=s;best=a;}});
  if(bestScore<=0)best=ARCH.find(a=>a.name==="温和混合派");return best;}

// 模拟多次
const N=300;let crash=0;const resDist={};const dimDominantCount={};DIMS.forEach(d=>dimDominantCount[d.key]=0);
const sigSet=new Set();
for(let it=0;it<N;it++){
  const seq=[];const answers={};
  for(let i=0;i<TOTAL;i++){selectNext(seq,answers);const id=seq[i];const q=BYID[id];answers[id]=Math.floor(Math.random()*q.options.length);}
  try{
    const c=tallyDims(seq,answers);const r=dominantPoles(c);const p=matchArch(r);
    resDist[p.name]=(resDist[p.name]||0)+1;
    DIMS.forEach(d=>{if(r[d.key]!=="混合")dimDominantCount[d.key]++;});
    sigSet.add(DIMS.map(d=>r[d.key]==="混合"?"·":r[d.key]).join(""));
  }catch(e){crash++;console.log('崩溃',e.message);}
}
console.log('模拟次数:',N,'| 崩溃:',crash);
console.log('=== 各维度在结果中“非混合”的比例 ===');
DIMS.forEach(d=>console.log('  '+d.name+': '+(dimDominantCount[d.key]/N*100).toFixed(0)+'%'));
console.log('出现的维度签名种类数:',sigSet.size);
console.log('=== 结果分布（出现次数）===');
Object.entries(resDist).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log('  '+k+': '+v));
