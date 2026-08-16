"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PartnerId = "vyby" | "pti";

type Partner = {
  id: PartnerId;
  name: string;
  imageSrc: string;
  width: number;
  height: number;
  message: string;
  buttonLabel: string;
  href: string;
};

const partners: Partner[] = [
  {
    id: "vyby",
    name: "Vyby",
    imageSrc: "/vyby-logo-v2.png",
    width: 1299,
    height: 1211,
    message:
      "Visit the site. Join the waitlist for the AI Video Creator Development League.",
    buttonLabel: "Join the waitlist",
    href: "https://vyby.com",
  },
  {
    id: "pti",
    name: "Positive Technology Institute",
    imageSrc: "/pti-logo.png",
    width: 454,
    height: 423,
    message: "Visit the site. Sign the pledge advancing positive technology.",
    buttonLabel: "Sign the pledge",
    href: "https://www.positivetechinstitute.org/pledge",
  },
];

export function PartnerLinks() {
  const [activePartner, setActivePartner] = useState<PartnerId | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelScheduledClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (
        activePartner &&
        regionRef.current &&
        !regionRef.current.contains(event.target as Node)
      ) {
        setActivePartner(null);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePartner(null);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
      cancelScheduledClose();
    };
  }, [activePartner]);

  return (
    <div ref={regionRef} className="partnerLinks">
      {partners.map((partner) => {
        const isOpen = activePartner === partner.id;

        return (
          <div
            key={partner.id}
            className={`partnerLogoSpot partnerLogoSpot${partner.id === "vyby" ? "Vyby" : "Pti"}`}
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                cancelScheduledClose();
                setActivePartner(partner.id);
              }
            }}
            onMouseLeave={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                cancelScheduledClose();
                closeTimerRef.current = setTimeout(() => {
                  setActivePartner(null);
                  closeTimerRef.current = null;
                }, 320);
              }
            }}
          >
            <button
              className="partnerLogoTrigger"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${partner.id}-partner-panel`}
              aria-label={`Learn more about ${partner.name}`}
              onClick={() => {
                const canHover = window.matchMedia(
                  "(hover: hover) and (pointer: fine)",
                ).matches;
                setActivePartner((current) =>
                  !canHover && current === partner.id ? null : partner.id,
                );
              }}
              onFocus={() => setActivePartner(partner.id)}
            >
              <Image
                className="partnerLogoImage"
                src={partner.imageSrc}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                sizes="(max-aspect-ratio: 4/5) 42vw, 34vw"
              />
            </button>

            <div
              id={`${partner.id}-partner-panel`}
              className={`partnerPanel${isOpen ? " isOpen" : ""}`}
              aria-hidden={!isOpen}
            >
              <p>{partner.message}</p>
              <a
                className="glassPill"
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isOpen ? 0 : -1}
              >
                {partner.buttonLabel}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
