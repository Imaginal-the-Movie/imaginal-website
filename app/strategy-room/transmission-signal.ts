const signalUrl = "/strategy-room/audio/incoming-transmission-elevenlabs-v1.mp3";
let openingSignal: HTMLAudioElement | null = null;

export function prepareTransmissionSignal() {
  try {
    if (openingSignal) return;
    openingSignal = new Audio(signalUrl);
    openingSignal.preload = "auto";
    openingSignal.volume = 0.6;
    openingSignal.load();
  } catch {
    // The room remains usable if media is unavailable.
  }
}

export function stopTransmissionSignal() {
  if (!openingSignal) return;
  openingSignal.pause();
  if (openingSignal.readyState > 0) openingSignal.currentTime = 0;
}

export function playTransmissionSignal() {
  try {
    prepareTransmissionSignal();
    if (!openingSignal) return;
    stopTransmissionSignal();
    void openingSignal.play().catch(() => {});
  } catch {
    // A blocked sound must never prevent the transmission from opening.
  }
}

const impactUrl = "/strategy-room/audio/transmission-radar.mp3";

let impact: {
  context: AudioContext;
  request: AbortController;
  audio: Promise<AudioBuffer | null>;
  clearBlur?: () => void;
} | null = null;

export function prepareTransmissionImpact() {
  if (impact) return;
  try {
    // Unlock audio during the opening gesture so the timed beat can play it later.
    const context = new AudioContext();
    const request = new AbortController();
    const audio = Promise.all([
      context.resume(),
      fetch(impactUrl, { signal: request.signal }).then(response => {
        if (!response.ok) throw new Error("Transmission audio unavailable");
        return response.arrayBuffer();
      }).then(bytes => context.decodeAudioData(bytes)),
    ]).then(([, buffer]) => buffer).catch(() => null);
    impact = { context, request, audio };
  } catch {
    // The transmission can continue without audio.
  }
}

export function stopTransmissionImpact() {
  if (!impact) return;
  const playback = impact;
  impact = null;
  playback.request.abort();
  playback.clearBlur?.();
  void playback.context.close().catch(() => {});
}

export function playTransmissionImpact(overlay: HTMLDivElement | null) {
  stopTransmissionSignal();
  const playback = impact;
  if (!playback) return;
  void playback.audio.then(buffer => {
    if (!buffer || impact !== playback) return;
    const { context } = playback;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = 0.65;
    gain.connect(context.destination);

    if (overlay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser).connect(gain);
      const samples = new Float32Array(analyser.fftSize);
      let frame = 0;
      let blur = 0;
      let previous = performance.now();
      const updateBlur = (now: number) => {
        analyser.getFloatTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
        const target = Math.min(10, Math.max(0, (rms - 0.012) * 36));
        // Follow the onset closely and smooth the radar's quieter tail.
        blur += (target - blur) * (1 - Math.exp(-(now - previous) / (target > blur ? 30 : 140)));
        overlay.style.setProperty("--impact-blur", blur >= 0.12 ? `blur(${blur.toFixed(2)}px)` : "none");
        previous = now;
        frame = requestAnimationFrame(updateBlur);
      };
      playback.clearBlur = () => {
        cancelAnimationFrame(frame);
        overlay.style.removeProperty("--impact-blur");
      };
      frame = requestAnimationFrame(updateBlur);
    } else {
      source.connect(gain);
    }

    source.onended = () => { if (impact === playback) stopTransmissionImpact(); };
    source.start();
  }).catch(() => { if (impact === playback) stopTransmissionImpact(); });
}
