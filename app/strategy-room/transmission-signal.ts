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

// A low electrical hum builds into a short connection zap, on opening only.
export function playTransmissionSignal() {
  playCue((context, done) => {
    const start = context.currentTime;
    [65, 130].forEach((frequency, index) => {
      const hum = context.createOscillator();
      const level = context.createGain();
      hum.type = index === 0 ? "sine" : "triangle";
      hum.frequency.value = frequency;
      level.gain.setValueAtTime(0, start);
      level.gain.linearRampToValueAtTime(index === 0 ? 0.065 : 0.018, start + 0.08);
      level.gain.linearRampToValueAtTime(index === 0 ? 0.08 : 0.025, start + 0.4);
      level.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
      hum.connect(level).connect(context.destination);
      hum.start(start);
      hum.stop(start + 0.84);
      if (index === 0) hum.onended = done;
    });
    const at = start + 0.44;
    const zap = context.createOscillator();
    const zapLevel = context.createGain();
    zap.type = "triangle";
    zap.frequency.setValueAtTime(1200, at);
    zap.frequency.exponentialRampToValueAtTime(2400, at + 0.03);
    zap.frequency.exponentialRampToValueAtTime(700, at + 0.16);
    zapLevel.gain.setValueAtTime(0, at);
    zapLevel.gain.linearRampToValueAtTime(0.03, at + 0.008);
    zapLevel.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    zap.connect(zapLevel).connect(context.destination);
    zap.start(at);
    zap.stop(at + 0.17);
    const spark = noise(context, 0.16);
    const resonance = context.createBiquadFilter();
    const sparkLevel = context.createGain();
    resonance.type = "bandpass";
    resonance.Q.value = 1.4;
    resonance.frequency.setValueAtTime(3200, at);
    resonance.frequency.exponentialRampToValueAtTime(900, at + 0.15);
    sparkLevel.gain.setValueAtTime(0, at);
    sparkLevel.gain.linearRampToValueAtTime(0.09, at + 0.008);
    sparkLevel.gain.exponentialRampToValueAtTime(0.0001, at + 0.15);
    spark.connect(resonance).connect(sparkLevel).connect(context.destination);
    spark.start(at);
  });
}

// Low-frequency tremor with irregular, damped crumble rather than a glass chime.
export function playTransmissionImpact() {
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
