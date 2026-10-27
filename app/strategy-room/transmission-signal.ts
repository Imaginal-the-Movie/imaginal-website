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
