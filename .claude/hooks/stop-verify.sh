#!/usr/bin/env bash
# Stop hook. Runs the CI "verify" checks (.github/workflows/ci.yml: npm run lint, npm run build).
# Pass: exit 0 and reset the attempt count. Fail: print the check and its first 20 error lines
# to stderr and exit 2, so Claude keeps working. After 3 blocks in one session: exit 0 and
# record "STOPPED WITH FAILING CHECKS" in .claude/progress.md.
# `npm ci` from CI is not run here: it deletes and reinstalls node_modules.
set -uo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT" || exit 0
ATTEMPTS="$ROOT/.claude/stop-attempts"
PROGRESS="$ROOT/.claude/progress.md"
MAX_BLOCKS=3

input=$(cat 2>/dev/null || true)
sid=$(printf '%s' "$input" | jq -r '.session_id // "unknown"' 2>/dev/null) || sid=unknown
[ -n "$sid" ] || sid=unknown

count=0
if [ -f "$ATTEMPTS" ] && [ "$(awk '{print $1}' "$ATTEMPTS")" = "$sid" ]; then
  count=$(awk '{print $2}' "$ATTEMPTS")
fi
[[ "$count" =~ ^[0-9]+$ ]] || count=0

failed="" errors=""
for check in lint build; do
  if ! out=$(npm run "$check" 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | cut -c1-300; exit "${PIPESTATUS[0]}"); then
    failed="npm run $check"
    errors=$(printf '%s\n' "$out" | grep -iE 'error|failed|✖' | head -n 20)
    [ -n "$errors" ] || errors=$(printf '%s\n' "$out" | tail -n 20)
    break
  fi
done

if [ -z "$failed" ]; then
  rm -f "$ATTEMPTS"
  exit 0
fi

if [ "$count" -ge "$MAX_BLOCKS" ]; then
  {
    echo
    echo "## STOPPED WITH FAILING CHECKS — $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    echo "Session: $sid. Blocked $count times. Failing check: $failed"
    echo '```'
    printf '%s\n' "$errors"
    echo '```'
  } >> "$PROGRESS"
  exit 0
fi

echo "$sid $((count + 1))" > "$ATTEMPTS"
{
  echo "stop-verify.sh: CI verify check failed: $failed (block $((count + 1)) of $MAX_BLOCKS)"
  printf '%s\n' "$errors"
} >&2
exit 2
