import storyCopy from "./copy/story.json";

export const ASSETS = "/strategy-room";
export const PITCH_URL = "https://www.canva.com/design/DAHY4hps7FU/j3nVZ9XtiZdN92NqHu_fAw/view";
export const logline = storyCopy.overview.logline;

export const transmission = [
  { focus: "contact", label: "Contact", text: "I’m Skye Chambers. I’m glad you made it." },
  { focus: "city", label: "2060", text: "I helped build a world where energy is abundant. But even now, someone is trying to control it." },
  { focus: "people", label: "Eve & Robot", text: "I’ve asked my daughter Eve and her robot partner to finish my work. But there’s more at stake than they realize." },
  { focus: "screen", label: "The vision", text: "I have to go. But before I do, there’s something I’d like you to see." },
] as const;

export const characters = {
  eve: {
    name: "Eve",
    fullName: "Eve Chambers",
    caption: "A gifted young scientist, Eve wants to make a name for herself while navigating an unstable invention, accusations of favoritism, and a tournament rival she can’t stand. An unlikely partnership with Robot and a devastating tournament loss to Phoenix help her solve a problem even her famous mother, Skye, couldn’t solve.",
    label: "The unfinished work",
    description: "A young scientist carrying work her mother could not finish, Eve must discover what she can contribute on her own terms.",
    arc: "From living in her mother’s shadow to trusting her own creative judgment.",
    image: `${ASSETS}/eve-source-film.jpg`,
  },
  robot: {
    name: "Robot",
    caption: "An SI humanoid Skye gives to Eve, Robot unsettles her at first with how human he looks. Their bond deepens as they come to appreciate their differences and learn to rely on each other.",
    label: "A different perspective",
    description: "Eve’s robot partner brings different abilities and a different perspective. Their discoveries depend on learning to trust what each can bring.",
    arc: "From supplying answers to becoming a partner in discovering something neither could find alone.",
    image: `${ASSETS}/robot-source-film.jpg`,
  },
  skye: {
    name: "Skye",
    fullName: "Skye Chambers",
    caption: "Eve’s mother and renowned scientist behind the coveted Post Select Energy Generator, Skye helped make energy abundant. Now she must fight to keep her boss, Richard, from centralizing their work, while trusting her daughter to carry it forward.",
    label: "The pioneer",
    description: "Eve’s mother helped give the world abundant energy. Now she is fighting to keep its future open.",
    arc: "From trying to protect everything she built to trusting what her daughter might create.",
    image: `${ASSETS}/lab-source-film.jpg`,
  },
  boyfriend: {
    name: "Lucas",
    caption: "Eve’s boyfriend and Richard’s ambitious son, Lucas is torn between the two people he loves. He dismisses Robot at first, then risks his life to save him. When someone he respects kills his father, Lucas hides his grief from Eve, setting him on the path to becoming the sequel’s villain.",
    image: `${ASSETS}/boyfriend-source-film.jpg`,
  },
  ceo: {
    name: "Richard",
    caption: "Skye’s boss, Lucas’s father, and the film’s antagonist, Richard believes civilization is safest under his control. His plans to centralize power and his exploitation of a captive creature turn his promise of protection into a threat to humanity’s survival.",
    label: "The opposing vision",
    description: "Skye’s longtime colleague believes humanity’s future needs a center—and that he should control it.",
    arc: "His pursuit of order becomes a struggle to own the future he once helped build.",
    image: `${ASSETS}/lab-source-film.jpg`,
  },
  phoenix: {
    name: "Phoenix",
    caption: "A brilliant inventor, celebrated socialite, and reigning tournament champion, Phoenix defends her title and her place in the spotlight when Eve challenges her. After defeating Eve in the tournament, Phoenix joins Eve’s global effort to fight a threat far greater than their rivalry.",
    image: `${ASSETS}/busts-v2/phoenix.webp`,
  },
  jason: {
    name: "Jason",
    caption: "Skye’s husband and Eve’s father answers her distress call and infiltrates Richard’s laboratory. Even as he discovers the truth about Skye and Richard’s past, he must work with her to keep humanity alive.",
    image: `${ASSETS}/busts-v2/jason.webp`,
  },
};

export const journey = storyCopy.acts;
