export type FontLinkKind = 'ui' | 'signature';

const GENERIC_FONT_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
]);

function resolveHref(href: string): string | null {
  if (typeof document === 'undefined') return null;

  try {
    return new URL(href, document.baseURI).href;
  } catch {
    return null;
  }
}

function splitFontFamilyList(value: string): string[] {
  const families: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (const char of value) {
    if ((char === '"' || char === "'") && quote === null) {
      quote = char;
      current += char;
      continue;
    }

    if (char === quote) {
      quote = null;
      current += char;
      continue;
    }

    if (char === ',' && quote === null) {
      families.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) families.push(current.trim());
  return families;
}

function normalizeFamilyName(value: string): string {
  return value
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .toLowerCase();
}

function extractFamilyNames(familyStacks: string[]): string[] {
  return Array.from(
    new Set(
      familyStacks
        .flatMap(splitFontFamilyList)
        .map((family) => family.trim().replace(/^['"]|['"]$/g, ''))
        .filter((family) => family && !GENERIC_FONT_FAMILIES.has(normalizeFamilyName(family))),
    ),
  );
}

function extractDeclaredFamilyNames(familyStacks: string[]): string[] {
  return extractFamilyNames(familyStacks).map(normalizeFamilyName);
}

function getDocumentFontFamilies(): Set<string> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return new Set();
  }

  const families = new Set<string>();
  const fontFaces = Array.from(document.fonts as unknown as Iterable<FontFace>);

  for (const face of fontFaces) {
    families.add(normalizeFamilyName(face.family));
  }

  return families;
}

function allFamiliesAreDeclared(familyStacks: string[] | undefined): boolean {
  if (!familyStacks || familyStacks.length === 0) return false;

  const requestedFamilies = extractDeclaredFamilyNames(familyStacks);
  if (requestedFamilies.length === 0) return false;

  const declaredFamilies = getDocumentFontFamilies();
  if (declaredFamilies.size === 0) return false;

  return requestedFamilies.every((family) => declaredFamilies.has(family));
}

function findStylesheetByHref(resolvedHref: string): HTMLLinkElement | null {
  const links = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"][href]'),
  );

  return links.find((link) => link.href === resolvedHref) ?? null;
}

function getManagedLink(kind: FontLinkKind): HTMLLinkElement | null {
  return document.head.querySelector<HTMLLinkElement>(
    `link[data-embedpdf-fonts="${kind}"][data-embedpdf-managed="true"]`,
  );
}

export function ensureFontStylesheet(
  kind: FontLinkKind,
  href: string,
  familyStacks?: string[],
): HTMLLinkElement | null {
  if (typeof document === 'undefined') return null;

  if (allFamiliesAreDeclared(familyStacks)) return null;

  const resolvedHref = resolveHref(href);
  if (!resolvedHref) return null;

  const existingLink = findStylesheetByHref(resolvedHref);
  if (existingLink) return existingLink;

  let managedLink = getManagedLink(kind);
  if (!managedLink) {
    managedLink = document.createElement('link');
    managedLink.rel = 'stylesheet';
    managedLink.setAttribute('data-embedpdf-fonts', kind);
    managedLink.setAttribute('data-embedpdf-managed', 'true');
    document.head.appendChild(managedLink);
  }

  if (managedLink.href !== resolvedHref) {
    managedLink.href = href;
  }

  return managedLink;
}

export function waitForStylesheet(link: HTMLLinkElement | null): Promise<void> {
  if (!link) return Promise.resolve();

  if (link.sheet) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      link.removeEventListener('load', finish);
      link.removeEventListener('error', finish);
      resolve();
    };

    link.addEventListener('load', finish, { once: true });
    link.addEventListener('error', finish, { once: true });
  });
}

export function preloadFontFamilies(familyStacks: string[], size = 48): Promise<unknown> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return Promise.resolve();
  }

  const families = extractFamilyNames(familyStacks);
  if (families.length === 0) return Promise.resolve();

  return Promise.all(families.map((family) => document.fonts.load(`${size}px "${family}"`)));
}
