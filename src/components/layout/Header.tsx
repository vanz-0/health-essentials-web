import { useEffect, useState } from "react";
import { ShoppingCart, User, Search, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
//
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Shop", href: "#shop" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "#blog" },
];

export default function Header() {
  const { totalQty, items, totalPrice, removeItem } = useCart();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top bar */}
      <div className="hidden md:block bg-secondary text-secondary-foreground text-xs">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> 0735558830</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Brentwood Arcade, Thindiqua, Kiambu</span>
          </div>
          <div className="text-xs">Your trusted partner in natural beauty and wellness</div>
        </div>
      </div>

      {/* Main nav */}
      <div className={
        `transition-colors duration-300 ${scrolled ? "bg-background/95 shadow-sm" : "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40"}`
      }>
        <nav className="container flex items-center justify-between py-3">
          <a href="#home" className="font-serifDisplay text-xl md:text-2xl font-bold tracking-tight">
            1Health Essentials
          </a>

          <ul className="hidden lg:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="story-link text-foreground/80 hover:text-foreground transition-colors">{item.label}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => toast({ title: "Search", description: "Search with filters coming soon." })}>
              <Search />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Account">
              <User />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="accent" size="icon" aria-label="Cart" className="relative">
                  <ShoppingCart />
                  {totalQty > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] px-1">
                      {totalQty}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="space-y-3">
                  <h4 className="font-medium">Cart Summary</h4>
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 py-2">
                          <img src={item.image} alt={`${item.name} image`} className="h-12 w-12 rounded object-cover" loading="lazy" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.qty} × KES {item.price.toLocaleString()}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">KES {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Checkout</Button>
                    <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Cart", description: "Full cart & checkout coming soon." })}>View Cart</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </nav>
      </div>
    </header>
  );
}
