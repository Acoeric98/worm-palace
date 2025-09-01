import { Ability } from '../types/game';

export const defaultAbilities: Ability[] = [
  // Hunter abilities
  {
    id: 'arrow-shot',
    name: 'Arrow Shot',
    nameHu: 'Nyíl Lövés',
    description: 'Fire a precise arrow at the enemy',
    descriptionHu: 'Pontos nyíl kilövése az ellenségre',
    type: 'offensive',
    cooldown: 3,
    energyCost: 5,
    damage: 15,
    classRestriction: ['hunter']
  },
  {
    id: 'track',
    name: 'Track',
    nameHu: 'Nyomkövetés',
    description: 'Reveal enemy weaknesses',
    descriptionHu: 'Ellenség gyengeségeinek feltárása',
    type: 'support',
    cooldown: 10,
    energyCost: 10,
    effects: ['reveals_stats'],
    classRestriction: ['hunter']
  },

  // Warrior abilities
  {
    id: 'sword-strike',
    name: 'Sword Strike',
    nameHu: 'Kard Csapás',
    description: 'A powerful melee attack',
    descriptionHu: 'Erős közelharci támadás',
    type: 'offensive',
    cooldown: 2,
    energyCost: 8,
    damage: 20,
    classRestriction: ['warrior']
  },
  {
    id: 'shield-wall',
    name: 'Shield Wall',
    nameHu: 'Pajzsfal',
    description: 'Raise defenses against incoming attacks',
    descriptionHu: 'Védelem növelése a bejövő támadások ellen',
    type: 'defensive',
    cooldown: 15,
    energyCost: 12,
    effects: ['damage_reduction'],
    classRestriction: ['warrior']
  },

  // Ranger abilities
  {
    id: 'nature-shot',
    name: 'Nature Shot',
    nameHu: 'Természet Lövés',
    description: 'Fire an arrow enhanced by nature magic',
    descriptionHu: 'Természet mágiával erősített nyíl kilövése',
    type: 'offensive',
    cooldown: 4,
    energyCost: 7,
    damage: 18,
    classRestriction: ['ranger']
  },
  {
    id: 'herbal-remedy',
    name: 'Herbal Remedy',
    nameHu: 'Gyógynövény Szer',
    description: 'Use nature knowledge to heal wounds',
    descriptionHu: 'Természet tudás használata sebek gyógyítására',
    type: 'support',
    cooldown: 8,
    energyCost: 10,
    healing: 25,
    classRestriction: ['ranger']
  },

  // Trickster abilities
  {
    id: 'sneak-attack',
    name: 'Sneak Attack',
    nameHu: 'Lopakodó Támadás',
    description: 'Strike from the shadows for extra damage',
    descriptionHu: 'Támadás az árnyékból extra sebzésért',
    type: 'offensive',
    cooldown: 6,
    energyCost: 12,
    damage: 25,
    classRestriction: ['trickster']
  },
  {
    id: 'smoke-bomb',
    name: 'Smoke Bomb',
    nameHu: 'Füst Bomba',
    description: 'Create confusion and reduce accuracy',
    descriptionHu: 'Zűrzavar keltése és pontosság csökkentése',
    type: 'support',
    cooldown: 12,
    energyCost: 8,
    effects: ['accuracy_reduction'],
    classRestriction: ['trickster']
  },

  // Behemoth abilities
  {
    id: 'crushing-blow',
    name: 'Crushing Blow',
    nameHu: 'Zúzó Csapás',
    description: 'Devastating attack that ignores some armor',
    descriptionHu: 'Pusztító támadás ami figyelmen kívül hagy némi páncélt',
    type: 'offensive',
    cooldown: 8,
    energyCost: 15,
    damage: 30,
    classRestriction: ['behemoth']
  },
  {
    id: 'intimidate',
    name: 'Intimidate',
    nameHu: 'Megfélemlítés',
    description: 'Frighten the enemy, reducing their damage',
    descriptionHu: 'Ellenség megfélemlítése, sebzés csökkentése',
    type: 'support',
    cooldown: 10,
    energyCost: 5,
    effects: ['damage_reduction_enemy'],
    classRestriction: ['behemoth']
  },

  // Priest abilities
  {
    id: 'divine-light',
    name: 'Divine Light',
    nameHu: 'Isteni Fény',
    description: 'Channel divine energy to damage undead',
    descriptionHu: 'Isteni energia csatornázása élőholtak sebzésére',
    type: 'offensive',
    cooldown: 5,
    energyCost: 10,
    damage: 22,
    classRestriction: ['priest']
  },
  {
    id: 'blessing',
    name: 'Blessing',
    nameHu: 'Áldás',
    description: 'Bless yourself or ally with divine protection',
    descriptionHu: 'Önmagad vagy szövetséges megáldása isteni védelemmel',
    type: 'support',
    cooldown: 15,
    energyCost: 12,
    effects: ['damage_resistance'],
    classRestriction: ['priest']
  },

  // Medic abilities
  {
    id: 'field-medicine',
    name: 'Field Medicine',
    nameHu: 'Tábori Orvoslás',
    description: 'Quickly treat wounds in combat',
    descriptionHu: 'Sebek gyors kezelése harcban',
    type: 'support',
    cooldown: 4,
    energyCost: 8,
    healing: 20,
    classRestriction: ['medic']
  },
  {
    id: 'poison-cure',
    name: 'Poison Cure',
    nameHu: 'Méreg Ellenszer',
    description: 'Remove harmful effects and provide immunity',
    descriptionHu: 'Káros hatások eltávolítása és immunitás biztosítása',
    type: 'support',
    cooldown: 12,
    energyCost: 10,
    effects: ['status_cleanse', 'poison_immunity'],
    classRestriction: ['medic']
  }
];