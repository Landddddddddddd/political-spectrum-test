import fs from 'fs';
const bank = JSON.parse(fs.readFileSync('question_bank.json', 'utf8'));
const orig = bank.filter(q => q.id <= 890);
const news = bank.filter(q => q.id >= 891 && q.id <= 950);

let err = 0;
const fail = (m) => { console.error('FAIL:', m); err++; };

// 1. counts
if (bank.length !== 950) fail('bank length ' + bank.length);
if (news.length !== 60) fail('new count ' + news.length);
const maxId = Math.max(...bank.map(q => q.id));
if (maxId !== 950) fail('max id ' + maxId);
const ids = bank.map(q => q.id).sort((a,b)=>a-b);
for (let i=0;i<ids.length;i++) if (ids[i] !== i+1) { fail('id gap at ' + (i+1)); break; }

// existing 30 domains + their en
const domMap = {};
for (const q of orig) domMap[q.domain] = q.domain_en;
const validDomains = new Set(Object.keys(domMap));
if (validDomains.size !== 30) fail('orig domain count ' + validDomains.size);

// forbidden phrasing
const FORB = ['本质上是','显然','毋庸置疑','唯一出路','才是正解','盲目','极端','自私'];
const NEUTRAL_T = '说实话这几个说法都不代表我，这题我宁愿跳过。';
const NEUTRAL_EN = 'Honestly, none of these speaks for me on this one — I\'d rather just skip it.';

// valid tags
const DIMS = {ECO:['L','R'],GOV:['A','L'],CUL:['T','P'],NAT:['N','C'],ENV:['G','S'],TECH:['K','U'],SEC:['E','F'],COL:['I','M']};
function validTag(t){const [d,p]=t.split(':'); return DIMS[d] && DIMS[d].includes(p);}

const usedDims = new Set();
let domCount = {};
for (const q of news) {
  if (!validDomains.has(q.domain)) fail('Q'+q.id+' unknown domain '+q.domain);
  if (q.domain_en !== domMap[q.domain]) fail('Q'+q.id+' domain_en mismatch '+q.domain_en+' vs '+domMap[q.domain]);
  if (!q.scene || !q.scene_en || !q.domain || !q.domain_en) fail('Q'+q.id+' missing field');
  if (typeof q.scene_en !== 'string' || q.scene_en.length < 10) fail('Q'+q.id+' bad scene_en');

  if (!Array.isArray(q.options) || q.options.length < 5) fail('Q'+q.id+' options<5');
  const last = q.options[q.options.length-1];
  if (last.t !== NEUTRAL_T || last.t_en !== NEUTRAL_EN || !Array.isArray(last.tags) || last.tags.length !== 0) {
    fail('Q'+q.id+' neutral option wrong');
  }
  // stance options: 4 of them
  for (let i=0;i<q.options.length-1;i++){
    const o = q.options[i];
    if (typeof o.t !== 'string' || typeof o.t_en !== 'string' || !Array.isArray(o.tags)) fail('Q'+q.id+' opt'+i+' field bad');
    if (o.tags.length < 2 || o.tags.length > 3) fail('Q'+q.id+' opt'+i+' tag count '+o.tags.length);
    const dimSet = new Set();
    for (const t of o.tags){ if(!validTag(t)) fail('Q'+q.id+' opt'+i+' bad tag '+t); dimSet.add(t.split(':')[0]); usedDims.add(t.split(':')[0]); }
    if (dimSet.size < 2) fail('Q'+q.id+' opt'+i+' tags not spread across >=2 dims ('+o.tags.join(',')+')');
    const blob = o.t + ' ' + o.t_en;
    for (const f of FORB) if (blob.includes(f)) fail('Q'+q.id+' opt'+i+' forbidden "'+f+'"');
  }
  // scene forbidden
  for (const f of FORB) if ((q.scene+' '+q.scene_en).includes(f)) fail('Q'+q.id+' scene forbidden "'+f+'"');
  // each question should touch multiple dims overall
  domCount[q.domain] = (domCount[q.domain]||0)+1;
}

// every existing domain appears in new set? Not required, but 30 used across 60 => 2 each
const domsUsed = Object.keys(domCount);
if (domsUsed.length !== 30) fail('new questions use only '+domsUsed.length+' domains');
for (const d of domsUsed) if (domCount[d] !== 2) fail('domain '+d+' appears '+domCount[d]+' times (expected 2)');

console.log('Questions:', news.length, '| distinct dims used across new set:', [...usedDims].sort().join(','));
console.log('Domains used in new:', domsUsed.length, '(expected 30, each x2)');
if (err === 0) console.log('VERIFY NEW: PASS');
else { console.error('VERIFY NEW: ' + err + ' FAILURES'); process.exit(1); }
