import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "@fontsource-variable/host-grotesk";
import "@fontsource-variable/geist-mono";
import "@xyflow/react/dist/style.css";
import "./styles/index.css";

const STALE_CHUNK_RELOAD_KEY = "tech-graph:reloaded-for-stale-chunk";

function reloadOnceForStaleChunk(): void {
  try {
    if (sessionStorage.getItem(STALE_CHUNK_RELOAD_KEY)) {
      return;
    }
    sessionStorage.setItem(STALE_CHUNK_RELOAD_KEY, "1");
  } catch {
    return;
  }
  window.location.reload();
}

window.addEventListener("vite:preloadError", reloadOnceForStaleChunk);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary
      fallback={(error) => (
        <div className="fallback" role="alert">
          <p className="fallback__title">Tech Graph couldn't start.</p>
          <p>Something broke while loading the map. Reloading usually fixes it.</p>
          <code className="fallback__detail">{error.message}</code>
          <button type="button" className="fallback__btn" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
