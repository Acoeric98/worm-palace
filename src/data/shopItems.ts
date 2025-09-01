import { Item } from '../types/game';

// Equipment item templates for random generation
export const equipmentTemplates = {
  // Helmets
  helmets: [
    { nameHu: 'Csápdíszes Sisak', icon: '⛑️' },
    { nameHu: 'Kitinkorona', icon: '👑' },
    { nameHu: 'Szárnyfedő Kupak', icon: '🪖' },
    { nameHu: 'Bogárfej Sisak', icon: '🪲' },
    { nameHu: 'Szegmenscsuklya', icon: '🎭' },
    { nameHu: 'Torvédő Sisak', icon: '⛑️' },
    { nameHu: 'Szarvacska Sisak', icon: '🦏' },
    { nameHu: 'Csillogó Fejhéj', icon: '✨' },
    { nameHu: 'Kitinkupola', icon: '🎪' },
    { nameHu: 'Bogárszarv Sisak', icon: '🪲' },
    { nameHu: 'Csápcsőr Sisak', icon: '🦑' },
    { nameHu: 'Páncélozott Fejhéj', icon: '🛡️' },
    { nameHu: 'Szárnykupak', icon: '🪶' },
    { nameHu: 'Szegmenskorona', icon: '👑' },
    { nameHu: 'Torcsuklya', icon: '🎭' },
    { nameHu: 'Csillogó Sisakocska', icon: '✨' },
    { nameHu: 'Kitinburok Sisak', icon: '🥽' },
    { nameHu: 'Szarvfej Védő', icon: '🦏' },
    { nameHu: 'Bogárkorona', icon: '🪲' },
    { nameHu: 'Csápfejfedő', icon: '🦑' }
  ],

  // Chest armor
  chestpieces: [
    { nameHu: 'Kitinpajzs Mellvas', icon: '🛡️' },
    { nameHu: 'Szárnyfedő Vértezet', icon: '🪶' },
    { nameHu: 'Bogárhéj Mellvért', icon: '🪲' },
    { nameHu: 'Csáprágó Vért', icon: '🦑' },
    { nameHu: 'Szegmenspáncél', icon: '🛡️' },
    { nameHu: 'Potrohpajzs', icon: '🪖' },
    { nameHu: 'Torpáncél', icon: '⚔️' },
    { nameHu: 'Szarvbogár Mellvas', icon: '🦏' },
    { nameHu: 'Lárvaburok Vért', icon: '🐛' },
    { nameHu: 'Páncélszárny Mellvért', icon: '🪶' },
    { nameHu: 'Csillogó Kitinbunda', icon: '✨' },
    { nameHu: 'Pikkelytor Páncél', icon: '🐍' },
    { nameHu: 'Pajzsocska Mellvért', icon: '🛡️' },
    { nameHu: 'Csápcsont Vértezet', icon: '🦑' },
    { nameHu: 'Bogárszárny Mellvas', icon: '🪲' },
    { nameHu: 'Szegmensbunda', icon: '🧥' },
    { nameHu: 'Torveret Mellpáncél', icon: '⚔️' },
    { nameHu: 'Szarvacska Vértezet', icon: '🦏' },
    { nameHu: 'Csápveret Mellvas', icon: '🦑' },
    { nameHu: 'Páncélszárny Vért', icon: '🪶' }
  ],

  // Gloves/Accessories
  gloves: [
    { nameHu: 'Kitinkarom', icon: '🪝' },
    { nameHu: 'Csápmarkoló', icon: '🦑' },
    { nameHu: 'Szegmenskesztyű', icon: '🧤' },
    { nameHu: 'Bogárkarom Kesztyű', icon: '🪲' },
    { nameHu: 'Szarvujj Páncél', icon: '🦏' },
    { nameHu: 'Szárnyfogó Kesztyű', icon: '🪶' },
    { nameHu: 'Torujj Kesztyű', icon: '⚔️' },
    { nameHu: 'Csillogó Páncélkesztyű', icon: '✨' },
    { nameHu: 'Kitinujjak', icon: '🪝' },
    { nameHu: 'Bogárfogás', icon: '🪲' },
    { nameHu: 'Csápkarom', icon: '🦑' },
    { nameHu: 'Szegmensmarkoló', icon: '🧤' },
    { nameHu: 'Szarvacska Kesztyű', icon: '🦏' },
    { nameHu: 'Bogárszárny Kesztyű', icon: '🪲' },
    { nameHu: 'Torcsapás', icon: '⚔️' },
    { nameHu: 'Pikkelykesztyű', icon: '🐍' },
    { nameHu: 'Kitinujjacskák', icon: '🪝' },
    { nameHu: 'Csillogó Karomkesztyű', icon: '✨' },
    { nameHu: 'Bogárpajzs Kesztyű', icon: '🪲' },
    { nameHu: 'Csápdíszes Kesztyű', icon: '🦑' }
  ],

  // Weapons
  weapons: {
    swords: [
      { nameHu: 'Kitinkard', icon: '⚔️' },
      { nameHu: 'Torpenge', icon: '🗡️' },
      { nameHu: 'Csápzúzó Kard', icon: '🦑' },
      { nameHu: 'Kitinvágó Kard', icon: '⚔️' },
      { nameHu: 'Bogárpenge', icon: '🪲' },
      { nameHu: 'Szarvkard', icon: '🦏' },
      { nameHu: 'Szegmenspenge', icon: '🗡️' },
      { nameHu: 'Kitinvértkard', icon: '⚔️' },
      { nameHu: 'Bogárszárny Penge', icon: '🪲' },
      { nameHu: 'Csillogó Kardocska', icon: '✨' },
      { nameHu: 'Szarvcsapás Kard', icon: '🦏' }
    ],
    daggers: [
      { nameHu: 'Csáptőr', icon: '🗡️' },
      { nameHu: 'Kitinkés', icon: '🔪' },
      { nameHu: 'Lárvaszúró', icon: '🪡' },
      { nameHu: 'Szegmenspenge', icon: '🗡️' },
      { nameHu: 'Potrohvágó', icon: '🔪' },
      { nameHu: 'Bogárfog Tőr', icon: '🪲' },
      { nameHu: 'Szarvacska Tőr', icon: '🦏' },
      { nameHu: 'Csillogó Tőr', icon: '✨' },
      { nameHu: 'Kitindöfő', icon: '🗡️' },
      { nameHu: 'Csáppenge', icon: '🦑' },
      { nameHu: 'Bogárkarom Tőr', icon: '🪲' },
      { nameHu: 'Szegmenskés', icon: '🔪' },
      { nameHu: 'Lárvavágó', icon: '🪡' },
      { nameHu: 'Kitinkarmok', icon: '🪝' },
      { nameHu: 'Bogárhegyű Tőr', icon: '🪲' },
      { nameHu: 'Szárnyvágó Kés', icon: '🪶' },
      { nameHu: 'Csillogó Pengetőr', icon: '✨' },
      { nameHu: 'Szegmensszúró', icon: '🪡' },
      { nameHu: 'Szarvtőr', icon: '🦏' }
    ],
    bows: [
      { nameHu: 'Bogárszárny Íj', icon: '🏹' },
      { nameHu: 'Szárnyvető Íj', icon: '🪶' },
      { nameHu: 'Kitinnyílvető', icon: '🏹' },
      { nameHu: 'Bogárszárny Kusza', icon: '🏹' },
      { nameHu: 'Szarvhegyű Nyílvető', icon: '🦏' },
      { nameHu: 'Kitiníj', icon: '🏹' },
      { nameHu: 'Bogárhegyű Nyílvető', icon: '🪲' },
      { nameHu: 'Szegmensdobó', icon: '🏹' },
      { nameHu: 'Szárnygerely Kusza', icon: '🪶' },
      { nameHu: 'Csillogó Nyílpuska', icon: '✨' },
      { nameHu: 'Toríj', icon: '🏹' },
      { nameHu: 'Bogárkaróvető', icon: '🪲' },
      { nameHu: 'Kitinbolygó Íj', icon: '🏹' },
      { nameHu: 'Csápnyílvető', icon: '🦑' },
      { nameHu: 'Szegmenscsúzli', icon: '🏹' },
      { nameHu: 'Potrohlövő', icon: '🏹' },
      { nameHu: 'Szárnyhegyű Kusza', icon: '🪶' },
      { nameHu: 'Bogárszárny Vető', icon: '🪲' }
    ],
    hammers: [
      { nameHu: 'Páncélszárny Pöröly', icon: '🔨' },
      { nameHu: 'Bogárzúzó Pöröly', icon: '🪲' },
      { nameHu: 'Kitinzúzó Pöröly', icon: '🔨' },
      { nameHu: 'Szarvtörő Buzogány', icon: '🦏' },
      { nameHu: 'Páncélszárny Kalapács', icon: '🔨' },
      { nameHu: 'Szegmenscsapó', icon: '🔨' },
      { nameHu: 'Bogárfej Zúzó', icon: '🪲' },
      { nameHu: 'Torromboló Pöröly', icon: '🔨' },
      { nameHu: 'Kitinverő Kalapács', icon: '🔨' },
      { nameHu: 'Szárnytörő Pöröly', icon: '🪶' },
      { nameHu: 'Potrohzúzó', icon: '🔨' },
      { nameHu: 'Csillogó Nagypöröly', icon: '✨' },
      { nameHu: 'Kitintörő Kalapács', icon: '🔨' },
      { nameHu: 'Bogárromboló', icon: '🪲' },
      { nameHu: 'Kitinóriás Pöröly', icon: '🔨' },
      { nameHu: 'Bogárerő Kalapács', icon: '🪲' },
      { nameHu: 'Szárnyzúzó', icon: '🪶' },
      { nameHu: 'Szegmensóriás', icon: '🔨' }
    ],
    staves: [
      { nameHu: 'Kitinoltár Bot', icon: '🪄' },
      { nameHu: 'Torjel Botocska', icon: '🪄' },
      { nameHu: 'Kitinrelikvia', icon: '🪄' },
      { nameHu: 'Bogárszent Bot', icon: '🪲' },
      { nameHu: 'Szárnyoltár Bot', icon: '🪶' },
      { nameHu: 'Bogárhívő Bot', icon: '🪲' },
      { nameHu: 'Szegmensoltár', icon: '🪄' },
      { nameHu: 'Torpálca', icon: '🪄' },
      { nameHu: 'Kitinrúd', icon: '🪄' }
    ]
  }
};

// Generate random equipment item
export const generateRandomEquipment = (tier: 'low' | 'mid-bottom' | 'mid-top' | 'high-bottom' | 'high-middle' | 'high-top'): Item => {
  // Determine rarity based on tier
  let rarity: 'common' | 'rare' | 'epic' | 'legendary';
  let statMultiplier: number;
  let level: number;

  switch (tier) {
    case 'low':
      rarity = Math.random() < 0.8 ? 'common' : 'rare';
      statMultiplier = 1;
      level = Math.floor(Math.random() * 3) + 1; // 1-3
      break;
    case 'mid-bottom':
      rarity = Math.random() < 0.6 ? 'common' : 'rare';
      statMultiplier = 1.5;
      level = Math.floor(Math.random() * 3) + 3; // 3-5
      break;
    case 'mid-top':
      rarity = Math.random() < 0.4 ? 'rare' : 'epic';
      statMultiplier = 2;
      level = Math.floor(Math.random() * 3) + 5; // 5-7
      break;
    case 'high-bottom':
      rarity = Math.random() < 0.3 ? 'rare' : 'epic';
      statMultiplier = 2.5;
      level = Math.floor(Math.random() * 3) + 7; // 7-9
      break;
    case 'high-middle':
      rarity = Math.random() < 0.2 ? 'epic' : 'legendary';
      statMultiplier = 3;
      level = Math.floor(Math.random() * 3) + 9; // 9-11
      break;
    case 'high-top':
      rarity = 'legendary';
      statMultiplier = 4;
      level = Math.floor(Math.random() * 5) + 12; // 12-16
      break;
  }

  // Choose equipment type
  const equipmentTypes = ['helmet', 'armor', 'accessory', 'weapon'];
  const equipmentType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];

  let template: { nameHu: string; icon: string };
  let subType: string;

  switch (equipmentType) {
    case 'helmet':
      template = equipmentTemplates.helmets[Math.floor(Math.random() * equipmentTemplates.helmets.length)];
      subType = 'helmet';
      break;
    case 'armor':
      template = equipmentTemplates.chestpieces[Math.floor(Math.random() * equipmentTemplates.chestpieces.length)];
      subType = 'armor';
      break;
    case 'accessory':
      template = equipmentTemplates.gloves[Math.floor(Math.random() * equipmentTemplates.gloves.length)];
      subType = 'accessory';
      break;
    case 'weapon':
      const weaponTypes = Object.keys(equipmentTemplates.weapons);
      const weaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
      const weaponArray = equipmentTemplates.weapons[weaponType as keyof typeof equipmentTemplates.weapons];
      template = weaponArray[Math.floor(Math.random() * weaponArray.length)];
      subType = 'weapon';
      break;
    default:
      template = equipmentTemplates.helmets[0];
      subType = 'helmet';
  }

  // Generate random stats
  const statTypes = ['strength', 'dexterity', 'endurance', 'stamina', 'intelligence', 'charisma'];
  const statBonus: Record<string, number> = {};
  
  // Number of stats based on rarity
  const numStats = rarity === 'common' ? 1 : 
                   rarity === 'rare' ? 2 : 
                   rarity === 'epic' ? 3 : 4;

  const shuffledStats = [...statTypes].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < numStats; i++) {
    const stat = shuffledStats[i];
    const baseValue = Math.floor(Math.random() * 3) + 1; // 1-3 base
    statBonus[stat] = Math.ceil(baseValue * statMultiplier);
  }

  // Generate unique ID
  const id = `${template.nameHu.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    name: template.nameHu, // Using Hungarian as English name too for now
    nameHu: template.nameHu,
    description: `A ${rarity} piece of equipment found during exploration.`,
    descriptionHu: `Egy ${rarity === 'common' ? 'közönséges' : rarity === 'rare' ? 'ritka' : rarity === 'epic' ? 'epikus' : 'legendás'} felszerelés, amit felfedezés során találtak.`,
    type: 'equipment',
    subType: subType as any,
    price: Math.floor(level * 50 * (rarity === 'common' ? 1 : rarity === 'rare' ? 2 : rarity === 'epic' ? 4 : 8)),
    rarity,
    icon: template.icon,
    statBonus,
    level
  };
};

export const defaultShopItems: Item[] = [
  // Only keep basic consumables in shop
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
  },
  
  // Just a few basic starter equipment pieces
  {
    id: 'basic_helmet',
    name: 'Basic Helmet',
    nameHu: 'Alapvető Sisak',
    description: 'A simple helmet for beginners.',
    descriptionHu: 'Egyszerű sisak kezdőknek.',
    type: 'equipment',
    subType: 'helmet',
    price: 50,
    rarity: 'common',
    icon: '⛑️',
    statBonus: {
      endurance: 1
    },
    level: 1
  },
  {
    id: 'basic_sword',
    name: 'Basic Sword',
    nameHu: 'Alapvető Kard',
    description: 'A simple sword for beginners.',
    descriptionHu: 'Egyszerű kard kezdőknek.',
    type: 'equipment',
    subType: 'weapon',
    price: 60,
    rarity: 'common',
    icon: '⚔️',
    statBonus: {
      strength: 2
    },
    level: 1
  }
];
