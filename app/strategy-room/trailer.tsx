"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./refinements.module.css";
import { loadYouTubeApi, type YouTubePlayer } from "../video-player";

const VIDEO_ID = "YIRQDS6SoVw";
export function Trailer({ onClose, initialTime, onRememberTime }: {
  onClose: () => void;
  initialTime: number;
  onRememberTime: (time: number) => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let disposed = false;
    let started = false;
    let ended = false;
    let closing = false;
    let player: YouTubePlayer | undefined;
    const close = (time: number) => {
      if (disposed || closing) return;
      closing = true;
      onRememberTime(time);
      onClose();
    };
    void loadYouTubeApi().then(YT => {
      if (disposed || !mount.current) return;
      const target = document.createElement("div");
      mount.current.append(target);
      player = new YT.Player(target, {
        width: "100%", height: "100%", videoId: VIDEO_ID,
        playerVars: { autoplay: 1, controls: 1, playsinline: 1, rel: 0, origin: window.location.origin, start: Math.floor(initialTime) },
        events: {
          onReady: event => {
            if (disposed) return;
            if (initialTime > 0) event.target.seekTo(initialTime, true);
            event.target.playVideo();
          },
          onStateChange: event => {
            if (disposed) return;
            if (event.data === 1) started = true;
            if (event.data === 2 && started) close(event.target.getCurrentTime());
            if (event.data === 0) { ended = true; close(0); }
          },
          onError: () => { if (!disposed) setError(true); },
        },
      });
    }).catch(() => { if (!disposed) setError(true); });
    return () => {
      disposed = true;
      if (player) {
        if (!closing) onRememberTime(ended ? 0 : player.getCurrentTime?.() || initialTime);
        player.destroy();
      }
    };
  }, [initialTime, onClose, onRememberTime]);

  return <section data-room-object data-trailer-screen className={styles.fullscreenTrailer} role="dialog" aria-modal="true" aria-label="Imaginal trailer">
    <div ref={mount} className={styles.youtubeMount} />
    <button type="button" className={styles.trailerClose} onClick={onClose}>Back to room</button>
    {error && <div className={styles.trailerError} role="alert"><p>The YouTube player could not load.</p><a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noreferrer">Watch on YouTube ↗</a><button type="button" onClick={onClose}>Close trailer</button></div>}
  </section>;
}
