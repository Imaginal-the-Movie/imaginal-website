"use client";

import { useEffect, useState } from "react";

// Opt-in local diagnostics: /strategy-room?layoutDebug=1. No production UI.
export function LayoutDiagnostics() {
  const [report, setReport] = useState("");
  const [frame, setFrame] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || new URLSearchParams(window.location.search).get("layoutDebug") !== "1") return;
    const measure = () => {
      const main = document.querySelector("main[data-view]");
      const panel = main?.querySelector<HTMLElement>("[data-reading-frame]");
      const inner = panel?.querySelector<HTMLElement>("[data-reading-scroll]");
      const footer = panel?.querySelector<HTMLElement>("[data-reading-footer]");
      const header = panel?.querySelector<HTMLElement>("[data-reading-header]");
      const rect = panel?.getBoundingClientRect();
      const px = (n: number) => `${n.toFixed(1)}px`;
      const box = (el?: HTMLElement | null) => {
        if (!el) return "none";
        const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        return `${px(r.height)} high; padding ${s.paddingTop}/${s.paddingBottom}`;
      };
      const last = footer?.lastElementChild?.getBoundingClientRect();
      setReport([
        "LAYOUT DIAGNOSTICS · anchored-panel-v5",
        `View: ${main?.getAttribute("data-view")} · viewport ${innerWidth}×${innerHeight} · DPR ${devicePixelRatio}`,
        `Visual viewport: ${window.visualViewport?.width.toFixed(1)}×${window.visualViewport?.height.toFixed(1)} · scale ${window.visualViewport?.scale}`,
        rect ? `Frame: ${px(rect.width)}×${px(rect.height)} · top ${px(rect.top)} · bottom gap ${px(innerHeight - rect.bottom)}` : "Open Story or Project to measure",
        rect ? `Center offset: ${px(rect.top + rect.height / 2 - innerHeight / 2)}` : "",
        `Header: ${box(header)}`,
        `Scroller: ${box(inner)} · scroll ${inner?.scrollTop.toFixed(1) ?? "—"}/${inner ? inner.scrollHeight - inner.clientHeight : "—"}`,
        `Footer: ${box(footer)}`,
        rect && last ? `Last action → frame bottom: ${px(rect.bottom - last.bottom)}` : "",
      ].filter(Boolean).join("\n"));
      setFrame(rect ?? null);
    };
    measure();
    const timer = window.setInterval(measure, 300);
    return () => window.clearInterval(timer);
  }, []);

  if (!report) return null;
  return <div aria-label="Layout diagnostics" style={{ position: "fixed", inset: 0, zIndex: 100, pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: "50%", width: "100%", borderTop: "1px dashed #c23b6d" }} />
    {frame && <div style={{ position: "absolute", left: frame.x, top: frame.y, width: frame.width, height: frame.height, outline: "1px solid #c23b6d" }} />}
    <pre style={{ position: "absolute", left: 8, bottom: 8, margin: 0, padding: 12, borderRadius: 4, background: "rgba(16,30,40,.94)", color: "#fff", font: "11px/1.55 monospace", whiteSpace: "pre-wrap", maxWidth: "calc(100vw - 16px)" }}>{report}</pre>
  </div>;
}
