---
'@embedpdf/pdfium': minor
---

Add cloudy border AP generation in PDFium C++. New `cpdf_cloudy_border.cpp/.h` generates scalloped border paths for Square, Circle, and Polygon annotations via the `/BE` border effect dictionary. Exposes `EPDFAnnot_SetBorderEffect` and `EPDFAnnot_ClearBorderEffect` bindings.
