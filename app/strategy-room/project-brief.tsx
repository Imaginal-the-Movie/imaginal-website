"use client";

import { Fragment, type Ref } from "react";
import { RoomIcon } from "./room-icon";
import { ChapterSequence, type Chapter } from "./chapter-sequence";
import { OrganizationDetails } from "./organization-details";
import copy from "./copy/project.json";
import refined from "./refinements.module.css";

export type ProjectEntry = { section: "top" | "contact"; revision: number };

export function ProjectBrief({ onClose, titleRef, entry }: { onClose: () => void; titleRef: Ref<HTMLHeadingElement>; entry: ProjectEntry }) {
  const chapters: Chapter[] = [
    { label: copy.whyNow.tab, content: <article className={refined.planCard} data-project-beat="why-now">
      <span className={refined.actCardNumber}>01 / 05</span>
      <h2>{copy.whyNow.heading}</h2>
      <p className={refined.planLead}>{copy.whyNow.lead}</p>
      {copy.whyNow.paragraphs.map((paragraph, index) => <p key={index}>{paragraph.startsWith("Imaginal ") ? <><em>Imaginal</em>{paragraph.slice("Imaginal".length)}</> : paragraph}</p>)}
    </article> },
    { label: copy.audience.tab, content: <article className={refined.planCard} data-project-beat="audience">
      <span className={refined.actCardNumber}>02 / 05</span>
      <h2>{copy.audience.heading}</h2>
      <p className={refined.formatLine}>{copy.audience.genre}</p>
      <h3 className={refined.planSubhead}>{copy.audience.audienceLabel}</h3>
      <p>{copy.audience.description}</p>
      <h3 className={refined.planSubhead}>{copy.audience.referencesLabel}</h3>
      <div data-creative-references className={refined.creativeReferences}>
        {copy.audience.references.map(reference => <div key={reference.title}><h3>{reference.title}</h3><p>{reference.description}</p></div>)}
      </div>
    </article> },
    { label: copy.team.tab, content: <article className={refined.planCard} data-project-beat="team">
      <header data-team-header className={refined.teamCardHeader}><span className={refined.actCardNumber}>03 / 05</span><h2>{copy.team.heading}</h2><OrganizationDetails /></header>
      <div data-team-grid className={refined.projectTeam}>
        {copy.team.people.map(person => <section key={person.linkedin}>
          <h3><a className={refined.teamNameLink} href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-description="LinkedIn profile; opens in a new tab">{person.name}</a></h3>
          <span className={refined.teamRole}>{person.role}</span>
          <p>{person.bio}</p>
          <p className={refined.teamCredentials}>{person.credentials.map((credential, index) => <span key={index} className={index === 0 ? refined.teamAffiliation : undefined}>{credential}</span>)}</p>
        </section>)}
      </div>
      <footer className={refined.teamAdvisors}><p>{copy.team.advisorsLabel}</p><p>{copy.team.advisors}</p></footer>
    </article> },
    { label: copy.production.tab, content: <article className={refined.planCard} data-project-beat="production">
      <span className={refined.actCardNumber}>04 / 05</span>
      <h2>{copy.production.heading}</h2>
      <div data-production-grid className={refined.productionFunding}>
        <div>{copy.production.sections.map(section => <Fragment key={section.heading}><h3 className={refined.planSubhead}>{section.heading}</h3><p>{section.text}</p></Fragment>)}</div>
        <div id="project-budget" className={refined.planBudget}>
          <h3 className={refined.planSubhead}>{copy.production.budget.heading}</h3>
          {copy.production.budget.items.map(item => "breakdown" in item && item.breakdown ? <details key={item.label} className={refined.budgetDetails}>
            <summary className={refined.budgetSummary}>
              <span>{item.label}</span><strong>{item.amount}</strong>
              <span className={refined.budgetBreakdownLabel}>{copy.production.budget.breakdownLabel}<RoomIcon name="arrow-right" /></span>
            </summary>
            <dl className={refined.budgetBreakdown}>
              {item.breakdown.map(line => <div key={line.label}><dt>{line.label}</dt><dd>{line.amount}</dd></div>)}
            </dl>
          </details> : <div key={item.label}><span>{item.label}</span><strong>{item.amount}</strong></div>)}
          <div className={refined.budgetTotal}><span>{copy.production.budget.totalLabel}</span><strong>{copy.production.budget.total}</strong></div>
          <p>{copy.production.budget.note}</p>
        </div>
      </div>
    </article> },
    { label: copy.contact.tab, content: <article className={refined.planCard} data-project-beat="join" data-project-contact>
      <span className={refined.actCardNumber}>05 / 05</span>
      <h2>{copy.contact.heading}</h2>
      <p className={refined.planLead}>{copy.contact.description}</p>
      <div className={refined.planContact}><a href={`mailto:${copy.contact.email}?subject=${encodeURIComponent(copy.contact.emailSubject)}`}>Contact: {copy.contact.email} <RoomIcon name="arrow-up-right" /></a></div>
    </article> },
  ];
  return <ChapterSequence variant="project" title={copy.panelTitle} titleRef={titleRef} onClose={onClose} chapters={chapters} initialIndex={entry.section === "contact" ? chapters.length - 1 : 0} resetKey={entry.revision} />;
}
