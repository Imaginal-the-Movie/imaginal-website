"use client";

import { useEffect, useState } from "react";

const TARGET_TIME = new Date("2026-08-24T23:59:00-07:00").getTime();

const DIGITS: Record<string, string[]> = {
  "0": ["11111", "10001", "10001", "10001", "10001", "10001", "11111"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["11111", "00001", "00001", "11111", "10000", "10000", "11111"],
  "3": ["11111", "00001", "00001", "01111", "00001", "00001", "11111"],
  "4": ["10001", "10001", "10001", "11111", "00001", "00001", "00001"],
  "5": ["11111", "10000", "10000", "11111", "00001", "00001", "11111"],
  "6": ["11111", "10000", "10000", "11111", "10001", "10001", "11111"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["11111", "10001", "10001", "11111", "10001", "10001", "11111"],
  "9": ["11111", "10001", "10001", "11111", "00001", "00001", "11111"],
};

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type LedTone = "orange" | "gold";

function getRemainingTime(): RemainingTime {
  const totalSeconds = Math.max(
    0,
    Math.floor((TARGET_TIME - Date.now()) / 1000),
  );

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function LedDot({ isOn }: { isOn: boolean }) {
  return <span className={`ledDot${isOn ? " isOn" : ""}`} />;
}

function LedDigit({ digit }: { digit: string }) {
  const grid = DIGITS[digit] ?? DIGITS["0"];

  return (
    <span className="ledDigit" aria-hidden="true">
      {grid.flatMap((row, rowIndex) =>
        [...row].map((value, columnIndex) => (
          <LedDot
            key={`${rowIndex}-${columnIndex}`}
            isOn={value === "1"}
          />
        )),
      )}
    </span>
  );
}

function LedNumber({ value }: { value: number }) {
  return (
    <span className="ledNumber">
      {String(value)
        .padStart(2, "0")
        .split("")
        .map((digit, index) => (
          <LedDigit key={`${digit}-${index}`} digit={digit} />
        ))}
    </span>
  );
}

function LedColon({ tone }: { tone: LedTone }) {
  return (
    <span className={`ledColon ledTone-${tone}`} aria-hidden="true">
      <LedDot isOn />
      <LedDot isOn />
    </span>
  );
}

function LedGroup({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: LedTone;
}) {
  return (
    <span className={`ledGroup ledTone-${tone}`}>
      <LedNumber value={value} />
      <span className="ledLabel">{label}</span>
    </span>
  );
}

export function Countdown() {
  const [remaining, setRemaining] = useState<RemainingTime | null>(null);

  useEffect(() => {
    const update = () => setRemaining(getRemainingTime());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const time = remaining ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const label = `${time.days} days, ${time.hours} hours, ${time.minutes} minutes, and ${time.seconds} seconds remaining`;

  return (
    <section
      className={`countdown${remaining ? " isReady" : ""}`}
      role="timer"
      aria-label={label}
    >
      <div className="countdownDisplay">
        <LedGroup value={time.days} label="Days" tone="orange" />
        <LedColon tone="orange" />
        <LedGroup value={time.hours} label="Hours" tone="orange" />
        <LedColon tone="orange" />
        <LedGroup value={time.minutes} label="Minutes" tone="orange" />
        <LedColon tone="gold" />
        <LedGroup value={time.seconds} label="Seconds" tone="gold" />
      </div>
    </section>
  );
}
