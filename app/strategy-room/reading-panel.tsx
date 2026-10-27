import type { ReactNode, Ref } from "react";
import styles from "./strategy-room.module.css";
import refined from "./refinements.module.css";

type ReadingPanelProps = {
  id: string;
  variant: "story" | "project";
  closeLabel: string;
  onClose: () => void;
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  bodyRef?: Ref<HTMLDivElement>;
  scrollBody?: boolean;
  edgeControls?: ReactNode;
};

export function ReadingPanel({ id, variant, closeLabel, onClose, header, footer, children, bodyRef, scrollBody = true, edgeControls }: ReadingPanelProps) {
  return <><span data-reading-shadow aria-hidden="true" className={refined.readingShadow} /><section data-room-object data-reading-frame data-reading-has-footer={Boolean(footer)} data-reading-has-edges={Boolean(edgeControls)} className={`${styles.surface} ${refined.readingPanel} ${variant === "story" ? refined.storySurface : refined.projectSurface}`} aria-labelledby={id}>
    <button type="button" className={refined.readingClose} aria-label={closeLabel} onClick={onClose}>×</button>
    <div data-reading-header className={refined.readingHeader}>{header}</div>
    <div ref={bodyRef} data-reading-scroll={scrollBody || undefined} tabIndex={scrollBody ? 0 : undefined} className={scrollBody ? `${refined.readingBody} ${refined.readingScroll}` : refined.readingBodyFixed}>{children}</div>
    {footer && <div data-reading-footer className={refined.readingFooter}>{footer}</div>}
    {edgeControls}
  </section></>;
}
