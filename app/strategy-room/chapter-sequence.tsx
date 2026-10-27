"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { ReadingPanel } from "./reading-panel";
import refined from "./refinements.module.css";
import { useSwipeNavigation } from "./use-swipe-navigation";

export type Chapter = { label: string; content: ReactNode };
type ChapterSequenceProps = {
  variant: "story" | "project";
  title: string;
  titleRef: Ref<HTMLHeadingElement>;
  onClose: () => void;
  chapters: Chapter[];
  initialIndex?: number;
  resetKey?: number;
  onComplete?: () => void;
  completeLabel?: string;
};

export function ChapterSequence({ variant, title, titleRef, onClose, chapters, initialIndex = 0, resetKey, onComplete, completeLabel }: ChapterSequenceProps) {
  const [step, setStep] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const reader = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const last = chapters.length - 1;
  const goTo = useCallback((next: number) => {
    const target = Math.max(0, Math.min(last, next));
    setDirection(target >= step ? 1 : -1);
    setStep(target);
  }, [last, step]);
  const forward = useCallback(() => { if (step === last) onComplete?.(); else goTo(step + 1); }, [goTo, last, onComplete, step]);
  const swipe = useSwipeNavigation(forward, () => goTo(step - 1));

  useEffect(() => { setStep(initialIndex); setDirection(1); }, [initialIndex, resetKey]);
  useEffect(() => { reader.current?.scrollTo({ top: 0 }); }, [step, resetKey]);
  useEffect(() => {
    const nav = navigation.current;
    const active = nav?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (nav && active && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: Math.max(0, active.offsetLeft - nav.offsetLeft - 12), behavior: "smooth" });
  }, [step]);
  useEffect(() => {
    const navigate = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      if (event.key === "ArrowRight") forward(); else goTo(step - 1);
    };
    window.addEventListener("keydown", navigate);
    return () => window.removeEventListener("keydown", navigate);
  }, [forward, goTo, step]);

  const hasNext = step < last || Boolean(onComplete);
  const nextLabel = step < last ? chapters[step + 1].label : completeLabel;
  const contentId = `${variant}-chapter`;
  return <ReadingPanel id={`${variant}-title`} variant={variant} closeLabel={variant === "story" ? "Close story" : "Close project"} onClose={onClose} scrollBody={false}
    edgeControls={<>
      {step > 0 && <button type="button" data-reading-prev className={`${refined.storyCircleArrow} ${refined.storyCirclePrevious}`} aria-label="Previous chapter" onClick={() => goTo(step - 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button>}
      {hasNext && <button type="button" data-reading-next className={`${refined.storyCircleArrow} ${refined.storyCircleNext}`} aria-label={step < last ? "Next chapter" : `Continue to ${completeLabel}`} onClick={forward}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button>}
    </>}
    header={<>
      <h1 ref={titleRef} tabIndex={-1} id={`${variant}-title`}>{title}</h1>
      <nav ref={navigation} data-reading-nav className={refined.actNav} aria-label={variant === "story" ? "Story chapters" : "Project chapters"}>{chapters.map((chapter, index) => <button key={chapter.label} type="button" aria-pressed={step === index} aria-controls={contentId} onClick={() => goTo(index)}>{chapter.label}</button>)}</nav>
    </>}
  >
    <div {...swipe} className={refined.storyDeck} data-chapter-deck data-story-deck={variant === "story" || undefined}>
      {step > 0 && <button type="button" className={`${refined.actPeek} ${refined.actPeekPrevious}`} aria-label={`Go to ${chapters[step - 1].label}`} onClick={() => goTo(step - 1)}><span>{chapters[step - 1].label}</span></button>}
      <div key={step} ref={reader} data-reading-scroll data-active-chapter={step} tabIndex={0} className={`${refined.actCard} ${refined.readingScroll}`} data-direction={direction} id={contentId}>
        {chapters[step].content}
      </div>
      {hasNext && <button type="button" className={`${refined.actPeek} ${refined.actPeekNext}`} aria-label={`Go to ${nextLabel}`} onClick={forward}><span>{nextLabel}</span></button>}
    </div>
  </ReadingPanel>;
}
