#!/usr/bin/env bash
# PreCompact hook. Appends a state snapshot to .claude/progress.md before compaction.
# Always exits 0 and prints nothing to stdout, so it never blocks or steers compaction.
trap 'exit 0' EXIT
set +e

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT" 2>/dev/null || exit 0
PROGRESS="$ROOT/.claude/progress.md"

input=$(cat 2>/dev/null)
transcript=$(printf '%s' "$input" | jq -r '.transcript_path // empty' 2>/dev/null)
trigger=$(printf '%s' "$input" | jq -r '.trigger // "unknown"' 2>/dev/null)

{
  echo
  echo "## PreCompact snapshot — $(date -u '+%Y-%m-%d %H:%M:%S UTC') (trigger: ${trigger:-unknown})"
  echo "Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
  echo
  echo "### git status --short"
  echo '```'
  git status --short 2>/dev/null
  echo '```'
  echo
  echo "### Last 3 commits"
  echo '```'
  git log --oneline -3 2>/dev/null
  echo '```'
  echo
  echo "### Last 5 user messages"
  if [ -n "$transcript" ] && [ -f "$transcript" ]; then
    jq -Rr '
      fromjson? | select(.type == "user" and (.isMeta | not))
      | .message.content
      | if type == "string" then .
        elif type == "array" then (map(select(.type == "text") | .text) | join(" "))
        else empty end
      | gsub("\\s+"; " ") | select(length > 0) | .[0:300]
    ' "$transcript" 2>/dev/null | tail -n 5 | sed 's/^/- /'
  else
    echo "- (no transcript at: ${transcript:-none})"
  fi
} >> "$PROGRESS" 2>/dev/null

exit 0
