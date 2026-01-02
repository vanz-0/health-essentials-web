import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext';

interface FlashBannerProps {
  endTime: Date;
  message: string;
}

export default function FlashBanner({ endTime, message }: FlashBannerProps) {
  const { isEnabled } = useFeatureFlag('bit_2_fomo');
  const { theme } = useSeasonalTheme();
  const [timeLeft, setTimeLeft] = useState(endTime.getTime() - Date.now());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;
    
    const interval = setInterval(() => {
      const remaining = endTime.getTime() - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, isEnabled]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isEnabled || !isVisible || timeLeft <= 0) return null;

  // Use seasonal theme gradient
  const gradientStyle = {
    background: `linear-gradient(to right, ${theme.gradient.from}, ${theme.gradient.to})`,
  };

  return (
    <div 
      className="text-white py-2 px-4 relative" 
      style={gradientStyle}
      role="banner" 
      aria-live="polite"
    >
      <div className="container flex items-center justify-center gap-2 text-sm md:text-base font-medium">
        <span>{theme.bannerEmoji} {message}</span>
        <span className="font-mono" aria-label={`Time remaining: ${formatTime(timeLeft)}`}>
          {formatTime(timeLeft)}
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded p-1"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
