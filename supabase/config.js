// =============================================================
// C-lite 配置文件 —— 你只需改这一处
// 把 SETUP_GUIDE.md 里拿到的 4 类凭证粘贴到下方即可。
// 未填时整个 C 功能自动关闭，不影响现有应用（本地测试/分享照常）。
// =============================================================

window.SUPABASE_CONFIG = {
  // ① Supabase 后台 Project Settings → API 里复制（前端可见，由 RLS 防护）
  URL:      "https://ixtvhikixfgddrdqjczd.supabase.co",   // 由 anon key 的 ref 字段推定
  ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dHZobGtpeGZnZGRyZHFqY3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjMwNjgsImV4cCI6MjEwMjE5OTA2OH0.GaiAkrwWC_MMtNgMr5kefmIZ5-JhcIkddKy1AE4bhqc",

  // ② OAuth 凭据（Client ID / Secret）走 Supabase 后台配置，**不放在这里**
  //    路径：Supabase Dashboard → Authentication → Providers → Google/Discord/Apple
  //    凭据只在服务端使用，绝不进前端代码（避免泄露）。
  //    配置完成后，前端调用 CSync.signIn('google' / 'discord') 即可使用。
};

// 简易可用性判断：任意一项未填即视为“未配置”
window.SUPABASE_READY = function () {
  const c = window.SUPABASE_CONFIG || {};
  return !!(c.URL && c.URL.indexOf("YOUR-") !== 0 &&
            c.ANON_KEY && c.ANON_KEY.indexOf("YOUR-") !== 0);
};
