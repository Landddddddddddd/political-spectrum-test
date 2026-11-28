# C-lite 部署设置指南（逐屏点击级 · 给「完全不会」的你）

> **一句话预期**：你总共只需干 4 件"登录后点按钮 + 把字符串粘进 Supabase 后台"的活，其余（跑代码、接通主程序、重新部署）全归我。
> 这 4 件活是：**① 建 Supabase 项目（登你账号点按钮）** → **② 在后台跑 schema.sql（粘 SQL 点 Run）** → **③ 建 Google OAuth 应用（粘到 Supabase 后台）** → **④ 建 Discord OAuth 应用（粘到 Supabase 后台）**。
> 完成后告诉我「配好了」，我接通主程序 + 冒烟 + 重新部署。
> 所有带 `https://` 的链接直接复制打开。
> 预计总耗时：4 件事约 20–30 分钟（均免费）；Apple 需先掏 $99/年，可选、可跳过。

---

## 第 0 步：你最终要拿到的字符串（清单）
1. **Supabase URL** + **Supabase anon key**（来自第 1 步 → 已由我替你写入 `config.js`，你不用动）
2. **Google** Client ID + Client secret（来自第 3 步 → 直接粘进 **Supabase 后台** Authentication → Providers → Google，不进 config.js）
3. **Discord** Client ID + Client secret（来自第 4 步 → 同上，进 Discord Provider）
4. **Apple** Client ID + 私钥（可选，跳过也能跑 Google + Discord）

> ⚠️ **重要**：OAuth 的 Client secret 是真正的"服务端密钥"，**绝不能**粘进 `config.js`（那是前端文件，会被所有用户看到）。它必须存放在 **Supabase 后台的 Authentication → Providers** 里（那是 Supabase 服务端配置，外部看不到）。

---

## 第 1 步：建 Supabase 项目（免费 · EU 法兰克福）

> 🔑 **为什么这一步必须你自己点？** 建项目要登你自己的云账号（带两步验证），我不能替你登录——就像不能替你开银行户。但**只有这一步 + 第 2/3 步的"登录建应用"需要你**，后面"跑 schema、接通主程序、部署"都归我。

### 1-A. 登录（用你已有的 GitHub 账号，30 秒）
1. 浏览器打开 **https://supabase.com**（整段复制粘到地址栏）。
2. 右上角点 **"Sign In"**（登录）。
3. 在登录页选 **"GitHub"** 图标按钮 → 跳到 GitHub → 点 **"Authorize supabase"**（授权）。
   - 用你做 GitHub Pages 那个账号（landddddddddddd）即可，不用新注册。
4. 首次会让你填用户名、勾同意条款 → 一路点过去。

### 1-B. 新建项目（照抄下面填）
登录后你会看到一个项目列表页（可能是空的）。
1. 点右上角绿色大按钮 **"New project"**（新建项目）。
2. 弹出表单，逐格填：
   - **Organization（组织）**：下拉选你自己的账号名（默认就一个，直接用它，别改）。
   - **Name（名称）**：填 `ideology-test`（随便写也行）。
   - **Database Password（数据库密码）**：点右侧 **"Generate a password"**（生成密码）→ 自动填出一串乱码 → **立刻点那串密码右边的复制图标，存进手机备忘录或电脑记事本**。⚠️ 这密码之后**再也看不到**，丢了只能重置整个库。
   - **Region（区域）**：点开下拉，**往下翻找到 `Frankfurt (eu-central-1)` 并选中**。最关键的一步——它决定数据存在德国法兰克福，符合欧洲隐私法规。别选成别的城市。
   - **Pricing Plan（套餐）**：保持 **Free（免费）** 不动。
3. 点底部 **"Create new project"**（创建项目）。
4. 等 1–2 分钟，页面中央会转圈 "Provisioning..."（正在准备），转完自动进入项目后台。

### 1-C. 复制要填进 config.js 的两串字符
进入项目后台后：
1. 左侧最底下点 **"Project Settings"**（设置，齿轮图标）。
2. 上方一排标签点 **"API"**。
3. 这一页有两样要复制（点各自右边的复制按钮）：
   - **Project URL**：形如 `https://xxxxxx.supabase.co`。
   - **Project API keys → anon public**：很长的 `eyJ...` 一串。
4. 先把这两样暂存到记事本（等下和第 2/3 步的一起粘进 config.js）。

### 1-D. 跑 schema.sql（建表，1 分钟）
1. 左侧栏点 **"SQL Editor"**（SQL 编辑器）。
2. 点 **"New query"**（新建查询），中间出现空白输入框。
3. 把我给你的 `schema.sql` 文件**整篇复制粘贴**进来（打开那文件 → Ctrl/Cmd+A 全选 → Ctrl/Cmd+C 复制 → 粘进输入框）。
4. 点右上 **"Run"**（运行），或按 Ctrl/Cmd+Enter。
5. 下方日志出现绿色 `Success` / `No rows returned` 之类 = 表建好了。

✅ 到此，**第 1 类凭证（URL + anon key）到手**，项目里数据库表也建好了。

---

## 第 3 步：Google OAuth（免费）

> 这一步拿到的 Client ID + Client secret **不粘进 config.js**，而是粘进 **Supabase 后台**（Authentication → Providers）。这样 secret 永远不进前端代码。

1. 打开 https://console.cloud.google.com/ → 左上点项目下拉 → **New Project** → 命名 `ideology-test` → 创建。
2. 左侧菜单 **APIs & Services → OAuth consent screen**：
   - **User type** 选 **External** → Create。
   - 填 **App name**：`意识形态测试`（或英文）
   - **User support email** / **Developer contact** 都选你的 Gmail。
   - 底部 **Save and Continue**（作用域、测试用户页一路 Continue/Save）。
   - 回到 **OAuth consent screen** 页，在 **Test users** 里 **+ Add users**，加上你自己的 Gmail（未上线前只有测试用户能登录）。
3. 左侧 **APIs & Services → Credentials** → 顶部 **+ Create Credentials → OAuth client ID**：
   - **Application type** 选 **Web application**。
   - **Name**：`ideology-web`
   - **Authorized redirect URIs** 点 **+ Add URI**，填：
     ```
     https://ixtvhikixfgddrdqjczd.supabase.co/auth/v1/callback
     ```
     （你的项目 REF 是 `ixtvhikixfgddrdqjczd`，整段就这样填）
   - 点 **Create**。
4. 弹窗里复制 **Client ID** 和 **Client secret**（两串先暂存记事本）。
5. **回到 Supabase 后台** → 左侧 **Authentication** → 顶部 **Providers** 标签 → 找到 **Google** 那一行 → 点它 → 打开开关 **Enable** → 把刚才的 Client ID / Secret 粘进表单 → 点底部 **Save**。

✅ 第 2 类到手。**不需要给我发任何字符串**，Supabase 后台配置即可生效。

---

## 第 4 步：Discord OAuth（免费）

> 同样：Client ID / Secret 不粘进 config.js，直接配进 Supabase 后台。

1. 打开 https://discord.com/developers/applications → 右上 **New Application** → 命名 `ideology-test` → Create。
2. 左侧 **OAuth2**：
   - **Client ID** 在页面顶部（先记一下）。
   - **Client Secret** 点 **Reset Secret** 后复制（先暂存记事本）。
   - 滚动到 **Redirects** → 点 **Add Redirect**，填：
     ```
     https://ixtvhikixfgddrdqjczd.supabase.co/auth/v1/callback
     ```
     → **Save Changes**。
3. **回到 Supabase 后台** → 左侧 **Authentication** → **Providers** → 找到 **Discord** 那一行 → 点它 → 打开 **Enable** → 把刚才的 Client ID / Secret 粘进表单 → **Save**。

✅ 第 3 类到手。同样**不需要给我发任何字符串**。

---

## 第 5 步：Apple OAuth（可选 · 需 $99/年）

> ⚠️ Apple 的 "Sign in with Apple" **强制要求付费 Apple Developer Program（$99/年）**，没有免费档。
> 若不想花钱，直接跳过本步 —— Google + Discord 已够用。

1. 打开 https://developer.apple.com/account/ → 加入 **Apple Developer Program**（$99/年）。
2. **Certificates, Identifiers & Profiles → Identifiers → +** → 选 **Services ID** → 启用 **Sign in with Apple** → 命名（如 `com.your.ideology`）。
3. 左侧 **Keys → +** → 勾选 **Sign in with Apple** → 绑定上面的 Services ID → 生成并下载 `.p8` 私钥文件。
4. 记录：Key ID（p8 文件名前缀）、Team ID（账户页顶部）。
5. 回到 Supabase 后台 → **Authentication → Providers → Apple** → 填 Services ID / Key ID / Team ID / 私钥 → Save。

---

## 第 6 步：回调地址公式（通用）
OAuth 的 **Redirect URI 永远是这一条**：
```
https://ixtvhikixfgddrdqjczd.supabase.co/auth/v1/callback
```
（你的项目 REF 已经定了，不需要再算）

---

## 第 7 步：部署通知后端（Edge Function + Resend）

> 这一步让「好友请求 / 邮箱验证 / 恢复信封重置」能真的发邮件。不配也能用全部功能（只是不收邮件通知），所以**可以最后再做**。
> 有两条路：**A 后台在线编辑器（推荐，不用装任何东西）** 或 **B Supabase CLI（需装 Node / 命令行）**。任选其一。

### 7-A. 注册 Resend（免费，拿发信密钥）
1. 打开 https://resend.com → 右上 **Sign Up**（用你 GitHub 或邮箱注册，免费档每月 3000 封够用）。
2. 登录后左侧 **API Keys** → 右上 **Create API Key** → 命名 `csync` → 生成。
3. 复制那串 `re_xxxxx`（只显示一次，**立刻存记事本**）。这就是 `RESEND_API_KEY`。

### 7-B 路线 A：后台在线编辑器部署（最省事）
1. Supabase 后台左侧 **Edge Functions**（在侧栏 `Database` 附近）。
2. 点 **Create a new function**（或 New Function）。
3. **Name（函数名）** 必须填：**`csync-notify`**（一字不差，客户端按此名调用）。
4. 把我要给你的 `supabase/functions/csync-notify/index.ts` 文件**整篇复制**粘进代码框（覆盖默认内容）。
5. 点 **Deploy**（部署）。等显示绿色 ✓ Deployed。
6. 部署成功后，函数页切到 **Secrets**（密钥）标签 → **Add new secret**：
   - Key: `RESEND_API_KEY`  Value: 刚才的 `re_xxxxx`
   - （可选）Key: `SITE_URL`  Value: `https://landddddddddddd.github.io/political-spectrum-test/`
7. 保存后点一次 **Redeploy**（让密钥生效）。

### 7-C 路线 B：Supabase CLI 部署（进阶，可跳过）
若你愿意用命令行（我也可以远程替你跑，但 `supabase login` 要你本人在浏览器授权一次）：
1. 装 CLI：命令行执行 `npm install -g supabase`。（需 Node，你已有）
2. `supabase login`（弹出浏览器，用你 GitHub 账号授权）。
3. 在项目根目录执行 `supabase link --project-ref ixtvhikixfgddrdqjczd`。
4. 设密钥：`supabase secrets set RESEND_API_KEY=re_xxxxx`（SITE_URL 可选同样设）。
5. 部署：`supabase functions deploy csync-notify`。

> 若没配 `RESEND_API_KEY`，函数会自动「假装成功」——好友请求照样能发起和互看，只是不发邮件，不报错。

## 第 8 步：告诉我「配好了」

当 Supabase 后台 **Authentication → Providers** 里看到 **Google** 与 **Discord** 都是绿色 Enable 状态，并（可选）完成第 7 步 Edge Function 部署，告诉我：
> 配好了

我会立刻做这三件事：
1. 把 `config.js` + `auth.js` 接进 `ideology-test-adaptive.html`（登录按钮、首次设置 handle、结果上行、好友互看 UI）。
2. 用真实凭证在本地冒烟测试一遍（登录 → 上行 → 加好友 → 互看解密）。
3. 把 `deploy/` 连同 C 功能重新推到 GitHub Pages。

---

## 常见问题
- **Google 登录报 redirect_uri_mismatch**：检查 Google OAuth 第 3 步填的回调是否与 `https://ixtvhikixfgddrdqjczd.supabase.co/auth/v1/callback` 完全一致（含 `https://` 和末尾 `/callback`）。
- **"App not verified" 黄屏**：正常，因为是测试应用；点 "Continue" 或用你加为 Test user 的账号登录即可。
- **Supabase 免费档够吗**：够。免费含 50k 月活、500MB 库、EU 区域、Auth 多家 OAuth。超了再考虑付费。
- **数据在哪**：全在法兰克福节点；政治倾向只有密文，服务器读不到。
- **Client secret 我应该发给你吗**：**绝对不要**。Client secret 直接粘进 Supabase 后台即可，不进前端、不进 config.js、也不发给我（我不需要它）。
- **为什么 Supabase 后台配就行？** 因为 OAuth 是 Supabase 服务端帮你跑（`signInWithOAuth`），secret 只在服务端使用。前端只需要 anon key（公开的），由 RLS 防护。
