import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '@/components/common/SEO';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChallengeCalendar from '@/components/challenges/ChallengeCalendar';
import { useChallenge, useChallengeDays, useChallenges } from '@/hooks/useChallenges';
import { useUserChallenge, useChallengeProgress, useUpdateProgress } from '@/hooks/useUserChallenge';
import { useCatalogueProducts } from '@/hooks/useCatalogueProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Gift, 
  ShoppingCart, 
  Copy,
  CheckCircle2,
  Sparkles,
  Package,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ChallengeDetail() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  
  const { data: userChallenge, isLoading: isLoadingUserChallenge } = useUserChallenge(challengeId);
  const { data: challenge, isLoading: isLoadingChallenge } = useChallenge(userChallenge?.challenge_id);
  const { data: days, isLoading: isLoadingDays } = useChallengeDays(userChallenge?.challenge_id);
  const { data: progress, isLoading: isLoadingProgress } = useChallengeProgress(challengeId);
  const { data: products } = useCatalogueProducts();
  const { data: allChallenges } = useChallenges();
  const { addItem } = useCart();
  const updateProgress = useUpdateProgress();
  
  // Get other challenges (excluding current one)
  const otherChallenges = allChallenges?.filter(c => c.id !== challenge?.id) || [];
  
  const isLoading = isLoadingUserChallenge || isLoadingChallenge || isLoadingDays || isLoadingProgress;
  
  // Get recommended products
  const recommendedProducts = products?.filter(p => 
    challenge?.recommended_products?.includes(p.productNum || '')
  ) || [];
  
  const handleDayComplete = (dayNumber: number, completed: boolean, notes?: string) => {
    if (!challengeId) return;
    updateProgress.mutate({
      userChallengeId: challengeId,
      dayNumber,
      completed,
      notes,
    });
  };
  
  const handleCopyDiscount = () => {
    if (userChallenge?.discount_code) {
      navigator.clipboard.writeText(userChallenge.discount_code);
      toast({
        title: "Discount Code Copied!",
        description: `Use ${userChallenge.discount_code} at checkout for ${challenge?.discount_percent}% off.`,
      });
    }
  };
  
  const handleAddAllToCart = () => {
    recommendedProducts.forEach(product => {
      addItem({
        id: product.id,
        name: product.name,
        price: Math.round(product.price * (1 - (challenge?.discount_percent || 0) / 100)),
        image: product.image,
      }, 1);
    });
    toast({
      title: "Products Added to Cart!",
      description: `${recommendedProducts.length} challenge products added with your discount.`,
    });
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-8">
          <div className="container">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!userChallenge || !challenge) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-16">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This challenge doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <Link to="/challenges">Browse Challenges</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <SEO 
        title={`${challenge.title} | My Challenge | 1Health Essentials`}
        description={`Track your progress in the ${challenge.title}. ${challenge.description}`}
      />
      
      <Header />
      
      <main className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/10">
        <div className="container">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/challenges')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
          
          {/* Challenge Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-christmas text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{challenge.title}</h1>
              </div>
              <p className="text-muted-foreground">{challenge.description}</p>
            </div>
            
            <Badge 
              className={`
                ${userChallenge.status === 'active' ? 'bg-christmas-green/20 text-christmas-green border-christmas-green' : ''}
                ${userChallenge.status === 'completed' ? 'bg-christmas-gold/20 text-christmas-gold border-christmas-gold' : ''}
                ${userChallenge.status === 'paused' ? 'bg-muted text-muted-foreground' : ''}
                ${userChallenge.status === 'abandoned' ? 'bg-destructive/20 text-destructive border-destructive' : ''}
              `}
            >
              {userChallenge.status === 'active' && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {userChallenge.status.charAt(0).toUpperCase() + userChallenge.status.slice(1)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Calendar */}
            <div className="lg:col-span-2">
              <ChallengeCalendar
                userChallenge={userChallenge}
                progress={progress || []}
                days={days || []}
                onDayComplete={handleDayComplete}
              />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Discount Code Card */}
              {userChallenge.discount_code && (
                <Card className="bg-gradient-christmas text-white overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Your Discount Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <code className="flex-1 bg-white/20 rounded px-3 py-2 font-mono text-lg">
                        {userChallenge.discount_code}
                      </code>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-white hover:bg-white/20"
                        onClick={handleCopyDiscount}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-white/80">
                      {challenge.discount_percent}% off all challenge products
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Challenge Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendedProducts.slice(0, 4).map((product) => {
                      const discountedPrice = Math.round(product.price * (1 - challenge.discount_percent / 100));
                      return (
                        <div 
                          key={product.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs line-through text-muted-foreground">
                                KES {product.price.toLocaleString()}
                              </span>
                              <span className="text-sm font-bold text-christmas-green">
                                KES {discountedPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <Button 
                      className="w-full bg-gradient-christmas text-white hover:opacity-90 mt-4"
                      onClick={handleAddAllToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add All to Cart ({challenge.discount_percent}% Off)
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* Challenge Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Challenge Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started</span>
                    <span className="font-medium">
                      {new Date(userChallenge.started_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{challenge.duration_days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty</span>
                    <Badge variant="outline" className="capitalize">
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="secondary" className="capitalize">
                      {challenge.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Other Challenges */}
              {otherChallenges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Explore More Challenges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {otherChallenges.slice(0, 4).map((otherChallenge) => (
                      <Link
                        key={otherChallenge.id}
                        to={`/challenges`}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{otherChallenge.icon}</span>
                          <div>
                            <p className="text-sm font-medium">{otherChallenge.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {otherChallenge.category} • {otherChallenge.difficulty}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      asChild
                    >
                      <Link to="/challenges">
                        View All Challenges
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
