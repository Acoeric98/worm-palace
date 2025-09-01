import { Item } from '../types/game';

export const defaultShopItems: Item[] = [
  // Energy and consumable items
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

  // === HELMETS ===
  // Low tier helmets (Level 1-3)
  {
    id: 'csapdiszes_sisak',
    name: 'Tentacle-Adorned Helmet',
    nameHu: 'Csápdíszes Sisak',
    description: 'A simple helmet decorated with dried tentacles.',
    descriptionHu: 'Egyszerű sisak szárított csápokkal díszítve.',
    type: 'equipment',
    subType: 'helmet',
    price: 45,
    rarity: 'common',
    icon: '⛑️',
    statBonus: {
      endurance: 1,
      intelligence: 1
    },
    level: 1
  },
  {
    id: 'kitinkorona',
    name: 'Chitin Crown',
    nameHu: 'Kitinkorona',
    description: 'A lightweight crown made from polished chitin.',
    descriptionHu: 'Könnyű korona fényezett kitinből.',
    type: 'equipment',
    subType: 'helmet',
    price: 80,
    rarity: 'common',
    icon: '👑',
    statBonus: {
      charisma: 2,
      intelligence: 1
    },
    level: 2
  },
  {
    id: 'szarnyfedo_kupak',
    name: 'Wing Cover Cap',
    nameHu: 'Szárnyfedő Kupak',
    description: 'A cap made from wing covers that provides good protection.',
    descriptionHu: 'Szárnyborításból készült kupak, ami jó védelmet nyújt.',
    type: 'equipment',
    subType: 'helmet',
    price: 120,
    rarity: 'common',
    icon: '🪖',
    statBonus: {
      endurance: 2,
      dexterity: 1
    },
    level: 3
  },

  // Mid tier helmets (Level 4-6)
  {
    id: 'bogarfej_sisak',
    name: 'Beetle Head Helmet',
    nameHu: 'Bogárfej Sisak',
    description: 'A helmet shaped like a beetle head, intimidating foes.',
    descriptionHu: 'Bogárfej formájú sisak, ami megijeszti az ellenfeleket.',
    type: 'equipment',
    subType: 'helmet',
    price: 200,
    rarity: 'rare',
    icon: '🪲',
    statBonus: {
      strength: 2,
      endurance: 2,
      charisma: 1
    },
    level: 4
  },
  {
    id: 'csillogo_fejhej',
    name: 'Gleaming Head Shell',
    nameHu: 'Csillogó Fejhéj',
    description: 'A shimmering head shell that reflects light beautifully.',
    descriptionHu: 'Csillogó fejhéj, ami gyönyörűen veri vissza a fényt.',
    type: 'equipment',
    subType: 'helmet',
    price: 300,
    rarity: 'rare',
    icon: '✨',
    statBonus: {
      intelligence: 3,
      charisma: 2,
      dexterity: 1
    },
    level: 5
  },

  // High tier helmets (Level 7+)
  {
    id: 'bogarszarv_sisak',
    name: 'Beetle Horn Helmet',
    nameHu: 'Bogárszarv Sisak',
    description: 'A powerful helmet adorned with massive beetle horns.',
    descriptionHu: 'Erős sisak hatalmas bogárszarvakkal díszítve.',
    type: 'equipment',
    subType: 'helmet',
    price: 500,
    rarity: 'epic',
    icon: '🦏',
    statBonus: {
      strength: 4,
      endurance: 3,
      stamina: 2
    },
    level: 7
  },

  // === CHEST PIECES ===
  // Low tier chest (Level 1-3)
  {
    id: 'kitinpajzs_mellvas',
    name: 'Chitin Shield Chestplate',
    nameHu: 'Kitinpajzs Mellvas',
    description: 'Basic armor made from hardened chitin plates.',
    descriptionHu: 'Alapvető páncél edzett kitinlemezekből.',
    type: 'equipment',
    subType: 'armor',
    price: 60,
    rarity: 'common',
    icon: '🛡️',
    statBonus: {
      endurance: 2,
      strength: 1
    },
    level: 1
  },
  {
    id: 'szarnyfedo_vertezet',
    name: 'Wing Cover Armor',
    nameHu: 'Szárnyfedő Vértezet',
    description: 'Flexible armor crafted from beetle wing covers.',
    descriptionHu: 'Rugalmas páncél bogárszárny fedőkből készítve.',
    type: 'equipment',
    subType: 'armor',
    price: 100,
    rarity: 'common',
    icon: '🪲',
    statBonus: {
      dexterity: 2,
      endurance: 1,
      stamina: 1
    },
    level: 2
  },

  // Mid tier chest (Level 4-6)
  {
    id: 'csaprago_vert',
    name: 'Tentacle Bite Armor',
    nameHu: 'Csáprágó Vért',
    description: 'Armor reinforced with sharp tentacle spikes.',
    descriptionHu: 'Páncél éles csáptüskékkel megerősítve.',
    type: 'equipment',
    subType: 'armor',
    price: 250,
    rarity: 'rare',
    icon: '🦑',
    statBonus: {
      strength: 3,
      endurance: 2,
      dexterity: 1
    },
    level: 4
  },
  {
    id: 'szegmenspancel',
    name: 'Segment Armor',
    nameHu: 'Szegmenspáncél',
    description: 'Articulated armor that moves with your body.',
    descriptionHu: 'Csuklós páncél, ami a testeddel mozog.',
    type: 'equipment',
    subType: 'armor',
    price: 350,
    rarity: 'rare',
    icon: '🪖',
    statBonus: {
      dexterity: 3,
      stamina: 2,
      endurance: 2
    },
    level: 5
  },

  // High tier chest (Level 7+)
  {
    id: 'csillogo_kitinbunda',
    name: 'Gleaming Chitin Coat',
    nameHu: 'Csillogó Kitinbunda',
    description: 'Magnificent armor that gleams with inner light.',
    descriptionHu: 'Pompás páncél, ami belső fénnyel csillog.',
    type: 'equipment',
    subType: 'armor',
    price: 600,
    rarity: 'epic',
    icon: '✨',
    statBonus: {
      endurance: 4,
      intelligence: 3,
      charisma: 3,
      stamina: 2
    },
    level: 7
  },

  // === GLOVES ===
  // Low tier gloves (Level 1-3)
  {
    id: 'kitinkarom',
    name: 'Chitin Claws',
    nameHu: 'Kitinkarom',
    description: 'Sharp claws made from hardened chitin.',
    descriptionHu: 'Éles karmok edzett kitinből.',
    type: 'equipment',
    subType: 'accessory',
    price: 40,
    rarity: 'common',
    icon: '🪝',
    statBonus: {
      strength: 2,
      dexterity: 1
    },
    level: 1
  },
  {
    id: 'csapmarkolo',
    name: 'Tentacle Grippers',
    nameHu: 'Csápmarkoló',
    description: 'Flexible gloves that enhance grip strength.',
    descriptionHu: 'Rugalmas kesztyűk, amik növelik a fogóerőt.',
    type: 'equipment',
    subType: 'accessory',
    price: 70,
    rarity: 'common',
    icon: '🦑',
    statBonus: {
      dexterity: 2,
      strength: 1
    },
    level: 2
  },

  // Mid tier gloves (Level 4-6)
  {
    id: 'bogarkarom_kesztyu',
    name: 'Beetle Claw Gloves',
    nameHu: 'Bogárkarom Kesztyű',
    description: 'Gloves with retractable beetle claws.',
    descriptionHu: 'Kesztyűk behúzható bogárkarmokkal.',
    type: 'equipment',
    subType: 'accessory',
    price: 180,
    rarity: 'rare',
    icon: '🪲',
    statBonus: {
      strength: 3,
      dexterity: 2
    },
    level: 4
  },
  {
    id: 'csillogo_pancel_kesztyu',
    name: 'Gleaming Armored Gloves',
    nameHu: 'Csillogó Páncélkesztyű',
    description: 'Beautifully crafted armored gloves.',
    descriptionHu: 'Gyönyörűen megmunkált páncélkesztyűk.',
    type: 'equipment',
    subType: 'accessory',
    price: 280,
    rarity: 'rare',
    icon: '✨',
    statBonus: {
      dexterity: 3,
      endurance: 2,
      charisma: 1
    },
    level: 5
  },

  // === WEAPONS ===
  // Swords
  {
    id: 'kitinkard',
    name: 'Chitin Sword',
    nameHu: 'Kitinkard',
    description: 'A sturdy sword forged from chitin.',
    descriptionHu: 'Erős kard kitinből kovácsolva.',
    type: 'equipment',
    subType: 'weapon',
    price: 90,
    rarity: 'common',
    icon: '⚔️',
    statBonus: {
      strength: 3,
      dexterity: 1
    },
    level: 2
  },
  {
    id: 'bogar_penge',
    name: 'Beetle Blade',
    nameHu: 'Bogárpenge',
    description: 'A razor-sharp blade with beetle motifs.',
    descriptionHu: 'Borotvaéles penge bogár díszítéssel.',
    type: 'equipment',
    subType: 'weapon',
    price: 200,
    rarity: 'rare',
    icon: '🗡️',
    statBonus: {
      strength: 4,
      dexterity: 2,
      charisma: 1
    },
    level: 4
  },
  {
    id: 'szarvkard',
    name: 'Horn Sword',
    nameHu: 'Szarvkard',
    description: 'A powerful sword made from giant beetle horn.',
    descriptionHu: 'Erős kard óriás bogárszarvból.',
    type: 'equipment',
    subType: 'weapon',
    price: 400,
    rarity: 'epic',
    icon: '🦏',
    statBonus: {
      strength: 5,
      endurance: 2,
      dexterity: 1
    },
    level: 6
  },

  // Daggers
  {
    id: 'csaptor',
    name: 'Tentacle Dagger',
    nameHu: 'Csáptőr',
    description: 'A quick dagger shaped like a tentacle.',
    descriptionHu: 'Gyors tőr csáp alakban.',
    type: 'equipment',
    subType: 'weapon',
    price: 50,
    rarity: 'common',
    icon: '🗡️',
    statBonus: {
      dexterity: 3,
      strength: 1
    },
    level: 1
  },
  {
    id: 'larvaszuro',
    name: 'Larva Piercer',
    nameHu: 'Lárvaszúró',
    description: 'A thin piercing dagger designed for precision.',
    descriptionHu: 'Vékony szúró tőr precíziós munkához.',
    type: 'equipment',
    subType: 'weapon',
    price: 80,
    rarity: 'common',
    icon: '🪡',
    statBonus: {
      dexterity: 4,
      intelligence: 1
    },
    level: 2
  },

  // Bows
  {
    id: 'bogarszarny_ij',
    name: 'Beetle Wing Bow',
    nameHu: 'Bogárszárny Íj',
    description: 'A bow crafted from flexible beetle wings.',
    descriptionHu: 'Íj rugalmas bogárszárnyakból készítve.',
    type: 'equipment',
    subType: 'weapon',
    price: 120,
    rarity: 'common',
    icon: '🏹',
    statBonus: {
      dexterity: 4,
      stamina: 1
    },
    level: 3
  },
  {
    id: 'kitinnyilveto',
    name: 'Chitin Crossbow',
    nameHu: 'Kitinnyílvető',
    description: 'A powerful crossbow with chitin frame.',
    descriptionHu: 'Erős számszeríj kitin kerettel.',
    type: 'equipment',
    subType: 'weapon',
    price: 250,
    rarity: 'rare',
    icon: '🏹',
    statBonus: {
      dexterity: 5,
      strength: 2
    },
    level: 5
  },

  // Hammers
  {
    id: 'bogar_zuzo_porely',
    name: 'Beetle Crusher Hammer',
    nameHu: 'Bogárzúzó Pöröly',
    description: 'A massive hammer for crushing enemies.',
    descriptionHu: 'Hatalmas pöröly ellenfelek összezúzására.',
    type: 'equipment',
    subType: 'weapon',
    price: 300,
    rarity: 'rare',
    icon: '🔨',
    statBonus: {
      strength: 6,
      endurance: 2
    },
    level: 5
  },

  // Staves and Wands
  {
    id: 'kitin_oltar_bot',
    name: 'Chitin Altar Staff',
    nameHu: 'Kitinoltár Bot',
    description: 'A mystical staff carved from sacred chitin.',
    descriptionHu: 'Misztikus bot szent kitinből faragva.',
    type: 'equipment',
    subType: 'weapon',
    price: 180,
    rarity: 'rare',
    icon: '🪄',
    statBonus: {
      intelligence: 4,
      charisma: 2
    },
    level: 4
  },
  {
    id: 'szarnykereszt_palca',
    name: 'Wing Cross Wand',
    nameHu: 'Szárnykereszt Pálca',
    description: 'A wand blessed with wing symbols.',
    descriptionHu: 'Pálca szárny szimbólumokkal megáldva.',
    type: 'equipment',
    subType: 'weapon',
    price: 100,
    rarity: 'common',
    icon: '🪄',
    statBonus: {
      intelligence: 3,
      charisma: 1
    },
    level: 3
  },

  // === ACCESSORIES ===
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