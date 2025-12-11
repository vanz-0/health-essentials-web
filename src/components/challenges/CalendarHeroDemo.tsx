import { CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo calendar showing how the 30-day challenge calendar looks
export default function CalendarHeroDemo() {
  // Demo data - shows filled days, missed days, locked days
  const demoStatuses = [
    'completed', 'completed', 'completed', 'completed', 'missed',
    'completed', 'completed', 'completed', 'missed', 'completed',
    'completed', 'completed', 'completed', 'completed', 'today',
    'locked', 'locked', 'locked', 'locked', 'locked',
    'locked', 'locked', 'locked', 'locked', 'locked',
    'locked', 'locked', 'locked', 'locked', 'locked',
  ] as const;
  
  return (
    <div className="bg-card/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 shadow-2xl">
      <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
        {Array.from({ length: 30 }, (_, i) => {
          const status = demoStatuses[i];
          const day = i + 1;
          
          return (
            <div
              key={day}
              className={cn(
                "relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all border-2",
                status === 'completed' && "bg-primary/30 border-primary text-primary",
                status === 'today' && "bg-christmas-gold/30 border-christmas-gold text-christmas-gold animate-pulse",
                status === 'missed' && "bg-destructive/30 border-destructive text-destructive",
                status === 'locked' && "bg-white/5 border-white/10 text-white/30",
              )}
            >
              {status === 'completed' && (
                <CheckCircle2 className="h-3 w-3 absolute top-0.5 right-0.5" />
              )}
              {status === 'locked' && (
                <Lock className="h-2.5 w-2.5 absolute top-0.5 right-0.5" />
              )}
              {status === 'missed' && (
                <AlertTriangle className="h-2.5 w-2.5 absolute top-0.5 right-0.5" />
              )}
              
              <span className="font-bold text-sm md:text-base text-white">{day}</span>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-white/10 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary/30 border-2 border-primary" />
          <span className="text-xs text-white/70">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-christmas-gold/30 border-2 border-christmas-gold" />
          <span className="text-xs text-white/70">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-destructive/30 border-2 border-destructive" />
          <span className="text-xs text-white/70">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white/5 border-2 border-white/10" />
          <span className="text-xs text-white/70">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
