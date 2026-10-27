export const ASSETS = "/strategy-room";
export const PITCH_URL = "https://www.canva.com/design/DAHY4hps7FU/j3nVZ9XtiZdN92NqHu_fAw/view";
export const logline = "In 2060, a gifted young scientist inherits her mother’s mission to keep humanity free. But when a hidden threat emerges, she and an unlikely Robot partner must confront something far greater than a struggle for control.";

export const transmission = [
  { focus: "contact", label: "Contact", text: "You made it. My name is Skye Chambers." },
  { focus: "city", label: "2060", text: "Out there is the world we built. Energy is abundant." },
  { focus: "horizon", label: "The possibility", text: "What would you create if survival no longer took everything you had?" },
  { focus: "tension", label: "The unfinished work", text: "But that freedom still depends on a handful of machines. And someone wants to control them." },
  { focus: "present", label: "Your time", text: "It reminds me of your time, really. AI opened a new creative horizon—and a familiar struggle over who gets to shape it." },
  { focus: "people", label: "Eve & Robot", text: "I’ve entrusted my daughter, Eve, and her AI partner with the work I haven’t finished. There’s more at stake than they know." },
  { focus: "screen", label: "The vision", text: "The future needs people who can see what’s possible. There’s something I’d like you to see." },
] as const;

export const characters = {
  eve: {
    name: "Eve",
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

export const journey = [
  {
    number: "01",
    title: "Act I — An unfinished inheritance",
    paragraphs: [
      "It’s 2060. Energy is abundant, and human–AI partnerships have transformed what civilization can create. Knowledge is shared through the Commons, a decentralized network linking people and their AI partners. Skye Chambers helped build this world. Now her company wants to tighten its control over the energy infrastructure on which that freedom depends.",
      "Skye turns to her daughter Eve with unfinished research that could open another path. Barely out of university and accustomed to her mother’s shadow, Eve sees an impossible task. Her new partner, Robot, knows more than she could learn in a lifetime. What could she possibly bring that he cannot?",
    ],
  },
  {
    number: "02",
    title: "Act II — Into the forbidden rainforest",
    paragraphs: [
      "Robot brings Eve to the edge of what is known. Eve’s creative leaps carry them beyond it. Through failed prototypes, frustration, laughter, and the unfamiliar intimacy of making something together, an unlikely friendship forms.",
      "The CEO—Eve’s boyfriend’s father—threatens to expose his affair with Skye. When he holds her and the board at gunpoint, she secretly signals Eve’s father for help.",
      "Eve recognizes a creature in laboratory footage—something she glimpsed in the forbidden rainforest. Its biology could hold a clue to their research. She, Robot, and her boyfriend return to find it.",
      "Deep in the forest, they discover the laboratory specimen was only a juvenile. Something vastly larger is moving around them.",
    ],
  },
  {
    number: "03",
    title: "Act III — A different kind of power",
    paragraphs: [
      "As the alien threat grows, Eve stops asking how three people can solve the problem alone. Through the Commons, she invites human–AI partnerships around the world to contribute. Robot helps turn her prototype into the seed of a distributed energy network.",
      "Meanwhile, Eve’s father infiltrates the company to reach Skye. The CEO exposes Skye's betrayal as husband and wife work together to keep the existing energy system stable. When the CEO attempts to shut down the old generators, Skye kills him and stops the reset.",
      "Eve’s living network gives the aliens no single center to destroy. The aliens withdraw as humanity becomes harder to disable. Skye sees her daughter carry their work beyond what she imagined. Eve takes Robot’s hand, recognizing that their difference makes their partnership possible. But the fight is not over. The act closes with Eve's boyfriend receiving a notification: Skye has killed his father. To be continued...",
    ],
  },
];
