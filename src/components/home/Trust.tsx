import { Leaf, ShieldCheck, Heart, Truck } from "lucide-react";

const items = [
  { icon: Leaf, title: "100% Natural Ingredients", desc: "Clean, safe, and effective formulas." },
  { icon: ShieldCheck, title: "Dermatologically Tested", desc: "Quality you can trust for your skin." },
  { icon: Heart, title: "Cruelty-Free Certified", desc: "Beauty with compassion and care." },
  { icon: Truck, title: "Free Local Delivery", desc: "Enjoy free delivery within Kiambu." },
];

export default function Trust() {
  return (
    <section className="mt-16 py-10 bg-secondary">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
