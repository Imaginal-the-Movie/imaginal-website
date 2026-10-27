"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { RoomIcon } from "./room-icon";
import styles from "./refinements.module.css";

function OriginalFolioSurface() {
  return <div className={styles.originalFolioSurface} aria-hidden="true" data-original-folio-surface>
      <Image src="/strategy-room/objects/character-folio-v1.png" alt="" width={1000} height={1000} unoptimized draggable={false} style={{ width: 1000, height: 1000, maxWidth: "none", transformOrigin: "0 0", transform: "matrix3d(1.68515724072,0.760641547425,0,7.9478055459e-05,0.505727039568,2.55274754062,0,0.000505727039568,0,0,1,0,-546.646862272,-1015.13847656,0,1)" }} />
  </div>;
}

function OriginalFolioEngraving() {
  return <div className={`${styles.originalFolioSurface} ${styles.folioEngraving}`} aria-hidden="true">
    {/* Only the original engraving is revealed; its old caption stays masked out. */}
        <Image src="/strategy-room/objects/folio-design-reference.png" alt="" width={1586} height={992} unoptimized draggable={false} style={{ width: 1586, height: 992, maxWidth: "none", transformOrigin: "0 0", transform: "matrix3d(14.6183675242,9.47522303629,0,-0.00137600078807,10.0061553107,58.9164509308,0,0.0100061553107,0,0,1,0,-8116.78993798,-41280.9957475,0,1)" }} />
  </div>;
}

export function CharacterFolio({ open, onOpen, inactive = false }: { open: boolean; onOpen: () => void; inactive?: boolean }) {
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    // Scale the rigid table geometry as HTML: Safari cannot reliably composite
    // nested SVG foreignObjects containing perspective-transformed images.
    const updateScale = () => element.style.setProperty("--folio-scale", String(element.clientWidth / 2176));
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className={styles.folioRig} data-folio-rig data-book-open={open} data-room-object inert={inactive}>
    <div ref={viewport} className={styles.folioViewport} aria-hidden="true">
      <div className={styles.folioGeometry}>
        <div className={styles.folioTablePlane}>
          <div className={`${styles.glassLeaf} ${styles.folioBase}`} data-book-right-page><OriginalFolioSurface /></div>
          <div className={styles.folioCover} data-book-cover>
            <div className={`${styles.glassLeaf} ${styles.folioCoverFront}`}><OriginalFolioSurface /><OriginalFolioEngraving /></div>
            <div className={`${styles.glassLeaf} ${styles.folioCoverBack}`}><OriginalFolioSurface /></div>
          </div>
        </div>
      </div>
    </div>
    <button type="button" className={styles.folioTrigger} aria-label="Meet the characters" aria-expanded={open} aria-controls="character-map" disabled={open} onClick={onOpen}>
      <span className={`${styles.objectCaption} ${styles.hingedCaption}`}>THE CHARACTERS<RoomIcon name="arrow-up-right" className={styles.objectCaptionArrow} /></span>
    </button>
    <span className={styles.folioProjectionLight} aria-hidden="true" />
  </div>;
}
