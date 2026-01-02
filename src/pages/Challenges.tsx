import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/common/SEO';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import CalendarHeroDemo from '@/components/challenges/CalendarHeroDemo';
import EnrollmentDialog from '@/components/challenges/EnrollmentDialog';
import { useChallenges, Challenge } from '@/hooks/useChallenges';
import { useUserChallenges } from '@/hooks/useUserChallenge';
import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Calendar, 
  Gift, 
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Target,
  TrendingUp
} from 'lucide-react';

export default function Challenges() {
  const navigate = useNavigate();
  const { data: challenges, isLoading } = useChallenges();
  const { data: userChallenges } = useUserChallenges();
  const { theme } = useSeasonalTheme();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Filter challenges by category
  const filteredChallenges = challenges?.filter(c => 
    !categoryFilter || c.category === categoryFilter
  ) || [];
  
  // Get unique categories
  const categories = [...new Set(challenges?.map(c => c.category) || [])];
  
  // Check if user has active challenges
  const activeChallenges = userChallenges?.filter(uc => uc.status === 'active') || [];
  
  const handleEnrollmentSuccess = (userChallengeId: string) => {
    setSelectedChallenge(null);
    navigate(`/challenges/${userChallengeId}`);
  };
  
  return (
    <>
      <SEO 
        title="30-Day Beauty Challenges | 1Health Essentials"
        description="Transform your skin, hair, and body with our guided 30-day challenges. Get exclusive discounts, daily tips, and track your progress."
      />
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section - Dark theme like Holiday Deals */}
        <section className="relative py-12 md:py-20 bg-[hsl(222.2,84%,4.9%)] overflow-hidden">
          {/* Decorative sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            <Sparkles className="absolute top-10 left-[10%] h-5 w-5 text-primary/40 animate-pulse" />
            <Sparkles className="absolute top-20 right-[15%] h-4 w-4 text-accent/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-20 left-[20%] h-4 w-4 text-primary/30 animate-pulse" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute bottom-10 right-[25%] h-5 w-5 text-accent/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text Content */}
              <div className="text-center lg:text-left">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                  <Gift className="h-3 w-3 mr-1" />
                  Save Up To 20% On Products
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                  30-Day Beauty Challenges
                </h1>
                <p className="text-lg text-white/70 mb-6 max-w-xl">
                  Transform your routine with guided daily steps, expert tips, and exclusive product discounts. Track your progress and see real results.
                </p>
                
                {/* How it works snippet */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Choose a challenge that matches your goals</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Complete daily routines & track your progress</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">See results & earn exclusive discounts</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-sm text-white/80">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span>6 Challenges</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-sm text-white/80">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>30 Days Each</span>
                  </div>
                </div>
              </div>
              
              {/* Right: Calendar Demo */}
              <div className="lg:pl-8">
                <CalendarHeroDemo />
              </div>
            </div>
          </div>
        </section>
        
        {/* Active Challenges Section */}
        {activeChallenges.length > 0 && (
          <section className="py-8 bg-primary/5 border-y border-primary/20">
            <div className="container">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Your Active Challenges</h2>
                  <p className="text-sm text-muted-foreground">Continue your journey to see results</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeChallenges.map((uc) => {
                  const challenge = challenges?.find(c => c.id === uc.challenge_id);
                  const progress = Math.round((uc.current_day / 30) * 100);
                  
                  return (
                    <Card 
                      key={uc.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-primary/20"
                      onClick={() => navigate(`/challenges/${uc.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm line-clamp-1">
                              {challenge?.title || 'Challenge'}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Day {uc.current_day} of 30
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            {progress}%
                          </Badge>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        
                        <Button size="sm" className="w-full" variant="outline">
                          Continue
                          <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        
        {/* Category Filter */}
        <section className="py-6 border-b border-border/30">
          <div className="container">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Button
                variant={categoryFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(null)}
              >
                All Challenges
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Challenges Grid */}
        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onSelect={setSelectedChallenge}
                  />
                ))}
              </div>
            )}
            
            {!isLoading && filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
                <p className="text-muted-foreground">Try changing your filter or check back later.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* How It Works - with holiday deals gradient for discount section */}
        <section className="py-16 bg-[hsl(222.2,84%,4.9%)]">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">How It Works</h2>
            <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
              Our 30-day challenges are designed to help you build lasting habits while enjoying exclusive discounts on our premium products.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Choose Your Challenge", desc: "Pick a 30-day challenge that matches your beauty goals", icon: Target },
                { step: 2, title: "Get Your Products", desc: "Enjoy exclusive discounts on recommended products", icon: Gift },
                { step: 3, title: "Follow Daily Steps", desc: "Receive tips and track your progress each day", icon: Calendar },
                { step: 4, title: "See Results", desc: "Complete the challenge and celebrate your transformation", icon: Trophy },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs text-white/40 mb-2">Step {item.step}</div>
                    <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            
            {/* Discount highlight with seasonal gradient */}
            <div 
              className="mt-12 p-6 rounded-2xl text-white text-center"
              style={{ background: `linear-gradient(to right, ${theme.accentGradient.from}, ${theme.accentGradient.to})` }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-6 w-6" />
                <span className="text-2xl font-bold">Up to 20% OFF</span>
              </div>
              <p className="text-white/90">on all challenge products when you enroll</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Enrollment Dialog */}
      <EnrollmentDialog
        challenge={selectedChallenge}
        isOpen={selectedChallenge !== null}
        onClose={() => setSelectedChallenge(null)}
        onSuccess={handleEnrollmentSuccess}
      />
    </>
  );
}