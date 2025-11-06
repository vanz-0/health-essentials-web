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
      items: ["Vitamin C Serum", "Daily Moisturizer", "Gentle Cleanser"],
      icon: Sparkles,
    },
    {
      title: "Hair Care Bundle",
      description: "Complete hair nourishment and restoration package",
      items: ["Nourishing Shampoo", "Deep Conditioner", "Hair Oil Treatment"],
      icon: Heart,
    },
    {
      title: "Body Care Essentials",
      description: "Head-to-toe body care for smooth, healthy skin",
      items: ["Shea Body Butter", "Body Scrub", "Moisturizing Body Wash"],
      icon: Package,
    },
    {
      title: "Sun Protection Pack",
      description: "Complete sun care for daily protection",
      items: ["SPF 50 Sunscreen", "After-Sun Lotion", "Lip Balm SPF 30"],
      icon: Shield,
    },
  ];

  const deliveryAreas = [
    "Thindiqua",
    "Kiambu Town",
    "Ruiru",
    "Juja",
    "Ruaka",
    "Kikuyu",
    "Limuru",
    "Ndumberi",
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
                  <ul className="space-y-2 text-sm">
                    {bundle.items.map((item) => (
                      <li key={item} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link to="/contact">Inquire About Bundle</Link>
                  </Button>
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
                <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Free Local Delivery</h2>
                <p className="mt-4 text-foreground/80">
                  We offer free delivery within Kiambu and surrounding areas. Enjoy the convenience of having your favorite natural beauty products delivered right to your doorstep.
                </p>
                <div className="mt-6 space-y-2">
                  <p className="font-semibold">Delivery Details:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Free delivery on all orders within our service areas</li>
                    <li>• Same-day delivery available for orders before 2pm</li>
                    <li>• Next-day delivery for orders after 2pm</li>
                    <li>• Safe, contactless delivery options available</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">We Deliver To:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {deliveryAreas.map((area) => (
                    <div key={area} className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Don't see your area? Contact us to inquire about delivery options.
                </p>
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
