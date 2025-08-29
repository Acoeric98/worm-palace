import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WormCard } from './WormCard';
import { Worm, JobAssignment, Job, getXpRequiredForLevel } from '../types/game';

interface DashboardProps {
  worm: Worm;
  assignments: JobAssignment[];
  jobs: Job[];
  onNavigate: (page: 'training' | 'jobs' | 'profile') => void;
  onCompleteJob: (assignmentId: string) => void;
}

export const Dashboard = ({ worm, assignments, jobs, onNavigate, onCompleteJob }: DashboardProps) => {
  const activeAssignments = assignments.filter(a => a.status === 'accepted');
  const completableJobs = activeAssignments.filter(assignment => {
    const job = jobs.find(j => j.id === assignment.jobId);
    if (!job) return false;
    const elapsed = Date.now() - assignment.startedAt;
    const required = job.durationMinutes * 60 * 1000;
    return elapsed >= required;
  });

  const totalStats = worm.strength + worm.agility + worm.endurance + 
                    worm.stamina + worm.intelligence + worm.charisma;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          🪱 Üdvözöllek, {worm.name}!
        </h1>
        <p className="text-muted-foreground">
          Így áll most a kis kukacod fejlődése
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Worm card */}
        <div className="md:col-span-2">
          <WormCard worm={worm} showDetailed={true} />
        </div>

        {/* Quick stats */}
        <Card className="bg-gradient-nature/10 border-nature-green/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📊</span> Gyors áttekintés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{worm.level}</div>
                <div className="text-xs text-muted-foreground">Szint</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-worm">{totalStats}</div>
                <div className="text-xs text-muted-foreground">Összesített<br/>statisztikák</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-energy">{worm.energy}</div>
                <div className="text-xs text-muted-foreground">Energia</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">{worm.coins}</div>
                <div className="text-xs text-muted-foreground">Érmék</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Következő szint</span>
                <span>{worm.xp}/{getXpRequiredForLevel(worm.level + 1)}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-worm h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(worm.xp / getXpRequiredForLevel(worm.level + 1)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active jobs notification */}
      {completableJobs.length > 0 && (
        <Card className="bg-gradient-worm/20 border-worm animate-pulse-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-worm">
              <span className="animate-bounce">🎉</span> Befejezett munkák!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-worm-foreground">
              {completableJobs.length} munkád van kész! Fejezd be őket, hogy megkapd a jutalmad.
            </p>
            <Button 
              onClick={() => onNavigate('jobs')}
              className="bg-gradient-worm hover:shadow-worm transition-bounce"
            >
              Munkák befejezése 💰
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:shadow-nature hover:scale-105" 
              onClick={() => onNavigate('training')}>
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-4xl">💪</div>
            <h3 className="font-semibold text-nature-green">Tréning Terem</h3>
            <p className="text-sm text-muted-foreground">
              Edzéssel fejleszd a statjaidat
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-worm hover:scale-105" 
              onClick={() => onNavigate('jobs')}>
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-4xl">💼</div>
            <h3 className="font-semibold text-worm">Munka Közvetítő</h3>
            <p className="text-sm text-muted-foreground">
              Vállalj munkákat pénzért és XP-ért
            </p>
            {activeAssignments.length > 0 && (
              <div className="text-xs bg-worm/20 rounded-full px-2 py-1">
                {activeAssignments.length} aktív munka
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-soft hover:scale-105" 
              onClick={() => onNavigate('profile')}>
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-4xl">👤</div>
            <h3 className="font-semibold text-primary">Profil</h3>
            <p className="text-sm text-muted-foreground">
              Szerkeszd a kukacod profilját
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💡</span> Tippek
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Az edzések naponta egyre kevésbé hatékonyak (csökkenő hozadék)</p>
          <p>• Minden edzésnek van várakozási ideje az újrafuttatásig</p>
          <p>• Naponta maximum {5} munkát végezhetsz el</p>
          <p>• A magasabb szintű munkák több érmét és XP-t adnak</p>
        </CardContent>
      </Card>
    </div>
  );
};