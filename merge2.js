const fs = require("fs");
const DIR = "C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55";
const LEGAL = new Set(["ECO:L","ECO:R","GOV:A","GOV:L","CUL:T","CUL:P","NAT:N","NAT:C",
  "ENV:G","ENV:S","TECH:K","TECH:U","SEC:E","SEC:F","COL:I","COL:M"]);
const DOMAINS = new Set(["社区邻里","职场雇佣","言论表达","经济分配","贸易产业","环境生态","学校教育","移民文化",
  "监控隐私","医疗健康","性别平权","科技AI","司法法治","宗教与信仰","住房城市","农业食品","媒体信息","治安刑罚",
  "外交国际","社会保障","家庭婚姻","动物伦理","艺术文化","体育竞技","老龄化养老","消费债务","能源基建","气候灾害",
  "数字平台","少数群体"]);

const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
let bank = read(DIR + "/question_bank.json");
const orig = JSON.parse(JSON.stringify(bank)); // 工作副本
fs.writeFileSync(DIR + "/question_bank_300.json", JSON.stringify(orig, null, 0));

// ---- 1) 应用文本补丁（替换 scene 与 options.t，校验数量/顺序） ----
const textFiles = ["patch_text_1.json","patch_text_2.json","patch_text_3.json"];
let patchCount = 0, patchErr = 0;
textFiles.forEach(f => {
  const patches = read(DIR + "/" + f);
  const byId = {}; orig.forEach(q => byId[q.id] = q);
  patches.forEach(p => {
    const q = byId[p.id];
    if (!q) { console.log("文本补丁 id 不存在:", p.id); patchErr++; return; }
    if (!Array.isArray(p.opts) || p.opts.length !== q.options.length) {
      console.log("文本补丁选项数不符 id", p.id, p.opts.length, "vs", q.options.length); patchErr++; return;
    }
    q.scene = p.scene;
    p.opts.forEach((t, i) => { q.options[i].t = t; });
    patchCount++;
  });
});
console.log(`文本补丁应用：${patchCount} 题成功，${patchErr} 处错误`);

// ---- 2) 追加新题（校验合法性） ----
const newFiles = ["patch_new_a.json","patch_new_b.json"];
let added = 0, newErr = 0;
const haveId = new Set(orig.map(q => q.id));
newFiles.forEach(f => {
  const arr = read(DIR + "/" + f);
  arr.forEach(q => {
    if (haveId.has(q.id)) { console.log("新题 id 重复:", q.id); newErr++; return; }
    const errs = validateQ(q);
    if (errs.length) { console.log("新题非法 id", q.id, errs.join("; ")); newErr++; return; }
    orig.push(q); haveId.add(q.id); added++;
  });
});
console.log(`新题追加：${added} 题，${newErr} 处错误`);

// ---- 3) 整体校验 ----
let totalErr = 0;
orig.forEach(q => { const e = validateQ(q); if (e.length) { totalErr++; if (totalErr <= 10) console.log("整体非法 id", q.id, e.join("; ")); } });
console.log("整体校验错误数:", totalErr);

function validateQ(q){
  const e = [];
  if (typeof q.id !== "number") e.push("id 非数字");
  if (!DOMAINS.has(q.domain)) e.push("domain 非法:" + q.domain);
  if (typeof q.scene !== "string" || q.scene.length < 6) e.push("scene 过短");
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 8) e.push("options 数越界");
  const seenTags = new Set();
  (q.options || []).forEach(o => {
    if (typeof o.t !== "string" || o.t.length < 4) e.push("选项文本过短");
    if (!Array.isArray(o.tags) || o.tags.length < 1 || o.tags.length > 4) e.push("标签数越界");
    o.tags.forEach(t => { if (!LEGAL.has(t)) e.push("非法标签:" + t); seenTags.add(t.split(":")[0]); });
  });
  return e;
}

if (patchErr === 0 && newErr === 0 && totalErr === 0) {
  fs.writeFileSync(DIR + "/question_bank.json", JSON.stringify(orig, null, 0));
  console.log("✅ 已写入 question_bank.json，总题数:", orig.length);
} else {
  console.log("❌ 存在错误，未覆盖原库");
  process.exit(1);
}

// ---- 4) 统计 ----
const domCount = {}; const optDist = {}; const dimCover = {};
orig.forEach(q => { domCount[q.domain] = (domCount[q.domain]||0)+1;
  optDist[q.options.length] = (optDist[q.options.length]||0)+1;
  q.options.forEach(o => o.tags.forEach(t => { const d = t.split(":")[0]; dimCover[d]=(dimCover[d]||0)+1; })); });
console.log("领域分布:", domCount);
console.log("选项数分布:", optDist);
const DIMS = ["ECO","GOV","CUL","NAT","ENV","TECH","SEC","COL"];
console.log("各维度被标签命中题数(估):", DIMS.map(d=>d+":"+(dimCover[d]||0)).join("  "));
const minLen = Math.min(...orig.map(q=>q.scene.length));
const maxLen = Math.max(...orig.map(q=>q.scene.length));
const avgOptLen = orig.flatMap(q=>q.options.map(o=>o.t.length)).reduce((a,b)=>a+b,0) / orig.flatMap(q=>q.options).length;
console.log("scene 长度 min/avg/max:", minLen, Math.round(orig.reduce((a,q)=>a+q.scene.length,0)/orig.length), maxLen);
console.log("选项文本平均字数:", Math.round(avgOptLen));
