import { useState, useEffect } from 'react';
import { GameState, Worm, User, Training, Job, JobAssignment, Item, InventoryItem, getXpRequiredForLevel, getDiminishingMultiplier, DAILY_JOB_LIMIT, TourResult, Battle, PlayerClass } from '../types/game';
import { defaultTrainings } from '../data/trainings';
import { defaultJobs } from '../data/jobs';
import { defaultShopItems, generateRandomEquipment } from '../data/shopItems';
import { defaultTours } from '../data/tours';
import { defaultAbilities } from '../data/abilities';
import { useToast } from './use-toast';
import defaultWormImage from '../assets/default-worm.png';

const STORAGE_KEY = 'worm-daycare-data';
const host = window.location.hostname;
const API_URL = `http://${host}:3001`;

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
  tourResults: defaultTours,
  battles: [],
  abilities: defaultAbilities,
  players: [],
  leaderboard: []
};

export const useGameData = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultGameState, ...parsed };
      } catch (error) {
        console.warn('Failed to parse game data from localStorage', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return defaultGameState;
  });

  const { toast } = useToast();

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Energy regeneration system
  useEffect(() => {
    if (!gameState.worm) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.worm || prev.worm.energy >= 100) return prev;

        const timeSinceLastUpdate = Date.now() - prev.worm.lastUpdated;
        const minutesSinceUpdate = timeSinceLastUpdate / (1000 * 60);
        
        // Regenerate 1 energy per minute
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
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [gameState.worm?.id]);

  const registerUser = async (
    username: string,
    password: string,
    wormName: string,
    playerClass: PlayerClass
  ) => {
    const user = createInitialUser(username);
    const worm = createInitialWorm(wormName, playerClass);

    const newState: GameState = {
      ...defaultGameState,
      user: { ...user, wormId: worm.id },
      worm
    };

    setGameState(newState);

    await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, data: newState })
    });

    toast({
      title: "Üdvözöllek!",
      description: `${wormName} kukac sikeresen létrehozva!`
    });
  };

  const loginUser = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      setGameState({ ...defaultGameState, ...data });
    } else {
      toast({
        title: 'Hiba',
        description: 'Érvénytelen belépési adatok',
        variant: 'destructive'
      });
    }
  };

  // Check if training is available (not on cooldown)
  const isTrainingAvailable = (trainingId: string): boolean => {
    if (!gameState.worm) return false;
    const cooldownEnd = gameState.worm.cooldowns[trainingId];
    return !cooldownEnd || Date.now() >= cooldownEnd;
  };

  // Get remaining cooldown time in seconds
  const getTrainingCooldown = (trainingId: string): number => {
    if (!gameState.worm) return 0;
    const cooldownEnd = gameState.worm.cooldowns[trainingId];
    if (!cooldownEnd) return 0;
    return Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
  };

  // Execute training
  const executeTrain = (trainingId: string) => {
    const training = gameState.trainings.find(t => t.id === trainingId);
    if (!training || !gameState.worm) return;

    const worm = gameState.worm;

    // Check energy
    if (worm.energy < training.energyCost) {
      toast({
        title: "Nincs elég energia!",
        description: `${training.nameHu} ${training.energyCost} energiát igényel.`,
        variant: "destructive"
      });
      return;
    }

    // Check coins
    if (training.coinCost && worm.coins < training.coinCost) {
      toast({
        title: "Nincs elég érme!",
        description: `${training.nameHu} ${training.coinCost} érmét igényel.`,
        variant: "destructive"
      });
      return;
    }

    // Check cooldown
    if (!isTrainingAvailable(trainingId)) {
      const remaining = getTrainingCooldown(trainingId);
      toast({
        title: "Még várnod kell!",
        description: `${training.nameHu} még ${Math.ceil(remaining / 60)} perc múlva lesz elérhető.`,
        variant: "destructive"
      });
      return;
    }

    // Get daily counter for diminishing returns
    const today = new Date().toDateString();
    const dailyCounter = worm.dailyCounters[trainingId];
    const todayCount = (dailyCounter?.date === today) ? dailyCounter.count : 0;
    const multiplier = getDiminishingMultiplier(todayCount);

    // Calculate gains with diminishing returns
    const actualStatGain = Math.floor(training.statGain * multiplier);
    const actualXpGain = Math.floor(training.xpGain * multiplier);

    // Update worm
    const updatedWorm: Worm = {
      ...worm,
      energy: worm.energy - training.energyCost,
      coins: worm.coins - (training.coinCost || 0),
      xp: worm.xp + actualXpGain,
      [training.statFocus]: worm[training.statFocus] + actualStatGain,
      cooldowns: {
        ...worm.cooldowns,
        [trainingId]: Date.now() + training.cooldownSeconds * 1000
      },
      dailyCounters: {
        ...worm.dailyCounters,
        [trainingId]: { date: today, count: todayCount + 1 }
      },
      lastUpdated: Date.now()
    };

    // Check for level up
    let newLevel = updatedWorm.level;
    while (updatedWorm.xp >= getXpRequiredForLevel(newLevel + 1)) {
      newLevel++;
    }

    if (newLevel > updatedWorm.level) {
      updatedWorm.level = newLevel;
      toast({
        title: "Szint lépés! 🎉",
        description: `${worm.name} elérte a ${newLevel}. szintet!`
      });
    }

    setGameState(prev => ({ ...prev, worm: updatedWorm }));

    toast({
      title: "Edzés befejezve!",
      description: `+${actualStatGain} ${training.statFocus === 'strength' ? 'Erő' : 
        training.statFocus === 'dexterity' ? 'Ügyesség' : 
        training.statFocus === 'endurance' ? 'Kitartás' : 
        training.statFocus === 'stamina' ? 'Állóképesség' : 
        training.statFocus === 'intelligence' ? 'Intelligencia' : 'Karizma'}, +${actualXpGain} XP`
    });
  };

  // Accept a job
  const acceptJob = (jobId: string) => {
    const job = gameState.jobs.find(j => j.id === jobId);
    if (!job || !gameState.worm) return;

    const worm = gameState.worm;

    // Check daily job limit
    const today = new Date().toDateString();
    const todayAssignments = gameState.jobAssignments.filter(ja => 
      new Date(ja.startedAt).toDateString() === today
    );
    
    if (todayAssignments.length >= DAILY_JOB_LIMIT) {
      toast({
        title: "Napi limit elérve!",
        description: `Ma már ${DAILY_JOB_LIMIT} munkát végeztél el.`,
        variant: "destructive"
      });
      return;
    }

    // Check level requirement
    if (worm.level < job.minLevel) {
      toast({
        title: "Túl alacsony szint!",
        description: `${job.nameHu} ${job.minLevel}. szintet igényel.`,
        variant: "destructive"
      });
      return;
    }

    // Check energy
    if (worm.energy < job.energyCost) {
      toast({
        title: "Nincs elég energia!",
        description: `${job.nameHu} ${job.energyCost} energiát igényel.`,
        variant: "destructive"
      });
      return;
    }

    // Check stat requirements
    for (const [stat, required] of Object.entries(job.statRequirements)) {
      const statValue = worm[stat as keyof Pick<Worm, 'strength' | 'dexterity' | 'endurance' | 'stamina' | 'intelligence' | 'charisma'>] as number;
      if (statValue < (required as number)) {
        const statName = stat === 'strength' ? 'Erő' : 
          stat === 'dexterity' ? 'Ügyesség' : 
          stat === 'endurance' ? 'Kitartás' : 
          stat === 'stamina' ? 'Állóképesség' : 
          stat === 'intelligence' ? 'Intelligencia' : 'Karizma';
        toast({
          title: "Nem elég magas stat!",
          description: `${job.nameHu} ${required} ${statName}-t igényel.`,
          variant: "destructive"
        });
        return;
      }
    }

    // Create job assignment
    const assignment: JobAssignment = {
      id: Date.now().toString(),
      jobId,
      status: 'accepted',
      startedAt: Date.now(),
    };

    // Deduct energy immediately
    const updatedWorm: Worm = {
      ...worm,
      energy: worm.energy - job.energyCost,
      lastUpdated: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm,
      jobAssignments: [...prev.jobAssignments, assignment]
    }));

    toast({
      title: "Munka elfogadva!",
      description: `${job.nameHu} - ${job.durationMinutes} perc múlva fejezheted be.`
    });
  };

  // Complete a job
  const completeJob = (assignmentId: string) => {
    const assignment = gameState.jobAssignments.find(ja => ja.id === assignmentId);
    const job = assignment ? gameState.jobs.find(j => j.id === assignment.jobId) : null;
    
    if (!assignment || !job || !gameState.worm || assignment.status !== 'accepted') return;

    // Check if enough time has passed
    const timeElapsed = Date.now() - assignment.startedAt;
    const requiredTime = job.durationMinutes * 60 * 1000;
    
    if (timeElapsed < requiredTime) {
      const remainingMinutes = Math.ceil((requiredTime - timeElapsed) / (60 * 1000));
      toast({
        title: "Még nem fejezhető be!",
        description: `${remainingMinutes} perc van hátra.`,
        variant: "destructive"
      });
      return;
    }

    const worm = gameState.worm;

    // Update worm with rewards
    const updatedWorm: Worm = {
      ...worm,
      coins: worm.coins + job.rewardCoins,
      xp: worm.xp + job.rewardXp,
      lastUpdated: Date.now()
    };

    // Check for level up
    let newLevel = updatedWorm.level;
    while (updatedWorm.xp >= getXpRequiredForLevel(newLevel + 1)) {
      newLevel++;
    }

    if (newLevel > updatedWorm.level) {
      updatedWorm.level = newLevel;
      toast({
        title: "Szint lépés! 🎉",
        description: `${worm.name} elérte a ${newLevel}. szintet!`
      });
    }

    // Update assignment status
    const updatedAssignments = gameState.jobAssignments.map(ja =>
      ja.id === assignmentId 
        ? { ...ja, status: 'completed' as const, completedAt: Date.now() }
        : ja
    );

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm,
      jobAssignments: updatedAssignments
    }));

    toast({
      title: "Munka befejezve! 💰",
      description: `+${job.rewardCoins} érme, +${job.rewardXp} XP`
    });
  };

  // Update worm profile
  const updateWormProfile = (updates: Partial<Pick<Worm, 'name' | 'avatarUrl'>>) => {
    if (!gameState.worm) return;

    setGameState(prev => ({
      ...prev,
      worm: prev.worm ? { ...prev.worm, ...updates, lastUpdated: Date.now() } : null
    }));

    toast({
      title: "Profil frissítve!",
      description: "A változások elmentve."
    });
  };

  // Buy item from shop
  const buyItem = (itemId: string) => {
    const item = gameState.shopItems.find(i => i.id === itemId);
    if (!item || !gameState.worm) return;

    const worm = gameState.worm;

    // Check if player has enough coins
    if (worm.coins < item.price) {
      toast({
        title: "Nincs elég érme!",
        description: `${item.nameHu} ${item.price} érmét igényel.`,
        variant: "destructive"
      });
      return;
    }

    // Check level requirement for equipment
    if (item.level && worm.level < item.level) {
      toast({
        title: "Túl alacsony szint!",
        description: `${item.nameHu} ${item.level}. szintet igényel.`,
        variant: "destructive"
      });
      return;
    }

    // Add to inventory
    const existingItem = gameState.inventory.find(inv => inv.itemId === itemId);
    const updatedInventory = existingItem 
      ? gameState.inventory.map(inv => 
          inv.itemId === itemId 
            ? { ...inv, quantity: inv.quantity + 1 }
            : inv
        )
      : [...gameState.inventory, { itemId, quantity: 1, acquiredAt: Date.now() }];

    // Deduct coins
    const updatedWorm: Worm = {
      ...worm,
      coins: worm.coins - item.price,
      lastUpdated: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm,
      inventory: updatedInventory
    }));

    toast({
      title: "Vásárlás sikeres!",
      description: `${item.nameHu} hozzáadva a táskádhoz.`
    });
  };

  // Use consumable item
  const useItem = (itemId: string) => {
    const inventoryItem = gameState.inventory.find(inv => inv.itemId === itemId);
    const item = gameState.shopItems.find(i => i.id === itemId);
    
    if (!inventoryItem || !item || !gameState.worm || inventoryItem.quantity <= 0) return;

    if (item.type !== 'consumable') {
      toast({
        title: "Nem használható!",
        description: "Ez a tárgy nem használható fel.",
        variant: "destructive"
      });
      return;
    }

    const worm = gameState.worm;
    const effects = item.effects || {};

    // Apply effects
    const updatedWorm: Worm = {
      ...worm,
      energy: Math.min(100, worm.energy + (effects.energy || 0)),
      health: Math.min(100, worm.health + (effects.health || 0)),
      mood: Math.min(100, worm.mood + (effects.mood || 0)),
      strength: worm.strength + (effects.strength || 0),
      dexterity: worm.dexterity + (effects.dexterity || 0),
      endurance: worm.endurance + (effects.endurance || 0),
      stamina: worm.stamina + (effects.stamina || 0),
      intelligence: worm.intelligence + (effects.intelligence || 0),
      charisma: worm.charisma + (effects.charisma || 0),
      lastUpdated: Date.now()
    };

    // Remove one from inventory
    const updatedInventory = inventoryItem.quantity === 1
      ? gameState.inventory.filter(inv => inv.itemId !== itemId)
      : gameState.inventory.map(inv => 
          inv.itemId === itemId 
            ? { ...inv, quantity: inv.quantity - 1 }
            : inv
        );

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm,
      inventory: updatedInventory
    }));

    toast({
      title: "Tárgy használva!",
      description: `${item.nameHu} hatása alkalmazva.`
    });
  };

  // Equip item
  const equipItem = (itemId: string) => {
    const inventoryItem = gameState.inventory.find(inv => inv.itemId === itemId);
    const item = gameState.shopItems.find(i => i.id === itemId);
    
    if (!inventoryItem || !item || !gameState.worm || item.type !== 'equipment') return;

    const worm = gameState.worm;
    const slot = item.subType as keyof typeof worm.equipment;

    if (!slot || !['helmet', 'armor', 'weapon', 'accessory'].includes(slot)) {
      toast({
        title: "Hiba!",
        description: "Ismeretlen felszerelés típus.",
        variant: "destructive"
      });
      return;
    }

    // Check level requirement
    if (item.level && worm.level < item.level) {
      toast({
        title: "Túl alacsony szint!",
        description: `${item.nameHu} ${item.level}. szintet igényel.`,
        variant: "destructive"
      });
      return;
    }

    const updatedWorm: Worm = {
      ...worm,
      equipment: {
        ...worm.equipment,
        [slot]: itemId
      },
      lastUpdated: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm
    }));

    toast({
      title: "Felszerelés felöltve!",
      description: `${item.nameHu} sikeresen felöltve.`
    });
  };

  // Unequip item
  const unequipItem = (slot: keyof Worm['equipment']) => {
    if (!gameState.worm) return;

    const updatedWorm: Worm = {
      ...gameState.worm,
      equipment: {
        ...gameState.worm.equipment,
        [slot]: undefined
      },
      lastUpdated: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm
    }));

    toast({
      title: "Felszerelés levéve!",
      description: "Tárgy sikeresen levéve."
    });
  };

  // Get total stats including equipment bonuses
  const getTotalStats = (worm: Worm) => {
    const totalStats = {
      strength: worm.strength,
      dexterity: worm.dexterity,
      endurance: worm.endurance,
      stamina: worm.stamina,
      intelligence: worm.intelligence,
      charisma: worm.charisma
    };

    // Add equipment bonuses
    Object.values(worm.equipment).forEach(itemId => {
      if (itemId) {
        const item = gameState.shopItems.find(i => i.id === itemId);
        if (item?.statBonus) {
          totalStats.strength += item.statBonus.strength || 0;
          totalStats.dexterity += item.statBonus.dexterity || 0;
          totalStats.endurance += item.statBonus.endurance || 0;
          totalStats.stamina += item.statBonus.stamina || 0;
          totalStats.intelligence += item.statBonus.intelligence || 0;
          totalStats.charisma += item.statBonus.charisma || 0;
        }
      }
    });

    return totalStats;
  };

  // Tour functions
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

    // Check requirements
    if (gameState.worm.level < tour.minLevel) {
      toast({
        title: "Szint túl alacsony",
        description: `${tour.minLevel}. szint szükséges ehhez a túrához.`,
        variant: "destructive",
      });
      return;
    }

    if (gameState.worm.energy < tour.energyCost) {
      toast({
        title: "Nincs elég energia",
        description: `${tour.energyCost} energia szükséges.`,
        variant: "destructive",
      });
      return;
    }

    if (!isTourAvailable(tourId)) {
      toast({
        title: "Túra még nem elérhető",
        description: "Várj még egy kicsit!",
        variant: "destructive",
      });
      return;
    }

    setGameState(prev => {
      if (!prev.worm) return prev;

      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - tour.energyCost,
        tourCooldowns: {
          ...prev.worm.tourCooldowns,
          [tourId]: Date.now() + (tour.duration * 60 * 1000) // Convert minutes to milliseconds
        }
      };

      // Generate random equipment reward (chance based on tier)
      let rewardItem: Item | null = null;
      const dropChance = tour.tier === 'low' ? 0.3 : 
                        tour.tier === 'mid-bottom' ? 0.4 :
                        tour.tier === 'mid-top' ? 0.5 :
                        tour.tier === 'high-bottom' ? 0.6 :
                        tour.tier === 'high-middle' ? 0.7 : 0.8;

      if (Math.random() < dropChance) {
        rewardItem = generateRandomEquipment(tour.tier, randomEquipmentSubType());
      }

      const updatedInventory = rewardItem 
        ? [...prev.inventory, { itemId: rewardItem.id, quantity: 1, acquiredAt: Date.now() }]
        : prev.inventory;

      const updatedShopItems = rewardItem 
        ? [...prev.shopItems, rewardItem]
        : prev.shopItems;

      toast({
        title: "Túra elkezdve!",
        description: rewardItem 
          ? `Túra elkezdve! ${tour.duration} perc múlva visszatérsz. Találtál egy tárgyat: ${rewardItem.nameHu}!`
          : `Túra elkezdve! ${tour.duration} perc múlva visszatérsz.`,
      });

      return {
        ...prev,
        worm: updatedWorm,
        inventory: updatedInventory,
        shopItems: updatedShopItems
      };
    });
  };

  // PvE functions
  const startDungeon = (difficulty: 'easy' | 'medium' | 'hard' | 'elite'): void => {
    if (!gameState.worm) return;

    const dungeonData = {
      easy: { energyCost: 15, minLevel: 1, tier: 'low' as const, xpReward: 20 },
      medium: { energyCost: 25, minLevel: 5, tier: 'mid-bottom' as const, xpReward: 40 },
      hard: { energyCost: 35, minLevel: 10, tier: 'mid-top' as const, xpReward: 60 },
      elite: { energyCost: 50, minLevel: 15, tier: 'high-bottom' as const, xpReward: 100 }
    };

    const dungeon = dungeonData[difficulty];

    // Check requirements
    if (gameState.worm.level < dungeon.minLevel) {
      toast({
        title: "Szint túl alacsony",
        description: `${dungeon.minLevel}. szint szükséges ehhez a börtönhöz.`,
        variant: "destructive",
      });
      return;
    }

    if (gameState.worm.energy < dungeon.energyCost) {
      toast({
        title: "Nincs elég energia",
        description: `${dungeon.energyCost} energia szükséges.`,
        variant: "destructive",
      });
      return;
    }

    setGameState(prev => {
      if (!prev.worm) return prev;

      // Generate rewards
      const xpGained = dungeon.xpReward;
      const newXp = prev.worm.xp + xpGained;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.worm.level;

      // Equipment drop (higher chance than tours since it's combat)
      let rewardItem: Item | null = null;
      const dropChance = difficulty === 'easy' ? 0.4 : 
                        difficulty === 'medium' ? 0.6 :
                        difficulty === 'hard' ? 0.75 : 0.9;

      if (Math.random() < dropChance) {
        rewardItem = generateRandomEquipment(dungeon.tier, randomEquipmentSubType());
      }

      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - dungeon.energyCost,
        xp: newXp,
        level: newLevel
      };

      const updatedInventory = rewardItem 
        ? [...prev.inventory, { itemId: rewardItem.id, quantity: 1, acquiredAt: Date.now() }]
        : prev.inventory;

      const updatedShopItems = rewardItem 
        ? [...prev.shopItems, rewardItem]
        : prev.shopItems;

      toast({
        title: "Börtön teljesítve!",
        description: rewardItem 
          ? `${xpGained} XP szerzett! Találtál: ${rewardItem.nameHu}${leveledUp ? ` Új szint: ${newLevel}!` : ''}`
          : `${xpGained} XP szerzett!${leveledUp ? ` Új szint: ${newLevel}!` : ''}`,
      });

      return {
        ...prev,
        worm: updatedWorm,
        inventory: updatedInventory,
        shopItems: updatedShopItems
      };
    });
  };

  const startRaid = (): void => {
    if (!gameState.worm) return;

    // Check requirements
    if (gameState.worm.level < 12) {
      toast({
        title: "Szint túl alacsony",
        description: "12. szint szükséges raid-ekhez.",
        variant: "destructive",
      });
      return;
    }

    if (gameState.worm.energy < 40) {
      toast({
        title: "Nincs elég energia",
        description: "40 energia szükséges.",
        variant: "destructive",
      });
      return;
    }

    setGameState(prev => {
      if (!prev.worm) return prev;

      // Raid rewards (guaranteed equipment + high XP)
      const xpGained = 150;
      const newXp = prev.worm.xp + xpGained;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.worm.level;

      // Always drop equipment from raids, chance for multiple items
      const rewards: Item[] = [];
      rewards.push(generateRandomEquipment('high-middle', randomEquipmentSubType())); // Guaranteed high-tier item
      
      // 50% chance for second item
      if (Math.random() < 0.5) {
        rewards.push(generateRandomEquipment('high-bottom', randomEquipmentSubType()));
      }

      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - 40,
        xp: newXp,
        level: newLevel
      };

      const newInventoryItems = rewards.map(item => ({ 
        itemId: item.id, 
        quantity: 1, 
        acquiredAt: Date.now() 
      }));

      const updatedInventory = [...prev.inventory, ...newInventoryItems];
      const updatedShopItems = [...prev.shopItems, ...rewards];

      toast({
        title: "Sárkány legyőzve!",
        description: `${xpGained} XP! Zsákmány: ${rewards.map(r => r.nameHu).join(', ')}${leveledUp ? ` Új szint: ${newLevel}!` : ''}`,
      });

      return {
        ...prev,
        worm: updatedWorm,
        inventory: updatedInventory,
        shopItems: updatedShopItems
      };
    });
  };

  const startAdventure = (): void => {
    if (!gameState.worm) return;

    // Check requirements
    if (gameState.worm.level < 8) {
      toast({
        title: "Szint túl alacsony", 
        description: "8. szint szükséges kalandokhoz.",
        variant: "destructive",
      });
      return;
    }

    if (gameState.worm.energy < 30) {
      toast({
        title: "Nincs elég energia",
        description: "30 energia szükséges.",
        variant: "destructive",
      });
      return;
    }

    setGameState(prev => {
      if (!prev.worm) return prev;

      // Adventure rewards (moderate XP, good equipment chance)
      const xpGained = 80;
      const newXp = prev.worm.xp + xpGained;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.worm.level;

      // 70% chance for equipment
      let rewardItem: Item | null = null;
      if (Math.random() < 0.7) {
        rewardItem = generateRandomEquipment('mid-top', randomEquipmentSubType());
      }

      const updatedWorm = {
        ...prev.worm,
        energy: prev.worm.energy - 30,
        xp: newXp,
        level: newLevel
      };

      const updatedInventory = rewardItem 
        ? [...prev.inventory, { itemId: rewardItem.id, quantity: 1, acquiredAt: Date.now() }]
        : prev.inventory;

      const updatedShopItems = rewardItem 
        ? [...prev.shopItems, rewardItem]
        : prev.shopItems;

      toast({
        title: "Kaland befejezve!",
        description: rewardItem 
          ? `${xpGained} XP! Találtál: ${rewardItem.nameHu}${leveledUp ? ` Új szint: ${newLevel}!` : ''}`
          : `${xpGained} XP szerzett!${leveledUp ? ` Új szint: ${newLevel}!` : ''}`,
      });

      return {
        ...prev,
        worm: updatedWorm,
        inventory: updatedInventory,
        shopItems: updatedShopItems
      };
    });
  };

  // Helper function to calculate level from XP
  const calculateLevel = (xp: number): number => {
    let level = 1;
    while (xp >= getXpRequiredForLevel(level + 1)) {
      level++;
    }
    return level;
  };

  return {
    gameState,
    registerUser,
    loginUser,
    executeTrain,
    acceptJob,
    completeJob,
    updateWormProfile,
    isTrainingAvailable,
    getTrainingCooldown,
    buyItem,
    useItem,
    equipItem,
    unequipItem,
    getTotalStats,
    isTourAvailable,
    getTourCooldown,
    startTour,
    startDungeon,
    startRaid,
    startAdventure,
    isLoggedIn: !!gameState.user && !!gameState.worm
  };
};