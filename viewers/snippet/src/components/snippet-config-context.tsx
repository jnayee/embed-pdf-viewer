import { h, ComponentChildren, createContext } from 'preact';
import { useContext } from 'preact/hooks';

import type { PDFViewerConfig } from './app';

const SnippetConfigContext = createContext<PDFViewerConfig>({});

interface SnippetConfigProviderProps {
  config: PDFViewerConfig;
  children: ComponentChildren;
}

export function SnippetConfigProvider({ config, children }: SnippetConfigProviderProps) {
  return <SnippetConfigContext.Provider value={config}>{children}</SnippetConfigContext.Provider>;
}

export function useSnippetConfig(): PDFViewerConfig {
  return useContext(SnippetConfigContext);
}
