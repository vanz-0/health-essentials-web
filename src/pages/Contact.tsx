import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactCaptureForm from "@/components/contact/ContactCaptureForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
export default function Contact() {
  return <div className="font-sansBody">
      <Helmet>
        <title>Contact Us | 1Health Essentials - Get in Touch</title>
        <meta name="description" content="Contact 1Health Essentials for inquiries, orders, or consultations. Visit us at Brentwood Arcade, Thindiqua, Kiambu or call 0735558830." />
        <link rel="canonical" href="/contact" />
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
            <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold">Contact Us</h1>
            <p className="mt-2 text-muted-foreground">We'd love to hear from you</p>
          </div>
        </section>

        <section className="container mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-serifDisplay text-2xl font-semibold mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              <ContactCaptureForm source="contact_page" variant="inline" showPhoneField={true} incentiveText="We typically respond within 24 hours" />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="font-serifDisplay text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      Visit Our Store
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Brentwood Arcade, Thindiqua</p>
                    <p className="text-sm">Kiambu, Kenya</p>
                    <a href="https://maps.google.com/?q=Brentwood+Arcade+Thindiqua+Kiambu" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                      Get Directions →
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Phone className="h-5 w-5 text-primary" />
                      Call Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a href="tel:+254735558830" className="text-sm hover:text-primary">
                      0735558830
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Available during business hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="h-5 w-5 text-primary" />
                      Email Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a href="mailto:hello@1health.co.ke" className="text-sm hover:text-primary">hello@1healthessentials.com</a>
                    <p className="text-xs text-muted-foreground mt-1">We respond within 24 hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p>Monday - Saturday: 9:00am - 6:00pm</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Follow Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                        <Instagram className="h-6 w-6" />
                      </a>
                      <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                        <Facebook className="h-6 w-6" />
                      </a>
                      <a href="mailto:hello@1health.co.ke" className="hover:text-primary transition-colors" aria-label="Email">
                        <Mail className="h-6 w-6" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mt-16 mb-16">
          <h2 className="font-serifDisplay text-2xl font-semibold mb-6">Find Us</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden border shadow-md">
            <iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Brentwood+Arcade,Thindiqua,Kiambu,Kenya&zoom=15" width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="1Health Essentials Location - Brentwood Arcade, Thindiqua, Kiambu" />
          </div>
        </section>
      </main>
      <Footer />
    </div>;
}