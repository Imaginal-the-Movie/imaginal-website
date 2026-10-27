"use client";

import { RoomIcon } from "./room-icon";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ASSETS, transmission } from "./content";
import { TabletopCharacters, type Character } from "./character-projections";
import { CharacterFolio } from "./character-folio";
import { CollaborationDialog } from "./organization-details";
import { Transmission } from "./transmission";
import { TransmissionFracture } from "./transmission-fracture";
import { playTransmissionSignal } from "./transmission-signal";
import { Trailer } from "./trailer";
import { LayoutDiagnostics } from "./layout-diagnostics";
import { ProjectBrief, type ProjectEntry } from "./project-brief";
import { StorySequence } from "./story-sequence";
import styles from "./strategy-room.module.css";
import refined from "./refinements.module.css";
import mobile from "./mobile.module.css";

type View = "room" | "transmission" | "trailer" | "story" | "project" | "brochure";
const BROCHURE_URL = "https://www.canva.com/design/DAHYwlO9W-4/bSywiULjErv4OyEgyGJ5kg/view";

function Arrow() {
  return <RoomIcon name="arrow-up-right" />;
}

export function StrategyRoom() {
  const [view, setView] = useState<View>("room");
  const [mapOpen, setMapOpen] = useState(false);
  const [pinnedCharacter, setPinnedCharacter] = useState<Character | null>(null);
  const [hoveredCharacter, setHoveredCharacter] = useState<Character | null>(null);
  const [beat, setBeat] = useState(0);
  const [trailerInvited, setTrailerInvited] = useState(false);
  const [projectEntry, setProjectEntry] = useState<ProjectEntry>({ section: "top", revision: 0 });
  const [brochureHovered, setBrochureHovered] = useState(false);
  const [storyEntry, setStoryEntry] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const room = useRef<HTMLElement>(null);
  const roomHeader = useRef<HTMLElement>(null);
  const roomFooter = useRef<HTMLElement>(null);
  const collaborationDialog = useRef<HTMLDialogElement>(null);
  const foreground = useRef<HTMLDivElement>(null);
  const panelTitle = useRef<HTMLHeadingElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const theaterPlay = useRef<HTMLButtonElement>(null);
  const trailerTime = useRef(0);
  const rememberTrailerTime = useCallback((time: number) => { trailerTime.current = time; }, []);
  const openView = useCallback((next: View) => {
    setMenuOpen(false);
    setTrailerInvited(false);
    if (next === "story") setStoryEntry(entry => entry + 1);
    if (next === "project") setProjectEntry(entry => ({ section: "top", revision: entry.revision + 1 }));
    if (next !== "room") lastTrigger.current = document.activeElement as HTMLElement;
    setPinnedCharacter(null);
    setHoveredCharacter(null);
    setView(next);
  }, []);

  const closeView = useCallback(() => {
    setMenuOpen(false);
    setTrailerInvited(false);
    setMapOpen(false);
    setPinnedCharacter(null);
    setHoveredCharacter(null);
    setView("room");
    requestAnimationFrame(() => {
      const target = lastTrigger.current;
      if (target?.getClientRects().length) target.focus({ preventScroll: true });
      else menuButton.current?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    foreground.current?.scrollTo({ top: 0 });
    if (view !== "room") panelTitle.current?.focus({ preventScroll: true });
  }, [view]);


  useEffect(() => {
    const header = roomHeader.current;
    const footer = roomFooter.current;
    if (!header || !footer) return;
    // Anchor reading panels between the actual navigation and footer credits.
    const measureEdges = () => {
      room.current?.style.setProperty("--room-header-height", `${header.getBoundingClientRect().height}px`);
      room.current?.style.setProperty("--room-footer-inset", `${window.innerHeight - footer.getBoundingClientRect().top}px`);
    };
    measureEdges();
    const observer = new ResizeObserver(measureEdges);
    observer.observe(header);
    observer.observe(footer);
    window.addEventListener("resize", measureEdges);
    window.visualViewport?.addEventListener("resize", measureEdges);
    return () => { observer.disconnect(); window.removeEventListener("resize", measureEdges); window.visualViewport?.removeEventListener("resize", measureEdges); };
  }, []);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menuOpen) { setMenuOpen(false); menuButton.current?.focus(); return; }
      closeView();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [closeView, menuOpen]);

  useEffect(() => { if (menuOpen) menu.current?.querySelector<HTMLButtonElement>("button")?.focus(); }, [menuOpen]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px), (max-width: 1024px) and (pointer: coarse)");
    const reset = () => { if (!media.matches) setMenuOpen(false); };
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, []);

  const openTransmission = () => { playTransmissionSignal(); setBeat(0); openView("transmission"); };
  const contact = () => { openView("project"); setProjectEntry(entry => ({ section: "contact", revision: entry.revision + 1 })); };
  const activeCharacter = hoveredCharacter ?? pinnedCharacter;
  const isStory = view === "story";
  const objectsActive = view === "room" && !mapOpen;

  const dismissOutsideObject = (event: MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof Element) || event.defaultPrevented) return;
    if (menuOpen && !event.target.closest("[data-room-header]")) { setMenuOpen(false); return; }
    // Let the open object and navigation handle their own interactions.
    if (event.target.closest("[data-room-object], button, a, input, select, textarea, summary")) return;
    if (view === "room") {
      setTrailerInvited(false);
      setMapOpen(false);
      setPinnedCharacter(null);
      setHoveredCharacter(null);
    } else {
      closeView();
    }
  };

  return (
    <main ref={room} onClick={dismissOutsideObject} className={`${styles.experience} ${refined.revised} ${mobile.compact}`} data-view={view} data-nav-open={menuOpen} data-map-open={mapOpen} data-trailer-invited={trailerInvited} data-focus={view === "transmission" ? transmission[beat].focus : undefined}>
      <a href="#room-content" className={styles.skipLink}>Skip to content</a>
      <div className={styles.environment} data-room-environment aria-hidden="true">
        <div className={styles.scene} data-room-scene="true">
          <Image src={`${ASSETS}/room-neutral-v4.png`} alt="" fill sizes="100vw" unoptimized preload className={styles.roomImage} />
          <div className={styles.daylight} />
          {view === "transmission" && <TransmissionFracture />}
          <div className={styles.atoms}>
            {Array.from({ length: 22 }, (_, i) => <i key={i} style={{ left: `${(i * 41 + 9) % 100}%`, top: `${(i * 23 + 13) % 100}%`, animationDelay: `${-i * 0.7}s` }} />)}
          </div>
        </div>
      </div>

      <div className={`${styles.scene} ${refined.objectStage}`} data-room-objects data-map-open={mapOpen} inert={!objectsActive} aria-hidden={!objectsActive ? true : undefined}>
        <button ref={theaterPlay} className={`${styles.hotspot} ${styles.screenHotspot} ${refined.theaterScreen}`} aria-label="Watch the trailer" data-invited={trailerInvited} onClick={() => openView("trailer")}>
          <span className={styles.screenTitle} data-screen-title>IMAGINAL</span>
          <span className={styles.playCircle} data-screen-play aria-hidden="true"><RoomIcon name="play" /></span>
          <span className={refined.objectCaption} data-screen-caption>{trailerInvited ? "PLAY TRAILER" : "WATCH THE TRAILER"}</span>
        </button>
        {trailerInvited && <button type="button" className={refined.handoffBack} data-trailer-return data-room-object onClick={closeView}><RoomIcon name="arrow-left" /> Back to room</button>}
        <CharacterFolio open={mapOpen} inactive={trailerInvited} onOpen={() => { setTrailerInvited(false); setMapOpen(true); setPinnedCharacter("skye"); setHoveredCharacter(null); }} />
        <button data-story-object className={refined.storySphere} disabled={trailerInvited} aria-label="Explore the story" onClick={() => openView("story")}>
          <Image src={`${ASSETS}/objects/story-sphere-v1.png`} alt="" fill sizes="13vw" unoptimized className={refined.objectImage} />
          <span className={`${refined.objectCaption} ${refined.sphereCaption}`}>THE STORY<RoomIcon name="arrow-up-right" className={refined.objectCaptionArrow} /></span>
        </button>
        <button data-project-object className={refined.projectSlab} disabled={trailerInvited} aria-label="Explore the project" onClick={() => openView("project")}>
          <Image src={`${ASSETS}/objects/project-slab-v1.png`} alt="" fill sizes="47vw" unoptimized className={refined.objectImage} />
          <span className={`${refined.objectCaption} ${refined.projectCaption}`}>THE PROJECT<RoomIcon name="arrow-up-right" className={refined.objectCaptionArrow} /></span>
        </button>
        <button className={refined.brochureObject} data-brochure-object data-brochure-hovered={brochureHovered && objectsActive && !trailerInvited} disabled={trailerInvited} aria-label="Preview the brochure" onPointerEnter={() => setBrochureHovered(true)} onPointerLeave={() => setBrochureHovered(false)} onFocus={() => setBrochureHovered(true)} onBlur={() => setBrochureHovered(false)} onClick={() => openView("brochure")}>
          <span className={refined.brochurePaper}>
            <span className={refined.brochureInner}><svg viewBox="0 0 254 393" aria-hidden="true"><image href={`${ASSETS}/brochure-cover-thumbnail.png`} x="-254" width="508" height="393" /></svg></span>
            <span className={refined.brochureCover} data-brochure-cover><svg viewBox="0 0 254 393" aria-hidden="true"><image href={`${ASSETS}/brochure-cover-thumbnail.png`} width="508" height="393" /></svg></span>
          </span>
        </button>
        <button className={refined.brochureLabel} data-brochure-label disabled={trailerInvited} aria-label="Open detailed brochure" onPointerEnter={() => setBrochureHovered(true)} onPointerLeave={() => setBrochureHovered(false)} onFocus={() => setBrochureHovered(true)} onBlur={() => setBrochureHovered(false)} onClick={() => openView("brochure")}>
          <span className={`${refined.objectCaption} ${refined.brochureLabelTitle}`}>DIVE DEEPER<RoomIcon name="arrow-up-right" className={refined.objectCaptionArrow} /></span>
          <span className={refined.brochureLabelNote}>(Optional)</span>
        </button>
        <button data-transmission-object className={refined.butterflyObject} disabled={trailerInvited} onClick={openTransmission} aria-label="Open Skye’s transmission">
          <Image src={`${ASSETS}/objects/transmission-butterfly-v2.png`} alt="" fill sizes="20vw" unoptimized className={refined.objectImage} />
          <span className={refined.butterflyCaption}><span className={styles.signal} aria-hidden="true">{Array.from({ length: 17 }, (_, i) => <i key={i} style={{ height: `${3 + (8 - Math.abs(8 - i)) * 1.8}px` }} />)}</span><span className={refined.objectCaption}>INCOMING TRANSMISSION / SKYE<RoomIcon name="arrow-up-right" className={refined.objectCaptionArrow} /></span></span>
        </button>
      </div>

      {menuOpen && <button type="button" data-room-menu-backdrop className={mobile.menuBackdrop} aria-label="Dismiss navigation" tabIndex={-1} onClick={() => setMenuOpen(false)} />}
      <header ref={roomHeader} data-room-header className={styles.header} inert={view === "trailer" || view === "brochure"}>
        <button data-room-brand className={`${styles.brand} ${refined.brandMark}`} onClick={closeView} aria-label="Imaginal, back to the strategy room"><span data-room-logo className={refined.brandLogo}><Image src={`${ASSETS}/imaginal-logo-transparent-v1.png`} alt="Imaginal" width={2170} height={725} unoptimized preload /></span><span>2060 / THE STRATEGY ROOM</span></button>
        <button ref={menuButton} type="button" data-room-menu className={mobile.menuButton} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="room-navigation" onKeyDown={event => {
          if (!menuOpen || event.key !== "Tab") return;
          const items = menu.current?.querySelectorAll<HTMLButtonElement>("button");
          if (!items?.length) return;
          event.preventDefault();
          (event.shiftKey ? items[items.length - 1] : items[0]).focus();
        }} onClick={() => setMenuOpen(open => !open)}><span>{menuOpen ? "Close" : "Menu"}</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d={menuOpen ? "m4 4 12 12M16 4 4 16" : "M3 6h14M3 14h14"} /></svg></button>
        <nav ref={menu} id="room-navigation" data-room-nav className={styles.navigation} aria-label="Explore Imaginal" onKeyDown={event => {
          if (!menuOpen || event.key !== "Tab") return;
          const items = menu.current?.querySelectorAll<HTMLButtonElement>("button");
          if (!items?.length) return;
          if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); menuButton.current?.focus(); }
          else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); menuButton.current?.focus(); }
        }}>
          <button aria-current={view === "trailer" ? "page" : undefined} onClick={() => openView("trailer")}>Trailer</button>
          <button aria-current={isStory ? "page" : undefined} onClick={() => openView("story")}>Story</button>
          <button onClick={() => { openView("room"); setMapOpen(true); setPinnedCharacter("skye"); }}>Characters</button>
          <button aria-current={view === "project" ? "page" : undefined} onClick={() => openView("project")}>Project</button>
          <button onClick={contact}>Contact <Arrow /></button>
        </nav>
      </header>

      <div ref={foreground} id="room-content" data-room-content className={styles.content}>
        {view === "room" && <section className={styles.roomHome} data-room-home aria-label="The strategy room">
          <div className={refined.roomForeground}>
          {mapOpen && <TabletopCharacters active={activeCharacter} selected={pinnedCharacter} onPreview={setHoveredCharacter} onSelect={setPinnedCharacter} onClose={closeView} />}
          </div>
        </section>}

        {view === "transmission" && <Transmission beat={beat} onBeat={setBeat} onComplete={() => { closeView(); setTrailerInvited(true); requestAnimationFrame(() => theaterPlay.current?.focus({ preventScroll: true })); }} onDismiss={closeView} />}

        {view === "trailer" && <Trailer onClose={closeView} initialTime={trailerTime.current} onRememberTime={rememberTrailerTime} />}

        {view === "brochure" && <section data-room-object data-brochure-preview role="dialog" aria-modal="true" aria-labelledby="brochure-title" aria-describedby="brochure-note" className={refined.brochurePreview}>
          <div className={refined.brochurePreviewHeader}>
            <div><h1 ref={panelTitle} tabIndex={-1} id="brochure-title">DETAILED BROCHURE</h1><p id="brochure-note">Dive deeper into the Imaginal story, world, and filmmaking.</p></div>
            <div className={refined.brochureHeaderActions}><a href={BROCHURE_URL} target="_blank" rel="noreferrer">View in Canva <Arrow /></a><button type="button" aria-label="Close brochure preview" onClick={closeView}><span>Close</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 3 10 10 M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg></button></div>
          </div>
          <iframe title="Imaginal brochure — Canva preview" src={`${BROCHURE_URL}?embed`} allowFullScreen />
        </section>}

        {isStory && <StorySequence key={storyEntry} titleRef={panelTitle} onClose={closeView} onCharacters={() => { openView("room"); setMapOpen(true); setPinnedCharacter("skye"); }} />}

        {view === "project" && <ProjectBrief titleRef={panelTitle} onClose={closeView} entry={projectEntry} />}
      </div>

      <CollaborationDialog dialog={collaborationDialog} />
      <footer ref={roomFooter} data-room-credits className={`${styles.footer} ${refined.roomCredits}`}><button type="button" aria-label="About the Vyby and PTI collaboration" aria-haspopup="dialog" onClick={() => collaborationDialog.current?.showModal()}>VYBY × POSITIVE TECHNOLOGY INSTITUTE</button></footer>
      {process.env.NODE_ENV === "development" && <LayoutDiagnostics />}
    </main>
  );
}
