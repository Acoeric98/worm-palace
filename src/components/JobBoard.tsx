import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job, JobAssignment, Worm, DAILY_JOB_LIMIT } from '../types/game';

interface JobBoardProps {
  jobs: Job[];
  assignments: JobAssignment[];
  worm: Worm;
  onAcceptJob: (jobId: string) => void;
  onCompleteJob: (assignmentId: string) => void;
}

export const JobBoard = ({ jobs, assignments, worm, onAcceptJob, onCompleteJob }: JobBoardProps) => {
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: Record<string, number> = {};
      
      assignments.forEach(assignment => {
        if (assignment.status === 'accepted') {
          const job = jobs.find(j => j.id === assignment.jobId);
          if (job) {
            const elapsed = Date.now() - assignment.startedAt;
            const required = job.durationMinutes * 60 * 1000;
            const remaining = Math.max(0, required - elapsed);
            newTimeRemaining[assignment.id] = Math.ceil(remaining / 1000);
          }
        }
      });
      
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [assignments, jobs]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canAcceptJob = (job: Job) => {
    // Check level
    if (worm.level < job.minLevel) return false;
    
    // Check energy
    if (worm.energy < job.energyCost) return false;
    
    // Check stat requirements
    for (const [stat, required] of Object.entries(job.statRequirements)) {
      const statValue = worm[stat as keyof Pick<Worm, 'strength' | 'agility' | 'endurance' | 'stamina' | 'intelligence' | 'charisma'>] as number;
      if (statValue < (required as number)) return false;
    }
    
    // Check if already accepted
    const activeAssignment = assignments.find(a => a.jobId === job.id && a.status === 'accepted');
    if (activeAssignment) return false;
    
    // Check daily limit
    const today = new Date().toDateString();
    const todayAssignments = assignments.filter(a => 
      new Date(a.startedAt).toDateString() === today
    );
    if (todayAssignments.length >= DAILY_JOB_LIMIT) return false;
    
    return true;
  };

  const getJobAssignment = (jobId: string) => {
    return assignments.find(a => a.jobId === jobId && a.status === 'accepted');
  };

  const today = new Date().toDateString();
  const todayJobsCount = assignments.filter(a => 
    new Date(a.startedAt).toDateString() === today
  ).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">💼 Munka Közvetítő</h2>
        <p className="text-muted-foreground">
          Vállalj munkákat, hogy érmét és tapasztalatot szerezz!
        </p>
        <div className="mt-2">
          <Badge variant={todayJobsCount >= DAILY_JOB_LIMIT ? "destructive" : "secondary"}>
            Ma elvégzett munkák: {todayJobsCount}/{DAILY_JOB_LIMIT}
          </Badge>
        </div>
      </div>

      {/* Active Jobs */}
      {assignments.filter(a => a.status === 'accepted').length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">🔄 Folyamatban lévő munkák</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {assignments
              .filter(a => a.status === 'accepted')
              .map(assignment => {
                const job = jobs.find(j => j.id === assignment.jobId);
                if (!job) return null;
                
                const remaining = timeRemaining[assignment.id] || 0;
                const canComplete = remaining === 0;

                return (
                  <Card key={assignment.id} className="bg-gradient-worm/10 border-worm/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{job.icon}</span>
                          <CardTitle className="text-lg">{job.nameHu}</CardTitle>
                        </div>
                        <Badge variant="outline">Folyamatban</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {canComplete ? (
                          <span className="text-nature-green font-semibold">✅ Befejezés kész!</span>
                        ) : (
                          <span>🕒 Hátralevő idő: {formatTime(remaining)}</span>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => onCompleteJob(assignment.id)}
                        disabled={!canComplete}
                        className="w-full transition-bounce"
                        variant={canComplete ? "default" : "outline"}
                      >
                        {canComplete ? 'Befejezés' : `Várj még ${formatTime(remaining)}`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Available Jobs */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">📋 Elérhető munkák</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => {
            const canAccept = canAcceptJob(job);
            const assignment = getJobAssignment(job.id);
            const isActive = !!assignment;

            return (
              <Card key={job.id} className={`transition-all duration-300 ${
                isActive ? 'bg-worm/10 border-worm/30 opacity-50' : 
                canAccept ? 'bg-gradient-nature/10 border-nature-green/30 hover:shadow-nature' : 
                'bg-muted/10 border-muted'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{job.icon}</span>
                      <CardTitle className="text-lg">{job.nameHu}</CardTitle>
                    </div>
                    <Badge variant={worm.level >= job.minLevel ? "default" : "outline"}>
                      Szint {job.minLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {job.descriptionHu}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Job details */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{job.durationMinutes}p</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⚡</span>
                      <span>{job.energyCost}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🪙</span>
                      <span>+{job.rewardCoins}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✨</span>
                      <span>+{job.rewardXp} XP</span>
                    </div>
                  </div>

                  {/* Stat requirements */}
                  {Object.keys(job.statRequirements).length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground">Követelmények:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(job.statRequirements).map(([stat, required]) => {
                          const statValue = worm[stat as keyof Pick<Worm, 'strength' | 'agility' | 'endurance' | 'stamina' | 'intelligence' | 'charisma'>] as number;
                          const statName = stat === 'strength' ? 'Erő' :
                            stat === 'agility' ? 'Ügyesség' :
                            stat === 'endurance' ? 'Kitartás' :
                            stat === 'stamina' ? 'Állóképesség' :
                            stat === 'intelligence' ? 'Intelligencia' : 'Karizma';
                          
                          return (
                            <Badge 
                              key={stat} 
                              variant={statValue >= (required as number) ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {statName} {required}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => onAcceptJob(job.id)}
                    disabled={!canAccept || isActive}
                    className="w-full transition-bounce"
                    variant={canAccept && !isActive ? "default" : "outline"}
                  >
                    {isActive ? 'Folyamatban' :
                     !canAccept ? (
                       worm.level < job.minLevel ? 'Alacsony szint' :
                       worm.energy < job.energyCost ? 'Nincs energia' :
                       todayJobsCount >= DAILY_JOB_LIMIT ? 'Napi limit' :
                       'Nem felel meg'
                     ) : 'Elfogadás'
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};