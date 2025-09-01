export interface Worm {
  id: string;
  name: string;
  level: number;
  xp: number;
  coins: number;
  energy: number;
  mood: number;
  health: number;
  
  // Core stats (renamed dexterity from agility)
  strength: number;
  dexterity: number;
  endurance: number;
  stamina: number;
  intelligence: number;
  charisma: number;
  
  // New properties
  class: PlayerClass;
  rank: number;
  wins: number;
  losses: number;
  
  // Appearance
  avatarUrl?: string;
  
  // Equipment slots
  equipment: {
    helmet?: string; // item id
    armor?: string;
    weapon?: string;
    accessory?: string;
  };
  
  // Training cooldowns (training_id -> timestamp when available again)
  cooldowns: Record<string, number>;
  
  // Daily counters for diminishing returns
  dailyCounters: Record<string, { date: string; count: number }>;
  
  // Tour cooldowns
  tourCooldowns: Record<string, number>;
  
  createdAt: number;
  lastUpdated: number;
}

export type PlayerClass = 'hunter' | 'warrior' | 'ranger' | 'trickster' | 'behemoth' | 'priest' | 'medic';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
  wormId?: string;
}

export interface Training {
  id: string;
  name: string;
  nameHu: string;
  description: string;
  descriptionHu: string;
  energyCost: number;
  coinCost?: number;
  xpGain: number;
  cooldownSeconds: number;
  statFocus: keyof Pick<Worm, 'strength' | 'dexterity' | 'endurance' | 'stamina' | 'intelligence' | 'charisma'>;
  statGain: number;
  icon: string;
}

export interface Job {
  id: string;
  name: string;
  nameHu: string;
  description: string;
  descriptionHu: string;
  minLevel: number;
  durationMinutes: number;
  energyCost: number;
  rewardCoins: number;
  rewardXp: number;
  statRequirements: Partial<Pick<Worm, 'strength' | 'dexterity' | 'endurance' | 'stamina' | 'intelligence' | 'charisma'>>;
  statFocus?: keyof Pick<Worm, 'strength' | 'dexterity' | 'endurance' | 'stamina' | 'intelligence' | 'charisma'>;
  icon: string;
}

export interface JobAssignment {
  id: string;
  jobId: string;
  status: 'accepted' | 'completed' | 'reward_claimed';
  startedAt: number;
  completedAt?: number;
  rewardClaimed?: boolean;
}

export interface Item {
  id: string;
  name: string;
  nameHu: string;
  description: string;
  descriptionHu: string;
  type: 'consumable' | 'equipment';
  subType?: 'helmet' | 'armor' | 'weapon' | 'accessory' | 'energy' | 'stat_boost';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  
  // Effects for consumables
  effects?: {
    energy?: number;
    health?: number;
    mood?: number;
    strength?: number;
    dexterity?: number;
    endurance?: number;
    stamina?: number;
    intelligence?: number;
    charisma?: number;
  };
  
  // Stats for equipment
  statBonus?: {
    strength?: number;
    dexterity?: number;
    endurance?: number;
    stamina?: number;
    intelligence?: number;
    charisma?: number;
  };
  
  level?: number; // minimum level to use
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  acquiredAt: number;
}

export interface TourResult {
  id: string;
  name: string;
  nameHu: string;
  description: string;
  descriptionHu: string;
  duration: number; // minutes
  energyCost: number;
  minLevel: number;
  tier: 'low' | 'mid-bottom' | 'mid-top' | 'high-bottom' | 'high-middle' | 'high-top';
  possibleItems: Item[];
}

export interface Battle {
  id: string;
  type: 'pvp' | 'pve';
  opponent: Worm | PveOpponent;
  status: 'pending' | 'completed';
  result?: 'win' | 'loss' | 'draw';
  startedAt: number;
  completedAt?: number;
}

export interface PveOpponent {
  id: string;
  name: string;
  level: number;
  strength: number;
  dexterity: number;
  endurance: number;
  stamina: number;
  intelligence: number;
  charisma: number;
  type: 'dungeon' | 'raid' | 'adventure';
  difficulty: 'easy' | 'medium' | 'hard' | 'elite';
}

export interface Ability {
  id: string;
  name: string;
  nameHu: string;
  description: string;
  descriptionHu: string;
  type: 'offensive' | 'defensive' | 'support';
  cooldown: number; // seconds
  energyCost: number;
  damage?: number;
  healing?: number;
  effects?: string[];
  classRestriction?: PlayerClass[];
}

export interface GameState {
  user: User | null;
  worm: Worm | null;
  trainings: Training[];
  jobs: Job[];
  jobAssignments: JobAssignment[];
  dailyJobsCompleted: number;
  inventory: InventoryItem[];
  shopItems: Item[];
  tourResults: TourResult[];
  battles: Battle[];
  abilities: Ability[];
  players: Worm[]; // Other players for PvP
  leaderboard: Array<{
    rank: number;
    username: string;
    wormName: string;
    level: number;
    xp: number;
    totalStats: number;
    wins: number;
    losses: number;
  }>;
}

export const DAILY_JOB_LIMIT = 5;
export const MAX_ENERGY = 100;
export const MAX_MOOD = 100;
export const MAX_HEALTH = 100;

// XP required for each level (exponential growth)
export const getXpRequiredForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Diminishing returns calculation
export const getDiminishingMultiplier = (dailyCount: number): number => {
  if (dailyCount <= 3) return 1.0;
  if (dailyCount <= 6) return 0.5;
  return 0.25;
};