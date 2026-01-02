import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChallengeDay } from '@/hooks/useChallenges';
import { ChallengeProgress } from '@/hooks/useUserChallenge';
import { useCatalogueProducts } from '@/hooks/useCatalogueProducts';
import { useCart } from '@/contexts/CartContext';
import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext';
import { 
  CheckCircle2, 
  Circle, 
  Sun, 
  Moon, 
  Clock,
  ShoppingCart,
  Sparkles,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  dayData: ChallengeDay | null;
  progress: ChallengeProgress | null;
  status: 'completed' | 'today' | 'missed' | 'locked' | 'pending';
  onComplete: (completed: boolean, notes?: string) => void;
}

export default function DayDetailModal({
  isOpen,
  onClose,
  dayNumber,
  dayData,
  progress,
  status,
  onComplete,
}: DayDetailModalProps) {
  const { data: products } = useCatalogueProducts();
  const { addItem } = useCart();
  const { theme } = useSeasonalTheme();
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Update state when progress changes
  useEffect(() => {
    setNotes(progress?.notes || '');
    setIsCompleted(progress?.completed || false);
  }, [progress]);
  
  // Get recommended products for this day
  const recommendedProducts = products?.filter(p => 
    dayData?.product_nums?.includes(p.productNum || '')
  ) || [];
  
  const handleComplete = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    onComplete(newCompleted, notes);
  };
  
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }, 1);
  };
  
  const routineIcon = dayData?.routine_time === 'morning' 
    ? <Sun className="h-4 w-4 text-primary" />
    : dayData?.routine_time === 'evening'
    ? <Moon className="h-4 w-4 text-indigo-500" />
    : <Clock className="h-4 w-4 text-muted-foreground" />;
  
  const routineLabel = dayData?.routine_time === 'morning' 
    ? 'Morning Routine'
    : dayData?.routine_time === 'evening'
    ? 'Evening Routine'
    : 'Morning & Evening';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl
                ${status === 'completed' ? 'bg-accent/20 text-accent' : ''}
                ${status === 'today' ? 'bg-primary/20 text-primary' : ''}
                ${status === 'missed' ? 'bg-destructive/20 text-destructive' : ''}
                ${status === 'locked' ? 'bg-muted text-muted-foreground' : ''}
                ${status === 'pending' ? 'bg-primary/20 text-primary' : ''}
              `}>
                {dayNumber}
              </div>
              <div>
                <DialogTitle>Day {dayNumber}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {dayData?.title || 'Challenge Day'}
                </p>
              </div>
            </div>
            
            {status === 'completed' && (
              <Badge className="bg-accent/20 text-accent border-accent">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
            {status === 'today' && (
              <Badge className="bg-primary/20 text-primary border-primary animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                Today
              </Badge>
            )}
            {status === 'missed' && (
              <Badge className="bg-destructive/20 text-destructive border-destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Missed
              </Badge>
            )}
            {status === 'locked' && (
              <Badge variant="secondary">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Routine Time */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
            {routineIcon}
            <span className="text-sm font-medium">{routineLabel}</span>
          </div>
          
          {/* Daily Tip */}
          {dayData?.tip && (
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Today's Tip
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                {dayData.tip}
              </p>
            </div>
          )}
          
          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Products for Today</h4>
              <div className="space-y-2">
                {recommendedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-sm text-accent font-bold">
                        KES {product.price.toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Notes */}
          {status !== 'locked' && (
            <div className="space-y-2">
              <Label htmlFor="notes">Your Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did today go? Any observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}
          
          {/* Complete Button */}
          {status !== 'locked' && (
            <Button
              className="w-full text-white hover:opacity-90"
              style={{ background: isCompleted ? 'hsl(var(--accent))' : `linear-gradient(to right, ${theme.gradient.from}, ${theme.gradient.to})` }}
              onClick={handleComplete}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completed! (Click to Undo)
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 mr-2" />
                  Mark Day {dayNumber} as Complete
                </>
              )}
            </Button>
          )}
          
          {status === 'locked' && (
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                This day will unlock when you reach it in your challenge journey.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
