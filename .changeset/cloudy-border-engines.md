---
'@embedpdf/engines': minor
---

Integrate cloudy border effect reading and writing in the PDFium engine. Annotations with `/BE /S /C` dictionaries now include `cloudyBorderIntensity` in their parsed objects, and creating/updating annotations writes the border effect dictionary via `setBorderEffect`.
