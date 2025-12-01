import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trophy, CheckCircle2 } from 'lucide-react';

export default function ChallengeBanner() {
  const [isOpen, setIsOpen] = useState(false);

  const benefits = [
    "🎁 Transform your skin with our curated holiday skincare routine",
    "❄️ Daily tips and guidance from beauty experts",
    "🌟 Exclusive festive product recommendations",
    "📊 Track your progress with our challenge tracker",
    "🎄 Join a community of holiday beauty enthusiasts"
  ];

  return (
    <>
      <div 
        className="container mt-12 bg-gradient-christmas rounded-2xl p-8 text-white cursor-pointer hover:shadow-xl transition-shadow border-2 border-christmas-gold/30 relative overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-3xl animate-bounce opacity-60" style={{ animationDuration: '2s' }}>🎁</div>
        <div className="absolute bottom-4 left-4 text-2xl twinkle-star opacity-50">✨</div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Trophy className="h-16 w-16 flex-shrink-0 text-christmas-gold" />
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                🎄 Join Our Holiday Glow Challenge
              </h3>
              <p className="text-white/90">
                Start the New Year with radiant, glowing skin
              </p>
            </div>
          </div>
          <Button 
            size="lg" 
            variant="secondary"
            className="flex-shrink-0"
          >
            Learn More
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              30-Day Glow Challenge
            </DialogTitle>
            <DialogDescription className="text-base mt-4">
              Join thousands of beauty enthusiasts on a transformative journey to radiant, healthy skin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">What You'll Get:</h4>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-center">
                <strong>Coming Soon!</strong> We're putting the finishing touches on this amazing challenge. 
                Sign up for our newsletter to be the first to know when it launches.
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" size="lg">
                Notify Me When Available
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
