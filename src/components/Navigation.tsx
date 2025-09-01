import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NavigationProps {
  currentPage: 'dashboard' | 'training' | 'jobs' | 'profile' | 'shop' | 'inventory' | 'tours' | 'pvp' | 'pve';
  onNavigate: (page: 'dashboard' | 'training' | 'jobs' | 'profile' | 'shop' | 'inventory' | 'tours' | 'pvp' | 'pve') => void;
  coins: number;
}

export const Navigation = ({ currentPage, onNavigate, coins }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Vezérlőpult', icon: '🏠' },
    { id: 'training', label: 'Tréning', icon: '💪' },
    { id: 'jobs', label: 'Munkák', icon: '💼' },
    { id: 'tours', label: 'Felfedezés', icon: '🗺️' },
    { id: 'pvp', label: 'PvP', icon: '⚔️' },
    { id: 'pve', label: 'PvE', icon: '🐉' },
    { id: 'shop', label: 'Bolt', icon: '🏪' },
    { id: 'inventory', label: 'Táska', icon: '🎒' },
    { id: 'profile', label: 'Profil', icon: '👤' }
  ] as const;

  return (
    <Card className="bg-gradient-soil border-primary/20 shadow-soft">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and coins */}
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-primary">
              🪱 Kukac Nevelde
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-worm rounded-full">
              <span className="text-lg">🪙</span>
              <span className="font-semibold text-worm-foreground">
                {coins}
              </span>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex gap-2 flex-wrap">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "outline"}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-2 transition-bounce"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};