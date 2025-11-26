import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlackNovemberPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const POPUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
  const STORAGE_KEY = "blackNovemberPopupLastShown";

  useEffect(() => {
    const checkAndShowPopup = () => {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();

      if (!lastShown || now - parseInt(lastShown) >= POPUP_INTERVAL) {
        setIsVisible(true);
        localStorage.setItem(STORAGE_KEY, now.toString());
      }
    };

    // Check immediately on mount
    setTimeout(checkAndShowPopup, 2000);

    // Set up interval
    const interval = setInterval(checkAndShowPopup, POPUP_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-28 right-4 z-40 animate-slide-in-right">
      <div className="relative w-64 bg-gradient-to-br from-black via-zinc-900 to-yellow-900 rounded-lg shadow-2xl overflow-hidden border-2 border-yellow-500">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-yellow-400 z-10"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-5 space-y-3">
          <div className="text-center">
            <h3 className="font-serifDisplay text-2xl font-bold text-yellow-400 mb-1">
              🔥 Black November!
            </h3>
            <p className="text-white/90 text-sm font-medium">
              Up to 50% OFF Premium Beauty
            </p>
          </div>
          
          <a
            href="https://1healthessentials.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
          >
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold shadow-lg">
              Shop Now →
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
