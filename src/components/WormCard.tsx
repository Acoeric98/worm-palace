import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Worm, getXpRequiredForLevel } from '../types/game';

interface WormCardProps {
  worm: Worm;
  showDetailed?: boolean;
}

export const WormCard = ({ worm, showDetailed = false }: WormCardProps) => {
  const xpRequired = getXpRequiredForLevel(worm.level + 1);
  const xpProgress = (worm.xp / xpRequired) * 100;

  const stats = [
    { name: 'Erő', nameEn: 'strength', value: worm.strength, icon: '💪', color: 'text-red-600' },
    { name: 'Ügyesség', nameEn: 'agility', value: worm.agility, icon: '🤸', color: 'text-blue-600' },
    { name: 'Kitartás', nameEn: 'endurance', value: worm.endurance, icon: '🛡️', color: 'text-green-600' },
    { name: 'Állóképesség', nameEn: 'stamina', value: worm.stamina, icon: '🏃', color: 'text-yellow-600' },
    { name: 'Intelligencia', nameEn: 'intelligence', value: worm.intelligence, icon: '🧠', color: 'text-purple-600' },
    { name: 'Karizma', nameEn: 'charisma', value: worm.charisma, icon: '✨', color: 'text-pink-600' }
  ];

  return (
    <Card className="bg-gradient-worm/10 border-worm/30 shadow-worm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-worm flex items-center justify-center shadow-worm animate-bounce-gentle">
            {worm.avatarUrl ? (
              <img 
                src={worm.avatarUrl} 
                alt={worm.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl animate-worm-wiggle">🪱</span>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl text-worm font-bold">
              {worm.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Szint {worm.level} • {worm.xp}/{xpRequired} XP
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tapasztalat</span>
            <span>{Math.round(xpProgress)}%</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Health, Energy, Mood */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Egészség</div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-health">❤️</span>
              <span className="font-semibold">{worm.health}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Energia</div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-energy">⚡</span>
              <span className="font-semibold">{worm.energy}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Hangulat</div>
            <div className="flex items-center justify-center gap-1">
              <span>😊</span>
              <span className="font-semibold">{worm.mood}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        {showDetailed && (
          <div className="grid grid-cols-2 gap-3">
            {stats.map(stat => (
              <div key={stat.nameEn} className="flex items-center gap-2 p-2 bg-card/50 rounded-lg">
                <span className="text-lg">{stat.icon}</span>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{stat.name}</div>
                  <div className="font-semibold">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};