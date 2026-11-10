import { useMemo } from "react";
import { loadGraphFromGlob } from "./content/load";

export function App() {
  const graph = useMemo(() => loadGraphFromGlob(), []);

  return (
    <main style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      <header style={{ marginBottom: "24px" }}>
        <h1>Tech Graph</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
          Interactive Knowledge Map · {graph.maps.length} maps ·{" "}
          {graph.nodes.length} nodes · {graph.edges.length} relations
        </p>
      </header>

      {graph.errors.length > 0 && (
        <section
          style={{
            padding: "16px",
            marginBottom: "24px",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.1)",
          }}
        >
          <h2>Content Validation Errors ({graph.errors.length})</h2>
          <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
            {graph.errors.map((err, i) => (
              <li key={i}>
                <code>[{err.code}]</code> {err.filePath}: {err.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "12px",
        }}
      >
        {graph.nodes.map((node) => (
          <article
            key={node.id}
            style={{
              padding: "14px",
              borderRadius: "8px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "8px",
              }}
            >
              <strong>{node.name}</strong>
              <span
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {node.map}/{node.category}
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginTop: "6px",
              }}
            >
              {node.what}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
