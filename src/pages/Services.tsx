import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Truck, DollarSign, Heart, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const bundles = [
    {
      title: "Skincare Starter Kit",
      description: "Everything you need to start your natural skincare journey",
      items: ["Vitamin C Serum", "Daily Moisturizer", "Gentle Cleanser", "Toner"],
      icon: Sparkles,
      price: "KSh 3,500",
    },
    {
      title: "Hair Care Bundle",
      description: "Complete hair nourishment and restoration package",
      items: ["Nourishing Shampoo", "Deep Conditioner", "Hair Oil Treatment", "Leave-in Spray"],
      icon: Heart,
      price: "KSh 4,200",
    },
    {
      title: "Body Care Essentials",
      description: "Head-to-toe body care for smooth, healthy skin",
      items: ["Shea Body Butter", "Body Scrub", "Moisturizing Body Wash", "Body Oil"],
      icon: Package,
      price: "KSh 3,800",
    },
    {
      title: "Sun Protection Pack",
      description: "Complete sun care for daily protection",
      items: ["SPF 50 Sunscreen", "After-Sun Lotion", "Lip Balm SPF 30"],
      icon: Shield,
      price: "KSh 2,900",
    },
    {
      title: "Anti-Aging Collection",
      description: "Turn back time with our premium anti-aging products",
      items: ["Retinol Serum", "Eye Cream", "Night Cream", "Peptide Mask"],
      icon: Sparkles,
      price: "KSh 5,500",
    },
    {
      title: "Acne Treatment Set",
      description: "Clear skin solution for acne-prone skin",
      items: ["Salicylic Cleanser", "Spot Treatment", "Oil-Free Moisturizer", "Clay Mask"],
      icon: Shield,
      price: "KSh 3,200",
    },
    {
      title: "Natural Glow Bundle",
      description: "Achieve radiant, glowing skin naturally",
      items: ["Brightening Serum", "Glow Moisturizer", "Face Oil", "Exfoliating Scrub"],
      icon: Sparkles,
      price: "KSh 4,500",
    },
    {
      title: "Men's Grooming Kit",
      description: "Complete grooming essentials for men",
      items: ["Beard Oil", "Face Wash", "After-Shave Balm", "Body Wash"],
      icon: Package,
      price: "KSh 3,600",
    },
  ];

  const freeDeliveryAreas = [
    "Windsor",
    "Thome",
    "Ridgeways",
    "Runda",
    "Kirigiti",
    "Kiambu",
  ];

  const freeDeliveryThindigua = [
    "Thindigua (All orders)",
  ];

  const paidDeliveryAreas = [
    "Greater Nairobi",
    "Kiambu Municipality",
    "Ruiru",
    "Juja",
    "Ruaka",
    "Kikuyu",
    "Limuru",
  ];

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>Services | 1Health Essentials - Bundles, Delivery & More</title>
        <meta name="description" content="Explore our product bundles, free local delivery in Kiambu, and affordable pricing options. Quality natural beauty products with flexible payment plans." />
        <link rel="canonical" href="/services" />
      </Helmet>

      <Header />
      <main className="min-h-screen">
        <section className="bg-secondary py-12">
          <div className="container">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold">Our Services</h1>
            <p className="mt-2 text-muted-foreground">Bundles, delivery, and flexible pricing for your convenience</p>
          </div>
        </section>

        {/* Bundles Section */}
        <section className="container mt-16">
          <div className="text-center mb-12">
            <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Product Bundles</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Save more with our carefully curated bundles designed for complete care routines
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bundles.map((bundle) => (
              <Card key={bundle.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <bundle.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{bundle.title}</CardTitle>
                  <CardDescription>{bundle.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-primary">{bundle.price}</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-4">
                    {bundle.items.map((item) => (
                      <li key={item} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`https://wa.me/254757968945?text=${encodeURIComponent(`Hi! I'm interested in the ${bundle.title} bundle (${bundle.price}). Can you provide more details?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full" variant="outline">
                      Inquire via WhatsApp
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Free Delivery Section */}
        <section className="bg-secondary py-16 mt-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Free & Affordable Delivery</h2>
                <p className="mt-4 text-foreground/80">
                  We offer flexible delivery options to get your favorite natural beauty products to you quickly and affordably.
                </p>
                <div className="mt-6 space-y-2">
                  <p className="font-semibold">Delivery Schedule:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Same-day delivery available for orders before 2pm</li>
                    <li>• Next-day delivery for orders after 2pm</li>
                    <li>• Safe, contactless delivery options available</li>
                    <li>• Track your order in real-time</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <h3 className="font-semibold text-lg">FREE for Orders Above KSh 1,000</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {freeDeliveryAreas.map((area) => (
                      <div key={area} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                        <span className="text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <h3 className="font-semibold text-lg">Always FREE</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {freeDeliveryThindigua.map((area) => (
                      <div key={area} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                        <span className="text-sm font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <h3 className="font-semibold text-lg">KSh 200 Delivery Fee</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {paidDeliveryAreas.map((area) => (
                      <div key={area} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                        <span className="text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-2">📍 Calculate Delivery for Your Location</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Don't see your area? Send us your location via WhatsApp for a quick delivery quote!
                  </p>
                  <a
                    href={`https://wa.me/254757968945?text=${encodeURIComponent("Hi! I'd like to know the delivery cost for my location. Can you help?")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="w-full">
                      Get Delivery Quote
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Affordable Pricing Section */}
        <section className="container mt-16 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Affordable Pricing</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Quality natural beauty shouldn't break the bank. We offer flexible payment options to make our products accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Bundle Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Save up to 20% when you purchase our curated product bundles instead of buying items individually.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stock up and save! Get special pricing on larger quantities—perfect for families or sharing with friends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loyalty Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Join our loyalty program and earn points with every purchase. Redeem for discounts on future orders.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="ml-4">Contact for Custom Pricing</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
