import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  AlertTriangle,
  Trophy,
  Flame,
  Calendar as CalendarIcon
} from 'lucide-react';
import { ChallengeProgress, UserChallenge } from '@/hooks/useUserChallenge';
import { ChallengeDay } from '@/hooks/useChallenges';
import DayDetailModal from './DayDetailModal';
import { cn } from '@/lib/utils';

interface ChallengeCalendarProps {
  userChallenge: UserChallenge;
  progress: ChallengeProgress[];
  days: ChallengeDay[];
  onDayComplete: (dayNumber: number, completed: boolean, notes?: string) => void;
}

export default function ChallengeCalendar({ 
  userChallenge, 
  progress, 
  days,
  onDayComplete 
}: ChallengeCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Calculate stats
  const stats = useMemo(() => {
    const completedDays = progress.filter(p => p.completed).length;
    const totalDays = 30;
    const percentage = Math.round((completedDays / totalDays) * 100);
    
    // Calculate current streak
    let streak = 0;
    const sortedProgress = [...progress].sort((a, b) => b.day_number - a.day_number);
    for (const p of sortedProgress) {
      if (p.completed) streak++;
      else break;
    }
    
    // Calculate days since start
    const startDate = new Date(userChallenge.started_at);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = Math.min(daysSinceStart, 30);
    
    return { completedDays, totalDays, percentage, streak, currentDay };
  }, [progress, userChallenge]);
  
  // Get day status
  const getDayStatus = (dayNumber: number) => {
    const dayProgress = progress.find(p => p.day_number === dayNumber);
    
    if (dayProgress?.completed) return 'completed';
    if (dayNumber > stats.currentDay) return 'locked';
    if (dayNumber < stats.currentDay && !dayProgress?.completed) return 'missed';
    if (dayNumber === stats.currentDay) return 'today';
    return 'pending';
  };
  
  // Get selected day data
  const selectedDayData = useMemo(() => {
    if (!selectedDay) return null;
    return days.find(d => d.day_number === selectedDay) || null;
  }, [selectedDay, days]);
  
  const selectedDayProgress = useMemo(() => {
    if (!selectedDay) return null;
    return progress.find(p => p.day_number === selectedDay) || null;
  }, [selectedDay, progress]);
  
  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.completedDays}</p>
            <p className="text-xs text-muted-foreground">Days Complete</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange/20 to-orange/5 border-orange/30">
          <CardContent className="p-4 text-center">
            <CalendarIcon className="h-6 w-6 mx-auto mb-2 text-orange" />
            <p className="text-2xl font-bold">Day {stats.currentDay}</p>
            <p className="text-xs text-muted-foreground">Current Day</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo/20 to-indigo/5 border-indigo/30">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-indigo" />
            <p className="text-2xl font-bold">{stats.percentage}%</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.completedDays}/{stats.totalDays} days
            </span>
          </div>
          <Progress value={stats.percentage} className="h-3" />
          
          {userChallenge.missed_days_streak > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {userChallenge.missed_days_streak} day{userChallenge.missed_days_streak > 1 ? 's' : ''} missed
                </span>
              </div>
              {userChallenge.missed_days_streak >= 5 && (
                <p className="text-xs text-muted-foreground mt-1">
                  ⚠️ Challenge will reset after 7 consecutive missed days
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            30-Day Challenge Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const status = getDayStatus(day);
              const dayData = days.find(d => d.day_number === day);
              
              return (
                <button
                  key={day}
                  onClick={() => status !== 'locked' && setSelectedDay(day)}
                  disabled={status === 'locked'}
                  className={cn(
                    "relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all",
                    "border-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary",
                    status === 'completed' && "bg-primary/20 border-primary text-primary",
                    status === 'today' && "bg-accent/20 border-accent text-accent animate-pulse",
                    status === 'missed' && "bg-destructive/20 border-destructive text-destructive",
                    status === 'locked' && "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed",
                    status === 'pending' && "bg-card border-border hover:border-primary",
                  )}
                >
                  {status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 absolute top-1 right-1" />
                  )}
                  {status === 'locked' && (
                    <Lock className="h-3 w-3 absolute top-1 right-1" />
                  )}
                  {status === 'missed' && (
                    <AlertTriangle className="h-3 w-3 absolute top-1 right-1" />
                  )}
                  
                  <span className="font-bold text-lg">{day}</span>
                  {dayData && (
                    <span className="text-[10px] truncate w-full px-1 text-center opacity-70">
                      {dayData.routine_time === 'morning' ? '🌅' : dayData.routine_time === 'evening' ? '🌙' : '☀️'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent/20 border-2 border-accent animate-pulse" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive" />
              <span className="text-xs text-muted-foreground">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted/50 border-2 border-muted" />
              <span className="text-xs text-muted-foreground">Locked</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        dayNumber={selectedDay || 1}
        dayData={selectedDayData}
        progress={selectedDayProgress}
        status={selectedDay ? getDayStatus(selectedDay) : 'pending'}
        onComplete={(completed, notes) => {
          if (selectedDay) {
            onDayComplete(selectedDay, completed, notes);
          }
        }}
      />
    </div>
  );
}
