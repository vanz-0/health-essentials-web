import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, Calendar, Gift, ArrowRight } from 'lucide-react';

export default function ChallengeBanner() {
  return (
    <div className="container mt-12">
      <Link to="/challenges" className="block">
        <div className="bg-gradient-challenge rounded-2xl p-8 text-primary-foreground hover:shadow-2xl transition-all duration-300 border border-primary/20 relative overflow-hidden group">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* Decorative icons */}
          <div className="absolute top-4 right-4 text-3xl animate-bounce opacity-60" style={{ animationDuration: '2s' }}>✨</div>
          <div className="absolute bottom-4 left-4 text-2xl twinkle-star opacity-50">💫</div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Trophy className="h-16 w-16 flex-shrink-0 text-accent" />
                <Sparkles className="h-6 w-6 absolute -top-1 -right-1 text-primary-foreground animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  30-Day Beauty Challenges
                </h3>
                <p className="text-primary-foreground/90 mb-3">
                  Transform your skincare, haircare & bodycare routines with expert guidance
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1 bg-primary-foreground/20 px-3 py-1 rounded-full">
                    <Calendar className="h-4 w-4" /> 6 Challenge Types
                  </span>
                  <span className="flex items-center gap-1 bg-primary-foreground/20 px-3 py-1 rounded-full">
                    <Gift className="h-4 w-4" /> Up to 20% Off Products
                  </span>
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              variant="secondary"
              className="flex-shrink-0 group-hover:scale-105 transition-transform"
            >
              Start Your Challenge
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}