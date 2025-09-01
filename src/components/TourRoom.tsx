import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TourResult, Worm } from '../types/game';

interface TourRoomProps {
  tours: TourResult[];
  worm: Worm;
  onStartTour: (tourId: string) => void;
  isTourAvailable: (tourId: string) => boolean;
  getTourCooldown: (tourId: string) => number;
}

export const TourRoom = ({ tours, worm, onStartTour, isTourAvailable, getTourCooldown }: TourRoomProps) => {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const updated = { ...prev };
        for (const tourId of Object.keys(updated)) {
          const remaining = getTourCooldown(tourId);
          if (remaining <= 0) {
            delete updated[tourId];
          } else {
            updated[tourId] = remaining;
          }
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [getTourCooldown]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'low': return 'bg-gray-500';
      case 'mid-bottom': return 'bg-green-500';
      case 'mid-top': return 'bg-blue-500';
      case 'high-bottom': return 'bg-purple-500';
      case 'high-middle': return 'bg-orange-500';
      case 'high-top': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'low': return 'Alacsony';
      case 'mid-bottom': return 'Közepes Alsó';
      case 'mid-top': return 'Közepes Felső';
      case 'high-bottom': return 'Magas Alsó';
      case 'high-middle': return 'Magas Közép';
      case 'high-top': return 'Magas Felső';
      default: return 'Ismeretlen';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">🗺️ Felfedezés</h1>
        <p className="text-muted-foreground">
          Indulj útnak és találj értékes tárgyakat! Magasabb szintű területek jobb jutalmakat kínálnak.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map(tour => {
          const isAvailable = isTourAvailable(tour.id);
          const canAfford = worm.energy >= tour.energyCost;
          const meetsLevel = worm.level >= tour.minLevel;
          const cooldownTime = getTourCooldown(tour.id);
          
          return (
            <Card key={tour.id} className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tour.nameHu}</CardTitle>
                  <Badge className={`${getTierColor(tour.tier)} text-white`}>
                    {getTierLabel(tour.tier)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{tour.descriptionHu}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Időtartam:</span>
                    <div className="font-semibold">{tour.duration} perc</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Energia:</span>
                    <div className={`font-semibold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                      {tour.energyCost}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min. szint:</span>
                    <div className={`font-semibold ${meetsLevel ? 'text-green-600' : 'text-red-600'}`}>
                      {tour.minLevel}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lehetséges tárgyak:</span>
                    <div className="font-semibold">{tour.possibleItems.length}</div>
                  </div>
                </div>

                {tour.possibleItems.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Lehetséges találatok:</div>
                    <div className="flex flex-wrap gap-1">
                      {tour.possibleItems.slice(0, 3).map(item => (
                        <Badge key={item.id} variant="outline" className="text-xs">
                          {item.icon} {item.nameHu}
                        </Badge>
                      ))}
                      {tour.possibleItems.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{tour.possibleItems.length - 3} több
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => onStartTour(tour.id)}
                  disabled={!isAvailable || !canAfford || !meetsLevel}
                  className="w-full"
                  variant={isAvailable && canAfford && meetsLevel ? "default" : "outline"}
                >
                  {!isAvailable ? (
                    <>⏱️ {formatTime(cooldownTime)}</>
                  ) : !meetsLevel ? (
                    `🔒 ${tour.minLevel}. szint szükséges`
                  ) : !canAfford ? (
                    `⚡ ${tour.energyCost} energia szükséges`
                  ) : (
                    `🗺️ Indulás`
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