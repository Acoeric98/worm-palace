import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react';
import {
  GameState,
  Worm,
  User,
  PlayerClass
} from '../types/game';
import { defaultTrainings } from '../data/trainings';
import { defaultJobs } from '../data/jobs';
import { defaultShopItems } from '../data/shopItems';
import { defaultTours } from '../data/tours';
import { defaultAbilities } from '../data/abilities';
import { useToast } from './use-toast';
import defaultWormImage from '../assets/default-worm.png';
import { useAuth } from './useAuth';
import { useTraining } from './useTraining';
import { useJobs } from './useJobs';
import { useInventory } from './useInventory';
import { useMarket } from './useMarket';
import { useActivities } from './useActivities';

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
  const activities = useActivities(gameState, setGameState, toast);
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
    isLoggedIn: !!gameState.user && !!gameState.worm,
    logout,
    ...activities,
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
  return createElement(GameContext.Provider, { value }, children);
};

export const useGameData = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameData must be used within a GameProvider');
  }
  return context;
};

export type GameHook = GameContextValue;
