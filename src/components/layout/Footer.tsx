import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import ContactCaptureForm from "@/components/contact/ContactCaptureForm";
export default function Footer() {
  return <footer className="border-t mt-24">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
        <div>
          <h4 className="font-serifDisplay text-xl font-semibold">1Health Essentials</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Premium cosmetics and personal care made with natural ingredients. Your trusted partner in natural beauty and wellness.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a 
              href="https://x.com/Healthy_Ess" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="X (Twitter)" 
              className="hover-scale"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href="https://www.facebook.com/one_health_essentials/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook" 
              className="hover-scale"
            >
              <Facebook />
            </a>
            <a 
              href="https://www.instagram.com/one_health_essentials/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram" 
              className="hover-scale"
            >
              <Instagram />
            </a>
            <a 
              href="https://www.tiktok.com/@1healthessentials?lang=en" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="TikTok" 
              className="hover-scale"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a 
              href="mailto:hello@1healthessentials.com" 
              aria-label="Email" 
              className="hover-scale"
            >
              <Mail />
            </a>
          </div>
        </div>

        <div>
          <h5 className="font-semibold">Quick Links</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:underline">Shop</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/services" className="hover:underline">Services</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Contact</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" />Brentwood Arcade, Thindigua, Kiambu</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0735558830</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" />hello@1healthessentials.com</li>
            <li>Mon-Sat: 9:00am - 6:00pm</li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Newsletter</h5>
          <p className="mt-3 text-sm text-muted-foreground">Get 10% off your first order.</p>
          <div className="mt-3">
            <ContactCaptureForm source="footer_newsletter" variant="footer" incentiveText="Join 5,000+ health-conscious Kenyans" />
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} 1Health Essentials. All rights reserved.</div>
    </footer>;
}