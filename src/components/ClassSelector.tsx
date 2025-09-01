import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerClass } from '../types/game';

interface ClassSelectorProps {
  selectedClass: PlayerClass | null;
  onSelectClass: (playerClass: PlayerClass) => void;
  onConfirm: () => void;
  loading?: boolean;
}

const classInfo: Record<PlayerClass, {
  name: string;
  nameHu: string;
  description: string;
  descriptionHu: string;
  icon: string;
  strengths: string[];
  weaknesses: string[];
}> = {
  hunter: {
    name: 'Hunter',
    nameHu: 'Vadász',
    description: 'Master of ranged combat and tracking',
    descriptionHu: 'A távharci és nyomkövetési mester',
    icon: '🏹',
    strengths: ['Pontosság', 'Nyomkövetés', 'Természet ismeret'],
    weaknesses: ['Közelharc', 'Páncélzat']
  },
  warrior: {
    name: 'Warrior',
    nameHu: 'Harcos',
    description: 'Strong melee fighter with heavy armor',
    descriptionHu: 'Erős közelharci harcos nehéz páncélzattal',
    icon: '⚔️',
    strengths: ['Erő', 'Védelem', 'Közelharc'],
    weaknesses: ['Mozgékonyság', 'Mágia']
  },
  ranger: {
    name: 'Ranger',
    nameHu: 'Erdőjáró',
    description: 'Balanced fighter with nature magic',
    descriptionHu: 'Kiegyensúlyozott harcos természet mágiával',
    icon: '🌲',
    strengths: ['Természet mágia', 'Sokoldalúság', 'Gyógyítás'],
    weaknesses: ['Specializáció hiánya']
  },
  trickster: {
    name: 'Trickster',
    nameHu: 'Cseles',
    description: 'Sneaky fighter using tricks and deception',
    descriptionHu: 'Ravasz harcos trükkökkel és megtévesztéssel',
    icon: '🗡️',
    strengths: ['Lopakodás', 'Kritikus sebzés', 'Sebezhetőség'],
    weaknesses: ['Ellenállás', 'Életerő']
  },
  behemoth: {
    name: 'Behemoth',
    nameHu: 'Behemót',
    description: 'Massive tank with incredible strength',
    descriptionHu: 'Hatalmas tank hihetetlen erővel',
    icon: '🛡️',
    strengths: ['Életerő', 'Erő', 'Páncélzat'],
    weaknesses: ['Sebesség', 'Energia költség']
  },
  priest: {
    name: 'Priest',
    nameHu: 'Pap',
    description: 'Holy warrior with divine magic',
    descriptionHu: 'Szent harcos isteni mágiával',
    icon: '✨',
    strengths: ['Gyógyítás', 'Isteni mágia', 'Támogatás'],
    weaknesses: ['Fizikai sebzés', 'Páncélzat']
  },
  medic: {
    name: 'Medic',
    nameHu: 'Orvos',
    description: 'Support fighter focused on healing',
    descriptionHu: 'Támogató harcos gyógyításra fókuszálva',
    icon: '⚕️',
    strengths: ['Gyógyítás', 'Méreg eltávolítás', 'Támogatás'],
    weaknesses: ['Offenzív képességek', 'Páncélzat']
  }
};

export const ClassSelector = ({ selectedClass, onSelectClass, onConfirm, loading }: ClassSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">🎭 Osztály Választás</h1>
        <p className="text-muted-foreground">
          Válassz egy osztályt a kukacod számára. Ez meghatározza a képességeidet és harci stílusodat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(classInfo) as PlayerClass[]).map(classKey => {
          const info = classInfo[classKey];
          const isSelected = selectedClass === classKey;
          
          return (
            <Card 
              key={classKey} 
              className={`cursor-pointer transition-all border-2 ${
                isSelected 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-primary/20 hover:border-primary/40'
              }`}
              onClick={() => onSelectClass(classKey)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{info.icon}</div>
                <CardTitle className="text-xl">{info.nameHu}</CardTitle>
                <p className="text-sm text-muted-foreground">{info.descriptionHu}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Erősségek:</h4>
                  <div className="flex flex-wrap gap-1">
                    {info.strengths.map(strength => (
                      <Badge key={strength} variant="outline" className="text-xs bg-green-50">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Gyengeségek:</h4>
                  <div className="flex flex-wrap gap-1">
                    {info.weaknesses.map(weakness => (
                      <Badge key={weakness} variant="outline" className="text-xs bg-red-50">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedClass && (
        <div className="text-center">
          <Button onClick={onConfirm} size="lg" className="px-8" disabled={loading}>
            {loading
              ? 'Regisztrálás...'
              : `${classInfo[selectedClass].icon} ${classInfo[selectedClass].nameHu} Választása`}
          </Button>
        </div>
      )}
    </div>
  );
};