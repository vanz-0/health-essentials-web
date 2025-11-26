import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import blackNovemberBanner from "@/assets/black-november-banner.jpg";

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

    // Check immediately
    checkAndShowPopup();

    // Set up interval
    const interval = setInterval(checkAndShowPopup, POPUP_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-40 animate-slide-in-right">
      <div className="relative w-80 bg-gradient-to-br from-black via-gray-900 to-yellow-900 rounded-lg shadow-2xl overflow-hidden border-2 border-yellow-600">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative">
          <img
            src={blackNovemberBanner}
            alt="Black November Sale"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-serifDisplay text-2xl font-bold text-yellow-400">
            Black November Sale
          </h3>
          <p className="text-white/90 text-sm">
            Exclusive deals on premium beauty essentials! Limited time offers that you don't want to miss.
          </p>
          
          <a
            href="https://1healthessentials.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
          >
            <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold">
              Shop Black November Sale →
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
