import storyCopy from "./copy/story.json";

export const ASSETS = "/strategy-room";
export const PITCH_URL = "https://www.canva.com/design/DAHY4hps7FU/j3nVZ9XtiZdN92NqHu_fAw/view";
export const logline = storyCopy.overview.logline;

export const transmission = [
  { focus: "contact", label: "Contact", text: "I’m Skye Chambers. I’m glad you made it." },
  { focus: "city", label: "2060", text: "I helped build a world where energy is abundant. But even now, someone is trying to control it." },
  { focus: "people", label: "Eve & Robot", text: "I’ve asked my daughter Eve and her AI partner to finish my work. But there’s more at stake than they realize." },
  { focus: "screen", label: "The vision", text: "I have to go. But before I do, there’s something I’d like you to see." },
] as const;

export const characters = {
  eve: {
    name: "Eve",
    fullName: "Eve Chambers",
    caption: "A young scientist takes up her mother’s unfinished research. To find her own way forward, she must learn to trust what she can bring.",
    label: "The unfinished work",
    description: "A young scientist carrying work her mother could not finish, Eve must discover what she can contribute on her own terms.",
    arc: "From living in her mother’s shadow to trusting her own creative judgment.",
    image: `${ASSETS}/eve-source-film.jpg`,
  },
  robot: {
    name: "Robot",
    caption: "Eve’s AI partner can find answers she cannot. Together, they must discover what neither could create alone.",
    label: "A different perspective",
    description: "Eve’s AI partner brings different abilities and a different perspective. Their discoveries depend on learning to trust what each can bring.",
    arc: "From supplying answers to becoming a partner in discovering something neither could find alone.",
    image: `${ASSETS}/robot-source-film.jpg`,
  },
  skye: {
    name: "Skye",
    fullName: "Skye Chambers",
    caption: "The scientist who helped make energy abundant now fights to keep its future open. Her hardest task is trusting her daughter to carry the work forward.",
    label: "The pioneer",
    description: "Eve’s mother helped give the world abundant energy. Now she is fighting to keep its future open.",
    arc: "From trying to protect everything she built to trusting what her daughter might create.",
    image: `${ASSETS}/lab-source-film.jpg`,
  },
  boyfriend: {
    name: "The boyfriend",
    caption: "Eve’s boyfriend is caught between her and his father, the CEO. As their loyalties pull apart, he must decide what he stands for.",
    image: `${ASSETS}/boyfriend-source-film.jpg`,
  },
  ceo: {
    name: "The CEO",
    caption: "Skye’s longtime colleague believes humanity needs someone in control. His pursuit of order threatens the freedom they once built together.",
    label: "The opposing vision",
    description: "Skye’s longtime colleague believes humanity’s future needs a center—and that he should control it.",
    arc: "His pursuit of order becomes a struggle to own the future he once helped build.",
    image: `${ASSETS}/lab-source-film.jpg`,
  },
};

export const journey = storyCopy.acts;
