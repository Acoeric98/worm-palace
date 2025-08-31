import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Coins, ShoppingCart, Zap, Shield } from 'lucide-react';
import { Item, Worm } from '../types/game';

interface ShopProps {
  items: Item[];
  worm: Worm;
  onBuyItem: (itemId: string) => void;
}

export const Shop = ({ items, worm, onBuyItem }: ShopProps) => {
  const getRarityColor = (rarity: Item['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityName = (rarity: Item['rarity']) => {
    switch (rarity) {
      case 'common': return 'Közönséges';
      case 'rare': return 'Ritka';
      case 'epic': return 'Epikus';
      case 'legendary': return 'Legendás';
      default: return 'Ismeretlen';
    }
  };

  const canAfford = (item: Item) => worm.coins >= item.price;
  const canUse = (item: Item) => !item.level || worm.level >= item.level;

  const consumables = items.filter(item => item.type === 'consumable');
  const equipment = items.filter(item => item.type === 'equipment');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🏪 Kukac Bolt</h2>
        <p className="text-muted-foreground mb-4">
          Vásárolj tárgyakat a kukacod fejlesztéséhez
        </p>
        <div className="flex items-center justify-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="text-xl font-bold">{worm.coins} érme</span>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Consumables Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Fogyóeszközök</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consumables.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <CardTitle className="text-sm">{item.nameHu}</CardTitle>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>
                          {getRarityName(item.rarity)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3">
                    {item.descriptionHu}
                  </p>
                  
                  {item.effects && (
                    <div className="mb-3">
                      <p className="text-xs font-medium mb-1">Hatások:</p>
                      <div className="text-xs space-y-1">
                        {item.effects.energy && (
                          <div className="flex justify-between">
                            <span>Energia:</span>
                            <span className="text-green-500">+{item.effects.energy}</span>
                          </div>
                        )}
                        {item.effects.health && (
                          <div className="flex justify-between">
                            <span>Egészség:</span>
                            <span className="text-green-500">+{item.effects.health}</span>
                          </div>
                        )}
                        {item.effects.mood && (
                          <div className="flex justify-between">
                            <span>Hangulat:</span>
                            <span className="text-green-500">+{item.effects.mood}</span>
                          </div>
                        )}
                        {Object.entries(item.effects).filter(([key]) => 
                          ['strength', 'agility', 'endurance', 'stamina', 'intelligence', 'charisma'].includes(key)
                        ).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between">
                            <span>{stat === 'strength' ? 'Erő' : 
                              stat === 'agility' ? 'Ügyesség' : 
                              stat === 'endurance' ? 'Kitartás' : 
                              stat === 'stamina' ? 'Állóképesség' : 
                              stat === 'intelligence' ? 'Intelligencia' : 'Karizma'}:</span>
                            <span className="text-green-500">+{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm font-medium">{item.price}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onBuyItem(item.id)}
                      disabled={!canAfford(item) || !canUse(item)}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Vásárlás
                    </Button>
                  </div>
                  
                  {!canAfford(item) && (
                    <p className="text-xs text-red-500 mt-1">Nincs elég érme</p>
                  )}
                  {!canUse(item) && item.level && (
                    <p className="text-xs text-red-500 mt-1">
                      {item.level}. szint szükséges
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Equipment Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-purple-500" />
            <h3 className="text-xl font-semibold">Felszerelések</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <CardTitle className="text-sm">{item.nameHu}</CardTitle>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>
                          {getRarityName(item.rarity)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3">
                    {item.descriptionHu}
                  </p>
                  
                  {item.statBonus && (
                    <div className="mb-3">
                      <p className="text-xs font-medium mb-1">Stat bónuszok:</p>
                      <div className="text-xs space-y-1">
                        {Object.entries(item.statBonus).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between">
                            <span>{stat === 'strength' ? 'Erő' : 
                              stat === 'agility' ? 'Ügyesség' : 
                              stat === 'endurance' ? 'Kitartás' : 
                              stat === 'stamina' ? 'Állóképesség' : 
                              stat === 'intelligence' ? 'Intelligencia' : 'Karizma'}:</span>
                            <span className="text-blue-500">+{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <p className="text-xs">
                      <span className="font-medium">Típus:</span> {
                        item.subType === 'helmet' ? 'Sisak' :
                        item.subType === 'armor' ? 'Páncél' :
                        item.subType === 'weapon' ? 'Fegyver' : 'Kiegészítő'
                      }
                    </p>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm font-medium">{item.price}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onBuyItem(item.id)}
                      disabled={!canAfford(item) || !canUse(item)}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Vásárlás
                    </Button>
                  </div>
                  
                  {!canAfford(item) && (
                    <p className="text-xs text-red-500 mt-1">Nincs elég érme</p>
                  )}
                  {!canUse(item) && item.level && (
                    <p className="text-xs text-red-500 mt-1">
                      {item.level}. szint szükséges
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};