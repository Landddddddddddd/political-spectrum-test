// 回溯回填题库英文源（scene_en / domain_en / options[].t_en）
// 方式：MyMemory 免费接口（zh->en），经 HTTP_PROXY 代理。
// 配额：匿名 ≈500 字符/天；设置环境变量 MYMEMORY_EMAIL 后可升至 5000 字符/天
//       （MyMemory 按邮箱计配额，不会外发，仅作为 de= 参数透传）。
// 可断点续跑：每翻完一题即写回 question_bank.json；已完整的题自动跳过。
// 配额友好：遇 quotaFinished / 429 / 403 自动停，保留进度，下次重跑续接。
// 用法：node backfill_en.mjs [最大题数]   （默认不限，跑完或配额耗尽为止）
// 提速：MYMEMORY_EMAIL=you@example.com node backfill_en.mjs
//       或把邮箱写进 backfill_email.txt（已 gitignore），之后裸跑 node backfill_en.mjs 即可
//       ↑ 优先级：环境变量 > backfill_email.txt > 匿名
import fs from 'fs';
import { execFileSync } from 'child_process';

const BANK = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/question_bank.json';
const EMAIL_FILE = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/backfill_email.txt';
const PROXY = process.env.HTTP_PROXY || 'http://127.0.0.1:7897';

// 邮箱来源：环境变量优先，其次本地文件（写一次即可，无需每天重打）
function readEmailFile() {
  try { return fs.readFileSync(EMAIL_FILE, 'utf8').trim(); } catch { return ''; }
}
const EMAIL = (process.env.MYMEMORY_EMAIL || '').trim() || readEmailFile();
const MAXQ = Number(process.argv[2] || 0); // 0 = 不限
const DOMAIN_EN = {
  '社区邻里': 'Community & Neighborhood', '职场雇佣': 'Workplace & Employment',
  '言论表达': 'Speech & Expression', '经济分配': 'Economic Distribution',
  '贸易产业': 'Trade & Industry', '环境生态': 'Environment & Ecology',
  '学校教育': 'School & Education', '移民文化': 'Immigration & Culture',
  '监控隐私': 'Surveillance & Privacy', '医疗健康': 'Healthcare',
  '性别平权': 'Gender Equality', '科技AI': 'Technology & AI',
  '司法法治': 'Justice & Rule of Law', '宗教与信仰': 'Religion & Belief',
  '住房城市': 'Housing & Urban', '农业食品': 'Agriculture & Food',
  '媒体信息': 'Media & Information', '治安刑罚': 'Policing & Punishment',
  '外交国际': 'Foreign Affairs & International', '社会保障': 'Social Security',
  '家庭婚姻': 'Family & Marriage', '动物伦理': 'Animal Ethics',
  '艺术文化': 'Art & Culture', '体育竞技': 'Sports & Competition',
  '老龄化养老': 'Aging & Elderly Care', '消费债务': 'Consumption & Debt',
  '能源基建': 'Energy & Infrastructure', '气候灾害': 'Climate & Disasters',
  '数字平台': 'Digital Platforms', '少数群体': 'Minority Groups',
};

let charsUsed = 0, calls = 0;
let quotaHit = false;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// 单次调用（不重试）
function callOnce(text) {
  const url = 'https://api.mymemory.translated.net/get?langpair=zh%7Cen'
    + (EMAIL ? '&de=' + encodeURIComponent(EMAIL) : '')
    + '&q=' + encodeURIComponent(text);
  const out = execFileSync('curl', ['-s', '--max-time', '30', '-x', PROXY, url],
    { encoding: 'utf8', maxBuffer: 1 << 24 });
  const j = JSON.parse(out);
  if (j.quotaFinished === true) { quotaHit = true; throw Object.assign(new Error('quota finished'), { quota: true }); }
  if (j.responseStatus !== 200) {
    throw Object.assign(new Error('status ' + j.responseStatus + ' :: ' + (j.responseDetails || '')),
      { quota: j.responseStatus === 429 || j.responseStatus === 403 });
  }
  const t = (j.responseData && j.responseData.translatedText) || '';
  if (!t || /^(MYMEMORY WARNING|QUERY LENGTH LIMIT)/i.test(t)) throw new Error('empty/limited: ' + t.slice(0, 60));
  calls++; charsUsed += text.length;
  return String(t).trim();
}

// 带重试 + 长文本分段
async function translate(text) {
  const src = String(text || '').trim();
  if (!src) return '';
  // 超长文本按句切成 ≤140 字的块分别翻译再拼接，避免接口截断
  if (src.length > 140) {
    const parts = [];
    let buf = '';
    for (const ch of src) {
      buf += ch;
      if ((/[。！？；\n]/).test(ch) && buf.length >= 90) { parts.push(buf); buf = ''; }
      else if (buf.length >= 140) { parts.push(buf); buf = ''; }
    }
    if (buf.trim()) parts.push(buf);
    const outs = [];
    for (const p of parts) { outs.push(await translate(p)); await sleep(150); }
    return outs.filter(Boolean).join(' ');
  }
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try { return callOnce(src); }
    catch (e) {
      lastErr = e;
      if (e.quota) throw e;
      await sleep(400 * attempt); // 偶发 null 退避重试
    }
  }
  throw lastErr;
}

function save(bank) { fs.writeFileSync(BANK, JSON.stringify(bank, null, 2)); }

const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
const need = q => !q.scene_en || (q.options || []).some(o => !o.t_en);
let queue = bank.filter(need).map(q => q.id);
if (MAXQ > 0) queue = queue.slice(0, MAXQ);
console.log(`[backfill] 配额模式 = ${EMAIL ? '注册档(~5000字符/天) de=' + EMAIL : '匿名档(~500字符/天) — 建议设置 MYMEMORY_EMAIL 或写入 backfill_email.txt'}`);
console.log('[backfill] 待回填题数 =', queue.length, '/ 题库总数', bank.length, ' 预计调用 ~', bank.filter(need).reduce((s, q) => s + 1 + (q.options || []).filter(o => !o.t_en).length, 0));

let done = 0, failed = 0;
const t0 = Date.now();
for (const id of queue) {
  if (quotaHit) break;
  const q = bank.find(x => x.id === id);
  if (!q || !need(q)) continue;
  try {
    if (!q.scene_en) { q.scene_en = await translate(q.scene); await sleep(150); }
    q.domain_en = DOMAIN_EN[q.domain] || q.domain_en || q.domain;
    for (const o of q.options) {
      if (o.t_en) continue;
      o.t_en = await translate(o.t);
      await sleep(150);
    }
    done++;
    save(bank); // 每题即存，断点安全
    if (done % 10 === 0) {
      const el = ((Date.now() - t0) / 1000).toFixed(0);
      console.log(`[backfill] 进度 ${done}/${queue.length} | 调用 ${calls} | 字符 ${charsUsed} | 用时 ${el}s`);
    }
  } catch (e) {
    if (e.quota || quotaHit) {
      console.log(`[backfill] ⚠️ 配额/限流触发，停止。已完成 ${done} 题，调用 ${calls}，字符 ${charsUsed}。进度已写回，可改日重跑续接。`);
      save(bank); process.exit(0);
    }
    failed++;
    console.log(`[backfill] id=${id} 失败跳过: ${e.message.slice(0, 80)}`);
    save(bank);
    if (failed >= 30) { console.log('[backfill] 连续失败过多，停止保护。'); save(bank); process.exit(1); }
  }
}
save(bank);
const el = ((Date.now() - t0) / 1000).toFixed(0);
console.log(`[backfill] 本轮结束。回填 ${done} 题，失败 ${failed}，调用 ${calls}，字符 ${charsUsed}，用时 ${el}s`);
console.log(quotaHit ? '[backfill] 结束原因：配额耗尽' : '[backfill] 结束原因：队列跑完或达上限');
