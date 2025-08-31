import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { WormCard } from './WormCard';
import { Camera, Save, User } from 'lucide-react';
import { Worm, User as UserType } from '../types/game';
import { useToast } from '../hooks/use-toast';

interface ProfileEditorProps {
  user: UserType;
  worm: Worm;
  onUpdateProfile: (updates: Partial<Pick<Worm, 'name' | 'avatarUrl'>>) => void;
}

export const ProfileEditor = ({ user, worm, onUpdateProfile }: ProfileEditorProps) => {
  const [wormName, setWormName] = useState(worm.name);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    if (wormName.trim() === '') {
      toast({
        title: "Hiba!",
        description: "A kukac neve nem lehet üres.",
        variant: "destructive"
      });
      return;
    }

    onUpdateProfile({ name: wormName.trim() });
    toast({
      title: "Siker!",
      description: "Profil sikeresen frissítve.",
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hiba!",
        description: "Kérlek válassz egy képfájlt!",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hiba!",
        description: "A kép mérete maximum 5MB lehet.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Create a local URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpdateProfile({ avatarUrl: result });
      setIsUploading(false);
      toast({
        title: "Siker!",
        description: "Avatar sikeresen frissítve.",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">👤 Profil Szerkesztése</h2>
        <p className="text-muted-foreground">
          Itt szerkesztheted a kukacod és profil részleteit
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Felhasználói Adatok
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Felhasználónév</Label>
                <Input 
                  id="username" 
                  value={user.username} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A felhasználónév nem módosítható
                </p>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* Worm Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🐛 Kukac Beállítások
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wormName">Kukac Neve</Label>
                <Input
                  id="wormName"
                  value={wormName}
                  onChange={(e) => setWormName(e.target.value)}
                  placeholder="Add meg a kukac nevét..."
                  maxLength={30}
                />
              </div>

              {/* Avatar Upload */}
              <div>
                <Label>Avatar</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={worm.avatarUrl} alt={worm.name} />
                    <AvatarFallback>🐛</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isUploading ? 'Feltöltés...' : 'Avatar Módosítása'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG max. 5MB
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Profil Mentése
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Worm Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kukac Előnézet</CardTitle>
            </CardHeader>
            <CardContent>
              <WormCard worm={{ ...worm, name: wormName }} showDetailed />
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Fiók Statisztikák</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regisztráció dátuma:</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('hu-HU')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kukac létrehozva:</span>
                <span className="font-medium">
                  {new Date(worm.createdAt).toLocaleDateString('hu-HU')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Utolsó frissítés:</span>
                <span className="font-medium">
                  {new Date(worm.lastUpdated).toLocaleDateString('hu-HU')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};