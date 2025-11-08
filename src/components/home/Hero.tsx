import { Button } from "@/components/ui/button";
import { Star, Shield, Smartphone, MapPin } from "lucide-react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import heroImage from "@/assets/hero-1health.jpg";

export default function Hero() {
  const { isEnabled } = useFeatureFlag('bit_1_hero');

  if (isEnabled) {
    return (
      <section id="home" className="relative">
        <div className="relative h-[80vh] w-full overflow-hidden">
          <img 
            src={heroImage} 
            alt="Feel Better, Live Better - 1Health Essentials hero" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-cyan-400/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          
          <div className="absolute inset-0 container flex items-center">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="font-serifDisplay text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Feel Better, Live Better — Essentials That Fit Kenyan Life
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-6 max-w-2xl">
                Science-guided wellness, fast delivery in Nairobi & beyond.
              </p>
              
              {/* Trust Pills */}
              <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-1.5 md:gap-2 bg-background/80 backdrop-blur rounded-full px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium">
                  <span className="text-primary text-xs md:text-sm">KES</span>
                  <span className="text-xs md:text-sm">Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 bg-background/80 backdrop-blur rounded-full px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium">
                  <Smartphone className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  <span className="text-xs md:text-sm">M-Pesa Ready</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 bg-background/80 backdrop-blur rounded-full px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium">
                  <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  <span className="text-xs md:text-sm">30-Day Guarantee</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                <a href="#shop">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm md:text-lg px-5 py-5 md:px-8 md:py-6"
                  >
                    Shop Bestsellers
                  </Button>
                </a>
                <a href="#challenge">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/40 text-foreground hover:bg-white/10 backdrop-blur text-sm md:text-lg px-5 py-5 md:px-8 md:py-6"
                  >
                    30-Day Challenge
                  </Button>
                </a>
              </div>

              {/* Social Proof Strip */}
              <div className="flex items-center gap-4 text-sm text-foreground/80">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  <span className="ml-2 font-semibold">4.8</span>
                </div>
                <span>•</span>
                <span>Trusted by 5,000+ Kenyan customers</span>
                <span className="hidden md:inline">•</span>
                <div className="hidden md:flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Nairobi, Mombasa, Kisumu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    );
  }

  // Fallback to original hero
  return (
    <section id="home" className="relative pt-[112px]">
      <div className="relative h-[64vh] md:h-[72vh] w-full overflow-hidden rounded-none">
        <img src={heroImage} alt="Natural beauty and wellness hero - 1Health Essentials" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 container flex items-end pb-12">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-serifDisplay text-4xl md:text-5xl font-bold tracking-tight">
              Nourish Your Natural Beauty with 1Health Essentials
            </h1>
            <p className="mt-3 text-base md:text-lg text-foreground/80">
              Premium cosmetics and personal care products for your healthiest, most radiant self.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#shop"><Button size="lg" variant="accent" className="hover-scale">Shop Now</Button></a>
              <a href="#contact"><Button size="lg" variant="outline" className="hover-scale">Visit Our Store</Button></a>
            </div>
            <div className="mt-4 text-xs md:text-sm text-muted-foreground">
              Natural Ingredients • Cruelty-Free • Quality Tested • Local Kenyan Brand
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
