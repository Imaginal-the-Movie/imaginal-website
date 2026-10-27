import { useId, type CSSProperties } from "react";
import styles from "./refinements.module.css";

const fractures = "M1010 250 968 229 930 189 885 168 M968 229 922 240 876 223 824 228 M922 240 880 278 836 294 800 330 M1010 250 1014 220 1042 185 1030 156 M1010 250 1056 267 1099 278 1133 314 1175 343 M1056 267 1046 312 1062 348 1045 386 M1010 250 981 278 973 326 937 360 920 416 M973 326 1001 345 1002 397 M930 189 943 166 M880 278 885 306 M1099 278 1118 254 M937 360 902 368";

export function TransmissionFracture() {
  const clip = `fracture-${useId().replace(/:/g, "")}`;
  return <svg data-transmission-fracture className={styles.transmissionFracture} viewBox="0 0 1587 992" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><clipPath id={clip}><path d="M468 134 Q870 159 1280 115 L1280 450 Q870 420 468 443Z" /></clipPath></defs>
    <g clipPath={`url(#${clip})`} className={styles.fractureCracks}>
      <path d={fractures} pathLength="1" stroke="rgba(63,89,104,.65)" strokeWidth="1.6" fill="none" />
      <path d={fractures} pathLength="1" stroke="rgba(255,255,255,.95)" strokeWidth="1" fill="none" transform="translate(-1 -1)" />
    </g>
    {Array.from({ length: 14 }, (_, index) => <g key={index} transform={`translate(${935 + index * 16} ${338 + index % 4 * 17})`}>
      <path className={styles.fractureFleck} d={index % 2 ? "M0 0 7-3 4 6Z" : "M0 0 4-2 6 4 1 7Z"} fill={index % 3 ? "rgba(103,123,135,.6)" : "rgba(255,255,255,.95)"} style={{ "--fall-x": `${(index % 5 - 2) * 13}px`, "--fall-y": `${110 + index % 4 * 27}px`, animationDelay: `${index * 17}ms` } as CSSProperties} />
    </g>)}
  </svg>;
}
