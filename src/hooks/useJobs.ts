import { GameState, Worm, JobAssignment, getXpRequiredForLevel, DAILY_JOB_LIMIT } from '../types/game';

export const useJobs = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  toast: (opts: { title: string; description: string; variant?: string }) => void
) => {
  // Accept a job
  const acceptJob = (jobId: string) => {
    const job = gameState.jobs.find(j => j.id === jobId);
    if (!job || !gameState.worm) return;

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

    // Check daily job limit
    const today = new Date().toDateString();
    const todayAssignments = gameState.jobAssignments.filter(ja =>
      new Date(ja.startedAt).toDateString() === today
    );

    if (todayAssignments.length >= DAILY_JOB_LIMIT) {
      toast({
        title: 'Napi limit elérve!',
        description: `Ma már ${DAILY_JOB_LIMIT} munkát végeztél el.`,
        variant: 'destructive'
      });
      return;
    }

    // Check level requirement
    if (worm.level < job.minLevel) {
      toast({
        title: 'Túl alacsony szint!',
        description: `${job.nameHu} ${job.minLevel}. szintet igényel.`,
        variant: 'destructive'
      });
      return;
    }

    // Check energy
    if (worm.energy < job.energyCost) {
      toast({
        title: 'Nincs elég energia!',
        description: `${job.nameHu} ${job.energyCost} energiát igényel.`,
        variant: 'destructive'
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
          title: 'Nem elég magas stat!',
          description: `${job.nameHu} ${required} ${statName}-t igényel.`,
          variant: 'destructive'
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

    // Daily counter for mood penalty
    const jobCounter = worm.dailyCounters[`job_${jobId}`];
    const jobCount = jobCounter?.date === today ? jobCounter.count : 0;
    const moodPenalty = 5 + jobCount * 2;

    // Deduct energy immediately and apply mood change
    const updatedWorm: Worm = {
      ...worm,
      energy: worm.energy - job.energyCost,
      mood: Math.max(0, worm.mood - moodPenalty),
      currentActivity: {
        type: 'job',
        endsAt: Date.now() + job.durationMinutes * 60 * 1000
      },
      dailyCounters: {
        ...worm.dailyCounters,
        [`job_${jobId}`]: { date: today, count: jobCount + 1 }
      },
      lastUpdated: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm,
      jobAssignments: [...prev.jobAssignments, assignment]
    }));

    toast({
      title: 'Munka elfogadva!',
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
        title: 'Még nem fejezhető be!',
        description: `${remainingMinutes} perc van hátra.`,
        variant: 'destructive'
      });
      return;
    }

    const worm = gameState.worm;

    // Update worm with rewards
    const updatedWorm: Worm = {
      ...worm,
      coins: worm.coins + job.rewardCoins,
      xp: worm.xp + job.rewardXp,
      currentActivity: undefined,
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
      title: 'Munka befejezve! 💰',
      description: `+${job.rewardCoins} érme, +${job.rewardXp} XP`
    });
  };

  return { acceptJob, completeJob };
};

export type JobsHook = ReturnType<typeof useJobs>;
