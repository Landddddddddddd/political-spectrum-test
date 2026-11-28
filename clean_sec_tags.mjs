// clean_sec_tags.mjs — 清洗存量题库中语义错位的 SEC 标签
// 权威定义（ideology-test-adaptive.html const DIMS）：
//   SEC:E = 世俗公共(Secular Public)   SEC:F = 信仰入公(Faith in Public)
// 存量误用：SEC 被当成「自由↔管控 / 进步↔保守」轴（E=自由/进步, F=保守/管控）
//   实际应属 GOV(自由/权威)、CUL(进步/传统)、TECH(隐私/管控) 等维度
//
// 保守策略：仅当选项文本明确涉及「宗教/信仰/世俗公共」语境时才保留 SEC；
//          其余（言论/表达/艺术/媒体/监控/举报/下架/把关/守底线等）一律移除 SEC，
//          不强行补新维度（原选项通常已有 GOV/CUL/TECH 标签表达立场）。
// 输出三类：keep / remove / suspect（含"世俗"但语境不明，人工复核，不动）。
import fs from 'fs';

const BANK = 'question_bank.json';
const WRITE = process.argv.includes('--write');

// 明确宗教/信仰语境 → 合法 SEC
const RELIGION = /宗教|信仰|教会|清真|圣经|古兰|寺庙|教堂|道观|政教|祷告|祈祷|教义|教条|十字架|头巾|面纱|斋月|弥撒|礼拜|诵经|传教|福音|伊斯兰|基督|佛(教|像|陀)|菩萨|经文|戒律|神(明|父|像|佛)|创世|神创|神迹|修道|僧侣|阿訇|牧师|神父|洗礼|受戒|封斋|庙宇|经堂|圣(经|像|诞)/;
// 世俗公共语境（SEC:E 合法用法）→ 保留
const SECULAR_OK = /世俗(公共|教育|国家|社会|领域|主义|空间|立场|学校|课程)|世俗化|政教分离|公共领域去宗教|非宗教|政教/;
// 含"世俗"但语境不明 → 疑似，走 suspect
const SECULAR_VAGUE = /世俗/;
// 教育/价值观语境的委婉表达（可能是世俗课程 vs 信仰教导之争，但不含明确宗教词）→ 走 suspect 人工复核
const EDU_VAGUE = /价值观|教材|学校系统教|校园文化|公立学校|世俗教育|性教育|婚恋教育/;
// 该 domain 本身即是世俗↔信仰轴，域内选项带 SEC 视为合法，强制 keep
const SEC_DOMAIN = '宗教与信仰';

const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
const keep = [], remove = [], suspect = [];

for (const q of bank) {
  (q.options || []).forEach((o, idx) => {
    const tags = o.tags || [];
    const has = tags.filter(t => t === 'SEC:E' || t === 'SEC:F');
    if (!has.length) return;
    const t = o.t || '';
    const newTags = tags.filter(t => t !== 'SEC:E' && t !== 'SEC:F');
    const rec = { id: q.id, idx, domain: q.domain, t: t.slice(0, 60), oldTags: tags.slice(), newTags, pole: has };
    if (q.domain === SEC_DOMAIN) keep.push(rec);            // 域内即合法
    else if (RELIGION.test(t)) keep.push(rec);
    else if (SECULAR_OK.test(t)) keep.push(rec);
    else if (SECULAR_VAGUE.test(t)) suspect.push(rec);
    else if (EDU_VAGUE.test(t)) suspect.push(rec);
    else remove.push(rec);
  });
}

console.log(`SEC:E/F 命中选项共=${keep.length + remove.length + suspect.length}`);
console.log(`  keep(明确宗教/世俗公共, 保留)=${keep.length}`);
console.log(`  remove(非宗教语境, 移除SEC)=${remove.length}`);
console.log(`  suspect(含"世俗"语境不明, 人工复核)=${suspect.length}`);

if (!WRITE) {
  fs.writeFileSync('sec_clean_report.json', JSON.stringify({ keep, remove, suspect }, null, 2));
  console.log('已写出 sec_clean_report.json（未修改题库）。查看 remove/suspect 列表复核。');
  process.exit(0);
}

// --write：执行移除（keep/suspect 不动）——必须与 dry-run 决策逻辑一致
let n = 0;
for (const q of bank) {
  (q.options || []).forEach(o => {
    const tags = o.tags || [];
    if (tags.some(t => t === 'SEC:E' || t === 'SEC:F')) {
      const t = o.t || '';
      const isKeep = q.domain === SEC_DOMAIN || RELIGION.test(t) || SECULAR_OK.test(t);
      const isSuspect = !isKeep && (SECULAR_VAGUE.test(t) || EDU_VAGUE.test(t));
      if (!isKeep && !isSuspect) {
        o.tags = tags.filter(t => t !== 'SEC:E' && t !== 'SEC:F');
        n++;
      }
    }
  });
}
fs.writeFileSync(BANK, JSON.stringify(bank, null, 2));
console.log(`已移除 ${n} 个选项的 SEC 标签并写回 ${BANK}。`);
