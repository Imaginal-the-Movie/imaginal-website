// Browser-only sounds: each short cue releases its context after playback.
function playCue(render: (context: AudioContext, done: () => void) => void) {
  try {
    const context = new AudioContext();
    let deadline: number;
    const done = () => { window.clearTimeout(deadline); void context.close().catch(() => {}); };
    deadline = window.setTimeout(done, 1800);
    const start = () => { if (context.state !== "closed") render(context, done); };
    if (context.state === "suspended") void context.resume().then(start).catch(done);
    else start();
  } catch {
    // Sound support must never prevent the transmission from opening/advancing.
  }
}

function noise(context: AudioContext, duration: number) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  source.buffer = buffer;
  return source;
}

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

// Low-frequency tremor with irregular, damped crumble rather than a glass chime.
export function playTransmissionImpact() {
  stopTransmissionSignal();
  playCue((context, done) => {
    const start = context.currentTime;
    const tremor = noise(context, 1.16);
    const low = context.createBiquadFilter();
    const subsonic = context.createBiquadFilter();
    const tremorLevel = context.createGain();
    low.type = "lowpass";
    low.frequency.value = 150;
    subsonic.type = "highpass";
    subsonic.frequency.value = 28;
    tremorLevel.gain.setValueAtTime(0, start);
    tremorLevel.gain.linearRampToValueAtTime(0.9, start + 0.025);
    tremorLevel.gain.linearRampToValueAtTime(0.65, start + 0.35);
    tremorLevel.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);
    tremor.connect(low).connect(subsonic).connect(tremorLevel).connect(context.destination);
    tremor.onended = done;
    tremor.start(start);

    [42, 56].forEach((frequency, index) => {
      const body = context.createOscillator();
      const level = context.createGain();
      body.frequency.value = frequency;
      level.gain.setValueAtTime(0, start);
      level.gain.linearRampToValueAtTime(index ? 0.035 : 0.08, start + 0.025);
      level.gain.exponentialRampToValueAtTime(0.0001, start + 1.05);
      body.connect(level).connect(context.destination);
      body.start(start);
      body.stop(start + 1.1);
    });

    const crumble = noise(context, 0.92);
    const muffler = context.createBiquadFilter();
    const crumbleLevel = context.createGain();
    muffler.type = "lowpass";
    muffler.frequency.value = 700;
    crumbleLevel.gain.setValueAtTime(0, start);
    crumbleLevel.gain.linearRampToValueAtTime(0.23, start + 0.02);
    crumbleLevel.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
    crumble.connect(muffler).connect(crumbleLevel).connect(context.destination);
    crumble.start(start);
    [0.04, 0.09, 0.17, 0.26, 0.31, 0.43, 0.54, 0.68, 0.79].forEach((offset, index) => {
      const fragment = noise(context, 0.1);
      const grit = context.createBiquadFilter();
      const level = context.createGain();
      const at = start + offset;
      grit.type = "lowpass";
      grit.frequency.value = 950 + index % 3 * 230;
      level.gain.setValueAtTime(0, at);
      level.gain.linearRampToValueAtTime(0.13 - index * 0.01, at + 0.005);
      level.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
      fragment.connect(grit).connect(level).connect(context.destination);
      fragment.start(at);
    });
  });
}
