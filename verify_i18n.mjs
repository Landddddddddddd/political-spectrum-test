// 多语言运行时沙箱校验：运行构建产物 deploy/index.html 的主脚本块，
// 用 Proxy 通用 DOM 桩 + location 桩执行，验证 i18n 合并与回退链（zh/en/ja/es/fr/de）。
import fs from 'fs';
import vm from 'vm';

const html = fs.readFileSync('deploy/index.html', 'utf8');

// 抽取所有 <script> 块，定位含 BANK 的主逻辑块（script #2）
const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m, blocks = [];
while ((m = re.exec(html))) blocks.push(m[1]);
const main = blocks.find(b => b.includes('const BANK =') || b.includes('applyI18nExtra'));
if (!main) { console.error('NO MAIN SCRIPT'); process.exit(1); }

// 中和 init() 顶层副作用：保留 applyI18nExtra 合并（在 init 之前执行），
// init 体内首行早返回，避免重 DOM 初始化；随后手动调用 applyLang/setLang 做路径覆盖。
let code = main.replace('(function init(){', '(function init(){ if(typeof window!=="undefined" && window.__NO_INIT__) return;');
if (!code.includes('__NO_INIT__')) { console.error('init 中和失败'); process.exit(1); }

code += `
;globalThis.__T = {
  DIMS: DIMS,
  DOMAIN_I18N: DOMAIN_I18N,
  UI_I18N: UI_I18N,
  TOAST_I18N: TOAST_I18N,
  BANK: (typeof BANK!=="undefined"?BANK:null),
  QUESTION_BANK: (typeof QUESTION_BANK!=="undefined"?QUESTION_BANK:null),
  FIGURES: (typeof FIGURES!=="undefined"?FIGURES:null),
  LANGS: LANGS,
  pick: pick, pickArr: pickArr, uiEntry: uiEntry,
  dname: dname, plabel: plabel, qdomain: qdomain, figName: figName, famName: famName,
  langFullIds: langFullIds, langCoverage: langCoverage,
  applyLang: applyLang, setLang: setLang,
  getLang: function(){ return CUR_LANG; }
};`;

// ---- 通用 DOM 桩 ----
function makeStyle() {
  return new Proxy({}, { get: () => '', set: () => true });
}
const classListStub = { add(){}, remove(){}, toggle(){}, contains(){ return false; } };
function makeEl() {
  const store = {};
  const el = new Proxy(function(){}, {
    get(t, prop) {
      if (prop === 'classList') return classListStub;
      if (prop === 'style') return makeStyle();
      if (prop === 'dataset') return {};
      if (prop === 'children' || prop === 'childNodes' || prop === 'options') return [];
      if (prop === 'parentElement') return el;
      if (prop === 'tagName') return 'DIV';
      if (prop === 'nodeType') return 1;
      if (prop === 'length') return 0;
      if (prop === 'closest') return () => null;
      if (prop === 'getAttribute') return (k) => (k in store ? store[k] : null);
      if (prop === 'setAttribute') return (k, v) => { store[k] = v; };
      if (prop === 'hasAttribute') return () => false;
      if (prop === 'addEventListener' || prop === 'removeEventListener') return () => {};
      if (prop === 'appendChild' || prop === 'removeChild' || prop === 'insertBefore') return () => {};
      if (prop === 'querySelector') return () => makeEl();
      if (prop === 'querySelectorAll') return () => [];
      if (prop === 'focus' || prop === 'blur' || prop === 'click' || prop === 'remove' || prop === 'scrollIntoView') return () => {};
      if (prop === 'getContext') return () => ({});
      if (['value','textContent','innerHTML','innerText','placeholder','nodeValue','id','title','max','min','checked','src','href'].includes(prop)) {
        return prop in store ? store[prop] : '';
      }
      // 默认：返回一个链式可调用的函数，避免 .forEach / 未知方法抛错
      return (...a) => el;
    },
    set(t, prop, val) { store[prop] = val; return true; },
    apply() { return el; }
  });
  return el;
}
const elCache = {};
const documentStub = {
  getElementById: (id) => (elCache[id] || (elCache[id] = makeEl())),
  querySelector: () => makeEl(),
  querySelectorAll: () => [],
  createElement: () => makeEl(),
  createTextNode: () => makeEl(),
  createTreeWalker: () => ({ nextNode: () => null }),
  addEventListener: () => {},
  removeEventListener: () => {},
  body: makeEl(),
  documentElement: makeEl(),
  title: '',
  get cookie() { return ''; },
  set cookie(v) {},
};
const localStore = new Map();
const localStorageStub = {
  getItem: (k) => (localStore.has(k) ? localStore.get(k) : null),
  setItem: (k, v) => localStore.set(k, String(v)),
  removeItem: (k) => localStore.delete(k),
};
const navigatorStub = { language: 'en', userAgent: 'node', languages: ['en'] };
const locationStub = { href: 'https://example.com/', origin: 'https://example.com', search: '', hash: '', pathname: '/', protocol: 'https:' };
const matchMediaStub = () => ({ matches: false, addEventListener(){}, removeEventListener(){}, addListener(){} });

const sb = {
  console,
  document: documentStub,
  navigator: navigatorStub,
  localStorage: localStorageStub,
  location: locationStub,
  NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 },
  matchMedia: matchMediaStub,
  setTimeout: () => 0,
  clearTimeout: () => {},
  setInterval: () => 0,
  clearInterval: () => {},
  requestAnimationFrame: () => 0,
  fetch: () => Promise.reject(new Error('no fetch')),
  __NO_INIT__: true,
  JSON, Math, Date, RegExp, Object, Array, String, Number, Boolean, Symbol, Set, Map, Promise, Proxy, Error, parseInt, parseFloat, isNaN,
};
sb.window = sb;
sb.self = sb;
sb.globalThis = sb;

vm.createContext(sb);
try {
  vm.runInContext(code, sb, { filename: 'main_logic.js' });
} catch (e) {
  console.error('EVAL ERROR:', e.message);
  console.error(e.stack ? e.stack.split('\n').slice(0,6).join('\n') : '');
  process.exit(1);
}

const T = sb.__T;
if (!T) { console.error('NO __T'); process.exit(1); }

// ================= 断言 =================
let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); }
}
const LANGS = ['zh','en','ja','es','fr','de'];

console.log('\n[1] applyI18nExtra 合并结果');
const ECO = T.DIMS.find(d => d.key === 'ECO');
ok('DIMS 共 8 维', T.DIMS.length === 8, 'len=' + T.DIMS.length);
ok('ECO.name_ja === 経済', ECO && ECO.name_ja === '経済', ECO && ECO.name_ja);
const ecoL = ECO && ECO.poles.find(p => p.k === 'L');
const ecoR = ECO && ECO.poles.find(p => p.k === 'R');
ok('ECO 极 L.label_ja === 平等／再分配', ecoL && ecoL.label_ja === '平等／再分配', ecoL && ecoL.label_ja);
ok('ECO 极 R.label_ja === 自由市場／私有', ecoR && ecoR.label_ja === '自由市場／私有', ecoR && ecoR.label_ja);
// 验证全部 8 维 ja 名非空
const allJaName = T.DIMS.every(d => d.name_ja && String(d.name_ja).trim());
ok('全部 8 维 name_ja 非空', allJaName);

console.log('\n[2] DOMAIN_I18N（域翻译）');
ok('DOMAIN_I18N 存在', !!T.DOMAIN_I18N);
ok('DOMAIN_I18N.ja["社区邻里"] === 地域社会', T.DOMAIN_I18N && T.DOMAIN_I18N.ja && T.DOMAIN_I18N.ja['社区邻里'] === '地域社会', T.DOMAIN_I18N && T.DOMAIN_I18N.ja && T.DOMAIN_I18N.ja['社区邻里']);
ok('DOMAIN_I18N 覆盖 ja/es/fr/de', T.DOMAIN_I18N && ['ja','es','fr','de'].every(l => T.DOMAIN_I18N[l] && Object.keys(T.DOMAIN_I18N[l]).length > 0));

console.log('\n[3] UI_I18N 静态文案子表');
ok('UI_I18N.en["意识形态测试"] === Political Spectrum Test', T.UI_I18N.en && T.UI_I18N.en['意识形态测试'] === 'Political Spectrum Test', T.UI_I18N.en && T.UI_I18N.en['意识形态测试']);
ok('UI_I18N.ja["意识形态测试"] === 政治スペクトル・テスト', T.UI_I18N.ja && T.UI_I18N.ja['意识形态测试'] === '政治スペクトル・テスト', T.UI_I18N.ja && T.UI_I18N.ja['意识形态测试']);
ok('UI_I18N 覆盖 ja/es/fr/de', ['ja','es','fr','de'].every(l => T.UI_I18N[l] && Object.keys(T.UI_I18N[l]).length > 0));

console.log('\n[4] pick 回退链（当前语言 _xx → en → zh 基础）');
const obj = { scene: '中', scene_en: 'en', scene_ja: 'ja', scene_es: 'es', scene_fr: 'fr', scene_de: 'de' };
const expect = { zh: '中', en: 'en', ja: 'ja', es: 'es', fr: 'fr', de: 'de' };
for (const l of LANGS) { T.setLang(l); ok('pick scene @' + l + ' === ' + expect[l], T.pick(obj, 'scene') === expect[l], T.pick(obj, 'scene')); }
// 回落：仅 zh + en，ja 应回落 en
T.setLang('ja');
ok('pick 回落(en) 当 ja 缺', T.pick({ scene: '中', scene_en: 'en' }, 'scene') === 'en', T.pick({ scene: '中', scene_en: 'en' }, 'scene'));
// 仅 zh，de 应回落 zh（en 也缺）
ok('pick 回落(zh) 当 en/de 缺', T.pick({ scene: '中' }, 'scene') === '中', T.pick({ scene: '中' }, 'scene'));

console.log('\n[5] dname / plabel / qdomain 访问器');
T.setLang('zh'); ok('dname(zh) === 经济', T.dname(ECO) === '经济', T.dname(ECO));
T.setLang('en'); ok('dname(en) 非空', !!T.dname(ECO) && T.dname(ECO) !== '经济', T.dname(ECO));
T.setLang('ja'); ok('dname(ja) === 経済', T.dname(ECO) === '経済', T.dname(ECO));
ok('plabel(ja) === 平等／再分配', T.plabel(ecoL) === '平等／再分配', T.plabel(ecoL));
// qdomain：取一题含 domain=社区邻里
const qSample = (T.BANK || T.QUESTION_BANK || []).find(q => q && q.domain === '社区邻里');
if (qSample) {
  T.setLang('ja'); ok('qdomain(ja) === 地域社会', T.qdomain(qSample) === '地域社会', T.qdomain(qSample));
  T.setLang('en'); ok('qdomain(en) 回落域_en/zh', T.qdomain(qSample) != null && T.qdomain(qSample) !== '', T.qdomain(qSample));
} else { ok('qdomain 样例(社区邻里)存在', false, '题库无此域题'); }

console.log('\n[6] langFullIds 抽题子集');
T.setLang('zh');
const zhIds = T.langFullIds('zh');
const bankLen = (T.BANK || T.QUESTION_BANK || []).length;
ok('langFullIds(zh) == 全库', zhIds.size === bankLen, zhIds.size + '/' + bankLen);
const enIds = T.langFullIds('en');
ok('langFullIds(en) > 0', enIds.size > 0, 'size=' + enIds.size);
ok('langFullIds(ja) == 0（无 ja 题）', T.langFullIds('ja').size === 0);
ok('langFullIds(es) == 0', T.langFullIds('es').size === 0);
ok('langFullIds(fr) == 0', T.langFullIds('fr').size === 0);
ok('langFullIds(de) == 0', T.langFullIds('de').size === 0);

console.log('\n[7] applyLang 逐语言路径不抛错');
for (const l of LANGS) {
  try { T.setLang(l); T.applyLang(); ok('applyLang @' + l + ' 无异常', true); }
  catch (e) { ok('applyLang @' + l + ' 无异常', false, e.message); }
}
T.setLang('en'); // 复位到默认

console.log('\n[8] figName 访问器（FIGURES 按阵营分组）');
let aFigure = null;
const figsRaw = T.FIGURES;
if (Array.isArray(figsRaw)) aFigure = figsRaw.find(f => f && typeof f === 'object' && f.name) || figsRaw[0];
else if (figsRaw && typeof figsRaw === 'object') {
  for (const k of Object.keys(figsRaw)) {
    const v = figsRaw[k];
    if (Array.isArray(v)) { const f = v.find(x => x && x.name); if (f) { aFigure = f; break; } }
    else if (v && typeof v === 'object' && v.name) { aFigure = v; break; }
  }
}
if (aFigure) {
  T.setLang('zh'); ok('figName(zh) 返回名称字符串', typeof T.figName(aFigure) === 'string' && T.figName(aFigure) !== '');
  T.setLang('ja');
  try {
    const r = T.figName(aFigure);
    ok('figName(ja) 不抛错且返回字符串或回退', (typeof r === 'string' || r === undefined || r === null), String(r));
  } catch (e) { ok('figName(ja) 不抛错', false, e.message); }
} else { ok('figName 样例', true, '无 figures（可选）'); }

console.log('\n==== 结果: ' + pass + ' PASS / ' + fail + ' FAIL ====');
process.exit(fail ? 1 : 0);
