#!/bin/bash
# deploy-ghpages.sh — 政治光谱测试：构建并同步 gh-pages（每日自动化收尾用）
# 策略：SSH 优先（自动化环境可用）；失败自动回退 HTTPS + gh 令牌 + Clash 代理（交互沙箱环境）。
#       产物与线上一致时自动跳过推送，可安全重复执行。
set -e
cd "$(dirname "$0")"

NODE="/c/Users/xiaol/.workbuddy/binaries/node/versions/22.22.2-6/node.exe"
WT="C:/wb-ghpages-deploy"

# HTTPS 回退所需的代理（SSH 传输不受 http_proxy 影响）
export http_proxy=http://127.0.0.1:7897
export https_proxy=http://127.0.0.1:7897
export HTTP_PROXY=http://127.0.0.1:7897
export HTTPS_PROXY=http://127.0.0.1:7897
# SSH 非交互，避免卡在密码/passphrase 提示
export GIT_SSH_COMMAND="ssh -o BatchMode=yes -o ConnectTimeout=10"

TOKEN=$(gh auth token 2>/dev/null || true)
HTTPS_CONFIG="-c http.sslBackend=openssl"
if [ -n "$TOKEN" ]; then
  HTTPS_CONFIG="$HTTPS_CONFIG -c url.https://x-access-token:${TOKEN}@github.com/.insteadOf=git@github.com:"
fi
can_https() { [ -n "$TOKEN" ]; }

echo "[1/6] 构建 deploy/index.html"
"$NODE" build.js

echo "[2/6] 拉取远程 gh-pages"
if ! git fetch origin gh-pages 2>/dev/null; then
  can_https || { echo "ERROR: SSH 拉取失败且无 gh 令牌，无法回退"; exit 1; }
  echo "  SSH 失败 → 回退 HTTPS"
  git $HTTPS_CONFIG fetch origin gh-pages
fi

echo "[3/6] 准备 worktree"
rm -rf "$WT"
git worktree prune
git worktree add "$WT" origin/gh-pages >/dev/null

echo "[4/6] 覆盖产物并暂存"
cp deploy/index.html "$WT/index.html"
cp question_bank.json "$WT/question_bank.json"
cd "$WT"
git checkout -B deploy-auto >/dev/null 2>&1
git add -A

if git diff --cached --quiet; then
  echo "[5/6] 产物无变化，跳过推送"
else
  git commit --quiet -m "deploy: 同步主库题库（$(date +%Y-%m-%d)）"
  echo "[5/6] 推送 deploy-auto -> gh-pages"
  if ! git push origin deploy-auto:gh-pages 2>/dev/null; then
    can_https || { echo "ERROR: SSH 推送失败且无 gh 令牌"; exit 1; }
    echo "  SSH 失败 → 回退 HTTPS"
    git $HTTPS_CONFIG push origin deploy-auto:gh-pages
  fi
fi

echo "[6/6] 清理临时资源"
cd "$(dirname "$0")"
git worktree remove --force "$WT" 2>/dev/null || true
git branch -D deploy-auto 2>/dev/null || true
git branch -f gh-pages origin/gh-pages 2>/dev/null || true

echo "deploy-ghpages.sh 完成"
