// =============================================================
// csync-notify — C-lite 通知 Edge Function (Deno / TypeScript)
// -------------------------------------------------------------
// 职责：在「服务端失明」前提下，发送三类邮件通知。
//   1) verify-email   —— 用户绑定邮箱后，发验证链接（点击后翻转 email_verified）
//   2) friend-request —— 有人向目标发起好友请求时，若目标邮箱已验证则发信
//   3) recovery-reset —— 用户触发「恢复信封」重置时，发通知信
//
// 安全原则：
//   - 所有 POST 动作都要求调用方携带有效 JWT（Supabase auth 用户），
//     用 service_role 客户端 + 该 JWT 调 auth.getUser() 校验身份。
//   - verify-email / recovery-reset 的 to 必须等于调用方自身 id（不能代他人触发）。
//   - friend-request 的 from 必须等于调用方自己的 handle。
//   - 读 email 一律用 service_role（绕过 RLS），但只用于发信，绝不回传给客户端。
//   - friend-request 仅当目标 email_verified = true 才发（防冒用 / 静默未验证邮箱）。
//
// 优雅降级：若未配置 RESEND_API_KEY，则所有动作返回 {ok:true, simulated:true}，
//   不破坏好友请求流（客户端 notify 是 fire-and-forget）。
//
// 环境变量（Supabase 后台 → Edge Functions → csync-notify → Add new secret）：
//   SUPABASE_URL               （部署时自动注入）
//   SUPABASE_SERVICE_ROLE_KEY  （部署时自动注入，切勿泄露）
//   RESEND_API_KEY             （在 Resend.com 创建，免费档即可）
//   NOTIFY_FROM                （可选，默认 onboarding@resend.dev，需 Resend 验证域名后可改）
//   SITE_URL                   （可选，默认 https://landddddddddddd.github.io/political-spectrum-test/）
// =============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = Deno.env.get("SITE_URL") ||
  "https://landddddddddddd.github.io/political-spectrum-test/";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") || "onboarding@resend.dev";

// ---------- HMAC 工具（用于验证链接防篡改） ----------
async function hmacToken(userId: string): Promise<string> {
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(userId));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  const idB64 = btoa(userId).replace(/=+$/, "");
  return `${idB64}.${b64.replace(/=+$/, "")}`;
}

async function verifyToken(token: string): Promise<string | null> {
  const [idB64, sigB64] = token.split(".");
  if (!idB64 || !sigB64) return null;
  let userId: string;
  try {
    userId = atob(idB64);
  } catch {
    return null;
  }
  const expected = await hmacToken(userId);
  if (expected !== token) return null;
  return userId;
}

// ---------- Resend 发信 ----------
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false; // 未配置 → 优雅跳过
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: NOTIFY_FROM, to, subject, html }),
  });
  if (!res.ok) {
    console.warn("[csync-notify] Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

// ---------- 主入口 ----------
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // ===== 验证链接回跳（GET）：?csync_verify=<token> =====
  if (req.method === "GET") {
    const token = url.searchParams.get("csync_verify");
    if (!token) {
      return Response.redirect(SITE_URL + "?verify=invalid", 302);
    }
    const userId = await verifyToken(token);
    if (!userId) {
      return Response.redirect(SITE_URL + "?verify=invalid", 302);
    }
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await sb.from("profiles")
      .update({ email_verified: true })
      .eq("id", userId);
    if (error) {
      console.warn("[csync-notify] verify update error", error);
      return Response.redirect(SITE_URL + "?verify=error", 302);
    }
    return Response.redirect(SITE_URL + "?verify=ok", 302);
  }

  // ===== 动作入口（POST，来自 supabase functions.invoke） =====
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method-not-allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 校验调用方 JWT
  const authHeader = req.headers.get("Authorization") || "";
  const sbUser = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: authData, error: authErr } = await sbUser.auth.getUser();
  if (authErr || !authData.user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const caller = authData.user;

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const action = body.action;
  const to = body.to;
  const from = body.from;

  // 未配置 Resend → 静默成功（不破坏流）
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: true, simulated: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // service_role 客户端（读 email，绕过 RLS）
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  if (action === "verify-email") {
    // to 必须等于调用方自身
    if (to !== caller.id) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
    }
    const { data: prof } = await sb.from("profiles")
      .select("email, email_verified").eq("id", caller.id).single();
    if (!prof || !prof.email) {
      return new Response(JSON.stringify({ ok: true, skipped: "no-email" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = await hmacToken(caller.id);
    const link = `${url.origin}${url.pathname}?csync_verify=${token}`;
    const ok = await sendEmail(
      prof.email,
      "验证你的邮箱 · 意识形态测试",
      `<p>你好，</p>
       <p>请点击下面的链接完成邮箱验证（用于好友请求 / 恢复信封重置通知）：</p>
       <p><a href="${link}">${link}</a></p>
       <p>如果你没有请求此验证，请忽略本邮件。</p>`,
    );
    return new Response(JSON.stringify({ ok: ok }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "recovery-reset") {
    if (to !== caller.id) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
    }
    const { data: prof } = await sb.from("profiles")
      .select("email, email_verified").eq("id", caller.id).single();
    if (!prof || !prof.email) {
      return new Response(JSON.stringify({ ok: true, skipped: "no-email" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    const ok = await sendEmail(
      prof.email,
      "你的恢复信封已重置 · 意识形态测试",
      `<p>你好，</p>
       <p>我们收到一次「恢复信封」重置请求。若这是你本人操作，你的历史结果密钥已被新密钥取代。</p>
       <p>若非你本人操作，请尽快修改你的登录账号密码。</p>`,
    );
    return new Response(JSON.stringify({ ok: ok }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "friend-request") {
    if (!from || !to) {
      return new Response(JSON.stringify({ error: "bad-request" }), { status: 400 });
    }
    // from 必须等于调用方自己的 handle
    const { data: me } = await sb.from("profiles")
      .select("handle").eq("id", caller.id).single();
    if (!me || me.handle !== from) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
    }
    // 读目标邮箱，仅当已验证才发
    const { data: target } = await sb.from("profiles")
      .select("email, email_verified").eq("id", to).single();
    if (!target || !target.email || !target.email_verified) {
      // 目标未绑定或未验证邮箱 → 不发（不报错，好友请求本身已成功）
      return new Response(JSON.stringify({ ok: true, skipped: "target-not-verified" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    const ok = await sendEmail(
      target.email,
      "新的好友请求 · 意识形态测试",
      `<p>你好，</p>
       <p><b>${from}</b> 想在你的「意识形态测试」账户里加你为好友。</p>
       <p>打开应用即可接受请求并互看结果：</p>
       <p><a href="${SITE_URL}">${SITE_URL}</a></p>`,
    );
    return new Response(JSON.stringify({ ok: ok }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "unknown-action" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
});
