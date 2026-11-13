#!/usr/bin/env bash
# Runs lint and the production build. Exit 2 on failure so Claude Code feeds stderr back to the agent.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 2

# Stop hook already blocked once this turn: let Claude stop instead of looping forever.
[ -t 0 ] || input=$(cat)
case "${input:-}" in *'"stop_hook_active":true'*|*'"stop_hook_active": true'*) exit 0 ;; esac

run() {
  local out
  if ! out=$("$@" 2>&1); then
    { echo "verify.sh: '$*' failed:"; echo "$out" | tail -n 100; } >&2
    exit 2
  fi
}

run npm run lint
run npm run build
exit 0
