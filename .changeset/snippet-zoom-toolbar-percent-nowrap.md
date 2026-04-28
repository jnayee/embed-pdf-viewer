---
'@embedpdf/snippet': patch
---

Prevent the zoom percentage `%` symbol in the custom zoom toolbar from wrapping to a new line when the toolbar is resized to a narrow width. The input and `%` are now rendered as a single non-wrapping flex group that clips overflow instead of breaking the layout.
