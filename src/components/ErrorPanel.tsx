import { useEffect, useRef } from "react";
import type { KnowledgeGraph } from "../content/graph";
import { useAppState } from "../state/useAppState";
import { Icon } from "./Icon";

export interface ErrorPanelProps {
  readonly graph: KnowledgeGraph;
}

function countOf(count: number, noun: string): string {
  return `${count} ${count === 1 ? noun : `${noun}s`}`;
}

export function ErrorPanel({ graph }: ErrorPanelProps) {
  const { isErrorPanelOpen, setIsErrorPanelOpen, navigateToNode } = useAppState();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const errorCount = graph.errors.length;
  const warningCount = graph.warnings.length;
  const totalCount = graph.diagnostics.length;

  useEffect(() => {
    if (!isErrorPanelOpen) {
      return;
    }
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    return () => {
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isErrorPanelOpen]);

  if (!isErrorPanelOpen) {
    if (errorCount === 0) {
      return null;
    }

    return (
      <div className="error-banner" role="alert">
        <span>
          Content validation found{" "}
          <span className="error-banner__count">{countOf(errorCount, "error")}</span>
          {warningCount > 0 ? ` and ${countOf(warningCount, "warning")}` : ""}.
        </span>
        <button
          type="button"
          className="error-banner__btn"
          onClick={() => setIsErrorPanelOpen(true)}
        >
          Show diagnostics
        </button>
      </div>
    );
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Content validation diagnostics"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setIsErrorPanelOpen(false);
        }
      }}
    >
      <div className="error-panel">
        <header className="error-panel__header">
          <div>
            <h2 className="error-panel__title">Content validation</h2>
            <p className="error-panel__subtitle">
              {countOf(errorCount, "error")} · {countOf(warningCount, "warning")} ·{" "}
              {countOf(graph.nodes.length, "node")} loaded
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="detail-panel__icon-btn"
            onClick={() => setIsErrorPanelOpen(false)}
            aria-label="Close diagnostics"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="error-panel__body">
          {totalCount === 0 ? (
            <div className="error-panel__clean">
              <p className="error-panel__clean-count">0 issues</p>
              <p>
                No schema errors, broken relations or orphan nodes across {graph.nodes.length}{" "}
                cards.
              </p>
            </div>
          ) : (
            <div className="error-panel__list">
              {graph.diagnostics.map((diag, idx) => {
                const isError = diag.severity === "error";
                const existingNode = diag.nodeId ? graph.nodesById.get(diag.nodeId) : undefined;

                return (
                  <div key={`${diag.filePath}-${diag.code}-${idx}`} className="error-panel__item">
                    <div className="error-panel__item-top">
                      <span
                        className={`error-panel__badge ${isError ? "error-panel__badge--error" : ""}`}
                      >
                        {diag.severity}
                      </span>
                      <code className="error-panel__code">{diag.code}</code>
                      <code className="error-panel__path">{diag.filePath}</code>
                      {existingNode ? (
                        <button
                          type="button"
                          className="error-panel__node-btn"
                          onClick={() => {
                            navigateToNode(existingNode);
                            setIsErrorPanelOpen(false);
                          }}
                        >
                          Open {existingNode.name}
                        </button>
                      ) : null}
                    </div>
                    <pre className="error-panel__message">{diag.message}</pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
