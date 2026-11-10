import { useMemo } from "react";
import { GraphCanvas } from "./components/GraphCanvas";
import { Toolbar } from "./components/Toolbar";
import { loadGraphFromGlob } from "./content/load";
import { AppStateProvider } from "./state/useAppState";

export function App() {
  const graph = useMemo(() => loadGraphFromGlob(), []);

  return (
    <AppStateProvider initialMap="backend" initialMode="layers">
      <div className="app-shell">
        <Toolbar graph={graph} />
        <main className="app-main">
          <GraphCanvas graph={graph} />
        </main>
      </div>
    </AppStateProvider>
  );
}
