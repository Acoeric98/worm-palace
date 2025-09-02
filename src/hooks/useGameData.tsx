import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  GameState,
  Worm,
  User,
  PlayerClass,
  getXpRequiredForLevel,
  Item
} from '../types/game';
import { defaultTrainings } from '../data/trainings';
import { defaultJobs } from '../data/jobs';
import { defaultShopItems, generateRandomEquipment } from '../data/shopItems';
import { defaultTours } from '../data/tours';
import { defaultAbilities } from '../data/abilities';
import { useToast } from './use-toast';
import defaultWormImage from '../assets/default-worm.png';
import { useAuth } from './useAuth';
import { useTraining } from './useTraining';
import { useJobs } from './useJobs';
import { useInventory } from './useInventory';
import { useMarket } from './useMarket';

const STORAGE_KEY = 'worm-daycare-data';

// Generate random worm stats for new worms
const generateRandomStats = () => ({
  strength: Math.floor(Math.random() * 5) + 3,
  dexterity: Math.floor(Math.random() * 5) + 3,
  endurance: Math.floor(Math.random() * 5) + 3,
  stamina: Math.floor(Math.random() * 5) + 3,
  intelligence: Math.floor(Math.random() * 5) + 3,
  charisma: Math.floor(Math.random() * 5) + 3,
});

const createInitialWorm = (name: string, playerClass: PlayerClass): Worm => {
  const stats = generateRandomStats();
  return {
    id: Date.now().toString(),
    name,
    level: 1,
    xp: 0,
    coins: 100,
    energy: 100,
    mood: 100,
    health: 100,
    class: playerClass,
    rank: 1000,
    wins: 0,
    losses: 0,
    ...stats,
    avatarUrl: defaultWormImage,
    equipment: {
      helmet: undefined,
      armor: undefined,
      weapon: undefined,
      accessory: undefined
    },
    cooldowns: {},
    dailyCounters: {},
    tourCooldowns: {},
    currentActivity: undefined,
    createdAt: Date.now(),
    lastUpdated: Date.now()
  };
};

const createInitialUser = (username: string): User => ({
  id: Date.now().toString(),
  username,
  email: `${username}@example.com`,
  createdAt: Date.now()
});

const randomEquipmentSubType = () => (
  ['helmet', 'armor', 'weapon', 'accessory'] as const
)[Math.floor(Math.random() * 4)];

const defaultGameState: GameState = {
  user: null,
  worm: null,
  trainings: defaultTrainings,
  jobs: defaultJobs,
  jobAssignments: [],
  dailyJobsCompleted: 0,
  inventory: [],
  shopItems: defaultShopItems,
  marketListings: [],
  tourResults: defaultTours,
  battles: [],
  abilities: defaultAbilities,
  players: [],
  leaderboard: []
};

const useGameDataInternal = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultGameState, ...parsed };
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return defaultGameState;
  });

  const { toast } = useToast();
  const { registerUser: authRegisterUser, loginUser: authLoginUser, saveGame, logout: authLogout } = useAuth();

  const training = useTraining(gameState, setGameState, toast);
  const jobs = useJobs(gameState, setGameState, toast);
  const inventory = useInventory(gameState, setGameState, toast);
  const market = useMarket(gameState, setGameState, toast);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveGame(gameState);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [saveGame, gameState]);

  useEffect(() => {
    if (!gameState.worm) return;
    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.worm || prev.worm.energy >= 100) return prev;
        const timeSinceLastUpdate = Date.now() - prev.worm.lastUpdated;
        const minutesSinceUpdate = timeSinceLastUpdate / (1000 * 60);
        const energyToRestore = Math.floor(minutesSinceUpdate);
        if (energyToRestore > 0) {
          const newEnergy = Math.min(100, prev.worm.energy + energyToRestore);
          return {
            ...prev,
            worm: {
              ...prev.worm,
              energy: newEnergy,
              lastUpdated: Date.now()
            }
          };
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [gameState.worm]);

  const registerUser = async (
    username: string,
    password: string,
    wormName: string,
    playerClass: PlayerClass
  ) => {
    localStorage.removeItem(STORAGE_KEY);

    const user = createInitialUser(username);
    const worm = createInitialWorm(wormName, playerClass);

    const newState: GameState = {
      ...defaultGameState,
      user: { ...user, wormId: worm.id },
      worm
    };

    setGameState(newState);

    try {
      await authRegisterUser({ username, password, data: newState });
      toast({
        title: 'Üdvözöllek!',
        description: `${wormName} kukac sikeresen létrehozva!`
      });
    } catch (err) {
      console.error('Failed to register user', err);
      toast({
        title: 'Hiba',
        description: err instanceof Error ? err.message : 'Nem sikerült csatlakozni a szerverhez.',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const data = await authLoginUser(username, password);
      setGameState({ ...defaultGameState, ...data });
    } catch (err) {
      console.error('Failed to login user', err);
      toast({
        title: 'Hiba',
        description: err instanceof Error ? err.message : 'Nem sikerült csatlakozni a szerverhez.',
        variant: 'destructive'
      });
    }
  };

  const updateWormProfile = (updates: Partial<Pick<Worm, 'name' | 'avatarUrl'>>) => {
    if (!gameState.worm) return;
    setGameState(prev => ({
      ...prev,
      worm: prev.worm ? { ...prev.worm, ...updates, lastUpdated: Date.now() } : null
    }));
    toast({ title: 'Profil frissítve!', description: 'A változások elmentve.' });
  };

  const isTourAvailable = (tourId: string): boolean => {
    if (!gameState.worm) return false;
    const cooldownTime = gameState.worm.tourCooldowns[tourId] || 0;
    return Date.now() >= cooldownTime;
  };

  const getTourCooldown = (tourId: string): number => {
    if (!gameState.worm) return 0;
    const cooldownTime = gameState.worm.tourCooldowns[tourId] || 0;
    const remaining = cooldownTime - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  const startTour = (tourId: string): void => {
    if (!gameState.worm) return;
    const tour = gameState.tourResults.find(t => t.id === tourId);
    if (!tour) return;

    if (gameState.worm.currentActivity && Date.now() < gameState.worm.currentActivity.endsAt) {
      toast({ title: 'Már folyamatban van egy tevékenység!', description: 'Várd meg, míg az előző befejeződik.', variant: 'destructive' });
      return;
    }

    if (gameState.worm.level < tour.minLevel) {
      toast({ title: 'Szint túl alacsony', description: `${tour.minLevel}. szint szükséges ehhez a túrához.`, variant: 'destructive' });
      return;
    }
    if (gameState.worm.energy < tour.energyCost) {
      toast({ title: 'Nincs elég energia', description: `${tour.energyCost} energia szükséges.`, variant: 'destructive' });
      return;
    }
    if (!isTourAvailable(tourId)) {
      toast({ title: 'Túra még nem elérhető', description: 'Várj még egy kicsit!', variant: 'destructive' });
      return;
    }

    setGameState(prev => {
      if (!prev.worm) return prev;
      const today = new Date().toDateString();
      const counter = prev.worm.dailyCounters[`tour_${tourId}`];
      const count = counter?.date === today ? counter.count : 0;
      const moodChange = 10 - count * 5;

      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - tour.energyCost,
        mood: Math.max(0, Math.min(100, prev.worm.mood + moodChange)),
        tourCooldowns: { ...prev.worm.tourCooldowns, [tourId]: Date.now() + tour.duration * 60 * 1000 },
        dailyCounters: { ...prev.worm.dailyCounters, [`tour_${tourId}`]: { date: today, count: count + 1 } },
        currentActivity: { type: 'tour', endsAt: Date.now() + tour.duration * 60 * 1000 }
      };

      let rewardItem: Item | null = null;
      const dropChance = tour.tier === 'low' ? 0.3 :
                        tour.tier === 'mid-bottom' ? 0.4 :
                        tour.tier === 'mid-top' ? 0.5 :
                        tour.tier === 'high-bottom' ? 0.6 :
                        tour.tier === 'high-middle' ? 0.7 : 0.8;
      if (Math.random() < dropChance) {
        rewardItem = generateRandomEquipment(tour.tier, randomEquipmentSubType());
      }

      const updatedInventory = rewardItem ? [...prev.inventory, { itemId: rewardItem.id, quantity: 1, acquiredAt: Date.now() }] : prev.inventory;
      const updatedShopItems = rewardItem ? [...prev.shopItems, rewardItem] : prev.shopItems;

      toast({
        title: 'Túra elkezdve!',
        description: rewardItem ? `Túra elkezdve! ${tour.duration} perc múlva visszatérsz. Találtál egy tárgyat: ${rewardItem.nameHu}!` : `Túra elkezdve! ${tour.duration} perc múlva visszatérsz.`,
      });

      return { ...prev, worm: updatedWorm, inventory: updatedInventory, shopItems: updatedShopItems };
    });
  };

  const startDungeon = (difficulty: 'easy' | 'medium' | 'hard' | 'elite'): void => {
    if (!gameState.worm) return;
    if (gameState.worm.currentActivity && Date.now() < gameState.worm.currentActivity.endsAt) {
      toast({ title: 'Már folyamatban van egy tevékenység!', description: 'Várd meg, míg az előző befejeződik.', variant: 'destructive' });
      return;
    }
    const dungeonData = {
      easy: { energyCost: 15, minLevel: 1, tier: 'low' as const, xpReward: 20, durationMinutes: 5 },
      medium: { energyCost: 25, minLevel: 5, tier: 'mid-bottom' as const, xpReward: 40, durationMinutes: 10 },
      hard: { energyCost: 35, minLevel: 10, tier: 'mid-top' as const, xpReward: 60, durationMinutes: 15 },
      elite: { energyCost: 50, minLevel: 15, tier: 'high-bottom' as const, xpReward: 100, durationMinutes: 20 }
    };
    const dungeon = dungeonData[difficulty];
    if (gameState.worm.level < dungeon.minLevel) {
      toast({ title: 'Szint túl alacsony', description: `${dungeon.minLevel}. szint szükséges ehhez a börtönhöz.`, variant: 'destructive' });
      return;
    }
    if (gameState.worm.energy < dungeon.energyCost) {
      toast({ title: 'Nincs elég energia', description: `${dungeon.energyCost} energia szükséges.`, variant: 'destructive' });
      return;
    }
    setGameState(prev => {
      if (!prev.worm) return prev;
      const xpGained = dungeon.xpReward;
      const newXp = prev.worm.xp + xpGained;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.worm.level;
      let rewardItem: Item | null = null;
      const dropChance = difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.6 : difficulty === 'hard' ? 0.75 : 0.9;
      if (Math.random() < dropChance) {
        rewardItem = generateRandomEquipment(dungeon.tier, randomEquipmentSubType());
      }
      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - dungeon.energyCost,
        xp: newXp,
        level: newLevel,
        currentActivity: { type: 'dungeon', endsAt: Date.now() + dungeon.durationMinutes * 60 * 1000 }
      };
      const updatedInventory = rewardItem ? [...prev.inventory, { itemId: rewardItem.id, quantity: 1, acquiredAt: Date.now() }] : prev.inventory;
      const updatedShopItems = rewardItem ? [...prev.shopItems, rewardItem] : prev.shopItems;
      toast({
        title: 'Börtön teljesítve!',
        description: rewardItem ? `${xpGained} XP! Zsákmány: ${rewardItem.nameHu}${leveledUp ? ` Új szint: ${newLevel}!` : ''}` : `${xpGained} XP szerzett!${leveledUp ? ` Új szint: ${newLevel}!` : ''}`,
      });
      return { ...prev, worm: updatedWorm, inventory: updatedInventory, shopItems: updatedShopItems };
    });
  };

  const startRaid = (): void => {
    if (!gameState.worm) return;
    if (gameState.worm.currentActivity && Date.now() < gameState.worm.currentActivity.endsAt) {
      toast({ title: 'Már folyamatban van egy tevékenység!', description: 'Várd meg, míg az előző befejeződik.', variant: 'destructive' });
      return;
    }
    if (gameState.worm.level < 12) {
      toast({ title: 'Szint túl alacsony', description: '12. szint szükséges a raidhez.', variant: 'destructive' });
      return;
    }
    if (gameState.worm.energy < 40) {
      toast({ title: 'Nincs elég energia', description: '40 energia szükséges.', variant: 'destructive' });
      return;
    }
    setGameState(prev => {
      if (!prev.worm) return prev;
      const xpGained = 150;
      const newXp = prev.worm.xp + xpGained;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.worm.level;
      const rewards: Item[] = [];
      rewards.push(generateRandomEquipment('high-middle', randomEquipmentSubType()));
      if (Math.random() < 0.5) {
        rewards.push(generateRandomEquipment('high-bottom', randomEquipmentSubType()));
      }
      const raidDurationMinutes = 30;
      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - 40,
        xp: newXp,
        level: newLevel,
        currentActivity: { type: 'raid', endsAt: Date.now() + raidDurationMinutes * 60 * 1000 }
      };
      const newInventoryItems = rewards.map(item => ({ itemId: item.id, quantity: 1, acquiredAt: Date.now() }));
      const updatedInventory = [...prev.inventory, ...newInventoryItems];
      const updatedShopItems = [...prev.shopItems, ...rewards];
      toast({ title: 'Sárkány legyőzve!', description: `${xpGained} XP! Zsákmány: ${rewards.map(r => r.nameHu).join(', ')}${leveledUp ? ` Új szint: ${newLevel}!` : ''}` });
      return { ...prev, worm: updatedWorm, inventory: updatedInventory, shopItems: updatedShopItems };
    });
  };

  const startAdventure = (): void => {
    if (!gameState.worm) return;
    if (gameState.worm.currentActivity && Date.now() < gameState.worm.currentActivity.endsAt) {
      toast({ title: 'Már folyamatban van egy tevékenység!', description: 'Várd meg, míg az előző befejeződik.', variant: 'destructive' });
      return;
    }
    if (gameState.worm.level < 8) {
      toast({ title: 'Szint túl alacsony', description: '8. szint szükséges kalandokhoz.', variant: 'destructive' });
      return;
    }
    if (gameState.worm.energy < 30) {
      toast({ title: 'Nincs elég energia', description: '30 energia szükséges.', variant: 'destructive' });
      return;
    }
    setGameState(prev => {
      if (!prev.worm) return prev;
      const xpGained = 80;
      const newXp = prev.worm.xp + xpGained;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.worm.level;
      let rewardItem: Item | null = null;
      if (Math.random() < 0.7) {
        rewardItem = generateRandomEquipment('mid-top', randomEquipmentSubType());
      }
      const adventureDurationMinutes = 20;
      const today = new Date().toDateString();
      const counter = prev.worm.dailyCounters['adventure'];
      const count = counter?.date === today ? counter.count : 0;
      const moodChange = 15 - count * 5;
      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - 30,
        xp: newXp,
        level: newLevel,
        mood: Math.max(0, Math.min(100, prev.worm.mood + moodChange)),
        currentActivity: { type: 'adventure', endsAt: Date.now() + adventureDurationMinutes * 60 * 1000 },
        dailyCounters: { ...prev.worm.dailyCounters, adventure: { date: today, count: count + 1 } }
      };
      const updatedInventory = rewardItem ? [...prev.inventory, { itemId: rewardItem.id, quantity: 1, acquiredAt: Date.now() }] : prev.inventory;
      const updatedShopItems = rewardItem ? [...prev.shopItems, rewardItem] : prev.shopItems;
      toast({ title: 'Kaland befejezve!', description: rewardItem ? `${xpGained} XP! Találtál: ${rewardItem.nameHu}${leveledUp ? ` Új szint: ${newLevel}!` : ''}` : `${xpGained} XP szerzett!${leveledUp ? ` Új szint: ${newLevel}!` : ''}` });
      return { ...prev, worm: updatedWorm, inventory: updatedInventory, shopItems: updatedShopItems };
    });
  };

  const calculateLevel = (xp: number): number => {
    let level = 1;
    while (xp >= getXpRequiredForLevel(level + 1)) level++;
    return level;
  };

  const logout = () => {
    void saveGame(gameState);
    authLogout();
    localStorage.removeItem(STORAGE_KEY);
    setGameState(defaultGameState);
  };

  return {
    gameState,
    registerUser,
    loginUser,
    updateWormProfile,
    isTourAvailable,
    getTourCooldown,
    startTour,
    startDungeon,
    startRaid,
    startAdventure,
    isLoggedIn: !!gameState.user && !!gameState.worm,
    logout,
    ...training,
    ...jobs,
    ...inventory,
    ...market
  };
};
type GameContextValue = ReturnType<typeof useGameDataInternal>;

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const value = useGameDataInternal();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameData = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameData must be used within a GameProvider');
  }
  return context;
};

export type GameHook = GameContextValue;
