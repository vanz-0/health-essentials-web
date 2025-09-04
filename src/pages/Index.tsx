import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import Trust from "@/components/home/Trust";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import FlashBanner from "@/components/home/FlashBanner";
import UrgentDeal from "@/components/home/UrgentDeal";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

import productSerum from "@/assets/product-serum.jpg";
import productBodyButter from "@/assets/product-bodybutter.jpg";
import productShampoo from "@/assets/product-shampoo.jpg";
import productSunscreen from "@/assets/product-sunscreen.jpg";

import pSerum from "@/assets/product-serum.jpg";
import pShampoo from "@/assets/product-shampoo.jpg";
import pButter from "@/assets/product-bodybutter.jpg";
import pSunscreen from "@/assets/product-sunscreen.jpg";

const bestSellers = [
  { id: "serum", name: "Vitamin C Brightening Serum", price: 1950, image: pSerum, rating: 4.8, sale: true },
  { id: "shampoo", name: "Nourishing Shampoo", price: 1250, image: pShampoo, rating: 4.6 },
  { id: "butter", name: "Shea Body Butter", price: 1450, image: pButter, rating: 4.9 },
  { id: "sunscreen", name: "Daily Mineral Sunscreen SPF 50", price: 2150, image: pSunscreen, rating: 4.7 },
];

const arrivals = [
  { id: "serum", name: "Vitamin C Brightening Serum", price: 1950, image: pSerum },
  { id: "sunscreen", name: "Daily Mineral Sunscreen SPF 50", price: 2150, image: pSunscreen },
  { id: "butter", name: "Shea Body Butter", price: 1450, image: pButter },
  { id: "shampoo", name: "Nourishing Shampoo", price: 1250, image: pShampoo },
];

const Index = () => {
  const { isEnabled: fomoEnabled } = useFeatureFlag('bit_2_fomo');
  
  // Flash sale ends in 2 hours (example)
  const flashSaleEnd = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "1Health Essentials",
    image: "https://lovable.dev/opengraph-image-p98pqg.png",
    telephone: "+254735558830",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Brentwood Arcade, Thindiqua",
      addressLocality: "Kiambu",
      addressCountry: "KE",
    },
    url: "/",
  };

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "Vitamin C Brightening Serum",
    image: [
      pSerum,
    ],
    brand: {
      "@type": "Brand",
      name: "1Health Essentials",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: "1950",
      availability: "https://schema.org/InStock",
      url: "/#shop",
    },
  };

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>1Health Essentials | Natural Beauty & Wellness in Kiambu</title>
        <meta name="description" content="Premium cosmetics and personal care in Thindiqua, Kiambu. Natural, cruelty-free, quality-tested. Shop online or visit Brentwood Arcade." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(businessJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <FlashBanner endTime={flashSaleEnd} message="Flash Sale ends in" />
      <Header />
      <main>
        <Hero />
        
        {/* FOMO Urgent Deals Section - Only shown when Bit 2 is enabled */}
        {fomoEnabled && (
          <section className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UrgentDeal
                title="Vitamin C Brightening Serum"
                discount={30}
                originalPrice={2499}
                timeLeft={180} // 3 hours in minutes
                claimed={47}
                total={100}
              />
              <UrgentDeal
                title="Shea Body Butter Special"
                discount={25}
                originalPrice={1899}
                timeLeft={420} // 7 hours in minutes
                claimed={23}
                total={50}
              />
            </div>
          </section>
        )}
        
        <Categories />
        <BestSellers products={bestSellers} />
        <NewArrivals items={arrivals} />
        <Trust />
        <About />
        <Testimonials />

        {/* Placeholder sections for navigation targets */}
        <section id="services" className="container mt-24">
          <h2 className="font-serifDisplay text-2xl font-semibold">Our Services</h2>
          <p className="mt-2 text-muted-foreground">Skin consultations, routine building, and personalized recommendations. (Details coming soon)</p>
        </section>

        <section id="contact" className="container mt-24">
          <h2 className="font-serifDisplay text-2xl font-semibold">Contact Us</h2>
          <p className="mt-2 text-muted-foreground">Call 0735558830 or visit us at Brentwood Arcade, Thindiqua, Kiambu.</p>
        </section>

        <section id="blog" className="container mt-24">
          <h2 className="font-serifDisplay text-2xl font-semibold">From Our Blog</h2>
          <p className="mt-2 text-muted-foreground">Beauty tips, ingredient spotlights, and wellness insights. (Coming soon)</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
