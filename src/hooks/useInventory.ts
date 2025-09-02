import { GameState, Worm, Item } from '../types/game';

export const useInventory = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  toast: (opts: { title: string; description: string; variant?: string }) => void
) => {
  // Buy item from shop
  const buyItem = (itemId: string) => {
    const item = gameState.shopItems.find(i => i.id === itemId);
    if (!item || !gameState.worm) return;

    const worm = gameState.worm;

    // Check if player has enough coins
    if (worm.coins < item.price) {
      toast({
        title: 'Nincs elég érme!',
        description: `${item.nameHu} ${item.price} érmét igényel.`,
        variant: 'destructive'
      });
      return;
    }

    // Check level requirement for equipment
    if (item.level && worm.level < item.level) {
      toast({
        title: 'Túl alacsony szint!',
        description: `${item.nameHu} ${item.level}. szintet igényel.`,
        variant: 'destructive'
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
      title: 'Vásárlás sikeres!',
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
        title: 'Nem használható!',
        description: 'Ez a tárgy nem használható fel.',
        variant: 'destructive'
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
      title: 'Tárgy használva!',
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
        title: 'Hiba!',
        description: 'Ismeretlen felszerelés típus.',
        variant: 'destructive'
      });
      return;
    }

    // Check level requirement
    if (item.level && worm.level < item.level) {
      toast({
        title: 'Túl alacsony szint!',
        description: `${item.nameHu} ${item.level}. szintet igényel.`,
        variant: 'destructive'
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
      title: 'Felszerelés felöltve!',
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
      title: 'Felszerelés levéve!',
      description: 'Tárgy sikeresen levéve.'
    });
  };

  const sellItemToShop = (itemId: string) => {
    const inventoryItem = gameState.inventory.find(inv => inv.itemId === itemId);
    const item = gameState.shopItems.find(i => i.id === itemId);
    if (!inventoryItem || !item || !gameState.worm) return;

    const ranges: Record<Item['rarity'], [number, number]> = {
      common: [30, 50],
      rare: [50, 75],
      epic: [75, 90],
      legendary: [90, 100],
    };
    const [min, max] = ranges[item.rarity];
    const price = Math.floor(Math.random() * (max - min + 1)) + min;

    const updatedInventory = inventoryItem.quantity === 1
      ? gameState.inventory.filter(inv => inv.itemId !== itemId)
      : gameState.inventory.map(inv =>
          inv.itemId === itemId ? { ...inv, quantity: inv.quantity - 1 } : inv
        );

    const updatedWorm: Worm = {
      ...gameState.worm,
      coins: gameState.worm.coins + price,
      lastUpdated: Date.now(),
    };

    setGameState(prev => ({
      ...prev,
      worm: updatedWorm,
      inventory: updatedInventory,
    }));

    toast({ title: 'Eladva!', description: `${item.nameHu} eladva ${price} érméért.` });
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

  return {
    buyItem,
    useItem,
    equipItem,
    unequipItem,
    sellItemToShop,
    getTotalStats
  };
};

export type InventoryHook = ReturnType<typeof useInventory>;
