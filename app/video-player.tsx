"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PlayerStateEvent = { data: number };
type PlayerReadyEvent = { target: YouTubePlayer };

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, number>;
      events: {
        onReady: (event: PlayerReadyEvent) => void;
        onStateChange: (event: PlayerStateEvent) => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) resolve(window.YT);
    };

    const existingScript = document.getElementById("youtube-iframe-api");
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = "youtube-iframe-api";
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("YouTube player failed to load."));
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

export function VideoPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const playerMountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const isPlayerReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const isClosingRef = useRef(false);

  const collapsePlayer = useCallback(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    pendingPlayRef.current = false;
    playerRef.current?.pauseVideo();
    setIsOpen(false);

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }

    window.setTimeout(() => {
      isClosingRef.current = false;
    }, 0);
  }, []);

  const openPlayer = () => {
    isClosingRef.current = false;
    pendingPlayRef.current = true;
    setLoadFailed(false);
    setIsOpen(true);

    if (document.documentElement.requestFullscreen) {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }

    if (playerRef.current && isPlayerReadyRef.current) {
      playerRef.current.playVideo();
    }
  };

  useEffect(() => {
    let isCancelled = false;

    void loadYouTubeApi()
      .then((youtube) => {
        if (isCancelled || !playerMountRef.current) return;

        playerRef.current = new youtube.Player(playerMountRef.current, {
          videoId: "pdDNh8P1VNs",
          playerVars: {
            autoplay: 0,
            controls: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              isPlayerReadyRef.current = true;
              if (pendingPlayRef.current) event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === 0 || event.data === 2) collapsePlayer();
            },
          },
        });
      })
      .catch(() => {
        if (!isCancelled) setLoadFailed(true);
      });

    return () => {
      isCancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      isPlayerReadyRef.current = false;
    };
  }, [collapsePlayer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (isOpen && !document.fullscreenElement) collapsePlayer();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [collapsePlayer, isOpen]);

  return (
    <>
      <button className="playButton" type="button" onClick={openPlayer} aria-label="Play Imaginal">
        <svg viewBox="0 0 32 36" aria-hidden="true">
          <path d="M29.5 15.4a3 3 0 0 1 0 5.2L5 34.7A3 3 0 0 1 .5 32.1V3.9A3 3 0 0 1 5 1.3l24.5 14.1Z" />
        </svg>
      </button>

      <div className={`videoOverlay${isOpen ? " isOpen" : ""}`} aria-hidden={!isOpen}>
        <div className="youtubePlayer" ref={playerMountRef} />
        {loadFailed && (
          <button className="videoError" type="button" onClick={collapsePlayer}>
            Video unavailable — return
          </button>
        )}
      </div>
    </>
  );
}
