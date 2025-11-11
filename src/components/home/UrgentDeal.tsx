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
  image: string;
}

export default function UrgentDeal({ 
  title, 
  discount, 
  originalPrice, 
  timeLeft: initialTimeLeft, 
  claimed, 
  total,
  image
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
    <div 
      className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 md:p-4 rounded-lg animate-pulse-glow relative overflow-hidden"
    >
      {/* Product image overlay - single clear image */}
      <div 
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none w-32 h-32 md:w-44 md:h-44"
      >
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}
        />
      </div>
      
      {/* Content with relative positioning to stay above background */}
      <div className="relative z-10">
      <div className="flex items-center gap-1.5 md:gap-2 mb-2">
        <Flame className="h-4 w-4 md:h-5 md:w-5 animate-urgent-bounce" />
        <Badge variant="secondary" className="bg-white/20 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5">
          Flash Deal
        </Badge>
        <span className="text-xs md:text-sm font-mono">
          {hours}h {minutes}m
        </span>
      </div>
      
      <h3 className="font-bold text-sm md:text-lg mb-1 line-clamp-2 pr-16 md:pr-24">{title}</h3>
      
      <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2 md:mb-3">
        <span className="text-lg md:text-2xl font-bold">
          KSh {Math.round(discountedPrice).toLocaleString()}
        </span>
        <span className="text-xs md:text-sm line-through opacity-75">
          KSh {Math.round(originalPrice).toLocaleString()}
        </span>
        <Badge variant="secondary" className="bg-white/20 text-white text-[10px] md:text-xs px-1 md:px-1.5">
          -{discount}%
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-2 md:mb-3">
        <div className="flex justify-between text-xs md:text-sm mb-1">
          <span>Claimed: {claimed}/{total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1.5 md:h-2">
          <div 
            className="bg-white h-1.5 md:h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <Button 
        className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold text-xs md:text-sm py-2"
        size="sm"
      >
        <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
        Claim Deal
      </Button>
      </div>
    </div>
  );
}