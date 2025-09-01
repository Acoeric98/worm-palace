import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onLogin, onSwitchToRegister }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-secondary">
      <Card className="w-full max-w-md bg-gradient-soil/10 border-primary/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="text-6xl animate-bounce-gentle">🪱</div>
          <CardTitle className="text-3xl font-bold text-primary">
            Kukac Nevelde
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Felhasználónév</Label>
              <Input
                id="username"
                type="text"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-smooth"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-lg py-6 transition-bounce bg-gradient-worm hover:shadow-worm"
              disabled={!username.trim() || !password.trim()}
            >
              Bejelentkezés
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              onClick={onSwitchToRegister}
              className="text-primary underline"
            >
              Nincs még fiókod? Regisztrálj
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
