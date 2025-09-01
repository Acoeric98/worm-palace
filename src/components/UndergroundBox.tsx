import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Worm, Battle } from '../types/game';

interface UndergroundBoxProps {
  worm: Worm;
  players: Worm[];
  battles: Battle[];
  onChallengeRandom: () => void;
  onChallengePlayer: (playerId: string) => void;
  onAcceptBattle: (battleId: string) => void;
}

export const UndergroundBox = ({ 
  worm, 
  players, 
  battles, 
  onChallengeRandom, 
  onChallengePlayer,
  onAcceptBattle 
}: UndergroundBoxProps) => {
  const [searchName, setSearchName] = useState('');
  const [foundPlayer, setFoundPlayer] = useState<Worm | null>(null);

  const handleSearch = () => {
    if (!searchName.trim()) return;
    
    const player = players.find(p => 
      p.name.toLowerCase().includes(searchName.toLowerCase()) && p.id !== worm.id
    );
    setFoundPlayer(player || null);
  };

  const pendingBattles = battles.filter(b => b.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">⚔️ Underground Box</h1>
        <p className="text-muted-foreground">
          Harcolj más játékosokkal ebben a titkos arénában!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Challenge Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Kihívás
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Véletlenszerű ellenfél</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Harcolj egy véletlenszerűen kiválasztott játékossal ingyen.
              </p>
              <Button onClick={onChallengeRandom} className="w-full">
                🎲 Véletlenszerű Harc
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Játékos keresése</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Keress egy konkrét játékost név alapján (100 érme).
              </p>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Játékos neve..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  🔍 Keresés
                </Button>
              </div>

              {foundPlayer && (
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{foundPlayer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Szint {foundPlayer.level} • 
                          {foundPlayer.wins}W/{foundPlayer.losses}L
                        </div>
                      </div>
                      <Button
                        onClick={() => onChallengePlayer(foundPlayer.id)}
                        disabled={worm.coins < 100}
                        size="sm"
                      >
                        {worm.coins >= 100 ? '⚔️ Kihívás (100 💰)' : 'Nincs elég érme'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {searchName && !foundPlayer && searchName.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Nincs találat "{searchName}" névre.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Battles */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Aktív Harcok
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingBattles.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Jelenleg nincs aktív harcod.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingBattles.map(battle => {
                  const opponent = battle.opponent as Worm;
                  return (
                    <Card key={battle.id} className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{opponent.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Szint {opponent.level} • 
                              {opponent.wins}W/{opponent.losses}L
                            </div>
                          </div>
                          <Button
                            onClick={() => onAcceptBattle(battle.id)}
                            size="sm"
                          >
                            ⚔️ Harc!
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Player Ranking Preview */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Játékos Rangsor (Top 10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {players
              .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses))
              .slice(0, 10)
              .map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    player.id === worm.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={index < 3 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Szint {player.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {player.wins}W
                    </div>
                    <div className="text-sm text-red-600">
                      {player.losses}L
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};