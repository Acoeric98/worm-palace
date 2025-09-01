import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, Zap, Shield, Shirt, Crown, Sword, Star } from 'lucide-react';
import { InventoryItem, Item, Worm } from '../types/game';

interface InventoryProps {
  inventory: InventoryItem[];
  items: Item[];
  worm: Worm;
  onUseItem: (itemId: string) => void;
  onEquipItem: (itemId: string) => void;
  onUnequipItem: (slot: keyof Worm['equipment']) => void;
  getTotalStats: (worm: Worm) => {
    strength: number;
    dexterity: number; 
    endurance: number;
    stamina: number;
    intelligence: number;
    charisma: number;
  };
}

export const Inventory = ({ 
  inventory, 
  items, 
  worm, 
  onUseItem, 
  onEquipItem, 
  onUnequipItem,
  getTotalStats 
}: InventoryProps) => {
  const getItemDetails = (itemId: string) => 
    items.find(item => item.id === itemId);

  const getInventoryItem = (itemId: string) =>
    inventory.find(inv => inv.itemId === itemId);

  const consumableItems = (inventory || [])
    .map(inv => ({ ...inv, item: getItemDetails(inv.itemId) }))
    .filter(inv => inv.item?.type === 'consumable');

  const equipmentItems = (inventory || [])
    .map(inv => ({ ...inv, item: getItemDetails(inv.itemId) }))
    .filter(inv => inv.item?.type === 'equipment');

  const totalStats = getTotalStats(worm);

  const getSlotIcon = (slot: string) => {
    switch (slot) {
      case 'helmet': return <Crown className="h-4 w-4" />;
      case 'armor': return <Shirt className="h-4 w-4" />;
      case 'weapon': return <Sword className="h-4 w-4" />;
      case 'accessory': return <Star className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getSlotName = (slot: string) => {
    switch (slot) {
      case 'helmet': return 'Sisak';
      case 'armor': return 'Páncél';
      case 'weapon': return 'Fegyver';
      case 'accessory': return 'Kiegészítő';
      default: return 'Ismeretlen';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🎒 Táska & Felszerelés</h2>
        <p className="text-muted-foreground">
          Kezeld a tárgyaidat és felszereléseidet
        </p>
      </div>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipment">Felszerelés</TabsTrigger>
          <TabsTrigger value="consumables">Fogyóeszközök</TabsTrigger>
          <TabsTrigger value="stats">Statisztikák</TabsTrigger>
        </TabsList>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Currently Equipped */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Jelenleg Felöltve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(worm.equipment).map(([slot, itemId]) => {
                  const equippedItem = itemId ? getItemDetails(itemId) : null;
                  return (
                    <div key={slot} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSlotIcon(slot)}
                        <div>
                          <p className="font-medium">{getSlotName(slot)}</p>
                          {equippedItem ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{equippedItem.icon}</span>
                              <span className="text-sm text-muted-foreground">
                                {equippedItem.nameHu}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Üres</p>
                          )}
                        </div>
                      </div>
                      {equippedItem && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUnequipItem(slot as keyof Worm['equipment'])}
                        >
                          Levétel
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Available Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Elérhető Felszerelések
                </CardTitle>
              </CardHeader>
              <CardContent>
                {equipmentItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nincs felszerelés a táskádban
                  </p>
                ) : (
                  <div className="space-y-3">
                    {equipmentItems.map((invItem) => {
                      const item = invItem.item!;
                      const isEquipped = Object.values(worm.equipment).includes(item.id);
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <p className="font-medium">{item.nameHu}</p>
                              <p className="text-xs text-muted-foreground">
                                {getSlotName(item.subType || '')}
                              </p>
                              {item.statBonus && (
                                <div className="text-xs text-blue-500">
                                  {Object.entries(item.statBonus).map(([stat, value]) => (
                                    <span key={stat} className="mr-2">
                                      +{value} {stat === 'strength' ? 'Erő' : 
                                        stat === 'dexterity' ? 'Ügy.' : 
                                        stat === 'endurance' ? 'Kit.' : 
                                        stat === 'stamina' ? 'Áll.' : 
                                        stat === 'intelligence' ? 'Int.' : 'Kar.'}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onEquipItem(item.id)}
                            disabled={isEquipped || (item.level && worm.level < item.level)}
                          >
                            {isEquipped ? 'Felöltve' : 'Felöltés'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consumables Tab */}
        <TabsContent value="consumables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Fogyóeszközök
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consumableItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nincsenek fogyóeszközök a táskádban
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {consumableItems.map((invItem) => {
                    const item = invItem.item!;
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.icon}</span>
                              <CardTitle className="text-sm">{item.nameHu}</CardTitle>
                            </div>
                            <Badge variant="secondary">
                              x{invItem.quantity}
                            </Badge>
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
                                {Object.entries(item.effects).map(([effect, value]) => (
                                  <div key={effect} className="flex justify-between">
                                    <span>{effect === 'energy' ? 'Energia' : 
                                      effect === 'health' ? 'Egészség' : 
                                      effect === 'mood' ? 'Hangulat' :
                                      effect === 'strength' ? 'Erő' : 
                                      effect === 'dexterity' ? 'Ügyesség' : 
                                      effect === 'endurance' ? 'Kitartás' : 
                                      effect === 'stamina' ? 'Állóképesség' : 
                                      effect === 'intelligence' ? 'Intelligencia' : 'Karizma'}:</span>
                                    <span className="text-green-500">+{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            onClick={() => onUseItem(item.id)}
                            className="w-full"
                            disabled={invItem.quantity <= 0}
                          >
                            Használat
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alap Statisztikák</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Erő:</span>
                  <span className="font-medium">{worm.strength}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ügyesség:</span>
                  <span className="font-medium">{worm.dexterity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kitartás:</span>
                  <span className="font-medium">{worm.endurance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Állóképesség:</span>
                  <span className="font-medium">{worm.stamina}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intelligencia:</span>
                  <span className="font-medium">{worm.intelligence}</span>
                </div>
                <div className="flex justify-between">
                  <span>Karizma:</span>
                  <span className="font-medium">{worm.charisma}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Teljes Statisztikák (Felszerelésekkel)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Erő:</span>
                  <span className="font-medium text-green-600">
                    {totalStats.strength}
                    {totalStats.strength !== worm.strength && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (+{totalStats.strength - worm.strength})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ügyesség:</span>
                  <span className="font-medium text-green-600">
                    {totalStats.dexterity}
                    {totalStats.dexterity !== worm.dexterity && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (+{totalStats.dexterity - worm.dexterity})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kitartás:</span>
                  <span className="font-medium text-green-600">
                    {totalStats.endurance}
                    {totalStats.endurance !== worm.endurance && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (+{totalStats.endurance - worm.endurance})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Állóképesség:</span>
                  <span className="font-medium text-green-600">
                    {totalStats.stamina}
                    {totalStats.stamina !== worm.stamina && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (+{totalStats.stamina - worm.stamina})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Intelligencia:</span>
                  <span className="font-medium text-green-600">
                    {totalStats.intelligence}
                    {totalStats.intelligence !== worm.intelligence && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (+{totalStats.intelligence - worm.intelligence})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Karizma:</span>
                  <span className="font-medium text-green-600">
                    {totalStats.charisma}
                    {totalStats.charisma !== worm.charisma && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (+{totalStats.charisma - worm.charisma})
                      </span>
                    )}
                  </span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Összesen:</span>
                  <span className="text-green-600">
                    {Object.values(totalStats).reduce((sum, stat) => sum + stat, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};