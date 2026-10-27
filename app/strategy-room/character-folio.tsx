"use client";

import Image from "next/image";
import { useId } from "react";
import styles from "./refinements.module.css";

function OriginalFolioSurface() {
  return <svg className={styles.originalFolioSurface} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" data-original-folio-surface>
    <foreignObject width="1000" height="1000" style={{ overflow: "visible" }}>
      <Image src="/strategy-room/objects/character-folio-v1.png" alt="" width={1000} height={1000} unoptimized draggable={false} style={{ width: 1000, height: 1000, maxWidth: "none", transformOrigin: "0 0", transform: "matrix3d(1.68515724072,0.760641547425,0,7.9478055459e-05,0.505727039568,2.55274754062,0,0.000505727039568,0,0,1,0,-546.646862272,-1015.13847656,0,1)" }} />
    </foreignObject>
  </svg>;
}

function OriginalFolioEngraving() {
  const id = `folio-art-${useId().replace(/:/g, "")}`;
  return <svg className={styles.originalFolioSurface} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id={id}><stop offset="42%" stopColor="black" /><stop offset="58%" stopColor="white" /></linearGradient>
      <mask id={`${id}-mask`}><rect width="1000" height="1000" fill={`url(#${id})`} /></mask>
    </defs>
    {/* Only the original engraving is revealed; its old caption stays masked out. */}
    <g mask={`url(#${id}-mask)`}>
      <foreignObject width="1000" height="1000" style={{ overflow: "visible" }}>
        <Image src="/strategy-room/objects/folio-design-reference.png" alt="" width={1586} height={992} unoptimized draggable={false} style={{ width: 1586, height: 992, maxWidth: "none", transformOrigin: "0 0", transform: "matrix3d(14.6183675242,9.47522303629,0,-0.00137600078807,10.0061553107,58.9164509308,0,0.0100061553107,0,0,1,0,-8116.78993798,-41280.9957475,0,1)" }} />
      </foreignObject>
    </g>
  </svg>;
}

export function CharacterFolio({ open, onOpen, inactive = false }: { open: boolean; onOpen: () => void; inactive?: boolean }) {
  return <div className={styles.folioRig} data-folio-rig data-book-open={open} data-room-object inert={inactive}>
    <svg className={styles.folioViewport} viewBox="0 0 2176 723" aria-hidden="true">
      <foreignObject width="2176" height="723" style={{ overflow: "visible" }}>
        <div className={styles.folioTablePlane}>
          <div className={`${styles.glassLeaf} ${styles.folioBase}`} data-book-right-page><OriginalFolioSurface /></div>
          <div className={styles.folioCover} data-book-cover>
            <div className={`${styles.glassLeaf} ${styles.folioCoverFront}`}><OriginalFolioSurface /><OriginalFolioEngraving /></div>
            <div className={`${styles.glassLeaf} ${styles.folioCoverBack}`}><OriginalFolioSurface /></div>
          </div>
        </div>
      </foreignObject>
    </svg>
    <button type="button" className={styles.folioTrigger} aria-label="Meet the characters" aria-expanded={open} aria-controls="character-map" disabled={open} onClick={onOpen}>
      <span className={`${styles.objectCaption} ${styles.hingedCaption}`}>THE CHARACTERS<span className={styles.objectCaptionArrow} aria-hidden="true">↗</span></span>
    </button>
    <span className={styles.folioProjectionLight} aria-hidden="true" />
  </div>;
}
