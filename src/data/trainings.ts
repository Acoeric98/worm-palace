import { Training } from '../types/game';

export const defaultTrainings: Training[] = [
  {
    id: 'mud-lifts',
    name: 'Mud Lifts',
    nameHu: 'Sár Emelés',
    description: 'Lift heavy mud clumps to build strength',
    descriptionHu: 'Nehéz sárcsomók emelése az erő növeléséért',
    energyCost: 15,
    coinCost: 5,
    xpGain: 10,
    cooldownSeconds: 300, // 5 minutes
    statFocus: 'strength',
    statGain: 2,
    icon: '💪'
  },
  {
    id: 'leaf-slalom',
    name: 'Leaf Slalom',
    nameHu: 'Levél Szlalom',
    description: 'Navigate through fallen leaves to improve agility',
    descriptionHu: 'Hulló levelek között navigálás az ügyesség fejlesztéséért',
    energyCost: 12,
    xpGain: 8,
    cooldownSeconds: 240, // 4 minutes
    statFocus: 'dexterity',
    statGain: 2,
    icon: '🍃'
  },
  {
    id: 'tunnel-run',
    name: 'Tunnel Run',
    nameHu: 'Alagút Futás',
    description: 'Dig and run through tunnels to boost stamina',
    descriptionHu: 'Alagutak ásása és átfutása az állóképesség növeléséért',
    energyCost: 18,
    coinCost: 3,
    xpGain: 12,
    cooldownSeconds: 360, // 6 minutes
    statFocus: 'stamina',
    statGain: 3,
    icon: '🏃‍♂️'
  },
  {
    id: 'compost-meditation',
    name: 'Compost Meditation',
    nameHu: 'Komposzt Meditáció',
    description: 'Meditate in compost to increase endurance and intelligence',
    descriptionHu: 'Komposztban meditálás a kitartás és intelligencia növeléséért',
    energyCost: 10,
    xpGain: 15,
    cooldownSeconds: 480, // 8 minutes
    statFocus: 'endurance',
    statGain: 2,
    icon: '🧘‍♂️'
  },
  {
    id: 'soil-chemistry',
    name: 'Soil Chemistry',
    nameHu: 'Talaj Kémia',
    description: 'Study soil composition to boost intelligence',
    descriptionHu: 'Talaj összetételének tanulmányozása az intelligencia fejlesztéséért',
    energyCost: 8,
    coinCost: 10,
    xpGain: 20,
    cooldownSeconds: 600, // 10 minutes
    statFocus: 'intelligence',
    statGain: 3,
    icon: '🧪'
  },
  {
    id: 'worm-dancing',
    name: 'Worm Dancing',
    nameHu: 'Kukac Tánc',
    description: 'Dance with other worms to improve charisma',
    descriptionHu: 'Tánc más kukacokkal a karizma növeléséért',
    energyCost: 14,
    coinCost: 2,
    xpGain: 8,
    cooldownSeconds: 300, // 5 minutes
    statFocus: 'charisma',
    statGain: 2,
    icon: '💃'
  }
];