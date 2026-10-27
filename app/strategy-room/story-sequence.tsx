"use client";

import type { Ref } from "react";
import { journey, logline } from "./content";
import { ChapterSequence } from "./chapter-sequence";
import refined from "./refinements.module.css";

export function StorySequence({ onClose, onCharacters, titleRef }: { onClose: () => void; onCharacters: () => void; titleRef: Ref<HTMLHeadingElement> }) {
  return <ChapterSequence variant="story" title="The story" titleRef={titleRef} onClose={onClose} onComplete={onCharacters} completeLabel="characters" chapters={[
    { label: "Overview", content: <div data-story-overview className={refined.overviewCard}><div><span className={refined.actCardNumber}>THE PREMISE</span><p className={refined.storyLogline}>{logline}</p></div></div> },
    ...journey.map((act, index) => ({ label: `Act ${index + 1}`, content: <article data-story-act={act.number} className={refined.storyAct} aria-live="polite"><span className={refined.actCardNumber}>{act.number} / 03</span><h2>{act.title}</h2>{act.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article> })),
  ]} />;
}
