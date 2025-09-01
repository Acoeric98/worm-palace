import { Item } from '../types/game';

export const defaultShopItems: Item[] = [
  // Energy items
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    nameHu: 'Energia Ital',
    description: 'A refreshing drink that restores 20 energy points.',
    descriptionHu: 'Frissítő ital, ami 20 energia pontot visszaad.',
    type: 'consumable',
    subType: 'energy',
    price: 10,
    rarity: 'common',
    icon: '🥤',
    effects: {
      energy: 20
    }
  },
  {
    id: 'super_energy',
    name: 'Super Energy Boost',
    nameHu: 'Szuper Energia Támogató',
    description: 'A powerful energy booster that restores 50 energy points.',
    descriptionHu: 'Erős energia segítő, ami 50 energia pontot visszaad.',
    type: 'consumable',
    subType: 'energy',
    price: 25,
    rarity: 'rare',
    icon: '⚡',
    effects: {
      energy: 50
    }
  },
  
  // Health and mood items
  {
    id: 'health_potion',
    name: 'Health Potion',
    nameHu: 'Gyógyital',
    description: 'Heals your worm and restores 30 health points.',
    descriptionHu: 'Meggyógyítja a kukacod és 30 egészség pontot ad vissza.',
    type: 'consumable',
    subType: 'energy',
    price: 15,
    rarity: 'common',
    icon: '🧪',
    effects: {
      health: 30
    }
  },
  {
    id: 'mood_candy',
    name: 'Mood Candy',
    nameHu: 'Hangulat Cukorka',
    description: 'Sweet candy that improves your worm\'s mood by 25 points.',
    descriptionHu: 'Édes cukorka, ami 25 ponttal javítja a kukac hangulatát.',
    type: 'consumable',
    subType: 'energy',
    price: 8,
    rarity: 'common',
    icon: '🍭',
    effects: {
      mood: 25
    }
  },
  
  // Equipment
  {
    id: 'iron_helmet',
    name: 'Iron Helmet',
    nameHu: 'Vas Sisak',
    description: 'A sturdy helmet that increases endurance.',
    descriptionHu: 'Erős sisak, ami növeli a kitartást.',
    type: 'equipment',
    subType: 'helmet',
    price: 100,
    rarity: 'common',
    icon: '⛑️',
    statBonus: {
      endurance: 2
    },
    level: 3
  },
  {
    id: 'strength_gauntlets',
    name: 'Strength Gauntlets',
    nameHu: 'Erő Kesztyűk',
    description: 'Heavy gauntlets that boost your strength.',
    descriptionHu: 'Nehéz kesztyűk, amik növelik az erődet.',
    type: 'equipment',
    subType: 'accessory',
    price: 80,
    rarity: 'common',
    icon: '🥊',
    statBonus: {
      strength: 2
    },
    level: 2
  },
  {
    id: 'agility_boots',
    name: 'Agility Boots',
    nameHu: 'Ügyesség Csizma',
    description: 'Light boots that enhance agility and speed.',
    descriptionHu: 'Könnyű csizma, ami növeli az ügyességet és sebességet.',
    type: 'equipment',
    subType: 'armor',
    price: 120,
    rarity: 'rare',
    icon: '👢',
    statBonus: {
      dexterity: 3
    },
    level: 4
  },
  {
    id: 'wisdom_amulet',
    name: 'Wisdom Amulet',
    nameHu: 'Bölcsesség Amulett',
    description: 'An ancient amulet that enhances intelligence.',
    descriptionHu: 'Ősi amulett, ami növeli az intelligenciát.',
    type: 'equipment',
    subType: 'accessory',
    price: 150,
    rarity: 'epic',
    icon: '🔮',
    statBonus: {
      intelligence: 4
    },
    level: 5
  },
  
  // Stat boost consumables
  {
    id: 'protein_shake',
    name: 'Protein Shake',
    nameHu: 'Protein Turmix',
    description: 'Temporarily boosts strength by 1 point.',
    descriptionHu: 'Átmenetileg 1 ponttal növeli az erőt.',
    type: 'consumable',
    subType: 'stat_boost',
    price: 30,
    rarity: 'rare',
    icon: '🥛',
    effects: {
      strength: 1
    }
  },
  {
    id: 'brain_food',
    name: 'Brain Food',
    nameHu: 'Agy Étel',
    description: 'Nutritious food that permanently boosts intelligence.',
    descriptionHu: 'Tápláló étel, ami tartósan növeli az intelligenciát.',
    type: 'consumable',
    subType: 'stat_boost',
    price: 50,
    rarity: 'epic',
    icon: '🧠',
    effects: {
      intelligence: 1
    }
  }
];