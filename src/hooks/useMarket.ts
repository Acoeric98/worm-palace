import { useCallback, useEffect } from 'react';
import { GameState, Worm, Item } from '../types/game';

export const useMarket = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  toast: (opts: { title: string; description: string; variant?: string }) => void
) => {
  const fetchMarketListings = useCallback(async () => {
    try {
      const res = await fetch('/api/market');
      if (!res.ok) return;
      const data = await res.json();
      setGameState(prev => ({ ...prev, marketListings: data.listings || [] }));
    } catch (err) {
      console.error('Failed to fetch market', err);
    }
  }, [setGameState]);

  useEffect(() => {
    void fetchMarketListings();
  }, [fetchMarketListings]);

  const listItemForSale = async (itemId: string, price: number) => {
    const inventoryItem = gameState.inventory.find(inv => inv.itemId === itemId);
    const item = gameState.shopItems.find(i => i.id === itemId);
    if (!inventoryItem || !item || !gameState.user) return;

    const updatedInventory = inventoryItem.quantity === 1
      ? gameState.inventory.filter(inv => inv.itemId !== itemId)
      : gameState.inventory.map(inv =>
          inv.itemId === itemId ? { ...inv, quantity: inv.quantity - 1 } : inv
        );

    try {
      const res = await fetch('/api/market/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, price, seller: gameState.user.username }),
      });
      if (!res.ok) throw new Error('Failed to list');
      const data = await res.json();
      const listing = data.listing;
      setGameState(prev => ({
        ...prev,
        inventory: updatedInventory,
        marketListings: [...prev.marketListings, listing],
      }));
      toast({ title: 'Piacra téve!', description: `${item.nameHu} listázva ${price} érméért.` });
    } catch (err) {
      console.error('Failed to list item', err);
      toast({ title: 'Hiba', description: 'Nem sikerült feltölteni a piacra.', variant: 'destructive' });
    }
  };

  const buyListing = async (listingId: string) => {
    const listing = gameState.marketListings.find(l => l.id === listingId);
    if (!listing || !gameState.worm) return;
    if (listing.price > gameState.worm.coins) {
      toast({ title: 'Nincs elég érme!', description: 'Nem tudod megvenni ezt a tárgyat.', variant: 'destructive' });
      return;
    }

    const item = gameState.shopItems.find(i => i.id === listing.itemId);
    if (!item) return;

    const existingItem = gameState.inventory.find(inv => inv.itemId === listing.itemId);
    const updatedInventory = existingItem
      ? gameState.inventory.map(inv =>
          inv.itemId === listing.itemId ? { ...inv, quantity: inv.quantity + 1 } : inv
        )
      : [...gameState.inventory, { itemId: listing.itemId, quantity: 1, acquiredAt: Date.now() }];

    const updatedWorm: Worm = {
      ...gameState.worm,
      coins: gameState.worm.coins - listing.price,
      lastUpdated: Date.now(),
    };

    try {
      const res = await fetch('/api/market/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      if (!res.ok) throw new Error('Failed to remove');
      setGameState(prev => ({
        ...prev,
        worm: updatedWorm,
        inventory: updatedInventory,
        marketListings: prev.marketListings.filter(l => l.id !== listingId),
      }));
      toast({ title: 'Vásárlás sikeres!', description: `${item.nameHu} megvásárolva.` });
    } catch (err) {
      console.error('Failed to buy listing', err);
      toast({ title: 'Hiba', description: 'Nem sikerült megvásárolni a tárgyat.', variant: 'destructive' });
    }
  };

  return { listItemForSale, buyListing };
};

export type MarketHook = ReturnType<typeof useMarket>;
