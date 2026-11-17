import { lazy, Suspense, useCallback, useMemo } from "react";
import { AUTHOR_NAME, ResumeLink } from "./components/Author";
import { DetailPanel } from "./components/DetailPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorPanel } from "./components/ErrorPanel";
import { Icon } from "./components/Icon";
import { PhoneIndex, useIsPhoneCardOpen, useIsPhoneLayout } from "./components/PhoneIndex";
import { SearchModal } from "./components/SearchModal";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import { buildGraphFromParsedContent, type KnowledgeGraph } from "./content/graph";
import builtContent from "virtual:tech-graph-content";
import { type ParsedUrlState, resolveDeepLink } from "./state/url-sync";
import { AppStateProvider, useAppState } from "./state/useAppState";

const MAIN_ID = "main-content";

const GraphCanvas = lazy(() =>
  import("./components/GraphCanvas").then(({ GraphCanvas }) => ({ default: GraphCanvas })),
);

function GraphCanvasLoading() {
  return (
    <div className="graph-canvas">
      <div className="graph-canvas__pane" />
      <footer className="graph-canvas__status graph-canvas__status--loading">
        <span className="graph-canvas__layout-badge">Arranging…</span>
      </footer>
    </div>
  );
}

function useIsCoveredByOverlay(): boolean {
  const { isSearchOpen, isErrorPanelOpen } = useAppState();
  return useIsPhoneCardOpen() || isSearchOpen || isErrorPanelOpen;
}

function SkipLink({ children }: { readonly children: string }) {
  const isCovered = useIsCoveredByOverlay();

  return (
    <button
      type="button"
      className="skip-link"
      inert={isCovered}
      onClick={() => document.getElementById(MAIN_ID)?.focus()}
    >
      {children}
    </button>
  );
}

function UnknownNodeNotice() {
  const { unknownNodeId, dismissUnknownNode, setIsSearchOpen } = useAppState();

  return (
    <div className="link-notice-region" role="status">
      {unknownNodeId ? (
        <div className="link-notice">
          <p className="link-notice__text">
            No topic called <code>{unknownNodeId}</code>. The link may point to a node that was
            renamed or removed.
          </p>
          <button
            type="button"
            className="graph-canvas__empty-btn"
            onClick={() => {
              dismissUnknownNode();
              setIsSearchOpen(true);
            }}
          >
            Search
          </button>
          <button
            type="button"
            className="detail-panel__icon-btn"
            onClick={dismissUnknownNode}
            aria-label="Dismiss notice"
          >
            <Icon name="close" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AuthorBar() {
  const isCovered = useIsCoveredByOverlay();

  return (
    <div className="author-bar" inert={isCovered}>
      <span className="author-bar__name">{AUTHOR_NAME}</span>
      <span className="author-bar__role">Senior Front-End Engineer · TypeScript</span>
      <ResumeLink />
    </div>
  );
}

function Workspace({ graph }: { readonly graph: KnowledgeGraph }) {
  const {
    activeMap,
    isSearchOpen,
    isErrorPanelOpen,
    isPhoneMapShown,
    isSidebarOpen,
    toggleSidebar,
  } = useAppState();
  const isPhoneLayout = useIsPhoneLayout();
  const isPhoneCardOpen = useIsPhoneCardOpen();

  return (
    <div className="app-workspace" inert={isSearchOpen || isErrorPanelOpen}>
      {isSidebarOpen ? (
        <>
          <div className="sidebar-scrim" aria-hidden="true" onClick={toggleSidebar} />
          <SkipLink>Skip filters</SkipLink>
        </>
      ) : null}
      <Sidebar graph={graph} />
      <main id={MAIN_ID} className="app-main" tabIndex={-1} inert={isPhoneCardOpen}>
        <UnknownNodeNotice />
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
            <Suspense fallback={<GraphCanvasLoading />}>
              <GraphCanvas graph={graph} />
            </Suspense>
          </ErrorBoundary>
        )}
      </main>
      <DetailPanel graph={graph} />
    </div>
  );
}

export function App() {
  const graph = useMemo(() => buildGraphFromParsedContent(builtContent), []);
  const resolveUrlState = useCallback(
    (parsed: ParsedUrlState) => resolveDeepLink(parsed, graph),
    [graph],
  );

  return (
    <AppStateProvider
      initialMap="core"
      hasInitialErrors={import.meta.env.DEV && graph.errors.length > 0}
      resolveUrlState={resolveUrlState}
    >
      <div className="app-shell">
        <SkipLink>Skip to content</SkipLink>
        <AuthorBar />
        <Toolbar graph={graph} />
        <Workspace graph={graph} />
        <SearchModal graph={graph} />
        {import.meta.env.DEV ? <ErrorPanel graph={graph} /> : null}
      </div>
    </AppStateProvider>
  );
}
