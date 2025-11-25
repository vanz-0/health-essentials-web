import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen } from "lucide-react";
import { useCatalogueProducts } from "@/hooks/useCatalogueProducts";
import { useMemo } from "react";

export default function BeautyTips() {
  const { data: products = [], isLoading } = useCatalogueProducts();

  // Extract unique tips from products
  const beautyTips = useMemo(() => {
    const tips: Array<{
      id: string;
      title: string;
      funFact?: string;
      instructions?: string;
      category?: string;
      productName: string;
      image: string;
    }> = [];

    products.forEach((product) => {
      if (product.funFact || product.instructions) {
        tips.push({
          id: product.id,
          title: `${product.category || 'Beauty'} Care Tips`,
          funFact: product.funFact,
          instructions: product.instructions,
          category: product.category,
          productName: product.name,
          image: product.image,
        });
      }
    });

    return tips;
  }, [products]);

  if (isLoading) {
    return (
      <div className="font-sansBody min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading beauty tips...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>Beauty Tips & Guides | 1Health Essentials</title>
        <meta name="description" content="Discover expert beauty tips, skincare routines, and haircare guides. Learn how to get the most from your natural beauty products." />
        <link rel="canonical" href="/beauty-tips" />
      </Helmet>

      <Header />
      <main className="min-h-screen pt-[112px]">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold">Beauty Tips & Guides</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Expert advice and care instructions for your beauty routine
            </p>
          </div>
        </section>

        <section className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {beautyTips.map((tip) => (
              <Card key={tip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tip.image}
                    alt={tip.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  {tip.category && (
                    <Badge className="absolute top-2 right-2 capitalize">
                      {tip.category}
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <span>{tip.title}</span>
                  </CardTitle>
                  <CardDescription className="text-sm font-medium">
                    Featured: {tip.productName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tip.funFact && (
                    <div className="bg-accent/20 rounded-lg p-3">
                      <h3 className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Did You Know?
                      </h3>
                      <p className="text-sm text-muted-foreground">{tip.funFact}</p>
                    </div>
                  )}
                  {tip.instructions && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2">How to Use</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {tip.instructions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {beautyTips.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No beauty tips available at the moment.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}