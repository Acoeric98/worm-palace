import { TourResult, Item } from '../types/game';

// Sample items that can be found during tours
const tourItems: Item[] = [
  // Low tier items
  {
    id: 'rusty-sword',
    name: 'Rusty Sword',
    nameHu: 'Rozsdás Kard',
    description: 'An old, worn sword',
    descriptionHu: 'Egy régi, kopott kard',
    type: 'equipment',
    subType: 'weapon',
    price: 50,
    rarity: 'common',
    icon: '🗡️',
    statBonus: { strength: 2 }
  },
  {
    id: 'leather-cap',
    name: 'Leather Cap',
    nameHu: 'Bőr Sapka',
    description: 'Simple leather headgear',
    descriptionHu: 'Egyszerű bőr fejfedő',
    type: 'equipment',
    subType: 'helmet',
    price: 30,
    rarity: 'common',
    icon: '🧢',
    statBonus: { endurance: 1 }
  },
  // Mid tier items
  {
    id: 'steel-blade',
    name: 'Steel Blade',
    nameHu: 'Acél Penge',
    description: 'A sharp steel weapon',
    descriptionHu: 'Egy éles acél fegyver',
    type: 'equipment',
    subType: 'weapon',
    price: 200,
    rarity: 'rare',
    icon: '⚔️',
    statBonus: { strength: 5, dexterity: 2 }
  },
  {
    id: 'chain-mail',
    name: 'Chain Mail',
    nameHu: 'Láncing',
    description: 'Protective chain armor',
    descriptionHu: 'Védő láncpáncél',
    type: 'equipment',
    subType: 'armor',
    price: 250,
    rarity: 'rare',
    icon: '🛡️',
    statBonus: { endurance: 4, strength: 1 }
  },
  // High tier items
  {
    id: 'dragon-sword',
    name: 'Dragon Sword',
    nameHu: 'Sárkány Kard',
    description: 'A legendary blade forged from dragon scales',
    descriptionHu: 'Legendás penge sárkánypikkelyből kovácsolva',
    type: 'equipment',
    subType: 'weapon',
    price: 1000,
    rarity: 'legendary',
    icon: '🐉',
    statBonus: { strength: 10, dexterity: 5, intelligence: 3 }
  },
  {
    id: 'crown-of-wisdom',
    name: 'Crown of Wisdom',
    nameHu: 'Bölcsesség Koronája',
    description: 'Ancient crown that enhances mental abilities',
    descriptionHu: 'Ősi korona ami fokozza a szellemi képességeket',
    type: 'equipment',
    subType: 'helmet',
    price: 800,
    rarity: 'epic',
    icon: '👑',
    statBonus: { intelligence: 8, charisma: 4 }
  }
];

export const defaultTours: TourResult[] = [
  {
    id: 'forest-walk',
    name: 'Forest Walk',
    nameHu: 'Erdei Séta',
    description: 'A peaceful walk through the nearby forest',
    descriptionHu: 'Békés séta a közeli erdőben',
    duration: 5,
    energyCost: 10,
    minLevel: 1,
    tier: 'low',
    possibleItems: [tourItems[0], tourItems[1]]
  },
  {
    id: 'cave-exploration',
    name: 'Cave Exploration',
    nameHu: 'Barlang Felfedezés',
    description: 'Explore dark caves for hidden treasures',
    descriptionHu: 'Sötét barlangok felfedezése rejtett kincsekért',
    duration: 10,
    energyCost: 20,
    minLevel: 3,
    tier: 'mid-bottom',
    possibleItems: [tourItems[1], tourItems[2]]
  },
  {
    id: 'mountain-climb',
    name: 'Mountain Climb',
    nameHu: 'Hegymászás',
    description: 'Scale treacherous peaks for rare items',
    descriptionHu: 'Veszélyes csúcsok megmászása ritka tárgyakért',
    duration: 18,
    energyCost: 30,
    minLevel: 5,
    tier: 'mid-top',
    possibleItems: [tourItems[2], tourItems[3]]
  },
  {
    id: 'ancient-ruins',
    name: 'Ancient Ruins',
    nameHu: 'Ősi Romok',
    description: 'Search through mysterious ancient structures',
    descriptionHu: 'Titokzatos ősi építmények átkutatása',
    duration: 25,
    energyCost: 40,
    minLevel: 8,
    tier: 'high-bottom',
    possibleItems: [tourItems[3], tourItems[4]]
  },
  {
    id: 'dragon-lair',
    name: 'Dragon Lair',
    nameHu: 'Sárkány Odú',
    description: 'Venture into the dangerous dragon lair',
    descriptionHu: 'Veszélyes kaland a sárkány odújában',
    duration: 35,
    energyCost: 50,
    minLevel: 12,
    tier: 'high-middle',
    possibleItems: [tourItems[4], tourItems[5]]
  },
  {
    id: 'celestial-realm',
    name: 'Celestial Realm',
    nameHu: 'Égi Birodalom',
    description: 'Journey to the realm of the gods',
    descriptionHu: 'Utazás az istenek birodalmába',
    duration: 40,
    energyCost: 60,
    minLevel: 15,
    tier: 'high-top',
    possibleItems: [tourItems[5]]
  }
];