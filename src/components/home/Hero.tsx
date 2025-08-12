import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-1health.jpg";

export default function Hero() {
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
