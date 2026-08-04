const fs = require("fs");
const h = fs.readFileSync("deploy/index.html", "utf8");
const BANK = JSON.parse(h.match(/const QUESTION_BANK = (\[[\s\S]*?\]);/)[1]);
const BYID = {}; BANK.forEach(q => BYID[q.id] = q);
const DIMS = [
  {key:"ECO",poles:[{k:"L"},{k:"R"}]},{key:"GOV",poles:[{k:"A"},{k:"L"}]},
  {key:"CUL",poles:[{k:"T"},{k:"P"}]},{key:"NAT",poles:[{k:"N"},{k:"C"}]},
  {key:"ENV",poles:[{k:"G"},{k:"S"}]},{key:"TECH",poles:[{k:"K"},{k:"U"}]},
  {key:"SEC",poles:[{k:"E"},{k:"F"}]},{key:"COL",poles:[{k:"I"},{k:"M"}]},
];
function uncertainty(dim, c){
  const a=c[DIMS.find(d=>d.key===dim).poles[0].k], b=c[DIMS.find(d=>d.key===dim).poles[1].k];
  const tot=a+b; return tot===0?1:1-Math.abs(a-b)/(tot+1);
}
function selectNext(seq, answers){
  const dcount={}; seq.forEach(id=>{const d=BYID[id].domain; dcount[d]=(dcount[d]||0)+1;});
  const dimc={}; DIMS.forEach(d=>{dimc[d.key]={}; d.poles.forEach(p=>dimc[d.key][p.k]=0);});
  seq.forEach(id=>{const ai=answers[id]; if(ai==null)return; BYID[id].options[ai].tags.forEach(t=>{const[dim,pole]=t.split(":"); if(dimc[dim]&&pole in dimc[dim]) dimc[dim][pole]++;});});
  const used=new Set(seq); const maxD=Math.max(1,...Object.values(dcount));
  const unc={}; DIMS.forEach(d=>unc[d.key]=uncertainty(d.key,dimc[d.key]));
  let best=null,bestScore=-1e9;
  BANK.forEach(q=>{
    if(used.has(q.id)) return;
    const dc=dcount[q.domain]||0;
    const domainScore = dc===0?1000:(maxD-dc)*10;
    const covered=new Set(); q.options.forEach(o=>o.tags.forEach(t=>covered.add(t.split(":")[0])));
    let info=0; covered.forEach(dim=>info+=unc[dim]);
    const score=domainScore+info*5+Math.random()*0.01;
    if(score>bestScore){bestScore=score;best=q;}
  });
  seq.push(best.id);
}
function tally(seq, answers){
  const counts={}; DIMS.forEach(d=>{counts[d.key]={}; d.poles.forEach(p=>counts[d.key][p.k]=0);});
  seq.forEach(id=>{const ai=answers[id]; if(ai==null)return; BYID[id].options[ai].tags.forEach(t=>{const[dim,pole]=t.split(":"); if(counts[dim]&&pole in counts[dim])counts[dim][pole]++;});});
  return counts;
}
function dominant(counts){
  const res={}; DIMS.forEach(d=>{const c=counts[d.key]; let best=null,bestN=-1,tie=false;
    d.poles.forEach(p=>{const n=c[p.k]; if(n>bestN){bestN=n;best=p.k;tie=false;}else if(n===bestN&&n>0)tie=true;});
    res[d.key]=(bestN<=0||tie)?"混合":best;});
  return res;
}
const COUNTS=[15,30,50,100];
COUNTS.forEach(TOTAL=>{
  let crashes=0, distinctOK=0, domSpreadMin=999, nonMixedSum=0;
  const N=100;
  for(let it=0;it<N;it++){
    try{
      const seq=[], answers={};
      // 随机答前若干题以驱动 uncertainty（模拟真人：随机选）
      for(let i=0;i<TOTAL;i++){ selectNext(seq,answers); answers[seq[i]]=Math.floor(Math.random()*BYID[seq[i]].options.length); }
      const distinct=new Set(seq).size===TOTAL;
      if(distinct) distinctOK++;
      const dc={}; seq.forEach(id=>{const d=BYID[id].domain; dc[d]=(dc[d]||0)+1;});
      domSpreadMin=Math.min(domSpreadMin, Object.keys(dc).length);
      const res=dominant(tally(seq,answers));
      nonMixedSum += Object.values(res).filter(v=>v!=="混合").length;
    }catch(e){ crashes++; }
  }
  console.log(`题量=${TOTAL}: 崩溃=${crashes}, 选题全不重复=${distinctOK}/${N}, 最少覆盖领域数=${domSpreadMin}/30, 平均非混合维度数=${(nonMixedSum/N).toFixed(1)}/8`);
});
