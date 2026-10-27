"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { transmission } from "./content";
import styles from "./refinements.module.css";

const positions = [
  { left: "54%", top: "47%" }, { left: "22%", top: "30%" },
  { left: "34%", top: "26%" }, { left: "76%", top: "50%" },
  { left: "62%", top: "30%" }, { left: "29%", top: "57%" },
  { left: "56%", top: "31%" },
];

export function Transmission({ beat, onBeat, onComplete, onDismiss }: {
  beat: number;
  onBeat: (index: number) => void;
  onComplete: () => void;
  onDismiss: () => void;
}) {
  const current = transmission[beat];
  const heading = useRef<HTMLHeadingElement>(null);
  const cloud = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const last = beat === transmission.length - 1;
  const duration = Math.max(6500, Math.min(12000, current.text.split(/\s+/).length * 300 + 2000));
  const stopped = paused || pageHidden || leaving;
  const advance = useCallback(() => {
    if (leaving) return;
    if (last) setLeaving(true); else onBeat(beat + 1);
  }, [last, leaving, onBeat, beat]);
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onComplete, 600);
    return () => window.clearTimeout(timer);
  }, [leaving, onComplete]);

  useEffect(() => {
    const visibility = () => setPageHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => { elapsed.current = 0; }, [beat]);
  useEffect(() => {
    if (stopped) return;
    const started = performance.now();
    const timer = window.setTimeout(advance, Math.max(0, duration - elapsed.current));
    return () => {
      window.clearTimeout(timer);
      elapsed.current += performance.now() - started;
    };
  }, [beat, duration, stopped, advance]);

  useEffect(() => {
    const navigate = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); advance(); }
      if (event.key === "ArrowLeft" && beat > 0) { event.preventDefault(); onBeat(beat - 1); }
    };
    window.addEventListener("keydown", navigate);
    return () => window.removeEventListener("keydown", navigate);
  }, [advance, beat, onBeat]);

  return <section className={styles.transmissionExperience} data-transmission-experience aria-label="Skye’s interactive transmission" data-room-object data-beat={beat} data-duration={duration} data-paused={stopped} data-leaving={leaving} onClick={event => {
    if (!(event.target instanceof Element) || event.target.closest("button, a")) return;
    if (!cloud.current) return;
    // The tap boundary follows the visible oval, including its breathing room.
    const bounds = cloud.current.getBoundingClientRect();
    const glow = getComputedStyle(cloud.current, "::before");
    const left = bounds.left + parseFloat(glow.left);
    const top = bounds.top + parseFloat(glow.top);
    const width = bounds.width - parseFloat(glow.left) - parseFloat(glow.right);
    const height = bounds.height - parseFloat(glow.top) - parseFloat(glow.bottom);
    const x = (event.clientX - left - width / 2) / (width / 2);
    const y = (event.clientY - top - height / 2) / (height / 2);
    if (x * x + y * y <= 1) advance(); else onDismiss();
  }}>
    <div className={styles.signalField} aria-hidden="true">
      <div className={styles.signalLight} style={positions[beat]}>
        <span className={styles.signalHalo} /><span className={styles.signalCore} />
        <span className={styles.signalParticles}>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--angle": `${i * 30}deg`, "--distance": `${24 + (i % 3) * 13}px`, animationDelay: `${i * -.3}s` } as CSSProperties} />)}</span>
      </div>
    </div>
    <div ref={cloud} className={styles.transmissionText} data-transmission-cloud data-room-object>
      <div className={styles.transmissionStatus}>
      <button className={styles.transmissionPlayback} onClick={() => setPaused(!paused)} aria-label={paused ? "Resume transmission autoplay" : "Pause transmission autoplay"} aria-pressed={paused}>
        <span className={styles.transmissionBars} aria-hidden="true">{transmission.map((line, index) => <i key={line.focus} data-state={index < beat ? "received" : index === beat ? "receiving" : "pending"} style={{ height: `${10 + (3 - Math.abs(3 - index)) * 4}px` }}><span key={beat} style={{ "--beat-duration": `${duration}ms` } as CSSProperties} /></i>)}</span>
        <span className={styles.playbackGlyph} aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
      </button>
      </div>
      <div key={beat} className={styles.transmissionBeat}>
        <h1 ref={heading} data-transmission-line tabIndex={-1} className={styles.transmissionLine} aria-live="polite" aria-atomic="true">
          <span className={styles.screenReaderOnly}>{current.text}</span>
          <span aria-hidden="true">{current.text.split(" ").map((word, i) => <span className={styles.enteringWord} key={i} style={{ "--word-delay": `${i * 38}ms` } as CSSProperties}>{word} </span>)}</span>
        </h1>
      </div>
      <div className={styles.transmissionControls}>
        <button className={styles.tapToContinue} aria-label={last ? "Finish transmission" : "Tap to continue"} onClick={advance}>TAP TO CONTINUE</button>
      </div>
    </div>
  </section>;
}
