import { useCallback, useMemo } from "react";
import resumeUrl from "../content/Maksym_Matsydulskas_Resume.pdf?url";
import { DetailPanel } from "./components/DetailPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorPanel } from "./components/ErrorPanel";
import { GraphCanvas } from "./components/GraphCanvas";
import { PhoneIndex, useIsPhoneLayout } from "./components/PhoneIndex";
import { SearchModal } from "./components/SearchModal";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import type { KnowledgeGraph } from "./content/graph";
import { loadGraphFromGlob } from "./content/load";
import { type ParsedUrlState, resolveDeepLink } from "./state/url-sync";
import { AppStateProvider, useAppState } from "./state/useAppState";

function AuthorBar() {
  const { isSearchOpen, isErrorPanelOpen } = useAppState();

  return (
    <div className="author-bar" inert={isSearchOpen || isErrorPanelOpen}>
      <span className="author-bar__name">Maksym Matsydulskas</span>
      <span className="author-bar__role">Senior Front-End Engineer · TypeScript</span>
      <a className="author-bar__resume" href={resumeUrl} target="_blank" rel="noopener">
        Résumé <span className="author-bar__format">PDF</span>
      </a>
    </div>
  );
}

function Workspace({ graph }: { readonly graph: KnowledgeGraph }) {
  const { activeMap, isSearchOpen, isErrorPanelOpen, isPhoneMapShown } = useAppState();
  const isPhoneLayout = useIsPhoneLayout();

  return (
    <div className="app-workspace" inert={isSearchOpen || isErrorPanelOpen}>
      <Sidebar graph={graph} />
      <main className="app-main">
        {isPhoneLayout && !isPhoneMapShown ? (
          <PhoneIndex key={activeMap} graph={graph} />
        ) : (
          <ErrorBoundary
            fallback={(_error, reset) => (
              <div className="fallback" role="alert">
                <p className="fallback__title">The map couldn't be drawn.</p>
                <p>Search and the node cards still work.</p>
                <button type="button" className="fallback__btn" onClick={reset}>
                  Redraw map
                </button>
              </div>
            )}
          >
            <GraphCanvas graph={graph} />
          </ErrorBoundary>
        )}
      </main>
      <DetailPanel graph={graph} />
    </div>
  );
}

export function App() {
  const graph = useMemo(() => loadGraphFromGlob(), []);
  const resolveUrlState = useCallback(
    (parsed: ParsedUrlState) => resolveDeepLink(parsed, graph),
    [graph],
  );

  return (
    <AppStateProvider
      initialMap="core"
      initialMode="layers"
      hasInitialErrors={import.meta.env.DEV && graph.errors.length > 0}
      resolveUrlState={resolveUrlState}
    >
      <div className="app-shell">
        <AuthorBar />
        <Toolbar graph={graph} />
        <Workspace graph={graph} />
        <SearchModal graph={graph} />
        {import.meta.env.DEV ? <ErrorPanel graph={graph} /> : null}
      </div>
    </AppStateProvider>
  );
}
