import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ContactCaptureForm from './ContactCaptureForm';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { cn } from '@/lib/utils';

const SLIDE_IN_KEY = 'scroll_slide_shown';
const COOLDOWN_HOURS = 24;
const SCROLL_THRESHOLD = 50; // Show after 50% scroll
const TIME_THRESHOLD = 30000; // Show after 30 seconds

export default function ScrollSlideIn() {
  const { isEnabled } = useFeatureFlag('bit_10_capture');
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    // Only on mobile (screen width <= 768px)
    if (window.innerWidth > 768) return;

    // Check if already shown recently
    const lastShown = localStorage.getItem(SLIDE_IN_KEY);
    if (lastShown) {
      const hoursSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
      if (hoursSince < COOLDOWN_HOURS) return;
    }

    let hasTriggered = false;

    // Scroll-based trigger
    const handleScroll = () => {
      if (hasTriggered) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= SCROLL_THRESHOLD) {
        hasTriggered = true;
        setIsVisible(true);
        localStorage.setItem(SLIDE_IN_KEY, Date.now().toString());
      }
    };

    // Time-based trigger
    const timeoutId = setTimeout(() => {
      if (!hasTriggered) {
        hasTriggered = true;
        setIsVisible(true);
        localStorage.setItem(SLIDE_IN_KEY, Date.now().toString());
      }
    }, TIME_THRESHOLD);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isEnabled]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleSuccess = () => {
    handleDismiss();
  };

  if (!isEnabled || !isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-2xl transition-transform duration-300 ease-out",
        isDismissed ? "translate-y-full" : "translate-y-0",
        "md:hidden" // Mobile only
      )}
    >
      <div className="container max-w-lg mx-auto p-4 pb-6">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mt-2">
          <h3 className="text-lg font-bold mb-1">🎁 Get 15% OFF Your First Order</h3>
          <p className="text-sm text-muted-foreground mb-3">Join 5,000+ health-conscious Kenyans</p>
          
          <ContactCaptureForm
            source="scroll_slide_mobile"
            variant="inline"
            onSuccess={handleSuccess}
          />
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            Free Nairobi delivery on first order.
          </p>
        </div>
      </div>
    </div>
  );
}
