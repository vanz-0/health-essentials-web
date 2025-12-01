import { Leaf, ShieldCheck, Heart, Truck } from "lucide-react";

const items = [
  { icon: Leaf, title: "100% Natural Ingredients", desc: "Clean, safe, and effective formulas." },
  { icon: ShieldCheck, title: "Dermatologically Tested", desc: "Quality you can trust for your skin." },
  { icon: Heart, title: "Cruelty-Free Certified", desc: "Beauty with compassion and care." },
  { icon: Truck, title: "Free Local Delivery", desc: "Enjoy free delivery within Kiambu." },
];

export default function Trust() {
  return (
    <section className="mt-16 py-10 bg-secondary relative overflow-hidden">
      {/* Subtle festive background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-10 text-4xl">❄️</div>
        <div className="absolute top-12 right-20 text-3xl">⭐</div>
        <div className="absolute bottom-8 left-1/4 text-4xl">🎄</div>
        <div className="absolute bottom-4 right-1/3 text-3xl">✨</div>
      </div>
      
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-3">
            <it.icon className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold">{it.title}</div>
              <p className="text-sm text-secondary-foreground/80">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
