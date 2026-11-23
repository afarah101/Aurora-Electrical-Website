#!/usr/bin/env bash
# SessionStart hook (matcher "compact"). After compaction only, prints the last 80 lines
# of .claude/progress.md to stdout, which Claude Code adds to context.
set +e
ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
PROGRESS="$ROOT/.claude/progress.md"

input=$(cat 2>/dev/null)
source=$(printf '%s' "$input" | jq -r '.source // empty' 2>/dev/null)
[ "$source" = "compact" ] || exit 0
[ -s "$PROGRESS" ] || exit 0

echo "Restored from .claude/progress.md (last 80 lines):"
tail -n 80 "$PROGRESS"
exit 0
