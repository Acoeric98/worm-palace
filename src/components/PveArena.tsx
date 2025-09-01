import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Worm, PveOpponent } from '../types/game';

interface PveArenaProps {
  worm: Worm;
  onStartDungeon: (difficulty: 'easy' | 'medium' | 'hard' | 'elite') => void;
  onStartRaid: () => void;
  onStartAdventure: () => void;
}

export const PveArena = ({ worm, onStartDungeon, onStartRaid, onStartAdventure }: PveArenaProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'elite': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Könnyű';
      case 'medium': return 'Közepes';
      case 'hard': return 'Nehéz';
      case 'elite': return 'Elit';
      default: return 'Ismeretlen';
    }
  };

  const dungeonDifficulties = [
    {
      id: 'easy',
      nameHu: 'Könnyű Börtön',
      description: 'Kezdőknek ajánlott börtön',
      energyCost: 15,
      minLevel: 1,
      rewards: 'Alapvető tárgyak, kevés XP'
    },
    {
      id: 'medium',
      nameHu: 'Közepes Börtön',
      description: 'Tapasztalt kalandozóknak',
      energyCost: 25,
      minLevel: 5,
      rewards: 'Jobb tárgyak, közepes XP'
    },
    {
      id: 'hard',
      nameHu: 'Nehéz Börtön',
      description: 'Veterán harcosoknak',
      energyCost: 35,
      minLevel: 10,
      rewards: 'Ritka tárgyak, sok XP'
    },
    {
      id: 'elite',
      nameHu: 'Elit Börtön',
      description: 'A legerősebb kihívás',
      energyCost: 50,
      minLevel: 15,
      rewards: 'Legendás tárgyak, rengeteg XP'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">⚔️ PvE Aréna</h1>
        <p className="text-muted-foreground">
          Harcolj szörnyekkel, felfedező küldetéseken és dungeon-ökben!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dungeons */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏰 Börtönök
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Rövid, intenzív harcok szörnyekkel
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {dungeonDifficulties.map(dungeon => {
              const canAfford = worm.energy >= dungeon.energyCost;
              const meetsLevel = worm.level >= dungeon.minLevel;
              
              return (
                <Card key={dungeon.id} className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{dungeon.nameHu}</div>
                      <Badge className={`${getDifficultyColor(dungeon.id)} text-white`}>
                        {getDifficultyLabel(dungeon.id)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {dungeon.description}
                    </p>
                    <div className="text-xs text-muted-foreground mb-2">
                      Jutalmak: {dungeon.rewards}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className={canAfford ? 'text-green-600' : 'text-red-600'}>
                          ⚡ {dungeon.energyCost}
                        </span>
                        {' • '}
                        <span className={meetsLevel ? 'text-green-600' : 'text-red-600'}>
                          Szint {dungeon.minLevel}+
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onStartDungeon(dungeon.id as any)}
                        disabled={!canAfford || !meetsLevel}
                      >
                        Indulás
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Raids */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🐉 Raiderek
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Epikus harcok hatalmas bossokkal
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🐲</div>
              <h3 className="font-semibold mb-2">Sárkány Raid</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Harcolj egy ősi sárkánnyal legendás jutalmakért!
              </p>
              <div className="text-sm mb-3">
                <div className={worm.energy >= 40 ? 'text-green-600' : 'text-red-600'}>
                  ⚡ 40 energia szükséges
                </div>
                <div className={worm.level >= 12 ? 'text-green-600' : 'text-red-600'}>
                  🔒 12. szint szükséges
                </div>
              </div>
              <Button
                onClick={onStartRaid}
                disabled={worm.energy < 40 || worm.level < 12}
                className="w-full"
              >
                🐉 Sárkány Kihívása
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Adventures */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗺️ Kalandok
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Hosszú küldetések felfedezésekkel
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🏔️</div>
              <h3 className="font-semibold mb-2">Hegy Expedíció</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Fedezd fel a titokzatos hegycsúcsokat!
              </p>
              <div className="text-sm mb-3">
                <div className={worm.energy >= 30 ? 'text-green-600' : 'text-red-600'}>
                  ⚡ 30 energia szükséges
                </div>
                <div className={worm.level >= 8 ? 'text-green-600' : 'text-red-600'}>
                  🔒 8. szint szükséges
                </div>
              </div>
              <Button
                onClick={onStartAdventure}
                disabled={worm.energy < 30 || worm.level < 8}
                className="w-full"
              >
                🏔️ Expedíció Indítása
              </Button>
            </div>

            <div className="border-t pt-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🌊</div>
                <h4 className="font-semibold text-sm">Tengeri Kaland</h4>
                <p className="text-xs text-muted-foreground mb-2">Hamarosan...</p>
                <Button size="sm" disabled className="w-full">
                  🔒 Fejlesztés alatt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bars */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>📊 PvE Statisztikák</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Börtön Clear Rate</div>
              <Progress value={75} className="mb-1" />
              <div className="text-xs text-muted-foreground">12/16 börtön tiszta</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Raid Győzelmek</div>
              <Progress value={40} className="mb-1" />
              <div className="text-xs text-muted-foreground">2/5 raid teljesítve</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Kaland Progressz</div>
              <Progress value={60} className="mb-1" />
              <div className="text-xs text-muted-foreground">3/5 kaland befejezve</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};