import { GameState, Item, getXpRequiredForLevel } from '../types/game';
import { generateRandomEquipment } from '../data/shopItems';

export const useActivities = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  toast: (opts: { title: string; description: string; variant?: string }) => void
) => {
  const randomEquipmentSubType = () => (
    ['helmet', 'armor', 'weapon', 'accessory'] as const
  )[Math.floor(Math.random() * 4)];

  const calculateLevel = (xp: number): number => {
    let level = 1;
    while (xp >= getXpRequiredForLevel(level + 1)) level++;
    return level;
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

  return { isTourAvailable, getTourCooldown, startTour, startDungeon, startRaid, startAdventure };
};

export type ActivitiesHook = ReturnType<typeof useActivities>;
