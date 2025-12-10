import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Challenge } from '@/hooks/useChallenges';
import { useEnrollChallenge } from '@/hooks/useUserChallenge';
import { useAuth } from '@/contexts/AuthContext';
import { useCatalogueProducts } from '@/hooks/useCatalogueProducts';
import { 
  Calendar, 
  Gift, 
  CheckCircle2, 
  Mail, 
  Loader2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface EnrollmentDialogProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userChallengeId: string) => void;
}

export default function EnrollmentDialog({ 
  challenge, 
  isOpen, 
  onClose,
  onSuccess 
}: EnrollmentDialogProps) {
  const { user } = useAuth();
  const { data: products } = useCatalogueProducts();
  const enrollMutation = useEnrollChallenge();
  
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  if (!challenge) return null;
  
  // Get recommended products
  const recommendedProducts = products?.filter(p => 
    challenge.recommended_products.includes(p.productNum || '')
  ).slice(0, 4) || [];
  
  // Create product snapshot with current prices
  const productSnapshot = recommendedProducts.reduce((acc, p) => ({
    ...acc,
    [p.productNum || '']: {
      name: p.name,
      price: p.price,
      discountedPrice: Math.round(p.price * (1 - challenge.discount_percent / 100)),
    }
  }), {});
  
  const handleEnroll = async () => {
    if (!email || !agreedToTerms) return;
    
    try {
      const result = await enrollMutation.mutateAsync({
        challengeId: challenge.id,
        email,
        fullName: fullName || undefined,
        challengeType: challenge.challenge_type,
        productSnapshot,
      });
      
      onSuccess(result.id);
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };
  
  const benefits = [
    "📧 Daily tips & reminders sent to your email",
    "🎁 Exclusive discount on challenge products",
    "📊 Progress tracking with visual calendar",
    "⏰ Gentle nudges if you miss a day",
    "🏆 Completion certificate & bonus rewards",
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-challenge text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{challenge.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {challenge.duration_days} days • {challenge.difficulty} level
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Discount Banner */}
          <div className="bg-gradient-challenge rounded-xl p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="h-8 w-8" />
                <div>
                  <p className="font-bold text-lg">{challenge.discount_percent}% OFF</p>
                  <p className="text-sm text-primary-foreground/80">On all challenge products</p>
                </div>
              </div>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                Exclusive Offer
              </Badge>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              What You'll Get
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-muted-foreground pl-6">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Recommended Products Preview */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-accent" />
              Recommended Products
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {recommendedProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs line-through text-muted-foreground">
                          KES {product.price.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-primary">
                          KES {Math.round(product.price * (1 - challenge.discount_percent / 100)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Enrollment Form */}
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Your Name (Optional)</Label>
              <Input
                id="fullName"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll send your challenge guide, daily tips, and discount code here.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to receive challenge-related emails and understand I can unsubscribe anytime.
              </Label>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-gradient-challenge text-primary-foreground hover:opacity-90"
              onClick={handleEnroll}
              disabled={!email || !agreedToTerms || enrollMutation.isPending}
            >
              {enrollMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Starting...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Start My {challenge.duration_days}-Day Challenge
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
