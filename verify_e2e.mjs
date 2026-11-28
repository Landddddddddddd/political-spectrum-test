// =============================================================
// E2E 加密往返验证（复刻 auth.js 的 WebCrypto 算法，Node 端实跑）
// 目的：在真实执行密钥交换 + 加解密后，断言
//   A 用 B 公钥封装结果密钥 → 上传 results + key_shares
//   B 用自己私钥 + A 公钥派生同一密钥 → 解封 → 解密 results
//   得到的明文 == A 原始结果对象
// 同时验证 ECDH 私钥「JWK 导出/再导入」持久化路径（修复 #51 的根）
// =============================================================

const subtle = globalThis.crypto.subtle;

// —— 与 auth.js 完全一致的 base64 工具 ——
function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64ToBuf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

async function importKeyB64(b64) {
  return subtle.importKey("raw", b64ToBuf(b64),
    { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}
async function importECDHPub(b64) {
  return subtle.importKey("raw", b64ToBuf(b64),
    { name: "ECDH", namedCurve: "P-256" }, true, []);
}

function assert(cond, msg) {
  if (!cond) { console.error("❌ FAIL:", msg); process.exitCode = 1; }
  else console.log("✅", msg);
}

// ---------- 1. A 生成本机材料 ----------
// A 的 ECDH 私钥（内存态，模拟刚生成）
const aEcdh = await subtle.generateKey(
  { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
const aPubRaw = await subtle.exportKey("raw", aEcdh.publicKey);
const aPubB64 = bufToB64(aPubRaw);

// A 的结果对称密钥
const aResultKey = await subtle.generateKey(
  { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
const aResultRaw = await subtle.exportKey("raw", aResultKey);

// ---------- 2. B 生成本机材料 ----------
const bEcdh = await subtle.generateKey(
  { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
const bPubRaw = await subtle.exportKey("raw", bEcdh.publicKey);
const bPubB64 = bufToB64(bPubRaw);

// ---------- 3. A 封装结果密钥给 B（shareWith） ----------
const friendPubB = await importECDHPub(bPubB64);
const wrappedA = await subtle.deriveKey(
  { name: "ECDH", public: friendPubB }, aEcdh.privateKey,
  { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
const ivA = crypto.getRandomValues(new Uint8Array(12));
const encA = await subtle.encrypt(
  { name: "AES-GCM", iv: ivA }, wrappedA, aResultRaw);
const wrappedKeyA = bufToB64(ivA) + ":" + bufToB64(encA); // 存 key_shares

// ---------- 4. A 加密自己的结果（uploadResult） ----------
const resultObj = {
  dims: { ECO: 0.82, GOV: -0.41, CUL: 0.13, NAT: 0.95, ENV: 0.6, TECH: -0.2, SEC: 0.33, COL: -0.77 },
  top: "Social Libertarian Ecologist",
  v: 1,
};
const ivR = crypto.getRandomValues(new Uint8Array(12));
const ctR = await subtle.encrypt(
  { name: "AES-GCM", iv: ivR }, aResultKey,
  new TextEncoder().encode(JSON.stringify(resultObj)));
const resultRow = { iv: bufToB64(ivR), ciphertext: bufToB64(ctR) }; // 存 results

// ---------- 5. B 取 A 的结果并解封（fetchFriendResult） ----------
const myPrivB = bEcdh.privateKey; // B 的本机 ECDH 私钥
const aPubForB = await importECDHPub(aPubB64);
const derivedB = await subtle.deriveKey(
  { name: "ECDH", public: aPubForB }, myPrivB,
  { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
const [ivAB64, encAB64] = wrappedKeyA.split(":");
const rawMyB = await subtle.decrypt(
  { name: "AES-GCM", iv: b64ToBuf(ivAB64) }, derivedB, b64ToBuf(encAB64));
const symKeyB = await importKeyB64(bufToB64(rawMyB));
const ptB = await subtle.decrypt(
  { name: "AES-GCM", iv: b64ToBuf(resultRow.iv) }, symKeyB, b64ToBuf(resultRow.ciphertext));
const resultObjB = JSON.parse(new TextDecoder().decode(ptB));

assert(JSON.stringify(resultObjB) === JSON.stringify(resultObj),
  "B 解密得到 A 原始结果对象（ECDH 互看往返一致）");

// ---------- 6. 验证 ECDH 私钥持久化路径（JWK 导出→再导入） ----------
// 模拟刷新页面后从 localStorage 读回 JWK 恢复 _ecdhPriv
const jwk = await subtle.exportKey("jwk", aEcdh.privateKey);
const restoredPriv = await subtle.importKey(
  "jwk", jwk, { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
// 用恢复后的私钥再做一次封装，确认等价
const wrappedA2 = await subtle.deriveKey(
  { name: "ECDH", public: friendPubB }, restoredPriv,
  { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
const encA2 = await subtle.encrypt({ name: "AES-GCM", iv: ivA }, wrappedA2, aResultRaw);
const rawMyB2 = await subtle.decrypt(
  { name: "AES-GCM", iv: b64ToBuf(ivAB64) }, derivedB, encA2); // derivedB 基于 B 私钥+A公钥（不变）
const symKeyB2 = await importKeyB64(bufToB64(rawMyB2));
const ptB2 = await subtle.decrypt(
  { name: "AES-GCM", iv: b64ToBuf(resultRow.iv) }, symKeyB2, b64ToBuf(resultRow.ciphertext));
assert(JSON.stringify(JSON.parse(new TextDecoder().decode(ptB2))) === JSON.stringify(resultObj),
  "ECDH 私钥 JWK 持久化后恢复，仍能完成互看解密（#51 修复根因）");

if (process.exitCode) console.log("\n❌ E2E 验证未通过");
else console.log("\n✅ E2E 加密往返全部通过");
