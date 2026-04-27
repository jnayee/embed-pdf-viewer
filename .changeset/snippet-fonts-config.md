---
'@embedpdf/snippet': patch
---

Add `fonts` configuration to the snippet viewer for controlling external webfont loading. Both defaults remain unchanged (Open Sans for the UI chrome, Caveat / Dancing Script / Great Vibes / Pacifico for the Create Signature "Type" tab), but integrators can now opt out cleanly for GDPR-sensitive, airgapped, or self-hosted deployments.

- `fonts.ui`: controls the snippet UI font. `null` skips the `<link>` (falls back to the system font stack); an object with `family` and/or `stylesheetUrl` lets you change the viewer font family independently from the stylesheet source, with omitted `stylesheetUrl` treated as no managed `<link>`.
- `fonts.signature`: controls the signature "Type" tab fonts. `null` skips the `<link>` and hides the "Type" tab; an object with `stylesheetUrl` and/or `fonts` lets you self-host the stylesheet and override the font list.

Both stylesheets are now registered at document scope with deduped `<link rel="stylesheet">` elements so `@font-face` works consistently across browsers and typed signatures can render correctly to canvas. Existing matching stylesheet links are reused when possible.
