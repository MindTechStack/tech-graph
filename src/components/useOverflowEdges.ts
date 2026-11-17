import { type RefObject, useEffect } from "react";

export function useOverflowEdges(scrollerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const markHiddenEdges = () => {
      scroller.dataset.hiddenStart = String(scroller.scrollLeft > 1);
      scroller.dataset.hiddenEnd = String(
        scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
      );
    };
    markHiddenEdges();
    void document.fonts.ready.then(markHiddenEdges);
    scroller.addEventListener("scroll", markHiddenEdges, { passive: true });
    const resizeObserver = new ResizeObserver(markHiddenEdges);
    resizeObserver.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", markHiddenEdges);
      resizeObserver.disconnect();
    };
  }, [scrollerRef]);
}
