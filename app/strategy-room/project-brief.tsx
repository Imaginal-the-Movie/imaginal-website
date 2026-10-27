"use client";

import { RoomIcon } from "./room-icon";
import type { Ref } from "react";
import { ChapterSequence, type Chapter } from "./chapter-sequence";
import { OrganizationDetails } from "./organization-details";
import refined from "./refinements.module.css";

export type ProjectEntry = { section: "top" | "contact"; revision: number };

export function ProjectBrief({ onClose, titleRef, entry }: { onClose: () => void; titleRef: Ref<HTMLHeadingElement>; entry: ProjectEntry }) {
  const chapters: Chapter[] = [
    { label: "Why now", content: <article className={refined.planCard} data-project-beat="why-now">
      <span className={refined.actCardNumber}>01 / 05</span>
      <h2>Why this / why now</h2>
      <p className={refined.planLead}>As AI changes how we work and create, what can each of us bring?</p>
      <p>AI is changing how we work and create—and who controls the systems shaping our lives. Our task is to harness progress to expand freedom and creative agency, even in abundance.</p>
      <p>We can remain distinct, contribute, and belong without surrendering freedom. Discovering that possibility for ourselves can loosen resistance and change beliefs—and those beliefs shape the stories we tell about the future.</p>
      <p>Imaginal gives that challenge a human shape: Eve’s insecurity, Skye’s difficulty letting go, and Robot’s difference. Through their relationships, audiences can recognize the possibility within themselves. The film’s reason to exist is to make that possibility felt.</p>
    </article> },
    { label: "Audience", content: <article className={refined.planCard} data-project-beat="audience">
      <span className={refined.actCardNumber}>02 / 05</span>
      <h2>Audience & positioning</h2>
      <p className={refined.formatLine}>Feature film · approx. 90 minutes · Science-fiction adventure thriller</p>
      <h3 className={refined.planSubhead}>Target audience</h3>
      <p>Adults ages 18–40 drawn to blockbuster adventure and provocative science fiction. They seek imaginative escapism, large-scale action and character-driven underdog stories that also explore deeper themes around power, culture and society.</p>
      <h3 className={refined.planSubhead}>Creative references</h3>
      <div data-creative-references className={refined.creativeReferences}>
        <div><h3>The Creator</h3><p>Immersive future worlds, large-scale action, human–AI relationships.</p></div>
        <div><h3>Tomorrowland</h3><p>Imaginative technology, wonder, discovery and youthful adventure.</p></div>
      </div>
    </article> },
    { label: "Team", content: <article className={refined.planCard} data-project-beat="team">
      <header data-team-header className={refined.teamCardHeader}><span className={refined.actCardNumber}>03 / 05</span><h2>The people behind Imaginal</h2><OrganizationDetails /></header>
      <div data-team-grid className={refined.projectTeam}>
        <section><h3><a className={refined.teamNameLink} href="https://www.linkedin.com/in/chasehattan/" target="_blank" rel="noopener noreferrer" aria-description="LinkedIn profile; opens in a new tab">Damien “Chase” Foster</a></h3><span className={refined.teamRole}>Director / Writer / Producer</span><p>Chase has spent his life helping creators find their creative spark—and building the tools and systems that help them hold onto it.</p><p className={refined.teamCredentials}><span className={refined.teamAffiliation}>Co-founder, Vyby</span><span>Software engineer, AI agent builder, 3D</span><span>20+ years in film and music production</span><span>Creative director to top influencers</span></p></section>
        <section><h3><a className={refined.teamNameLink} href="https://www.linkedin.com/in/glucyliu/" target="_blank" rel="noopener noreferrer" aria-description="LinkedIn profile; opens in a new tab">Lucy Liu</a></h3><span className={refined.teamRole}>Writer / Producer</span><p>Lucy builds systems and cultures around conscious participation, helping people feel fully expressed, connected and alive.</p><p className={refined.teamCredentials}><span className={refined.teamAffiliation}>Co-founder, Vyby</span><span>1st PM / Ex-VP of Product, lifestyle membership FabFitFun (Series A, unicorn)</span><span>Ex-Disney gaming &amp; J.P. Morgan IBD</span></p></section>
        <section><h3><a className={refined.teamNameLink} href="https://www.linkedin.com/in/mikaonishi/" target="_blank" rel="noopener noreferrer" aria-description="LinkedIn profile; opens in a new tab">Mika Onishi</a></h3><span className={refined.teamRole}>Writer / Producer</span><p>Mika works to put technology in service of human sovereignty and collective intelligence, enabling greater human flourishing.</p><p className={refined.teamCredentials}><span className={refined.teamAffiliation}>Co-founder and Chair of the Positive Technology Institute</span><span>General Partner, PORTAL Venture Partners</span><span>Founder, House of Remembering</span></p></section>
      </div>
      <footer className={refined.teamAdvisors}><p>Advised &amp; supported by the Positive Technology Institute Advisory Board:</p><p>Tom Kehler, Dr. Karina Alexanyan, Jason Bateman, Sanaz Abravani and Peter Loukianoff</p></footer>
    </article> },
    { label: "Production", content: <article className={refined.planCard} data-project-beat="production">
      <span className={refined.actCardNumber}>04 / 05</span>
      <h2>Production & funding</h2>
      <div data-production-grid className={refined.productionFunding}>
        <div><h3 className={refined.planSubhead}>What we have</h3><p>Completed trailer, 15-page treatment, director</p><h3 className={refined.planSubhead}>What we need</h3><p>Funding and mission-aligned backers and partners to bring the feature to life.</p><h3 className={refined.planSubhead}>Production approach</h3><p>AI-generated video with human voice performance, editing, sound design and VFX.</p></div>
        <div id="project-budget" className={refined.planBudget}>
          <h3 className={refined.planSubhead}>Preliminary budget</h3>
          <div><span>Development, production & post</span><strong>$750K</strong></div><div><span>Contingency</span><strong>$100K</strong></div><div><span>Marketing & release</span><strong>$250K</strong></div><div className={refined.budgetTotal}><span>Full-project estimate</span><strong>US $1.1M</strong></div>
          <p>90-minute feature. Working estimates, subject to detailed costing.</p>
        </div>
      </div>
    </article> },
    { label: "Contact", content: <article className={refined.planCard} data-project-beat="join" data-project-contact>
      <span className={refined.actCardNumber}>05 / 05</span>
      <h2>Help bring Imaginal to life.</h2>
      <div className={refined.planContact}><a href="mailto:lucy@vyby.com?subject=Imaginal%20%E2%80%94%20let%E2%80%99s%20talk">lucy@vyby.com <RoomIcon name="arrow-up-right" /></a></div>
      <p className={refined.planLead}>We’re looking for partners who connect with the film and want to help shape its next stage.</p>
    </article> },
  ];
  return <ChapterSequence variant="project" title="The Project" titleRef={titleRef} onClose={onClose} chapters={chapters} initialIndex={entry.section === "contact" ? chapters.length - 1 : 0} resetKey={entry.revision} />;
}
