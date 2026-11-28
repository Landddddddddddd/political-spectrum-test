-- =============================================================
-- 意识形态测试 · C-lite 数据库骨架（服务端失明 / Server-Blind）
-- 适用：Supabase 免费档 · EU 区域（法兰克福 eu-central-1）
-- 用法：Supabase 后台 → SQL Editor → 粘贴本文件 → Run
-- 原则：服务器只存 密文 blob + 好友边 + 假名 handle + 公钥
--       永远看不到政治倾向明文（结果在客户端 AES-GCM 加密后上传）
-- 邮箱（可选）：单独一列，仅用于「恢复信封重置通知 + 好友请求通知」，绝不营销；
--       删除账户随 profiles 级联清除。邮箱绝不包含在政治倾向密文或好友边中。
-- =============================================================

-- 1) profiles：镜像 auth.users，仅存假名与合规标志，不收真实姓名/手机/邮箱
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  handle      text not null unique,
  region      text not null default 'OTHER',   -- 'EU' | 'OTHER'（数据驻留/合规分流）
  consent     boolean not null default false,  -- 特殊类别数据明确同意
  age_ok      boolean not null default false,  -- 年龄门槛 16+
  pubkey      text,                             -- ECDH P-256 公钥（hex/spki），供好友封装密钥
  email       text,                             -- 可选绑定：仅用于通知（恢复信封重置 / 好友请求），不营销；删除账户级联清除
  email_verified boolean not null default false,-- 绑定后是否完成验证（发信前必须已验证，防冒用）
  created_at  timestamptz not null default now()
);
create index if not exists profiles_handle_idx on public.profiles (handle);

-- 2) results：仅密文。iv + ciphertext（AES-GCM），服务器不可读
create table if not exists public.results (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  iv          text not null,
  ciphertext  text not null,
  ver         int  not null default 1,
  updated_at  timestamptz not null default now()
);

-- 3) friendships：仅“边”，不含任何观点内容
create table if not exists public.friendships (
  a           uuid not null references auth.users(id) on delete cascade,
  b           uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'pending',  -- 'pending' | 'accepted'
  created_at  timestamptz not null default now(),
  primary key (a, b),
  check (a <> b)
);
create index if not exists friendships_b_idx on public.friendships (b);

-- 4) key_shares：A 授权 B 看结果时，用 B 公钥封装的结果对称密钥（wrapped）
--    B 用自己私钥解封 → 得到对称密钥 → 解密 A 的 results 密文
create table if not exists public.key_shares (
  owner       uuid not null references auth.users(id) on delete cascade,  -- 结果主人 A
  friend      uuid not null references auth.users(id) on delete cascade,  -- 被授权者 B
  wrapped_key text not null,   -- 用 B 公钥封装的对称密钥
  created_at  timestamptz not null default now(),
  primary key (owner, friend)
);

-- ===================== 行级安全 RLS =====================
alter table public.profiles     enable row level security;
alter table public.results      enable row level security;
alter table public.friendships  enable row level security;
alter table public.key_shares   enable row level security;

-- profiles：本人可读写自己的全部列（含 email）；email 绝不对外暴露
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- 公共目录视图：仅暴露 非敏感列（id/handle/pubkey），供好友搜索与密钥封装；
-- 由 BYPASSRLS 角色（postgres）定义，绕过底层 profiles 的 RLS，从而不含 email。
-- 好友搜索/互看一律查此视图，永不直查 profiles.email，杜绝邮箱被其他用户读到。
drop view if exists public.profile_directory;
create view public.profile_directory as
  select id, handle, pubkey from public.profiles;
grant select on public.profile_directory to authenticated;

-- results：本人可读写；已接受好友关系的对方也可读（用于取密文解密）
drop policy if exists results_owner on public.results;
create policy results_owner on public.results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists results_friend on public.results;
create policy results_friend on public.results
  for select using (
    exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and ((f.a = auth.uid() and f.b = results.user_id)
          or (f.b = auth.uid() and f.a = results.user_id))
    )
  );

-- friendships：涉及自己（任一端）才可查看；仅本人可发起(a=自己)
drop policy if exists friendships_visible on public.friendships;
create policy friendships_visible on public.friendships
  for select using (auth.uid() = a or auth.uid() = b);

drop policy if exists friendships_insert on public.friendships;
create policy friendships_insert on public.friendships
  for insert with check (auth.uid() = a);

drop policy if exists friendships_update on public.friendships;
create policy friendships_update on public.friendships
  for update using (auth.uid() = a or auth.uid() = b) with check (auth.uid() = a or auth.uid() = b);

drop policy if exists friendships_delete on public.friendships;
create policy friendships_delete on public.friendships
  for delete using (auth.uid() = a or auth.uid() = b);

-- key_shares：被授权者(friend)可读；主人(owner)可写/删
drop policy if exists key_shares_read on public.key_shares;
create policy key_shares_read on public.key_shares
  for select using (auth.uid() = friend);

drop policy if exists key_shares_write on public.key_shares;
create policy key_shares_write on public.key_shares
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

-- ===================== 备注 =====================
-- 1. 好友请求流：A 插入 (a=A, b=B, status='pending')；
--    B 接受：更新该行 status='accepted'（B 是 b 端，满足 update 策略）。
-- 2. 互看：B 读 A 的 results（results_friend 策略放行）+ 读 key_shares(owner=A,friend=B) 得 wrapped_key。
-- 3. 删除账户：on delete cascade 自动清 results / friendships / key_shares / profiles。
-- 4. 本 SQL 不含任何政治倾向明文列；所有敏感内容在客户端加密后才进 results。
-- 5. email 为 profiles 内「单独一列」，与 results(密文) / friendships(边) 完全分离；
--    删除账户（auth.users 级联）→ profiles 整行清除 → email 一并删除。
--    邮箱只用于通知（恢复信封重置 / 好友请求），服务端失明原则下 E2E 密钥仍由口令派生，
--    服务器既看不到明文密钥，也看不到政治倾向明文；邮箱绑定不改变此模型。
-- 6. 通知发信需先 email_verified=true；验证与发信由 Edge Function 读取 profiles.email 完成
--    （客户端无权读他人 email，目录视图 profile_directory 也不含 email）。
