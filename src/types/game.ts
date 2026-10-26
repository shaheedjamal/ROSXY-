export type CyberRole = 'Netrunner' | 'Code Architect' | 'SecOps Hunter' | 'Kernel Breaker' | 'AI Whisperer';

export type DistrictId = 
  | 'neon-academy'
  | 'python-port'
  | 'c-industrial'
  | 'java-citadel'
  | 'web-city'
  | 'linux-underground'
  | 'network-nexus'
  | 'cyber-defense'
  | 'data-vault'
  | 'ai-frontier'
  | 'dev-metropolis';

export interface PlayerCustomization {
  suitColor: string;
  visorColor: string;
  accentColor: string;
  cyberware: 'Neural Deck' | 'Optic Glitch' | 'Overclock Core' | 'Quantum Rig';
  avatarIcon: string;
}

export type LanguageId = 
  | 'python'
  | 'c'
  | 'cpp'
  | 'java'
  | 'javascript'
  | 'html-css'
  | 'csharp'
  | 'dart'
  | 'kotlin'
  | 'swift'
  | 'go'
  | 'rust'
  | 'php'
  | 'sql'
  | 'typescript'
  | 'r'
  | 'bash'
  | 'powershell'
  | 'lua'
  | 'ruby'
  | 'cybersecurity';

export type LanguageCategory = 
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Web Development'
  | 'App Development'
  | 'Game Development'
  | 'AI and Data'
  | 'Cybersecurity';

export interface LanguageTrackInfo {
  id: LanguageId;
  name: string;
  symbol: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  categories: LanguageCategory[];
  color: string;
  byteQuip: string;
  description: string;
  whyLearn: string;
  starterCodeSample: string;
  isFullyImplemented: boolean;
  totalMissions: number;
  districtId: DistrictId;
  tutorialSteps?: string[];
}

export interface PlayerStats {
  name: string;
  handle: string;
  role: CyberRole;
  level: number;
  xp: number;
  xpToNextLevel: number;
  credits: number;
  energy: number; // max 5 (Duolingo hearts)
  maxEnergy: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedDistricts: DistrictId[];
  currentDistrict: DistrictId;
  completedMissions: string[];
  defeatedBosses: string[];
  customization: PlayerCustomization;
  inventory: InventoryItem[];
  unlockedSkills: string[];
  recentLanguage: LanguageId;
  pinnedLanguages: LanguageId[];
  languageProgress: Record<string, { completedCount: number; currentLevel: number; xp: number }>;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'visor' | 'jacket' | 'chip' | 'badge' | 'tool';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  statBonus?: string;
  equipped?: boolean;
}

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  order: number;
  tagline: string;
  purpose: string;
  environmentDescription: string;
  learningTopics: string[];
  bossName: string;
  bossTitle: string;
  bossDescription: string;
  primaryLanguage: string;
  color: string;
  unlockedByDefault?: boolean;
}

export interface CodeTestCase {
  input?: string;
  expectedOutput: string;
  description: string;
}

export interface CodeMission {
  id: string;
  districtId: DistrictId;
  title: string;
  summary: string;
  storyContext: string;
  language: 'python' | 'javascript' | 'bash' | 'sql' | 'cpp' | 'network' | 'cyberdefense';
  concept: string;
  starterCode: string;
  solutionSnippet: string;
  hints: string[];
  byteRoast: string;
  byteSuccess: string;
  testCases: CodeTestCase[];
  xpReward: number;
  creditsReward: number;
  itemReward?: InventoryItem;
  badgeReward?: string;
  isBossMission?: boolean;
  type?: 'code' | 'terminal' | 'phishing' | 'network-routing' | 'sql';
}

export interface SkillNode {
  id: string;
  name: string;
  track: 'Programming' | 'Cybersecurity' | 'Systems' | 'Architecture';
  description: string;
  tier: number;
  requiredXp: number;
  prerequisites: string[];
  unlocked: boolean;
  perk: string;
}

export interface ByteDialogue {
  id: string;
  mood: 'neutral' | 'sarcastic' | 'alarmed' | 'proud' | 'smug';
  text: string;
  audioEffect?: 'beep' | 'glitch' | 'alarm' | 'fanfare';
}
