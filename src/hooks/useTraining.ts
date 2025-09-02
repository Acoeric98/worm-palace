import { GameState, Worm, getXpRequiredForLevel, getDiminishingMultiplier } from '../types/game';

export const useTraining = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  toast: (opts: { title: string; description: string; variant?: string }) => void
) => {
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

    // Prevent action if another activity is running
    if (worm.currentActivity && Date.now() < worm.currentActivity.endsAt) {
      toast({
        title: 'Már folyamatban van egy tevékenység!',
        description: 'Várd meg, míg az előző befejeződik.',
        variant: 'destructive'
      });
      return;
    }

    // Check energy
    if (worm.energy < training.energyCost) {
      toast({
        title: 'Nincs elég energia!',
        description: `${training.nameHu} ${training.energyCost} energiát igényel.`,
        variant: 'destructive'
      });
      return;
    }

    // Check coins
    if (training.coinCost && worm.coins < training.coinCost) {
      toast({
        title: 'Nincs elég érme!',
        description: `${training.nameHu} ${training.coinCost} érmét igényel.`,
        variant: 'destructive'
      });
      return;
    }

    // Check cooldown
    if (!isTrainingAvailable(trainingId)) {
      const remaining = getTrainingCooldown(trainingId);
      toast({
        title: 'Még várnod kell!',
        description: `${training.nameHu} még ${Math.ceil(remaining / 60)} perc múlva lesz elérhető.`,
        variant: 'destructive'
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

    // Mood penalty increases with repeated trainings
    const moodPenalty = 5 + todayCount * 2;

    // Update worm
    const updatedWorm: Worm = {
      ...worm,
      energy: worm.energy - training.energyCost,
      coins: worm.coins - (training.coinCost || 0),
      xp: worm.xp + actualXpGain,
      mood: Math.max(0, worm.mood - moodPenalty),
      [training.statFocus]: worm[training.statFocus] + actualStatGain,
      cooldowns: {
        ...worm.cooldowns,
        [trainingId]: Date.now() + training.cooldownSeconds * 1000
      },
      dailyCounters: {
        ...worm.dailyCounters,
        [trainingId]: { date: today, count: todayCount + 1 }
      },
      currentActivity: {
        type: 'training',
        endsAt: Date.now() + training.cooldownSeconds * 1000
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
        title: 'Szint lépés! 🎉',
        description: `${worm.name} elérte a ${newLevel}. szintet!`
      });
    }

    setGameState(prev => ({ ...prev, worm: updatedWorm }));

    toast({
      title: 'Edzés befejezve!',
      description: `+${actualStatGain} ${training.statFocus === 'strength' ? 'Erő' :
        training.statFocus === 'dexterity' ? 'Ügyesség' :
        training.statFocus === 'endurance' ? 'Kitartás' :
        training.statFocus === 'stamina' ? 'Állóképesség' :
        training.statFocus === 'intelligence' ? 'Intelligencia' : 'Karizma'}, +${actualXpGain} XP`
    });
  };

  return { isTrainingAvailable, getTrainingCooldown, executeTrain };
};

export type TrainingHook = ReturnType<typeof useTraining>;
