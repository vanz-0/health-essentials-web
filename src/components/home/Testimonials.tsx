import avatar1 from "@/assets/testimonial-1.jpg";
import avatar2 from "@/assets/testimonial-2.jpg";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aisha M.",
    location: "Kiambu",
    avatar: avatar1,
    rating: 5,
    quote: "My skin has never felt better. Truly premium products and excellent service!",
  },
  {
    name: "Kevin O.",
    location: "Nairobi",
    avatar: avatar2,
    rating: 4.5,
    quote: "Fast delivery and amazing quality. The body butter is a game changer.",
  },
];

export default function Testimonials() {
  return (
    <section className="mt-16 bg-muted/40">
      <div className="container py-12" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="font-serifDisplay text-2xl md:text-3xl font-semibold text-center">Loved by 1,000+ Customers</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={`${t.name} testimonial - 1Health Essentials`} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.location}</div>
                </div>
              </div>
              <p className="mt-4 text-foreground/80">“{t.quote}”</p>
              <div className="mt-3 inline-flex items-center gap-1 text-primary">
                {Array.from({ length: Math.floor(t.rating) }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                {t.rating % 1 !== 0 && <Star className="h-4 w-4" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
