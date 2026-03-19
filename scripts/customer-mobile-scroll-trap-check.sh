#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-customer-app/lib}"

if [[ ! -d "$ROOT" ]]; then
  echo "customer mobile scroll trap check: root not found: $ROOT" >&2
  exit 1
fi

files=()
while IFS= read -r file; do
  files+=("$file")
done < <(
  find "$ROOT" \
    \( -path '*/presentation/*screen.dart' -o -path '*/app/entry/*screen.dart' \) \
    -type f | sort
)

suspects=()

for file in "${files[@]}"; do
  segment="$(sed -n '/body:/,/^[[:space:]]*[[:alnum:]_].*=>\|^[[:space:]]*}\|^[[:space:]]*[A-Z][A-Za-z0-9_]*[[:space:]]/p' "$file")"

  if [[ -z "$segment" ]]; then
    continue
  fi

  has_safearea_column=0
  has_body_column=0
  has_spacer_or_expanded=0
  has_scroll_container=0
  has_expanded_scroll_child=0
  has_local_scrollable_widget=0

  if printf '%s\n' "$segment" | rg -q 'body:\s*SafeArea\('; then
    if printf '%s\n' "$segment" | rg -q 'child:\s*Column\('; then
      has_safearea_column=1
    fi
  fi

  if printf '%s\n' "$segment" | rg -q 'body:\s*Column\('; then
    has_body_column=1
  fi

  if printf '%s\n' "$segment" | rg -q 'Spacer\(|Expanded\('; then
    has_spacer_or_expanded=1
  fi

  if printf '%s\n' "$segment" | rg -q 'ScrollableSafeContent|SingleChildScrollView|CustomScrollView|body:\s*ListView\('; then
    has_scroll_container=1
  fi

  if printf '%s\n' "$segment" | perl -0ne 'exit(!( /Expanded\(.*child:\s*(ListView|CustomScrollView|TabBarView)\(/s ))'; then
    has_expanded_scroll_child=1
  fi

  if rg -q 'return\s+(ListView|CustomScrollView)\(|TabBarView\(' "$file"; then
    has_local_scrollable_widget=1
  fi

  if [[ $has_spacer_or_expanded -eq 1 && $has_scroll_container -eq 0 ]]; then
    if [[ $has_safearea_column -eq 1 ]]; then
      if [[ $has_local_scrollable_widget -eq 1 ]]; then
        continue
      fi
      suspects+=("$file")
      continue
    fi

    if [[ $has_body_column -eq 1 && $has_expanded_scroll_child -eq 0 && $has_local_scrollable_widget -eq 0 ]]; then
      suspects+=("$file")
    fi
  fi
done

if [[ ${#suspects[@]} -eq 0 ]]; then
  echo "customer mobile scroll trap check: no likely route-level traps found"
  exit 0
fi

echo "customer mobile scroll trap check: manual review recommended for:"
printf ' - %s\n' "${suspects[@]}"
