import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blog() {
  return (
    <div className="font-sansBody">
      <Helmet>
        <title>Blog | 1Health Essentials - Beauty Tips & Wellness Insights</title>
        <meta name="description" content="Read our latest articles on natural beauty, ingredient spotlights, skincare routines, and wellness tips. Expert advice for your health journey." />
        <link rel="canonical" href="/blog" />
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
            <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold">From Our Blog</h1>
            <p className="mt-2 text-muted-foreground">Beauty tips, ingredient spotlights, and wellness insights</p>
          </div>
        </section>

        <section className="container mt-16 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold mb-4">
              Explore Our External Blog
            </h2>
            
            <p className="text-foreground/80 mb-6">
              We share valuable content about natural beauty, skincare routines, ingredient education, and wellness tips on our external blog platform. Click below to visit and discover helpful articles for your health journey.
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-sm text-muted-foreground">
                Topics we cover include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                <div className="p-3 bg-secondary rounded-lg border">
                  <p className="text-sm font-medium">Natural Ingredients Guide</p>
                </div>
                <div className="p-3 bg-secondary rounded-lg border">
                  <p className="text-sm font-medium">Skincare Routines</p>
                </div>
                <div className="p-3 bg-secondary rounded-lg border">
                  <p className="text-sm font-medium">Hair Care Tips</p>
                </div>
                <div className="p-3 bg-secondary rounded-lg border">
                  <p className="text-sm font-medium">Wellness & Self-Care</p>
                </div>
              </div>
            </div>

            <a 
              href="https://1health.co.ke/blog" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                Visit Our Blog
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>

            <div className="mt-12 p-6 bg-secondary rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter to get the latest blog posts delivered directly to your inbox.
              </p>
              <Link to="/contact">
                <Button variant="outline">Subscribe Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
