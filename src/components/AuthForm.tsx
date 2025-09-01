import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Bejelentkezési hiba",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sikeres bejelentkezés!",
          description: "Üdvözöllek vissza!"
        });
      }
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Próbáld újra később.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Regisztrációs hiba",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sikeres regisztráció!",
          description: "Ellenőrizd az e-mailedet a megerősítéshez."
        });
      }
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Próbáld újra később.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-secondary">
      <Card className="w-full max-w-md bg-gradient-soil/10 border-primary/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="text-6xl animate-bounce-gentle">🪱</div>
          <CardTitle className="text-3xl font-bold text-primary">
            Kukac Nevelde
          </CardTitle>
          <p className="text-muted-foreground">
            Jelentkezz be vagy regisztrálj, hogy elkezd a kukac nevelést!
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Bejelentkezés</TabsTrigger>
              <TabsTrigger value="register">Regisztráció</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail cím</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="pelda@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Jelszó</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Bejelentkezés..." : "🚪 Bejelentkezés"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail cím</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="pelda@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Jelszó</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Regisztráció..." : "✨ Regisztráció"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};