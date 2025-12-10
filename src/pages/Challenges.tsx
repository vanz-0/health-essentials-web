import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/common/SEO';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import EnrollmentDialog from '@/components/challenges/EnrollmentDialog';
import { useChallenges, Challenge } from '@/hooks/useChallenges';
import { useUserChallenges } from '@/hooks/useUserChallenge';
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
  Filter
} from 'lucide-react';

export default function Challenges() {
  const navigate = useNavigate();
  const { data: challenges, isLoading } = useChallenges();
  const { data: userChallenges } = useUserChallenges();
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
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-challenge overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="container relative z-10 text-center text-primary-foreground">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">
              <Gift className="h-3 w-3 mr-1" />
              Exclusive Discounts on Products
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              30-Day Beauty Challenges
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Transform your routine with guided daily steps, expert tips, and exclusive product discounts. Track your progress and see real results.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
                <Trophy className="h-5 w-5" />
                <span>6 Challenges Available</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
                <Calendar className="h-5 w-5" />
                <span>30 Days Each</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
                <Gift className="h-5 w-5" />
                <span>Up to 20% Off Products</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Active Challenges Banner */}
        {activeChallenges.length > 0 && (
          <section className="py-6 bg-primary/10 border-y border-primary/20">
            <div className="container">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">You have {activeChallenges.length} active challenge{activeChallenges.length > 1 ? 's' : ''}!</p>
                    <p className="text-sm text-muted-foreground">Continue your journey to see results.</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate(`/challenges/${activeChallenges[0].id}`)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue Challenge
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Category Filter */}
        <section className="py-8 border-b border-border/50">
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
        
        {/* How It Works */}
        <section className="py-16 bg-secondary/20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: 1, title: "Choose Your Challenge", desc: "Pick a 30-day challenge that matches your goals" },
                { step: 2, title: "Get Your Products", desc: "Enjoy exclusive discounts on recommended products" },
                { step: 3, title: "Follow Daily Steps", desc: "Receive tips and track your progress each day" },
                { step: 4, title: "See Results", desc: "Complete the challenge and celebrate your transformation" },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-challenge text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
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
