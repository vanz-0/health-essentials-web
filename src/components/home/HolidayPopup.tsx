import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const POPUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = 'holidayPopupLastShown';

export default function HolidayPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown) > POPUP_INTERVAL) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem(STORAGE_KEY, now.toString());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-md w-full bg-gradient-christmas rounded-2xl p-8 text-white shadow-2xl border-4 border-christmas-gold animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 hover:bg-white/20 rounded-full p-2 transition-all"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center space-y-4">
          {/* Decorative elements */}
          <div className="flex justify-center gap-3 mb-4">
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎄</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎁</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>❄️</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold font-serifDisplay mb-2">
            🎊 Merry Christmas Sale!
          </h2>
          
          <p className="text-xl font-semibold mb-4">
            Up to 50% OFF Premium Beauty Gifts
          </p>
          
          <p className="text-white/90 mb-6">
            Celebrate the season with exclusive deals on our best-selling beauty and wellness products. Perfect gifts for your loved ones! 🌟
          </p>
          
          {/* Decorative snowflakes */}
          <div className="flex justify-center gap-2 text-2xl mb-4">
            <span className="twinkle-star" style={{ animationDelay: '0s' }}>✨</span>
            <span className="twinkle-star" style={{ animationDelay: '0.3s' }}>⭐</span>
            <span className="twinkle-star" style={{ animationDelay: '0.6s' }}>✨</span>
          </div>
          
          <a
            href="https://1healthessentials.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="inline-block bg-white text-christmas-red px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            🎁 Shop Holiday Gifts Now
          </a>
          
          <p className="text-sm text-white/70 mt-4">
            Free delivery on orders over KES 3,000 • Valid until New Year's
          </p>
        </div>
      </div>
    </div>
  );
}
