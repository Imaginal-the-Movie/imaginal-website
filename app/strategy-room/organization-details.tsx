"use client";

import { RoomIcon } from "./room-icon";
import Image from "next/image";
import { useRef } from "react";
import refined from "./refinements.module.css";

function PartnerLogos() {
  return <span data-partner-logos className={refined.projectBrands}>
    <svg role="img" aria-label="Vyby" viewBox="915 273 2490 3745" className={refined.vybyBrand}><image href="/strategy-room/brands/vyby-logo-source.png" width="4384" height="4320" /></svg>
    <span aria-hidden="true">×</span>
    <Image src="/strategy-room/brands/pti-logo.png" alt="Positive Technology Institute" width={868} height={808} unoptimized className={refined.ptiBrand} />
  </span>;
}

export function OrganizationDetails() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button type="button" data-partner-trigger className={refined.organizationTrigger} aria-label="About the Vyby and PTI collaboration" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      <PartnerLogos />
    </button>
    <dialog ref={dialog} data-room-object aria-labelledby="collaboration-title" className={refined.organizationDialog} onKeyDown={event => event.stopPropagation()} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
    }}>
      <button type="button" className={refined.organizationClose} aria-label="Close collaboration details" onClick={() => dialog.current?.close()}>×</button>
      <h2 id="collaboration-title">A Vyby × PTI collaboration</h2>
      <div data-organization-grid className={refined.organizations}>
        <section><div className={refined.organizationLogo}><svg role="img" aria-label="Vyby" viewBox="915 273 2490 3745" className={refined.vybyBrand}><image href="/strategy-room/brands/vyby-logo-source.png" width="4384" height="4320" /></svg></div><h3>Vyby</h3><a className={refined.organizationLink} href="https://vyby.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Vyby (opens in a new tab)">vyby.com <RoomIcon name="arrow-up-right" /></a><p>Vyby scouts and develops rising AI video creators, cultivating the next generation of tastemakers through an AI studio, competition-based education, and a culture that honors creativity, craft, and contribution.</p><p>Vyby’s purpose is to expand human creative agency and connection as technology transforms how culture is made.</p></section>
        <section><div className={refined.organizationLogo}><Image src="/strategy-room/brands/pti-logo.png" alt="Positive Technology Institute" width={868} height={808} unoptimized className={refined.ptiBrand} /></div><h3>Positive Technology Institute</h3><a className={refined.organizationLink} href="https://www.positivetechinstitute.org/" target="_blank" rel="noopener noreferrer" aria-label="Visit PTI (opens in a new tab)">positivetechinstitute.org <RoomIcon name="arrow-up-right" /></a><p>The Positive Technology Institute (PTI) connects researchers, builders, and funders to advance technologies that support human sovereignty, well-being, and abundance for all.</p><p>Through its Positive Technology Pledge, shared insights, and community, PTI helps turn those values into coordinated action.</p></section>
      </div>
    </dialog>
  </>;
}
