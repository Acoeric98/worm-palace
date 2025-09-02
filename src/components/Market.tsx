import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Coins } from 'lucide-react';
import { MarketListing, Item, Worm } from '../types/game';

interface MarketProps {
  listings: MarketListing[];
  items: Item[];
  worm: Worm;
  onBuy: (listingId: string) => void;
}

export const Market = ({ listings, items, worm, onBuy }: MarketProps) => {
  const getItem = (id: string) => items.find(i => i.id === id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🛒 Piac</h2>
        <p className="text-muted-foreground mb-4">Vásárolj és adj el tárgyakat más játékosokkal</p>
        <div className="flex items-center justify-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="text-xl font-bold">{worm.coins} érme</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => {
          const item = getItem(listing.itemId);
          if (!item) return null;
          return (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <CardTitle className="text-sm">{item.nameHu}</CardTitle>
                      <Badge variant="secondary">{listing.seller}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm font-medium">{listing.price}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onBuy(listing.id)}
                    disabled={worm.coins < listing.price || listing.seller === worm.name}
                  >
                    Vásárlás
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {listings.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center">Nincsenek listázások.</p>
        )}
      </div>
    </div>
  );
};
