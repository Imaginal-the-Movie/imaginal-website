import styles from "./room-icon.module.css";

type IconName = "arrow-up-right" | "arrow-left" | "arrow-right" | "play" | "pause";

export function RoomIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg className={`${styles.icon} ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {name === "play" ? <path d="M8 5.5 19 12 8 18.5Z" fill="currentColor" />
      : name === "pause" ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" />
      : <path d={name === "arrow-up-right" ? "M5 19 19 5M6 5h13v13" : name === "arrow-left" ? "M20 12H4m7-7-7 7 7 7" : "M4 12h16m-7-7 7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>;
}
