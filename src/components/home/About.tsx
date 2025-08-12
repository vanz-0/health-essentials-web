import aboutImage from "@/assets/category-skincare.jpg";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section id="about" className="container mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Our Commitment to Quality</h2>
        <p className="mt-4 text-foreground/80">
          At 1Health Essentials, our mission is to empower your natural beauty and overall wellness. We craft and curate premium cosmetics and personal care products with clean, effective ingredients—thoughtfully sourced and tested for quality.
        </p>
        <Button variant="outline" className="mt-5">Learn More About Us</Button>
      </div>
      <div className="order-1 md:order-2">
        <img src={aboutImage} alt="About 1Health Essentials - premium, natural products" className="w-full rounded-lg object-cover" loading="lazy" />
      </div>
    </section>
  );
}
