// 对 measure_accuracy.out.json 的实测点做最小二乘饱和曲线拟合
import fs from 'fs';
const M = JSON.parse(fs.readFileSync('measure_accuracy.out.json','utf8'));
const pts = M.map(o=>({n:o.n, acc:o.acc, dims:o.dims}));

// 模型：f(n) = base + (top-base) * n/(n+half)，n→∞ 收敛到 top
function sse(P, key){
  let s=0;
  for(const p of pts){
    const f = P.base + (P.top-P.base)*(p.n/(p.n+P.half));
    s += (f-p[key])**2;
  }
  return s;
}
function fit(key){
  let best=null, bestS=Infinity;
  // 粗网格 + 坐标下降
  const bases = key==='acc' ? [56,58,60,62,64,66] : [5.5,6.0,6.5,7.0];
  const tops  = key==='acc' ? [74,76,78,80,82]     : [8.0,8.0,8.0,8.0];
  const halves= [6,9,12,16,20,26,34,44];
  for(const base of bases) for(const top of tops) for(const half of halves){
    let P={base,top,half}, s=sse(P,key);
    if(s<bestS){ bestS=s; best=P; }
  }
  // 坐标下降精修
  for(let it=0; it<600; it++){
    let improved=false;
    for(const k of ['base','top','half']){
      const step = k==='half'?0.5:0.2;
      for(const dir of [1,-1]){
        const cand={...best, [k]: best[k]+dir*step};
        if(cand[k]<=0) continue;
        const s=sse(cand,key);
        if(s<bestS-1e-9){ bestS=s; best=cand; improved=true; }
      }
    }
    if(!improved) break;
  }
  return {P:best, sse:bestS};
}
const fa=fit('acc'), fd=fit('dims');
const rms=(key,P)=>Math.sqrt(sse(P,key)/pts.length);
console.log('ACC  fit:', JSON.stringify({base:+fa.P.base.toFixed(4), top:+fa.P.top.toFixed(4), half:+fa.P.half.toFixed(3)}), 'RMSE=', rms('acc',fa.P).toFixed(3));
console.log('DIMS fit:', JSON.stringify({base:+fd.P.base.toFixed(4), top:+fd.P.top.toFixed(4), half:+fd.P.half.toFixed(3)}), 'RMSE=', rms('dims',fd.P).toFixed(3));
// 打印拟合曲线在样本点上的对照
console.log('\nn   acc_meas  acc_fit   dims_meas  dims_fit');
for(const p of pts){
  const af=fa.P.base+(fa.P.top-fa.P.base)*(p.n/(p.n+fa.P.half));
  const df=fd.P.base+(fd.P.top-fd.P.base)*(p.n/(p.n+fd.P.half));
  console.log(String(p.n).padStart(3), p.acc.toFixed(1).padStart(8), af.toFixed(1).padStart(8), '   ', p.dims.toFixed(2).padStart(7), df.toFixed(2).padStart(8));
}
