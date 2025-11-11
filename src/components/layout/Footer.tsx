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
            <a aria-label="Instagram" href="#" className="hover-scale"><Instagram /></a>
            <a aria-label="Facebook" href="#" className="hover-scale"><Facebook /></a>
            <a aria-label="Email" href="#" className="hover-scale"><Mail /></a>
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
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" />hello@1healthessntials.com</li>
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