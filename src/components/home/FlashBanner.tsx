import { useState } from 'react';
import { X } from 'lucide-react';
import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext';

interface FlashBannerProps {
  message?: string;
}

export default function FlashBanner({ message }: FlashBannerProps) {
  const { theme } = useSeasonalTheme();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Use seasonal theme gradient
  const gradientStyle = {
    background: `linear-gradient(to right, ${theme.gradient.from}, ${theme.gradient.to})`,
  };

  const displayMessage = message || `${theme.saleBadgeText}! Shop Now`;

  return (
    <div 
      className="text-white py-2 px-4 relative" 
      style={gradientStyle}
      role="banner"
    >
      <div className="container flex items-center justify-center gap-2 text-sm md:text-base font-medium">
        <span>{theme.bannerEmoji} {displayMessage} {theme.bannerEmoji}</span>
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
