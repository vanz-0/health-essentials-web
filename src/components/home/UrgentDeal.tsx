import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Flame, ShoppingCart } from 'lucide-react';

interface UrgentDealProps {
  title: string;
  discount: number;
  originalPrice: number;
  timeLeft: number; // in minutes
  claimed: number;
  total: number;
}

export default function UrgentDeal({ 
  title, 
  discount, 
  originalPrice, 
  timeLeft: initialTimeLeft, 
  claimed, 
  total 
}: UrgentDealProps) {
  const { isEnabled } = useFeatureFlag('bit_2_fomo');
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [progress, setProgress] = useState((claimed / total) * 100);

  useEffect(() => {
    if (!isEnabled) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isEnabled]);

  useEffect(() => {
    setProgress((claimed / total) * 100);
  }, [claimed, total]);

  if (!isEnabled || timeLeft <= 0) return null;

  const discountedPrice = originalPrice * (1 - discount / 100);
  const hours = Math.floor(timeLeft / 60);
  const minutes = timeLeft % 60;

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg animate-pulse-glow">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="h-5 w-5 animate-urgent-bounce" />
        <Badge variant="secondary" className="bg-white/20 text-white">
          Flash Deal
        </Badge>
        <span className="text-sm font-mono">
          {hours}h {minutes}m left
        </span>
      </div>
      
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold">
          KSh {discountedPrice.toLocaleString()}
        </span>
        <span className="text-sm line-through opacity-75">
          KSh {originalPrice.toLocaleString()}
        </span>
        <Badge variant="secondary" className="bg-white/20 text-white">
          -{discount}%
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Claimed: {claimed}/{total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <Button 
        className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold"
        size="sm"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Claim Deal Now
      </Button>
    </div>
  );
}