import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/hooks/useChallenges';
import { 
  Sparkles, 
  Scissors, 
  Heart, 
  Shield, 
  Palette, 
  Flower2,
  Calendar,
  Gift,
  Users
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Scissors,
  Heart,
  Shield,
  Palette,
  Flower2,
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-primary/15 text-primary border-primary/30',
  intermediate: 'bg-accent/15 text-accent border-accent/30',
  advanced: 'bg-orange/15 text-orange border-orange/30',
};

const categoryColors: Record<string, string> = {
  skincare: 'bg-primary/10 text-primary border-primary/20',
  haircare: 'bg-accent/10 text-accent border-accent/20',
  bodycare: 'bg-indigo/10 text-indigo border-indigo/20',
  makeup: 'bg-orange/10 text-orange border-orange/20',
};

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
  enrollmentCount?: number;
}

export default function ChallengeCard({ challenge, onSelect, enrollmentCount = 0 }: ChallengeCardProps) {
  const IconComponent = iconMap[challenge.icon] || Sparkles;
  
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-transparent hover:border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden"
      onClick={() => onSelect(challenge)}
    >
      {/* Discount Banner */}
      <div className="bg-gradient-challenge text-primary-foreground text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2">
          <Gift className="h-4 w-4" />
          <span className="text-sm font-semibold">{challenge.discount_percent}% OFF Challenge Products</span>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 rounded-xl bg-gradient-challenge text-primary-foreground shadow-lg">
            <IconComponent className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={difficultyColors[challenge.difficulty]}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className={categoryColors[challenge.category]}>
              {challenge.category}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
          {challenge.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {challenge.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{challenge.duration_days} days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{enrollmentCount > 0 ? `${enrollmentCount}+ joined` : 'Be first!'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="text-muted-foreground">Uses</span>
          <Badge variant="secondary" className="bg-secondary/50">
            {challenge.recommended_products.length} products
          </Badge>
        </div>
        
        <Button className="w-full bg-gradient-challenge hover:opacity-90 text-primary-foreground">
          Start This Challenge
        </Button>
      </CardContent>
    </Card>
  );
}
