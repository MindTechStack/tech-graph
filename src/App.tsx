import { useMemo } from "react";
import { DetailPanel } from "./components/DetailPanel";
import { ErrorPanel } from "./components/ErrorPanel";
import { GraphCanvas } from "./components/GraphCanvas";
import { SearchModal } from "./components/SearchModal";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import { loadGraphFromGlob } from "./content/load";
import { AppStateProvider } from "./state/useAppState";

export function App() {
  const graph = useMemo(() => loadGraphFromGlob(), []);

  return (
    <AppStateProvider
      initialMap="backend"
      initialMode="layers"
      hasInitialErrors={graph.errors.length > 0}
    >
      <div className="app-shell">
        <Toolbar graph={graph} />
        <div className="app-workspace">
          <Sidebar graph={graph} />
          <main className="app-main">
            <GraphCanvas graph={graph} />
          </main>
          <DetailPanel graph={graph} />
        </div>
        <SearchModal graph={graph} />
        <ErrorPanel graph={graph} />
      </div>
    </AppStateProvider>
  );
}
