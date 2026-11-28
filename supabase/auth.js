// =============================================================
// C-lite 客户端模块（服务端失明）
// 依赖：supabase/config.js 先加载并填好凭证。
// 行为：未配置(SUPABASE_READY()=false)时全部方法 no-op，绝不破坏现有应用。
// 注意：本文件为「可接入」骨架，逻辑完整但未在真实 Supabase 上跑过，
//       待你按 SETUP_GUIDE 配好凭证后，由我接进 ideology-test-adaptive.html。
// =============================================================

(function () {
  if (typeof window === "undefined") return;
  const CSync = {};
  let _client = null;      // supabase client
  let _me = null;          // 当前 profile {id, handle, ...}
  let _resultKey = null;   // 本机持有的结果对称密钥(CryptoKey, 存在内存+localStorage)
  const LS_KEY = "ideo_csync_key"; // base64 结果密钥，设备本地
  const LS_ECDH = "ideo_csync_ecdh"; // ECDH 私钥 JWK，设备本地，服务器永不可见

  // ---------- 初始化 ----------
  CSync.init = async function () {
    if (!window.SUPABASE_READY || !window.SUPABASE_READY()) return false;
    if (_client) return true;
    await _loadECDH(); // 本地 ECDH 私钥（设备级，无网络）
    try {
      const { createClient } = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
      );
      const c = window.SUPABASE_CONFIG;
      _client = createClient(c.URL, c.ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
      const { data: { user } } = await _client.auth.getUser();
      if (user) _me = await CSync._loadOrCreateProfile(user);
      return true;
    } catch (e) {
      console.warn("[CSync] init failed:", e);
      return false;
    }
  };

  CSync.isSignedIn = function () { return !!_me; };
  CSync.me = function () { return _me; };

  // ---------- 登录 / 登出 ----------
  CSync.signIn = async function (provider) {
    if (!(await CSync.init())) return { error: "not-configured" };
    // provider: 'google' | 'discord' | 'apple'
    const { error } = await _client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: location.href }
    });
    return error ? { error } : { ok: true };
  };

  CSync.signOut = async function () {
    if (!_client) return;
    await _client.auth.signOut();
    _me = null; _resultKey = null;
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
  };

  // 登录态变化监听（Supabase 回跳后触发）
  CSync.onAuth = function (cb) {
    if (!_client) return;
    _client.auth.onAuthStateChange(async (ev, session) => {
      if (session && session.user) _me = await CSync._loadOrCreateProfile(session.user);
      else _me = null;
      cb && cb(ev, _me);
    });
  };

  // ---------- profile ----------
  CSync._loadOrCreateProfile = async function (user) {
    const { data, error } = await _client
      .from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (error) { console.warn(error); return null; }
    if (data) return data;
    return { id: user.id }; // 已登录但还没建 profile → 返回带 id 的占位，供首次 setup
  };

  // 首次设置：handle / 区域 / 同意 / 年龄 / 公钥
  CSync.setupProfile = async function ({ handle, region, consent, ageOk, pubkey }) {
    if (!_client || !_me) return { error: "not-signed-in" };
    const { data, error } = await _client.from("profiles").upsert({
      id: _me.id, handle, region,
      consent: !!consent,
      age_ok: !!ageOk,
      pubkey
    }).select().single();
    if (error) return { error };
    _me = data; return { ok: true, profile: data };
  };

  CSync.findHandle = async function (handle) {
    if (!_client) return [];
    const { data } = await _client
      .from("profile_directory")   // 视图：仅 id/handle/pubkey，绝不暴露 email
      .select("id,handle,pubkey")
      .eq("handle", handle).maybeSingle();
    return data;
  };

  // ---------- 结果加密同步（服务端失明核心） ----------
  // 生成本地结果对称密钥（若已有则复用，实现跨设备需配合口令派生，见备注）
  CSync.ensureResultKey = async function () {
    if (_resultKey) return _resultKey;
    const cached = (function(){ try { return localStorage.getItem(LS_KEY); } catch(e){ return null; } })();
    if (cached) {
      _resultKey = await importKeyB64(cached);
      return _resultKey;
    }
    _resultKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const raw = await crypto.subtle.exportKey("raw", _resultKey);
    try { localStorage.setItem(LS_KEY, bufToB64(raw)); } catch (e) {}
    return _resultKey;
  };

  // 把“结果对象”加密上行（results 只存密文）
  CSync.uploadResult = async function (resultObj) {
    if (!_client || !_me) return { error: "not-signed-in" };
    const key = await CSync.ensureResultKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const pt = new TextEncoder().encode(JSON.stringify(resultObj));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, pt);
    const { error } = await _client.from("results").upsert({
      user_id: _me.id,
      iv: bufToB64(iv),
      ciphertext: bufToB64(ct),
      ver: 1
    });
    return error ? { error } : { ok: true };
  };

  CSync.downloadOwnResult = async function () {
    if (!_client || !_me) return null;
    const { data } = await _client.from("results")
      .select("iv,ciphertext").eq("user_id", _me.id).maybeSingle();
    if (!data) return null;
    const key = await CSync.ensureResultKey();
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBuf(data.iv) }, key, b64ToBuf(data.ciphertext));
    return JSON.parse(new TextDecoder().decode(pt));
  };

  // ---------- 好友 ----------
  CSync.sendFriendRequest = async function (targetHandle) {
    if (!_client || !_me) return { error: "not-signed-in" };
    const t = await CSync.findHandle(targetHandle);
    if (!t) return { error: "no-such-handle" };
    if (t.id === _me.id) return { error: "self" };
    const { error } = await _client.from("friendships").insert({ a: _me.id, b: t.id, status: "pending" });
    if (error) return { error };
    CSync.notifyFriendRequest(t.id); // 异步发信，不阻塞（对方若绑定邮箱则收通知）
    return { ok: true, target: t };
  };

  CSync.acceptFriend = async function (requesterId) {
    if (!_client || !_me) return { error: "not-signed-in" };
    const { error } = await _client.from("friendships")
      .update({ status: "accepted" })
      .eq("a", requesterId).eq("b", _me.id);
    return error ? { error } : { ok: true };
  };

  CSync.listFriends = async function () {
    if (!_client || !_me) return [];
    const { data } = await _client.from("friendships")
      .select("a,b,status").or(`a.eq.${_me.id},b.eq.${_me.id}`);
    if (!data) return [];
    const ids = data.map(f => f.a === _me.id ? f.b : f.a);
    const { data: profs } = await _client.from("profile_directory")
      .select("id,handle,pubkey").in("id", ids);
    return (profs || []).map(p => {
      const rel = data.find(f => (f.a === p.id || f.b === p.id));
      return { ...p, status: rel.status, incoming: rel.b === _me.id && rel.status === "pending" };
    });
  };

  // ---------- 邮箱可选绑定（与 results/friendships 分离，存 profiles.email） ----------
  // 仅用于：① 恢复信封重置通知 ② 好友请求通知；绝不用于营销。
  // 即便绑定邮箱，E2E 结果密钥仍由本机口令派生，服务器看不到明文密钥（见底部备注）。
  CSync.bindEmail = async function (email) {
    if (!_client || !_me) return { error: "not-signed-in" };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email || "")) return { error: "bad-email" };
    const { data, error } = await _client.from("profiles")
      .update({ email, email_verified: false }).eq("id", _me.id)
      .select("email,email_verified").single();
    if (error) return { error };
    _me = { ..._me, ...data };
    return { ok: true, needVerify: true };
  };

  CSync.unbindEmail = async function () {
    if (!_client || !_me) return { error: "not-signed-in" };
    const { data, error } = await _client.from("profiles")
      .update({ email: null, email_verified: false }).eq("id", _me.id)
      .select("email,email_verified").single();
    if (error) return { error };
    _me = { ..._me, ...data };
    return { ok: true };
  };

  // 触发一次邮箱验证（由 Edge Function 发验证链接；客户端只发起，不碰他人 email）
  CSync.sendEmailVerify = async function () {
    if (!_client || !_me || !_me.email) return { error: "no-email" };
    const { error } = await _client.functions.invoke("csync-notify", {
      body: { action: "verify-email", to: _me.id }
    });
    return error ? { error } : { ok: true };
  };

  // 通知：好友请求到达时，由 Edge Function 读取对方 profiles.email 发信
  CSync.notifyFriendRequest = async function (targetId) {
    if (!_client || !_me) return { error: "not-signed-in" };
    const { error } = await _client.functions.invoke("csync-notify", {
      body: { action: "friend-request", to: targetId, from: _me.handle }
    });
    return error ? { error } : { ok: true };
  };

  // 通知：恢复信封（口令重置）时，由 Edge Function 读取 profiles.email 发信
  CSync.notifyRecovery = async function () {
    if (!_client || !_me || !_me.email) return { error: "no-email" };
    const { error } = await _client.functions.invoke("csync-notify", {
      body: { action: "recovery-reset", to: _me.id }
    });
    return error ? { error } : { ok: true };
  };

  // ---------- 密钥交换（互看） ----------
  // A 授权 B：用 B 的公钥封装结果对称密钥，写入 key_shares
  CSync.shareWith = async function (friendId, friendPubKeyB64) {
    if (!_me) return { error: "not-signed-in" };
    await _loadECDH();
    if (!_ecdhPriv) return { error: "no-ecdh" };
    const myKey = await CSync.ensureResultKey();
    const friendPub = await importECDHPub(friendPubKeyB64);
    // 用本机 ECDH 私钥 + 对方公钥派生共享密钥（对称：对方用其私钥+我公钥得同一密钥）
    const wrapped = await crypto.subtle.deriveKey(
      { name: "ECDH", public: friendPub }, _ecdhPriv,
      { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    // 用派生密钥加密结果密钥的导出字节
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const rawMy = await crypto.subtle.exportKey("raw", myKey);
    const enc = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, wrapped, rawMy);
    const { error } = await _client.from("key_shares").upsert({
      owner: _me.id, friend: friendId,
      wrapped_key: bufToB64(iv) + ":" + bufToB64(enc)
    });
    return error ? { error } : { ok: true };
  };

  // B 取 A 的结果：读 A 的 results 密文 + 自己的 key_share，解密
  CSync.fetchFriendResult = async function (friendId) {
    if (!_client || !_me) return null;
    await _loadECDH();
    if (!_ecdhPriv) return null;
    const { data: res } = await _client.from("results")
      .select("iv,ciphertext").eq("user_id", friendId).maybeSingle();
    const { data: share } = await _client.from("key_shares")
      .select("wrapped_key").eq("owner", friendId).eq("friend", _me.id).maybeSingle();
    if (!res || !share) return null;
    const [ivB64, encB64] = share.wrapped_key.split(":");
    const myPriv = await getMyECDHPriv();
    const derived = await crypto.subtle.deriveKey(
      { name: "ECDH", public: await getFriendECDHPub(friendId) },
      myPriv, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    const rawMy = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBuf(ivB64) }, derived, b64ToBuf(encB64));
    const symKey = await importKeyB64(bufToB64(rawMy));
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBuf(res.iv) }, symKey, b64ToBuf(res.ciphertext));
    return JSON.parse(new TextDecoder().decode(pt));
  };

  // ---------- WebCrypto 底层（纯浏览器，无需凭证） ----------
  let _ecdhPriv = null;
  CSync.genECDH = async function () {
    const kp = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
    _ecdhPriv = kp.privateKey;
    try { localStorage.setItem(LS_ECDH, JSON.stringify(await crypto.subtle.exportKey("jwk", _ecdhPriv))); } catch (e) {}
    const pubRaw = await crypto.subtle.exportKey("raw", kp.publicKey);
    return bufToB64(pubRaw); // 存入 profiles.pubkey
  };
  async function _loadECDH() {
    if (_ecdhPriv) return true;
    try {
      const j = localStorage.getItem(LS_ECDH);
      if (j) {
        _ecdhPriv = await crypto.subtle.importKey(
          "jwk", JSON.parse(j),
          { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
        return true;
      }
    } catch (e) {}
    return false;
  }
  async function getMyECDHPriv() { return _ecdhPriv; }
  async function importECDHPub(b64) {
    return crypto.subtle.importKey("raw", b64ToBuf(b64),
      { name: "ECDH", namedCurve: "P-256" }, true, []);
  }
  async function getFriendECDHPub(friendId) {
    const { data } = await _client.from("profile_directory")
      .select("pubkey").eq("id", friendId).single();
    return importECDHPub(data.pubkey);
  }
  async function importKeyB64(b64) {
    return crypto.subtle.importKey("raw", b64ToBuf(b64),
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  }

  // ---------- 工具 ----------
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

  window.CSync = CSync;
})();

// =============================================================
// 备注（跨设备同步的真实落地）
// 当前 _resultKey 存于本机 localStorage，换设备会丢失 → 需“恢复口令”派生：
//   recoveryKey = PBKDF2(passphrase, salt) → 用它 AES-GCM 加密 _resultKey 的导出字节 →
//   存 results 之外的一列(或 key_shares 自引用)，新设备输入口令即可解密还原 _resultKey。
// 这一步在配好凭证、主线接通后再补；不影响好友互看（好友互看走 ECDH，不需恢复口令）。
// 重要：无论是否绑定邮箱，_resultKey 的派生/恢复始终基于口令，email 仅作通知渠道，
//       绝不作为密钥材料；服务器既看不到明文口令/密钥，也看不到政治倾向明文。
// =============================================================
