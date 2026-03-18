---
'@embedpdf/plugin-annotation': patch
---

FreeText annotation improvements:

- Fix FreeText editing blocked by interaction layer after the visual/interaction layer split. When `isEditing` is true, pointer events now correctly reach the text content in the visual layer while the interaction layer becomes passive.
- Add `editAfterCreate` tool behavior: FreeText annotations automatically enter editing mode after creation, with the default text fully selected so typing immediately replaces it.
- Prevent accidental annotation creation when exiting FreeText editing mode by clicking the page background (`stopImmediatePropagation`).
- Normalize NBSP characters (`\u00A0`) to regular spaces when reading text from contenteditable on blur.
- Fix Vue FreeText editing initialization timing so `editAfterCreate` works correctly on first mount.
