#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

css_files=(
  "$ROOT/merchant-console/src/app/globals.css"
  "$ROOT/admin-console/src/app/globals.css"
  "$ROOT/public-website/src/app/globals.css"
)

tsx_roots=(
  "$ROOT/merchant-console/src"
  "$ROOT/admin-console/src"
  "$ROOT/public-website/src"
)

suspects=()

for file in "${css_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    continue
  fi

  while IFS=: read -r line _; do
    [[ -n "$line" ]] || continue
    suspects+=("$file:$line css viewport lock candidate")
  done < <(
    perl -0ne '
      while (/([^{]+)\{([^}]*)\}/sg) {
        $selector = $1;
        $body = $2;
        if (
          $body =~ /(?:^|;)\s*height:\s*100vh\s*;/ ||
          (
            $body =~ /(?:^|;)\s*min-height:\s*100vh\s*;/ &&
            $body =~ /(?:^|;)\s*overflow:\s*hidden\s*;/
          ) ||
          (
            $body =~ /(?:^|;)\s*position:\s*fixed\s*;/ &&
            $body =~ /(?:^|;)\s*top:\s*0\s*;/ &&
            $body =~ /(?:^|;)\s*bottom:\s*0\s*;/ &&
            $body !~ /overflow-y:\s*auto/
          )
        ) {
          $selector =~ s/\s+/ /g;
          print "$.:$selector\n";
        }
      }
    ' "$file"
  )
done

for root in "${tsx_roots[@]}"; do
  if [[ ! -d "$root" ]]; then
    continue
  fi

  while IFS= read -r file; do
    has_risky_inline=0
    has_risky_class=0
    has_scrollable_markup=0

    if rg -q 'minHeight:\s*"100vh"|height:\s*"100vh"|overflow:\s*"hidden"|position:\s*"fixed"' "$file"; then
      has_risky_inline=1
    fi

    if rg -q 'className=.*(h-screen|min-h-screen|overflow-hidden|fixed inset-0)' "$file"; then
      has_risky_class=1
    fi

    if rg -q 'overflow-y-auto|overflow-auto|sticky|ListView|CustomScrollView|SingleChildScrollView' "$file"; then
      has_scrollable_markup=1
    fi

    if [[ $((has_risky_inline + has_risky_class)) -gt 0 && $has_scrollable_markup -eq 0 ]]; then
      suspects+=("$file tsx viewport lock candidate")
    fi
  done < <(
    find "$root" \
      \( -path '*/app/*/page.tsx' -o -path '*/app/*/layout.tsx' -o -path '*/features/*/presentation/*.tsx' \) \
      -type f | sort
  )
done

if [[ ${#suspects[@]} -eq 0 ]]; then
  echo "web mobile scroll trap check: no likely route-level traps found"
  exit 0
fi

echo "web mobile scroll trap check: manual review recommended for:"
printf ' - %s\n' "${suspects[@]}"
