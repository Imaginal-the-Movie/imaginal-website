// Called from a user gesture; opening the room itself remains silent.
export function playTransmissionSignal() {
  try {
    const context = new AudioContext();
    const close = () => { void context.close().catch(() => {}); };
    const play = () => {
      const start = context.currentTime;
      [640, 880].forEach((frequency, index) => {
        const tone = context.createOscillator();
        const envelope = context.createGain();
        const at = start + index * 0.11;
        tone.type = "sine";
        tone.frequency.setValueAtTime(frequency, at);
        envelope.gain.setValueAtTime(0, at);
        envelope.gain.linearRampToValueAtTime(0.025, at + 0.035);
        envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.42);
        tone.connect(envelope);
        envelope.connect(context.destination);
        tone.start(at);
        tone.stop(at + 0.45);
        if (index === 1) tone.onended = close;
      });
    };
    if (context.state === "suspended") void context.resume().then(play).catch(close);
    else play();
  } catch {
    // Audio support or permission must never prevent the transmission opening.
  }
}

export function playTransmissionImpact() {
  try {
    const context = new AudioContext();
    let deadline: number;
    const close = () => { window.clearTimeout(deadline); void context.close().catch(() => {}); };
    deadline = window.setTimeout(close, 1200);
    const play = () => {
      if (context.state === "closed") return;
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.28), context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      const sound = context.createBufferSource();
      const muffler = context.createBiquadFilter();
      const envelope = context.createGain();
      const at = context.currentTime;
      sound.buffer = buffer;
      muffler.type = "lowpass";
      muffler.frequency.value = 240;
      envelope.gain.setValueAtTime(0, at);
      envelope.gain.linearRampToValueAtTime(0.12, at + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.26);
      sound.connect(muffler).connect(envelope).connect(context.destination);
      sound.onended = close;
      sound.start();
    };
    if (context.state === "suspended") void context.resume().then(play).catch(close);
    else play();
  } catch {
    // The brief visual interruption still works if sound is unavailable.
  }
}
