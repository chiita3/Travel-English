export enum Country {
  Australia = 'Australia',
  Brazil = 'Brazil',
  Canada = 'Canada',
  France = 'France',
  Germany = 'Germany',
  India = 'India',
  Ireland = 'Ireland',
  Italy = 'Italy',
  Japan = 'Japan',
  Mexico = 'Mexico',
  NewZealand = 'New Zealand',
  Nigeria = 'Nigeria',
  Philippines = 'Philippines',
  Singapore = 'Singapore',
  SouthAfrica = 'South Africa',
  SouthKorea = 'South Korea',
  Spain = 'Spain',
  Taiwan = 'Taiwan',
  Thailand = 'Thailand',
  UK = 'UK',
  USA = 'USA',
  Vietnam = 'Vietnam',
}

export interface ConversationExample {
  speaker: 'user' | 'model';
  text: string;
  japanese: string;
}

export interface VocabularyItem {
  word: string;
  japanese: string;
  definition: string;
}

export interface ExampleSet {
    image: string;
    examples: ConversationExample[];
    vocabulary: VocabularyItem[];
}

export type Scene = {
  id: string;
  title: string;
  emoji: string;
  prompt: string;
  color: string;
  hoverColor: string;
  exampleSets: ExampleSet[];
};

export enum MessageRole {
  User = 'user',
  Model = 'model',
  System = 'system',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  audio?: AudioBuffer;
  pronunciationFeedback?: PronunciationFeedback;
}

export interface PronunciationFeedback {
  score: number;
  words: {
    word: string;
    isCorrect: boolean;
  }[];
  advice: string;
}

export interface SavedPhrase {
    id: string;
    text: string;
    scene: string;
}