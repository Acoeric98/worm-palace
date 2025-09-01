import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Training, Worm, getDiminishingMultiplier } from '../types/game';

interface TrainingRoomProps {
  trainings: Training[];
  worm: Worm;
  onTrain: (trainingId: string) => void;
  isTrainingAvailable: (trainingId: string) => boolean;
  getTrainingCooldown: (trainingId: string) => number;
}

export const TrainingRoom = ({ 
  trainings, 
  worm, 
  onTrain, 
  isTrainingAvailable, 
  getTrainingCooldown 
}: TrainingRoomProps) => {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newCooldowns: Record<string, number> = {};
      trainings.forEach(training => {
        newCooldowns[training.id] = getTrainingCooldown(training.id);
      });
      setCooldowns(newCooldowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [trainings, getTrainingCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDailyCount = (trainingId: string) => {
    const today = new Date().toDateString();
    const dailyCounter = worm.dailyCounters[trainingId];
    return (dailyCounter?.date === today) ? dailyCounter.count : 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🏋️ Tréning Terem</h2>
        <p className="text-muted-foreground">
          Erősítsd meg a kukacod különböző edzésekkel!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainings.map(training => {
          const available = isTrainingAvailable(training.id);
          const cooldownSeconds = cooldowns[training.id] || 0;
          const canAfford = worm.energy >= training.energyCost && 
                           (!training.coinCost || worm.coins >= training.coinCost);
          const dailyCount = getDailyCount(training.id);
          const multiplier = getDiminishingMultiplier(dailyCount);

          return (
            <Card key={training.id} className="bg-gradient-nature/10 border-nature-green/30 hover:shadow-nature transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{training.icon}</span>
                    <CardTitle className="text-lg">{training.nameHu}</CardTitle>
                  </div>
                  {multiplier < 1 && (
                    <Badge variant="outline" className="text-xs">
                      -{Math.round((1 - multiplier) * 100)}% hatás
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {training.descriptionHu}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Training stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span>⚡</span>
                    <span>{training.energyCost}</span>
                  </div>
                  {training.coinCost && (
                    <div className="flex items-center gap-1">
                      <span>🪙</span>
                      <span>{training.coinCost}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span>✨</span>
                    <span>+{Math.floor(training.xpGain * multiplier)} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📈</span>
                    <span>+{Math.floor(training.statGain * multiplier)} {
                      training.statFocus === 'strength' ? 'Erő' :
                      training.statFocus === 'dexterity' ? 'Ügyesség' :
                      training.statFocus === 'endurance' ? 'Kitartás' :
                      training.statFocus === 'stamina' ? 'Állóképesség' :
                      training.statFocus === 'intelligence' ? 'Intelligencia' :
                      'Karizma'
                    }</span>
                  </div>
                </div>

                {/* Daily counter */}
                {dailyCount > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Ma: {dailyCount}x végrehajtva
                  </div>
                )}

                {/* Action button */}
                <Button
                  onClick={() => onTrain(training.id)}
                  disabled={!available || !canAfford}
                  className="w-full transition-bounce"
                  variant={available && canAfford ? "default" : "outline"}
                >
                  {!available && cooldownSeconds > 0 ? (
                    `Várakozás: ${formatTime(cooldownSeconds)}`
                  ) : !canAfford ? (
                    worm.energy < training.energyCost ? 'Nincs energia' : 'Nincs érme'
                  ) : (
                    'Edzés Kezdése'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};