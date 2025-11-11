import { useEffect, useState } from "react";
import { ShoppingCart, User, Search, MapPin, Phone, LogOut, Heart, Menu } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Blog", to: "/blog" },
];

export default function Header() {
  const { totalQty } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_6_shopping_cart');
  const { isEnabled: authEnabled } = useFeatureFlag('bit_5_auth');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <a 
              href="https://api.whatsapp.com/send?phone=254735558830" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5" /> +254 735 558 830
            </a>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Brentwood Arcade, Thindiqua, Kiambu</span>
          </div>
          <div className="text-xs">Your trusted partner in natural beauty and wellness</div>
        </div>
      </div>

      {/* Main nav */}
      <div className={
        `transition-colors duration-300 ${scrolled ? "bg-background/95 shadow-sm" : "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40"}`
      }>
        <nav className="container flex items-center justify-between py-2 md:py-3 px-2 md:px-4">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="font-serifDisplay text-xl">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg py-2 px-3 rounded-md hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-1.5 md:gap-3">
              <img 
                src={logo} 
                alt="1Health Essentials Logo" 
                className="h-9 w-9 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain transition-all duration-300"
              />
              <span className={`font-serifDisplay text-lg md:text-2xl font-bold tracking-tight transition-all duration-300 ${scrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                1Health Essentials
              </span>
            </Link>
          </div>

          <ul className="hidden lg:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="story-link text-foreground/80 hover:text-foreground transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-0.5 md:gap-2">
            <Button variant="ghost" size="icon" aria-label="Search" className="h-8 w-8 md:h-10 md:w-10" onClick={() => toast({ title: "Search", description: "Search with filters coming soon." })}>
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            
            <ThemeToggle />
            
            {/* Wishlist Button */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" aria-label="Wishlist" className="relative h-8 w-8 md:h-10 md:w-10">
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 md:h-5 md:min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[8px] md:text-[10px] px-0.5 md:px-1 font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Auth Section (if auth is enabled) */}
            {authEnabled ? (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8 md:h-10 md:w-10">
                      <Avatar className="h-6 w-6 md:h-8 md:w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px] md:text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link to="/dashboard">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <Link to="/admin">
                          <DropdownMenuItem>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="icon" aria-label="Account" className="h-8 w-8 md:h-10 md:w-10">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
              )
            ) : (
              <Button variant="ghost" size="icon" aria-label="Account" className="h-8 w-8 md:h-10 md:w-10">
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            )}

            {cartEnabled && (
              <CartDrawer>
                <Button variant="accent" size="icon" aria-label="Cart" className="relative h-8 w-8 md:h-10 md:w-10">
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                  {totalQty > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 md:h-5 md:min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[8px] md:text-[10px] px-0.5 md:px-1 font-bold">
                      {totalQty}
                    </span>
                  )}
                </Button>
              </CartDrawer>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
