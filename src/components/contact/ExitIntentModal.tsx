import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import ContactCaptureForm from './ContactCaptureForm';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

const EXIT_INTENT_KEY = 'exit_intent_shown';
const COOLDOWN_HOURS = 24;

export default function ExitIntentModal() {
  const { isEnabled } = useFeatureFlag('bit_10_capture');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    // Check if already shown recently
    const lastShown = localStorage.getItem(EXIT_INTENT_KEY);
    if (lastShown) {
      const hoursSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
      if (hoursSince < COOLDOWN_HOURS) return;
    }

    // Exit intent handler (mouse leaving viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isOpen) {
        setIsOpen(true);
        localStorage.setItem(EXIT_INTENT_KEY, Date.now().toString());
      }
    };

    // Only on desktop (screen width > 768px)
    if (window.innerWidth > 768) {
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [isEnabled, isOpen]);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  if (!isEnabled) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        
        <DialogHeader>
          <DialogTitle className="sr-only">Subscribe for discount</DialogTitle>
        </DialogHeader>
        
        <ContactCaptureForm
          source="exit_intent_modal"
          variant="popup"
          onSuccess={handleSuccess}
          incentiveText="Join 5,000+ health-conscious Kenyans"
        />
      </DialogContent>
    </Dialog>
  );
}
