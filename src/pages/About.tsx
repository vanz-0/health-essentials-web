import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, Heart, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";
import aboutImage from "@/assets/category-skincare.jpg";
import aboutImage2 from "@/assets/category-bodycare.jpg";

export default function About() {
  return (
    <div className="font-sansBody">
      <Helmet>
        <title>About Us | 1Health Essentials - Our Story & Mission</title>
        <meta name="description" content="Learn about 1Health Essentials' commitment to natural beauty and wellness. We craft premium cosmetics with clean, effective ingredients for your health." />
        <link rel="canonical" href="/about" />
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
            <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold">About 1Health Essentials</h1>
            <p className="mt-2 text-muted-foreground">Your trusted partner in natural beauty and wellness</p>
          </div>
        </section>

        <section className="container mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Our Commitment to Quality</h2>
            <p className="mt-4 text-foreground/80">
              At 1Health Essentials, our mission is to empower your natural beauty and overall wellness. We craft and curate premium cosmetics and personal care products with clean, effective ingredients—thoughtfully sourced and tested for quality.
            </p>
            <p className="mt-4 text-foreground/80">
              Based in Thindiqua, Kiambu, we serve health-conscious individuals across Kenya who refuse to compromise on quality. Every product we offer is dermatologically tested, cruelty-free, and made with ingredients you can trust.
            </p>
            <Link to="/shop">
              <Button className="mt-6">Explore Our Products</Button>
            </Link>
          </div>
          <div>
            <img src={aboutImage} alt="Premium natural skincare products" className="w-full rounded-lg object-cover shadow-lg" loading="lazy" />
          </div>
        </section>

        <section className="bg-secondary py-16 mt-16">
          <div className="container">
            <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold text-center mb-12">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Natural Ingredients</h3>
                <p className="text-sm text-muted-foreground">
                  We carefully select 100% natural, safe, and effective ingredients for all our formulations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Quality Testing</h3>
                <p className="text-sm text-muted-foreground">
                  Every product is dermatologically tested and certified to ensure it meets our high standards.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Cruelty-Free</h3>
                <p className="text-sm text-muted-foreground">
                  We are committed to beauty with compassion—no animal testing, ever.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Community Focus</h3>
                <p className="text-sm text-muted-foreground">
                  We serve the Kiambu community and beyond with personalized care and local delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img src={aboutImage2} alt="Natural body care products" className="w-full rounded-lg object-cover shadow-lg" loading="lazy" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Our Philosophy</h2>
            <p className="mt-4 text-foreground/80">
              We believe that true beauty comes from within, and our products are designed to enhance your natural radiance. We're not about covering up—we're about bringing out the best version of you.
            </p>
            <p className="mt-4 text-foreground/80">
              Our approach combines traditional wisdom with modern science. We respect the power of natural ingredients while ensuring every formula meets contemporary safety and efficacy standards.
            </p>
            <p className="mt-4 text-foreground/80">
              Whether you're looking for skincare, hair care, body care, or sun protection, we've got you covered with products that work as hard as you do.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="mt-6">Get in Touch</Button>
            </Link>
          </div>
        </section>

        <section className="container mt-16 mb-16 text-center">
          <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">Visit Our Store</h2>
          <p className="mt-4 text-foreground/80 max-w-2xl mx-auto">
            We're located at Brentwood Arcade in Thindiqua, Kiambu. Visit us Monday through Saturday, 9:00am to 6:00pm for personalized consultations and to experience our products firsthand.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link to="/shop">
              <Button>Shop Now</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
