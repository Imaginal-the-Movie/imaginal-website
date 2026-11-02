"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ASSETS } from "./content";
import { RoomIcon } from "./room-icon";
import styles from "./brochure-pages.module.css";

const PAGE_COUNT = 19;

export function BrochurePages() {
  const [page, setPage] = useState(1);
  const move = useCallback((direction: number) => setPage(current => Math.max(1, Math.min(PAGE_COUNT, current + direction))), []);
  useEffect(() => {
    const navigate = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", navigate);
    return () => window.removeEventListener("keydown", navigate);
  }, [move]);

  return <section className={styles.viewer} aria-label="Imaginal brochure">
    <button type="button" className={styles.page} aria-label="Turn brochure page" title="Tap to advance" disabled={page === PAGE_COUNT} onClick={() => move(1)}>
      <Image src={`${ASSETS}/brochure-pages/${String(page).padStart(2, "0")}.webp`} alt={`Imaginal brochure, page ${page} of ${PAGE_COUNT}. Download the PDF for selectable text.`} fill unoptimized sizes="100vw" />
    </button>
    <nav className={styles.controls} aria-label="Brochure pages">
      <button type="button" aria-label="Previous brochure page" disabled={page === 1} onClick={() => move(-1)}><RoomIcon name="arrow-left" /></button>
      <span aria-live="polite">{page} / {PAGE_COUNT}</span>
      <button type="button" aria-label="Next brochure page" disabled={page === PAGE_COUNT} onClick={() => move(1)}><RoomIcon name="arrow-right" /></button>
    </nav>
  </section>;
}
