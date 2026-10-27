import type { CSSProperties } from "react";
import styles from "./refinements.module.css";

const ceiling = [550, 665, 790, 905, 1035, 1140];

export function TransmissionDebris() {
  return <svg data-transmission-debris className={styles.transmissionDebris} viewBox="0 0 1587 992" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {Array.from({ length: 30 }, (_, index) => <g key={index} transform={`translate(${ceiling[index % ceiling.length] + (index % 5 - 2) * 11} ${64 + index % 4 * 8})`}>
      <g className={styles.debrisFleck} style={{ "--fall-x": `${(index % 7 - 3) * 12}px`, "--fall-y": `${160 + index % 5 * 31}px`, animationDuration: `${1000 + index % 4 * 90}ms`, animationDelay: `${index % 7 * 28}ms` } as CSSProperties}>
        {index % 3 === 0
          ? <path d={index % 2 ? "M0 0 7-3 4 6Z" : "M0 0 4-2 6 4 1 7Z"} fill="rgba(123,130,132,.65)" stroke="rgba(255,255,255,.8)" strokeWidth=".6" />
          : <circle r={1.2 + index % 3 * .6} fill="rgba(139,146,146,.6)" />}
      </g>
    </g>)}
  </svg>;
}
