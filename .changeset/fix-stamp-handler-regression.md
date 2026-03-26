---
'@embedpdf/plugin-annotation': patch
---

Fix stamp (and other annotation type) handlers not working for custom tools added via `addTool()`.

The #537 merge moved handler factory lookup from a centralized subtype-based registry to a `pointerHandler` property on each tool object. Custom tools that didn't specify `pointerHandler` lost their pointer interaction entirely. This restores a default handler registry as a fallback so tools without an explicit `pointerHandler` automatically get the canonical handler for their annotation subtype.
