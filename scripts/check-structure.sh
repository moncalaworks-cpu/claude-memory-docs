#!/bin/bash

# Check repository structure integrity
# Verify MEMORY.md exists and all referenced files are present

set -e

echo "🔍 Checking repository structure...\n"

# 1. Check MEMORY.md exists
if [ ! -f "MEMORY.md" ]; then
  echo "❌ MEMORY.md not found"
  exit 1
fi
echo "✅ MEMORY.md exists"

# 2. Check all referenced files exist
echo "✅ Checking referenced files..."
broken_refs=0

while IFS= read -r link; do
  if [ -n "$link" ]; then
    # Extract file path from markdown link
    file=$(echo "$link" | sed -E 's/^.*\]\(([^)]+)\).*/\1/' | grep '\.md$' || true)
    
    if [ -n "$file" ] && [ ! -f "$file" ]; then
      echo "   ❌ Referenced file not found: $file"
      ((broken_refs++))
    fi
  fi
done < <(grep -oE '\]\([^)]+\.md[^)]*\)' MEMORY.md || true)

if [ $broken_refs -gt 0 ]; then
  echo "❌ Found $broken_refs broken references"
  exit 1
fi
echo "✅ All referenced files exist"

# 3. Check for orphaned files (not referenced in MEMORY.md)
echo "✅ Checking for orphaned files..."
orphaned_count=0

for file in *.md; do
  if [ "$file" != "MEMORY.md" ]; then
    if ! grep -q "$(basename "$file")" MEMORY.md 2>/dev/null; then
      echo "   ⚠️  Orphaned file (not in MEMORY.md): $file"
      ((orphaned_count++))
    fi
  fi
done

if [ $orphaned_count -gt 0 ]; then
  echo "⚠️  Found $orphaned_count orphaned files"
  # Don't fail on orphaned files, just warn
fi

echo "\n✅ Structure validation passed"
exit 0
