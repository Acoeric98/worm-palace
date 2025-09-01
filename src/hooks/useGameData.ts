import { useState, useEffect } from 'react';
import { GameState, Worm, User, Training, Job, JobAssignment, Item, InventoryItem, getXpRequiredForLevel, getDiminishingMultiplier, DAILY_JOB_LIMIT } from '../types/game';
import { defaultTrainings } from '../data/trainings';
import { defaultJobs } from '../data/jobs';
import { defaultShopItems } from '../data/shopItems';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';
import defaultWormImage from '../assets/default-worm.png';

// Generate random worm stats for new worms
const generateRandomStats = () => ({
  strength: Math.floor(Math.random() * 5) + 3,
  agility: Math.floor(Math.random() * 5) + 3,
  endurance: Math.floor(Math.random() * 5) + 3,
  stamina: Math.floor(Math.random() * 5) + 3,
  intelligence: Math.floor(Math.random() * 5) + 3,
  charisma: Math.floor(Math.random() * 5) + 3,
});

const createInitialWorm = (name: string): Worm => {
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

export const useGameData = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [gameState, setGameState] = useState<GameState>(() => {
    if (!authUser) {
      return {
        user: null,
        worm: null,
        trainings: defaultTrainings,
        jobs: defaultJobs,
        jobAssignments: [],
        dailyJobsCompleted: 0,
        inventory: [],
        shopItems: defaultShopItems,
        leaderboard: []
      };
    }

    const userStorageKey = `worm-daycare-data-${authUser.id}`;
    const stored = localStorage.getItem(userStorageKey);
    return stored ? JSON.parse(stored) : {
      user: null,
      worm: null,
      trainings: defaultTrainings,
      jobs: defaultJobs,
      jobAssignments: [],
      dailyJobsCompleted: 0,
      inventory: [],
      shopItems: defaultShopItems,
      leaderboard: []
    };
  });

  const { toast } = useToast();

  // Load user-specific data when auth user changes
  useEffect(() => {
    if (!authUser) {
      setGameState({
        user: null,
        worm: null,
        trainings: defaultTrainings,
        jobs: defaultJobs,
        jobAssignments: [],
        dailyJobsCompleted: 0,
        inventory: [],
        shopItems: defaultShopItems,
        leaderboard: []
      });
      return;
    }

    const userStorageKey = `worm-daycare-data-${authUser.id}`;
    const stored = localStorage.getItem(userStorageKey);
    if (stored) {
      setGameState(JSON.parse(stored));
    }
  }, [authUser]);

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    if (authUser) {
      const userStorageKey = `worm-daycare-data-${authUser.id}`;
      localStorage.setItem(userStorageKey, JSON.stringify(gameState));
    }
  }, [gameState, authUser]);

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

  // Create new user and worm
  const createUserAndWorm = (username: string, wormName: string) => {
    const user = createInitialUser(username);
    const worm = createInitialWorm(wormName);
    
    setGameState(prev => ({
      ...prev,
      user: { ...user, wormId: worm.id },
      worm
    }));
    
    toast({
      title: "Üdvözöllek!",
      description: `${wormName} kukac sikeresen létrehozva!`
    });
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
        training.statFocus === 'agility' ? 'Ügyesség' : 
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
      const statValue = worm[stat as keyof Pick<Worm, 'strength' | 'agility' | 'endurance' | 'stamina' | 'intelligence' | 'charisma'>] as number;
      if (statValue < (required as number)) {
        const statName = stat === 'strength' ? 'Erő' : 
          stat === 'agility' ? 'Ügyesség' : 
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
      agility: worm.agility + (effects.agility || 0),
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
    let totalStats = {
      strength: worm.strength,
      agility: worm.agility,
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
          totalStats.agility += item.statBonus.agility || 0;
          totalStats.endurance += item.statBonus.endurance || 0;
          totalStats.stamina += item.statBonus.stamina || 0;
          totalStats.intelligence += item.statBonus.intelligence || 0;
          totalStats.charisma += item.statBonus.charisma || 0;
        }
      }
    });

    return totalStats;
  };

  return {
    gameState,
    createUserAndWorm,
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
    isLoggedIn: !!gameState.user && !!gameState.worm,
    isAuthenticated
  };
};