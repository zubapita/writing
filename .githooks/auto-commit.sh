#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------
# auto-commit.sh: 変更を検出して自動コミット・プッシュ
#   - launchd から定期実行される
#   - 変更がなければ何もしない
#   - pre-commit フックが自動で画像最適化を実行
# ---------------------------------------------------------

REPO_DIR="/Users/t-negishi/writing"
LOG_FILE="${REPO_DIR}/.githooks/auto-commit.log"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

cd "$REPO_DIR"

# 変更があるか確認（未追跡ファイル + 変更ファイル）
changes=$(git status --porcelain 2>/dev/null | grep -v '^\s*$' | grep -v '.DS_Store' || true)

if [ -z "$changes" ]; then
  exit 0
fi

log "変更を検出"

# すべての変更をステージング（.DS_Storeは.gitignoreで除外済み）
git add -A

# 変更されたファイルの概要を取得
summary=$(git diff --cached --stat --no-color 2>/dev/null | tail -1)

# コミット（pre-commitフックが画像最適化を実行）
if git commit -m "$(cat <<EOF
auto: ${summary}

自動コミット by launchd
EOF
)" >> "$LOG_FILE" 2>&1; then
  log "コミット成功"
else
  log "コミット失敗（変更なし or フックエラー）"
  exit 0
fi

# プッシュ
if git push origin main >> "$LOG_FILE" 2>&1; then
  log "プッシュ成功"
else
  log "プッシュ失敗（ネットワークエラー等）"
fi
