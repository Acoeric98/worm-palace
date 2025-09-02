import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayerClass } from '../types/game';
import { ClassSelector } from './ClassSelector';

interface SetupFormProps {
  onRegister: (
    username: string,
    password: string,
    wormName: string,
    playerClass: PlayerClass
  ) => Promise<void>;
  onSwitchToLogin: () => void;
}

export const SetupForm = ({ onRegister, onSwitchToLogin }: SetupFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [wormName, setWormName] = useState('');
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);
  const [step, setStep] = useState<'profile' | 'class'>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (username.trim().length < 3) {
      setError('Felhasználónév túl rövid (min 3).');
      return;
    }
    if (password.trim().length < 6) {
      setError('Jelszó túl rövid (min 6).');
      return;
    }
    if (!wormName.trim()) {
      setError('Adj nevet a kukacodnak.');
      return;
    }
    setStep('class');
  };

  const handleClassConfirm = async () => {
    if (!selectedClass) return;
    setError(null);
    setLoading(true);
    try {
      await onRegister(username.trim(), password, wormName.trim(), selectedClass);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const wormNameSuggestions = [
    'Rózsika', 'Benedek', 'Csigusz', 'Mókus', 'Bogár', 'Virág'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-secondary">
      <Card className="w-full max-w-md bg-gradient-soil/10 border-primary/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="text-6xl animate-bounce-gentle">🪱</div>
          <CardTitle className="text-3xl font-bold text-primary">
            Kukac Nevelde
          </CardTitle>
          <p className="text-muted-foreground">
            Üdvözöllek a Kukac Nevelőben! Hozd létre a profilodat és neveld fel a saját kis kukacod.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <p role="alert" className="text-red-600 text-sm text-center">{error}</p>
          )}
          {step === 'profile' ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">A te neved</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Add meg a nevedet..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Jelszó</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Adj meg egy jelszót..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-smooth"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wormName">Kukac neve</Label>
                  <Input
                    id="wormName"
                    type="text"
                    placeholder="Nevezd el a kukacod..."
                    value={wormName}
                    onChange={(e) => setWormName(e.target.value)}
                    className="transition-smooth"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">Ötletek:</span>
                    {wormNameSuggestions.map(name => (
                      <Button
                        key={name}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => setWormName(name)}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full text-lg py-6 transition-bounce bg-gradient-worm hover:shadow-worm"
                  disabled={!username.trim() || !password.trim() || !wormName.trim()}
                >
                  🎉 Következő: Osztály Választás
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  🎮 Növeld a kukacod statjait tréninggel<br/>
                  💼 Végezz munkákat érmékért<br/>
                  🏆 Versenyzz a ranglistán
                </p>
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary underline mt-2"
                >
                  Már van fiókod? Bejelentkezés
                </button>
              </div>
            </>
          ) : (
            <ClassSelector
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
              onConfirm={handleClassConfirm}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};