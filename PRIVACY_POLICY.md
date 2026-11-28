# 意识形态测试 · 隐私政策与同意流（C-lite 草案）

> 适用版本：v1.13+ 的「跨设备同步 + 好友互看结果」功能（C-lite）。
> 语言：中英双语（应用已支持 i18n，隐私与同意文案一并提供双语）。
> 状态：草案，待法务/你最终确认后再接进应用。

---

## 一、决策锁定（C-lite 边界）

| 决策点 | 你的回复 | 落地结论 |
|---|---|---|
| 跨设备同步 | 要 | 做 C-lite：云端加密同步**自己**的结果 + 与指定好友互看/对比 |
| 托管区域与预算 | 不懂，尽量免费，你定 | **Supabase 免费档 · EU 区域（法兰克福 eu-central-1）**（Auth+Postgres+RLS+50k MAU 全免费，且含 Google/Apple/Discord OAuth，无需自建） |
| 年龄门槛 | 按最严市场，你定 | **16+**（欧盟 GDPR 默认数字同意年龄 16，为最严主流标准） |
| 假名 | 保持假名（推荐） | 仅用 **handle 昵称**，不收集真实姓名 |
| 邮箱 | 可选绑定，你定 | **可选**：不绑定也能用全部功能；仅用于「恢复信封重置通知 + 好友请求通知」，绝不营销；单独一列存储，删除账户一并清除 |
| 隐私政策/同意流 | 顺带起草 | 本文件即交付（含邮箱可选绑定条款，见下文） |

**架构原则（服务端失明 / Server-Blind）**：服务器只存「密文 blob + 好友关系边 + 假名 handle」，永远看不到政治倾向明文。结果在客户端用 WebCrypto（AES-GCM）加密后上传；互看时用对方公钥封装对称密钥。这同时满足：海外 GDPR 第9条（政治倾向属特殊类别数据，但服务端非明文处理者）与国内敏感 PII 不出本机的诉求。

---

## 二、我们收集什么（服务端可见范围）

| 数据 | 示例 | 服务端可见 | 说明 |
|---|---|---|---|
| 假名 handle | `night-owl-229` | 是 | 用户自选，非真实姓名 |
| 认证标识 auth_sub | `google_123…` | 是 | 由 OAuth 提供方返回，不含政治内容 |
| 区域 region | `EU` / `OTHER` | 是 | 用于数据驻留与合规分流 |
| 同意标志 consent / age_ok | `true` | 是 | 年龄与特殊类别数据同意记录 |
| 好友边 friendships | `(A,B,accepted)` | 是 | 仅「谁和谁是好友」，不含内容 |
| 结果密文 results | `iv + ciphertext` | **仅密文** | 政治倾向明文不出客户端 |
| 邮箱（可选）email | `a@b.com` | 仅本人可读 + 发信函数可读 | 可选绑定；仅用于两类通知，绝不营销；与 results/friendships 分离，删除账户级联清除 |

**我们明确不收集用于营销的邮箱**，也不收集：真实姓名、手机号、精确地理位置、政治倾向明文、好友的政治倾向明文。邮箱为**可选绑定**，且仅作通知渠道（见上表），不绑定也能使用全部功能。

---

## 三、隐私政策正文（草案）

### 中文

**1. 我们是谁**
本应用「意识形态测试」由独立开发者运营，是一项**教育用途**的政治倾向自评工具。我们不出售你的任何数据。

**2. 我们处理的数据**
- **账户**：你自选的假名 handle、登录方式标识（Google / Apple / Discord）、你所在区域（用于合规）。
- **测试结果**：你的答题结果在**你的设备本地加密**后上传；服务器只存储无法读取的密文。
- **好友关系**：当你主动添加好友时，我们记录「你与某 handle 是好友」这一关系，不记录你们各自的观点内容。
- **邮箱（可选）**：仅在你想接收「恢复信封重置」与「好友请求」通知时绑定；我们不发任何营销邮件，且它独立于你的测试结果密文与好友关系。

**3. 特殊类别数据（政治倾向）**
你的政治倾向属于法律上的「特殊类别个人数据」。我们**不会以明文形式处理或传输它**。其加密密钥仅存在于你的设备与你主动授权的好友设备之间。将结果分享给好友，需要你**每次主动确认**（opt-in）。

**4. 法律依据**
基于你的**明确同意**（GDPR 第6(1)(a) 与第9(2)(a) 条）处理上述特殊类别数据。

**5. 年龄**
本应用面向 **16 周岁及以上**用户。未满 16 周岁不得使用。

**6. 你的权利**
你可随时：导出你的数据、删除你的账户与所有关联数据（含密文与好友边）、撤回同意。删除后数据在 30 天内从备份中清除。

**7. 数据存储地点**
数据托管于欧盟（法兰克福）节点。跨境传输遵循欧盟标准合同条款（SCC）。

**8. 联系**
隐私问题请联系：`privacy@example.com`（占位，待你替换）。

### English

**1. Who we are**
"Ideology Test" is an independently operated, **educational** political-orientation self-assessment tool. We do not sell your data.

**2. Data we process**
- **Account**: a self-chosen pseudonymous handle, your sign-in provider (Google / Apple / Discord), and your region (for compliance).
- **Test results**: your answers are encrypted **on your device** before upload; the server stores only unreadable ciphertext.
- **Friendships**: when you add a friend, we record the fact that "you and handle X are friends" — never the content of either person's views.
- **Email (optional)**: bound only if you want "recovery-envelope reset" and "friend-request" notifications. We send no marketing email, and it is stored separately from your result ciphertext and friendships.

**3. Special-category data (political opinions)**
Your political orientation is "special-category" personal data under the law. We **never process or transmit it in plaintext**. Its encryption keys exist only on your device and the devices of friends you explicitly authorize. Sharing your result with a friend requires your **active, per-action confirmation** (opt-in).

**4. Legal basis**
Processing of this special-category data is based on your **explicit consent** (GDPR Art. 6(1)(a) & 9(2)(a)).

**5. Age**
This app is for users **aged 16 and over**. Under-16s may not use it.

**6. Your rights**
At any time you may export your data, delete your account and all associated data (ciphertext + friendship edges), and withdraw consent. Deleted data is purged from backups within 30 days.

**7. Data location**
Data is hosted in the EU (Frankfurt). Cross-border transfers follow EU Standard Contractual Clauses (SCC).

**8. Contact**
Privacy questions: `privacy@example.com` (placeholder — replace before launch).

---

## 四、同意流文案（可直接落入应用 UI）

### 4.1 首次启动 · 年龄门槛（16+）
- zh：`本应用含政治倾向自评，仅限 16 周岁及以上使用。你年满 16 周岁了吗？`
- en：`This app includes a political-orientation self-assessment and is for users aged 16+. Are you at least 16 years old?`
- 按钮：`是，我已满 16 岁 / Yes, I am 16 or older` · `否 / No`（选否则进入只读说明页，不可测试）

### 4.2 特殊类别数据同意（opt-in，仅分享时触发）
- zh：`将结果分享给好友属于「特殊类别数据」处理。只有你主动确认，我们才会把你的加密结果密钥发给对方。我们永远看不到你的政治倾向明文。是否授权分享给 {好友 handle}？`
- en：`Sharing your result is "special-category data" processing. Only with your confirmation do we send your encrypted result key to the friend. We never see your political views in plaintext. Authorize sharing with {friend handle}?`
- 按钮：`授权分享 / Authorize` · `暂不 / Not now`

### 4.3 Cookie / 非必要存储同意横幅
- zh：`我们使用本地存储保存你的进度与语言偏好，并使用必要的会话 Cookie。是否允许我们分析型 Cookie（仅用于匿名可用性统计）？`
- en：`We use local storage for progress and language, plus essential session cookies. Allow analytics cookies (anonymous usability stats only)?`
- 按钮：`允许 / Allow` · `仅必要 / Essential only`

### 4.4 注册 / 登录（假名）
- zh：`用 Google / Apple / Discord 登录，只需一个假名昵称，无需真实姓名。`
- en：`Sign in with Google / Apple / Discord. Just pick a pseudonymous handle — no real name required.`

### 4.5 好友添加
- zh：`输入对方分享码或 handle 发送好友请求；对方接受后，你们可互看加密结果并对比。`
- en：`Enter a friend's share code or handle to send a request. Once accepted, you can view each other's encrypted results and compare.`

### 4.6 数据导出 / 删除
- zh：`在「账户」中可随时导出你的数据或删除账户。删除后 30 天内从备份清除。`
- en：`In "Account" you can export your data or delete your account at any time. Deleted data is purged from backups within 30 days.`

### 4.7 隐私政策入口
- 设置页固定一行：`隐私政策 / Privacy Policy`（链接本文件或应用内静态页）

### 4.8 邮箱可选绑定（非强制）
- zh：`邮箱为可选，不绑定也能使用全部功能。绑定后仅用于「恢复信封重置通知」和「好友请求通知」，我们绝不发送营销邮件。是否绑定邮箱？`
- en：`Email is optional — all features work without it. If bound, it is used only for "recovery-envelope reset" and "friend-request" notifications. We never send marketing email. Bind an email?`
- 按钮：`绑定 / Bind` · `跳过 / Skip`
- 绑后（zh）：`我们会向你发送一封验证邮件，验证通过后才用于发信。你可随时在「账户」中解绑并清除。`
- after bind (en): `We'll send a verification email; notifications start only after verification. You can unbind and erase it anytime in "Account".`

---

## 五、待你拍板 / 待补项
1. 隐私联系邮箱 `privacy@example.com` 需替换为真实地址。
2. 是否需独立「数据处理协议（DPA）」页（Supabase 作为处理方）——免费档一般引用其现成 DPA 即可。
3. 文案落地时，跟随应用 i18n 接入 `g(zh,en)`，勿写死。
4. 实现前需你提供：Supabase 项目 URL + anon key（免费档后台一键复制），以及 OAuth 三方凭据（Google/Apple/Discord 各一个 Client ID/Secret，免费申请）。
5. 邮箱绑定需配套两块（均服务端，客户端无权读他人 email）：① 验证流程——发验证链接、写回 `email_verified`；② Edge Function `csync-notify`，仅读取 `profiles.email` 发送上述两类通知。好友搜索/互看改走 `profile_directory` 视图，确保邮箱永不外泄。
