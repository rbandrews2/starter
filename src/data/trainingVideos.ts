export type TrainingVideo = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  topics: string[];
  source: string;
  level: "intro" | "intermediate" | "advanced";
};

export const trainingVideos: TrainingVideo[] = [
  {
    id: "flagger-basics-1",
    title: "Work Zone Safety – Flagging Basics",
    description:
      "Foundational flagger techniques and positioning for safe temporary traffic control in short-term work zones.",
    youtubeId: "AZwl4L8JMlE",
    topics: ["flagging", "work zone basics", "temporary traffic control", "MUTCD"],
    source: "SafetyVideos / YouTube",
    level: "intro",
  },
  {
    id: "flagger-exercise-cdot",
    title: "Basic Work Zone Flagger Exercise (CDOT)",
    description:
      "Colorado DOT scenario-based exercise demonstrating correct STOP / SLOW paddle use and communication in active work zones.",
    youtubeId: "-MTCadQ8iIE",
    topics: ["flagging", "CDOT", "hands-on scenarios"],
    source: "Colorado DOT / YouTube",
    level: "intermediate",
  },
  {
    id: "flagger-training-cdot",
    title: "Work Zone Flagger Training",
    description:
      "Detailed training on proper flagger signals, positioning, and hazard awareness for two-lane flagging operations.",
    youtubeId: "ErsYn1muk78",
    topics: ["flagging", "signal paddles", "lane control"],
    source: "Colorado DOT / YouTube",
    level: "intro",
  },
  {
    id: "two-lane-work-zone",
    title: "Two Lane Work Zone Safety",
    description:
      "Two-lane work zone setup and flagger coordination, including tapers, advance warning, and pilot vehicle operations.",
    youtubeId: "Ydjfx7QBMao",
    topics: ["two-lane operations", "flagging", "temporary traffic control"],
    source: "VTrans / Vermont AOT",
    level: "intermediate",
  },
  {
    id: "wz-traffic-control-inspection",
    title: "Work Zone Traffic Control Inspection",
    description:
      "How to inspect work zone traffic control layouts for MUTCD compliance, visibility, and worker protection.",
    youtubeId: "GAaLyDtFfBM",
    topics: ["inspection", "MUTCD", "temporary traffic control"],
    source: "DOT Training / YouTube",
    level: "intermediate",
  },
  {
    id: "wz-traffic-control-reviews",
    title: "Work Zone Traffic Control Reviews",
    description:
      "High-level overview of temporary traffic control plan reviews and field checks to keep crews and road users safe.",
    youtubeId: "wSvCXCaUU8U",
    topics: ["temporary traffic control", "plan review", "FHWA"],
    source: "FHWA / YouTube",
    level: "intro",
  },
  {
    id: "setting-up-safe-work-zone",
    title: "Setting Up a Safe Work Zone – Road Crew Safety",
    description:
      "Step-by-step work zone setup best practices, including buffer space, taper lengths, and worker safety strategies.",
    youtubeId: "QsSqSmUTawo",
    topics: ["work zone setup", "buffer space", "cones & signs"],
    source: "Road Crew Safety / YouTube",
    level: "intro",
  },
  {
    id: "paving-safety-iowa-dot",
    title: "Paving Safety – Hazards of Paving Operations",
    description:
      "Common hazards of paving with asphalt and concrete, plus controls for workers near pavers, rollers, and trucks.",
    youtubeId: "GAo13jpISrs",
    topics: ["paver safety", "equipment", "hot mix asphalt"],
    source: "Iowa DOT / YouTube",
    level: "intermediate",
  },
  {
    id: "asphalt-paver-machine-safety",
    title: "Asphalt Paving Machine Safety",
    description:
      "Safe operation and spotter communication for asphalt pavers, focusing on pinch points, backing hazards, and visibility.",
    youtubeId: "042YQWY877c",
    topics: ["paver safety", "equipment", "spotter communication"],
    source: "GotSafety / YouTube",
    level: "intermediate",
  },
  {
    id: "asphalt-paving-operations",
    title: "Asphalt Paving Operation – Positions and Equipment",
    description:
      "End-to-end look at a paving crew: roles, equipment, and safety responsibilities from prep to final pass.",
    youtubeId: "j463RFDu24M",
    topics: ["paving operations", "crew roles", "equipment"],
    source: "Training Video / YouTube",
    level: "intro",
  },
  {
    id: "work-zone-safety-training",
    title: "Work Zone Safety Training – Construction Hazards",
    description:
      "Broad work zone safety course covering struck-by hazards, exposure risks, and traffic separation strategies.",
    youtubeId: "bsuqZ8DkSCc",
    topics: ["hazards", "PPE", "struck-by prevention"],
    source: "SafetyVideos.com / YouTube",
    level: "intro",
  },
  {
    id: "wz-safety-intro",
    title: "Work Zone Safety – Introduction",
    description:
      "Introductory module explaining why work zone safety matters, key terminology, and high-level MUTCD guidance.",
    youtubeId: "oQ7lgod-4LU",
    topics: ["work zone overview", "MUTCD", "terminology"],
    source: "SafetyVideos.com / YouTube",
    level: "intro",
  },
];
