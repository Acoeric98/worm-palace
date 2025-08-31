import { useState, useEffect } from 'react';
import { GameState, Worm, User, Training, Job, JobAssignment, getXpRequiredForLevel, getDiminishingMultiplier, DAILY_JOB_LIMIT } from '../types/game';
import { defaultTrainings } from '../data/trainings';
import { defaultJobs } from '../data/jobs';
import { useToast } from './use-toast';
import defaultWormImage from '../assets/default-worm.png';

const STORAGE_KEY = 'worm-daycare-data';

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
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      user: null,
      worm: null,
      trainings: defaultTrainings,
      jobs: defaultJobs,
      jobAssignments: [],
      dailyJobsCompleted: 0,
      leaderboard: []
    };
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

  return {
    gameState,
    createUserAndWorm,
    executeTrain,
    acceptJob,
    completeJob,
    updateWormProfile,
    isTrainingAvailable,
    getTrainingCooldown,
    isLoggedIn: !!gameState.user && !!gameState.worm
  };
};