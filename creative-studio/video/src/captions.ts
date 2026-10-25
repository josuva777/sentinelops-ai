export interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

export interface CaptionSentence {
  sentence: string;
  start: number;
  end: number;
  words: CaptionWord[];
}

export const captionsData: CaptionSentence[] = [
  {
    sentence: "An autonomous AI agent just tried to wire $84,000 offshore.",
    start: 0.1,
    end: 5.258,
    words: [
      { word: "An", start: 0.1, end: 0.616 },
      { word: "autonomous", start: 0.616, end: 1.132 },
      { word: "AI", start: 1.132, end: 1.647 },
      { word: "agent", start: 1.647, end: 2.163 },
      { word: "just", start: 2.163, end: 2.679 },
      { word: "tried", start: 2.679, end: 3.195 },
      { word: "to", start: 3.195, end: 3.711 },
      { word: "wire", start: 3.711, end: 4.227 },
      { word: "$84,000", start: 4.227, end: 4.742 },
      { word: "offshore.", start: 4.742, end: 5.258 }
    ]
  },
  {
    sentence: "In 8 milliseconds, SentinelOps intercepted the payload pre-flight.",
    start: 5.208,
    end: 9.664,
    words: [
      { word: "In", start: 5.208, end: 5.765 },
      { word: "8", start: 5.765, end: 6.322 },
      { word: "milliseconds,", start: 6.322, end: 6.879 },
      { word: "SentinelOps", start: 6.879, end: 7.436 },
      { word: "intercepted", start: 7.436, end: 7.993 },
      { word: "the", start: 7.993, end: 8.55 },
      { word: "payload", start: 8.55, end: 9.107 },
      { word: "pre-flight.", start: 9.107, end: 9.664 }
    ]
  },
  {
    sentence: "Deterministic mathematical rules.",
    start: 9.664,
    end: 12.442,
    words: [
      { word: "Deterministic", start: 9.664, end: 10.59 },
      { word: "mathematical", start: 10.59, end: 11.516 },
      { word: "rules.", start: 11.516, end: 12.442 }
    ]
  },
  {
    sentence: "Zero LLM hallucinations.",
    start: 12.442,
    end: 15.336,
    words: [
      { word: "Zero", start: 12.442, end: 13.407 },
      { word: "LLM", start: 13.407, end: 14.371 },
      { word: "hallucinations.", start: 14.371, end: 15.336 }
    ]
  },
  {
    sentence: "The rogue loop was paused with a 15-minute cryptographic token.",
    start: 15.336,
    end: 19.456,
    words: [
      { word: "The", start: 15.336, end: 15.748 },
      { word: "rogue", start: 15.748, end: 16.16 },
      { word: "loop", start: 16.16, end: 16.572 },
      { word: "was", start: 16.572, end: 16.984 },
      { word: "paused", start: 16.984, end: 17.396 },
      { word: "with", start: 17.396, end: 17.808 },
      { word: "a", start: 17.808, end: 18.22 },
      { word: "15-minute", start: 18.22, end: 18.632 },
      { word: "cryptographic", start: 18.632, end: 19.044 },
      { word: "token.", start: 19.044, end: 19.456 }
    ]
  },
  {
    sentence: "Only executive human approval unlocks execution.",
    start: 19.456,
    end: 23.125,
    words: [
      { word: "Only", start: 19.456, end: 20.068 },
      { word: "executive", start: 20.068, end: 20.679 },
      { word: "human", start: 20.679, end: 21.291 },
      { word: "approval", start: 21.291, end: 21.902 },
      { word: "unlocks", start: 21.902, end: 22.514 },
      { word: "execution.", start: 22.514, end: 23.125 }
    ]
  },
  {
    sentence: "SentinelOps AI.",
    start: 23.125,
    end: 25.185,
    words: [
      { word: "SentinelOps", start: 23.125, end: 24.155 },
      { word: "AI.", start: 24.155, end: 25.185 }
    ]
  },
  {
    sentence: "Stop rogue agents before they act.",
    start: 25.185,
    end: 27.975,
    words: [
      { word: "Stop", start: 25.185, end: 25.65 },
      { word: "rogue", start: 25.65, end: 26.115 },
      { word: "agents", start: 26.115, end: 26.58 },
      { word: "before", start: 26.58, end: 27.045 },
      { word: "they", start: 27.045, end: 27.51 },
      { word: "act.", start: 27.51, end: 27.975 }
    ]
  }
];

