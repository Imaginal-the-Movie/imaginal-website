"use client";

import { RoomIcon } from "./room-icon";
import { useCallback, useEffect, useId, useRef } from "react";
import { characters } from "./content";
import styles from "./refinements.module.css";
import { useSwipeNavigation } from "./use-swipe-navigation";

export type Character = keyof typeof characters;
const characterOrder: Character[] = ["skye", "eve", "robot", "ceo", "boyfriend"];

// Preserve the original film engraving independently of the new map portraits.
export function FolioEngraving() {
  const uid = useId().replace(/:/g, "");
  const clipId = `engraving-${uid}`;
  return <svg className={styles.portrait} viewBox="1240 270 370 430" aria-hidden="true">
    <defs><clipPath id={clipId}><path d="M1399 294 C1465 294 1496 324 1493 385 C1488 424 1476 449 1453 461 L1464 482 Q1538 482 1571 534 L1561 700 L1287 700 L1285 580 Q1290 526 1353 499 L1364 476 Q1340 466 1333 444 L1317 441 L1307 430 L1314 420 L1306 417 L1313 405 L1301 399 L1312 385 L1321 364 C1320 315 1354 296 1399 294 Z" /></clipPath></defs>
    <image className={styles.bustFace} clipPath={`url(#${clipId})`} href={characters.robot.image} width="1920" height="1080" />
  </svg>;
}

export function CharacterProjection({ kind }: { kind: Character }) {
  const uid = useId().replace(/:/g, "");
  const maskId = `bust-alpha-${kind}-${uid}`;
  const meshId = `mesh-${kind}-${uid}`;
  const occlusionId = `ring-occlusion-${kind}-${uid}`;
  const solidId = `ring-solid-${kind}-${uid}`;
  const fadeId = `bust-fade-${kind}-${uid}`;
  const fadeGradientId = `bust-gradient-${kind}-${uid}`;
  const source = `/strategy-room/busts-v2/${kind === "eve" ? "eve-v3" : kind}.png`;
  return <svg className={`${styles.portrait} ${styles.generatedPortrait}`} viewBox="0 0 1024 1536" aria-hidden="true">
    <defs>
      <mask id={maskId} style={{ maskType: "alpha" }} x="0" y="0" width="1024" height="1536" maskUnits="userSpaceOnUse">
        <image href={source} width="1024" height="1536" />
      </mask>
      <filter id={solidId}><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
      <mask id={occlusionId} style={{ maskType: "luminance" }} x="-200" y="0" width="1424" height="1600" maskUnits="userSpaceOnUse">
        <rect x="-200" width="1424" height="1600" fill="white" />
        <image href={source} width="1024" height="1536" filter={`url(#${solidId})`} />
      </mask>
      <linearGradient id={fadeGradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="77%" stopColor="white" /><stop offset="94%" stopColor="black" /></linearGradient>
      <mask id={fadeId} style={{ maskType: "luminance" }} x="0" y="0" width="1024" height="1536" maskUnits="userSpaceOnUse"><rect width="1024" height="1536" fill={`url(#${fadeGradientId})`} /></mask>
      <pattern id={meshId} width="35" height="30" patternUnits="userSpaceOnUse"><path d="M0 0 35 30 M35 0 0 30 M0 15H35" fill="none" stroke="currentColor" strokeWidth=".65" /></pattern>
    </defs>
    <path data-ring-back className={styles.bustRingBack} d="M-108 1380 A620 110 0 0 1 1132 1380" mask={`url(#${occlusionId})`} />
    <g mask={`url(#${fadeId})`}>
    <image data-bust-image className={styles.bustFace} href={source} width="1024" height="1536" />
    <rect className={styles.bustMesh} mask={`url(#${maskId})`} width="1024" height="1536" fill={`url(#${meshId})`} />
    </g>
    <path data-ring-front className={styles.bustRingFront} d="M-108 1380 A620 110 0 0 0 1132 1380" />
  </svg>;
}

export function TabletopCharacters({ active, selected, onPreview, onSelect, onClose }: {
  active: Character | null;
  selected: Character | null;
  onPreview: (character: Character | null) => void;
  onSelect: (character: Character) => void;
  onClose: () => void;
}) {
  const selectedIndex = selected ? characterOrder.indexOf(selected) : 0;
  const nextButton = useRef<HTMLButtonElement>(null);
  const keepCycleFocus = useRef(false);
  useEffect(() => {
    if (keepCycleFocus.current) {
      nextButton.current?.focus({ preventScroll: true });
      keepCycleFocus.current = false;
    }
  }, [selected]);
  const cycleCharacter = useCallback((direction: number, retainFocus = false) => {
    const current = selected ? characterOrder.indexOf(selected) : direction > 0 ? -1 : 0;
    keepCycleFocus.current = retainFocus || document.activeElement === nextButton.current;
    onPreview(null);
    onSelect(characterOrder[(current + direction + characterOrder.length) % characterOrder.length]);
  }, [selected, onPreview, onSelect]);
  const swipe = useSwipeNavigation(() => cycleCharacter(1), () => cycleCharacter(-1));
  useEffect(() => {
    const cycleWithArrows = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      cycleCharacter(event.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", cycleWithArrows);
    return () => window.removeEventListener("keydown", cycleWithArrows);
  }, [cycleCharacter]);
  return <div {...swipe} id="character-map" data-character-map data-room-object data-has-selection={selected ? "true" : undefined} className={styles.tabletopCharacters} role="group" aria-label="Character holograms on the strategy table">
    <button type="button" data-character-close aria-label="Close characters" onClick={onClose}>×</button>
    <div className={styles.busts} data-character-orbit>
      {characterOrder.map(key => <div key={key} className={styles.characterStation} data-character={key} data-selected={selected === key ? "true" : undefined} data-orbit-slot={selected ? (selectedIndex - characterOrder.indexOf(key) + characterOrder.length) % characterOrder.length : undefined}>
        <button
        type="button"
        data-character={key}
        className={`${styles.bustButton} ${active === key || selected === key ? styles.bustActive : ""}`}
        aria-label={`Meet ${characters[key].name}`}
        aria-expanded={selected === key}
        aria-controls={selected === key ? `character-detail-${key}` : undefined}
        onPointerEnter={event => { if (event.pointerType === "mouse") onPreview(key); }}
        onPointerLeave={() => onPreview(null)}
        onFocus={() => onPreview(key)}
        onBlur={() => onPreview(null)}
        onClick={() => selected === key ? cycleCharacter(1, true) : onSelect(key)}
      >
        <span className={styles.bustGlow} aria-hidden="true" />
        <CharacterProjection kind={key} />
        <span className={styles.bustName}>{characters[key].name}</span>
      </button>
      {selected === key && <aside id={`character-detail-${key}`} data-character-detail data-room-object className={styles.characterDetail} aria-label={`${characters[key].name} character introduction`}>
        <h2>{characters[key].name}</h2><p>{characters[key].caption}</p>
        <span className={styles.characterNextCue} aria-hidden="true">Next character <RoomIcon name="arrow-right" /></span>
        <button ref={nextButton} type="button" className={styles.characterNext} aria-label="Next character" onClick={() => cycleCharacter(1, true)} />
      </aside>}
      </div>)}
    </div>
    <div data-character-controls>
      <button type="button" aria-label="Previous character" onClick={() => cycleCharacter(-1)}><RoomIcon name="arrow-left" /></button>
      <span aria-live="polite">{selected ? characters[selected].name : "Characters"} · {selectedIndex + 1} / {characterOrder.length}</span>
      <button type="button" aria-label="Next character" onClick={() => cycleCharacter(1)}><RoomIcon name="arrow-right" /></button>
    </div>
  </div>;
}
