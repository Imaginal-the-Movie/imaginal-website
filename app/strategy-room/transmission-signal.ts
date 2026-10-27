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

// Radio static resolves into a short electronic connection tone, on opening only.
export function playTransmissionSignal() {
  playCue((context, done) => {
    const start = context.currentTime;
    const staticSound = noise(context, 0.42);
    const radio = context.createBiquadFilter();
    const staticLevel = context.createGain();
    radio.type = "bandpass";
    radio.Q.value = 0.8;
    radio.frequency.setValueAtTime(1600, start);
    radio.frequency.exponentialRampToValueAtTime(750, start + 0.4);
    staticLevel.gain.setValueAtTime(0, start);
    staticLevel.gain.linearRampToValueAtTime(0.15, start + 0.025);
    staticLevel.gain.linearRampToValueAtTime(0.035, start + 0.12);
    staticLevel.gain.linearRampToValueAtTime(0.12, start + 0.18);
    staticLevel.gain.exponentialRampToValueAtTime(0.0001, start + 0.41);
    staticSound.connect(radio).connect(staticLevel).connect(context.destination);
    staticSound.start(start);
    [640, 880].forEach((frequency, index) => {
      const tone = context.createOscillator();
      const envelope = context.createGain();
      const at = start + 0.27 + index * 0.14;
      tone.type = "sine";
      tone.frequency.setValueAtTime(frequency, at);
      envelope.gain.setValueAtTime(0, at);
      envelope.gain.linearRampToValueAtTime(0.055, at + 0.025);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.38);
      tone.connect(envelope).connect(context.destination);
      tone.start(at);
      tone.stop(at + 0.42);
      if (index === 1) tone.onended = done;
    });
  });
}

export function playTransmissionImpact() {
  playCue((context, done) => {
    const start = context.currentTime;
    const body = context.createOscillator();
    const bodyLevel = context.createGain();
    body.frequency.setValueAtTime(110, start);
    body.frequency.exponentialRampToValueAtTime(44, start + 0.45);
    bodyLevel.gain.setValueAtTime(0, start);
    bodyLevel.gain.linearRampToValueAtTime(0.17, start + 0.012);
    bodyLevel.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);
    body.connect(bodyLevel).connect(context.destination);
    body.start(start);
    body.stop(start + 0.66);
    body.onended = done;

    const rubble = noise(context, 0.56);
    const muffler = context.createBiquadFilter();
    const rubbleLevel = context.createGain();
    muffler.type = "lowpass";
    muffler.frequency.value = 420;
    rubbleLevel.gain.setValueAtTime(0, start);
    rubbleLevel.gain.linearRampToValueAtTime(0.24, start + 0.01);
    rubbleLevel.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
    rubble.connect(muffler).connect(rubbleLevel).connect(context.destination);
    rubble.start(start);

    [0.08, 0.2, 0.33].forEach(offset => {
      const fragment = noise(context, 0.12);
      const glass = context.createBiquadFilter();
      const level = context.createGain();
      const at = start + offset;
      glass.type = "bandpass";
      glass.frequency.value = 2200;
      glass.Q.value = 2;
      level.gain.setValueAtTime(0, at);
      level.gain.linearRampToValueAtTime(0.025, at + 0.008);
      level.gain.exponentialRampToValueAtTime(0.0001, at + 0.11);
      fragment.connect(glass).connect(level).connect(context.destination);
      fragment.start(at);
    });
  });
}
