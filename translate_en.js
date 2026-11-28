// 断点续传式英文翻译脚本（MyMemory 免密钥）
// 产出：question_bank.json 增加 scene_en / 每选项 t_en / domain_en
//       figures_bank.json 增加 note_en / role_en / bio_en / 每事迹 t_en,d_en / works_en(并行数组)
// 进度记录于 translate_progress.json；每日 MyMemory 配额用尽会自动停下，下次运行从断点续翻。
const fs = require('fs');
const https = require('https');
const BASE = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const QFILE = BASE + 'question_bank.json';
const FFILE = BASE + 'figures_bank.json';
const PROG  = BASE + 'translate_progress.json';
const EMAIL = 'translate@example.com';   // 绑邮箱可提升 MyMemory 每日配额
const DELAY = 550;                        // 请求间隔(ms)，避免限流
const TIMEOUT = 15000;

const q = JSON.parse(fs.readFileSync(QFILE, 'utf8'));
const f = JSON.parse(fs.readFileSync(FFILE, 'utf8'));
const prog = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')) : { qDone: {}, fDone: {} };
if (!prog.qDone) prog.qDone = {};
if (!prog.fDone) prog.fDone = {};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function mt(text) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.mymemory.translated.net/get?de=' + encodeURIComponent(EMAIL) +
                '&q=' + encodeURIComponent(text) + '&langpair=zh|en';
    const t = setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ideo-translate/1.0)' } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => {
        clearTimeout(t);
        try {
          const j = JSON.parse(d);
          const tt = j.responseData && j.responseData.translatedText;
          if (j.quotaFinished || (tt && /MYMEMORY WARNING/i.test(tt))) return resolve({ quota: true });
          return resolve({ text: tt });
        } catch (e) { reject(new Error('PARSE:' + d.slice(0, 120))); }
      });
    });
    req.on('error', e => { clearTimeout(t); reject(e); });
  });
}

let stopped = false;
async function tr(text) {
  if (!text || !text.trim()) return text || '';
  for (let i = 0; i < 3; i++) {
    try {
      const r = await mt(text);
      if (r.quota) { stopped = true; return null; }
      return r.text;
    } catch (e) {
      if (i === 2) throw e;
      await sleep(1000);
    }
  }
}

function save() {
  fs.writeFileSync(QFILE, JSON.stringify(q));
  fs.writeFileSync(FFILE, JSON.stringify(f));
  fs.writeFileSync(PROG, JSON.stringify(prog));
}

(async () => {
  let nQ = 0, nF = 0;
  // 题目
  for (const item of q) {
    if (prog.qDone[item.id]) continue;
    try {
      const sceneEn = await tr(item.scene); if (stopped) break;
      item.scene_en = sceneEn != null ? sceneEn : item.scene;
      const domEn = await tr(item.domain); if (stopped) break;
      item.domain_en = domEn != null ? domEn : item.domain;
      for (const o of item.options) {
        const tEn = await tr(o.t); if (stopped) break;
        o.t_en = tEn != null ? tEn : o.t;
        await sleep(DELAY);
      }
      if (stopped) break;
      prog.qDone[item.id] = true; nQ++;
      if (nQ % 5 === 0) { save(); console.log(`[题] 已完成 ${nQ} 道，最后 id=${item.id}`); }
      await sleep(DELAY);
    } catch (e) {
      console.log('ERR 题', item.id, e.message); save(); break;
    }
  }
  // 人物
  if (!stopped) {
    outer:
    for (const [key, arr] of Object.entries(f)) {
      for (let i = 0; i < arr.length; i++) {
        const fkey = key + '#' + i;
        if (prog.fDone[fkey]) continue;
        const fig = arr[i];
        try {
          fig.note_en = fig.note ? ((await tr(fig.note)) || fig.note) : ''; if (stopped) break;
          fig.role_en = fig.role ? ((await tr(fig.role)) || fig.role) : ''; if (stopped) break;
          fig.bio_en  = fig.bio  ? ((await tr(fig.bio))  || fig.bio)  : ''; if (stopped) break;
          for (const d of (fig.deeds || [])) {
            d.t_en = d.t ? ((await tr(d.t)) || d.t) : ''; if (stopped) break;
            d.d_en = d.d ? ((await tr(d.d)) || d.d) : ''; if (stopped) break;
            await sleep(DELAY);
          }
          if (stopped) break;
          const worksEn = [];
          for (const w of (fig.works || [])) {
            const we = await tr(w); if (stopped) break;
            worksEn.push(we != null ? we : w);
            await sleep(DELAY);
          }
          if (stopped) break;
          fig.works_en = worksEn;
          prog.fDone[fkey] = true; nF++;
          if (nF % 5 === 0) { save(); console.log(`[人] 已完成 ${nF} 位，最后 ${key}#${i}`); }
          await sleep(DELAY);
        } catch (e) {
          console.log('ERR 人', fkey, e.message); save(); break;
        }
      }
    }
  }
  save();
  console.log(`DONE. stopped(配额用尽)=${stopped} 本轮翻译 题=${nQ} 人=${nF}`);
})();
