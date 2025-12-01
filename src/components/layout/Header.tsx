import { useEffect, useState } from "react";
import { ShoppingCart, User, Search, MapPin, Phone, LogOut, Heart, Menu, Facebook, Instagram, Mail } from "lucide-react";
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
import GlobalSearch from "@/components/common/GlobalSearch";
const navItems = [{
  label: "Home",
  to: "/"
}, {
  label: "Shop",
  to: "/shop"
}, {
  label: "About",
  to: "/about"
}, {
  label: "Services",
  to: "/services"
}, {
  label: "Beauty Tips",
  to: "/beauty-tips"
}, {
  label: "Contact",
  to: "/contact"
}, {
  label: "Blog",
  to: "/blog"
}];
export default function Header() {
  const {
    totalQty
  } = useCart();
  const {
    wishlistCount
  } = useWishlist();
  const {
    user,
    signOut
  } = useAuth();
  const {
    isAdmin
  } = useUserRole();
  const {
    toast
  } = useToast();
  const {
    isEnabled: cartEnabled
  } = useFeatureFlag('bit_6_shopping_cart');
  const {
    isEnabled: authEnabled
  } = useFeatureFlag('bit_5_auth');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <header className="fixed inset-x-0 top-0 z-50">
      {/* Top bar - Christmas themed with news ticker */}
      <div className="bg-gradient-christmas overflow-hidden relative">
        <div className="container flex items-center justify-between">
          <a href="https://1healthessentials.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex-1 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="ticker-wrapper py-0.5">
              <div className="ticker-content">
                <span className="ticker-item text-white font-semibold text-xs md:text-sm">
                  🎄 CHRISTMAS SALE! Up to 50% OFF • 🎁 Perfect Gifts for Your Loved Ones • ❄️ Free Delivery on Orders Over KES 3,000 • 🌟 Shop Now! •
                </span>
                <span className="ticker-item font-semibold text-xs md:text-sm text-zinc-950">
                  🎄 CHRISTMAS SALE! Up to 50% OFF • 🎁 Perfect Gifts for Your Loved Ones • ❄️ Free Delivery on Orders Over KES 3,000 • 🌟 Shop Now! •
                </span>
              </div>
            </div>
          </a>
          
          {/* Social Media Icons */}
          <div className="flex items-center gap-2 md:gap-3 pl-4">
            <a href="https://x.com/Healthy_Ess" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-white hover:opacity-70 transition-opacity">
              <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/one_health_essentials/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:opacity-70 transition-opacity">
              <Facebook className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
            <a href="https://www.instagram.com/one_health_essentials/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:opacity-70 transition-opacity">
              <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
            <a href="https://www.tiktok.com/@1healthessentials?lang=en" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:opacity-70 transition-opacity">
              <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a href="mailto:hello@1healthessentials.com" aria-label="Email" className="text-white hover:opacity-70 transition-opacity">
              <Mail className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`transition-colors duration-300 ${scrolled ? "bg-background/95 shadow-sm" : "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40"}`}>
        <nav className="container flex items-center justify-between py-1 md:py-2 px-2 md:px-4">
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
                  {navItems.map(item => <Link key={item.label} to={item.to} onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 px-3 rounded-md hover:bg-accent transition-colors">
                      {item.label}
                    </Link>)}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-1.5 md:gap-3">
              <img src={logo} alt="1Health Essentials Logo" className="h-9 w-9 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain transition-all duration-300" />
              <span className={`font-serifDisplay text-lg md:text-2xl font-bold tracking-tight transition-all duration-300 ${scrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                1Health Essentials
              </span>
            </Link>
          </div>

          <ul className="hidden lg:flex items-center gap-6 text-sm">
            {navItems.map(item => <li key={item.label}>
                <Link to={item.to} className="story-link text-foreground/80 hover:text-foreground transition-colors">{item.label}</Link>
              </li>)}
          </ul>

          <div className="flex items-center gap-0.5 md:gap-2">
            <Button variant="ghost" size="icon" aria-label="Search" className="h-8 w-8 md:h-10 md:w-10" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            
            <ThemeToggle />
            
            {/* Wishlist Button */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" aria-label="Wishlist" className="relative h-8 w-8 md:h-10 md:w-10">
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 md:h-5 md:min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[8px] md:text-[10px] px-0.5 md:px-1 font-bold">
                    {wishlistCount}
                  </span>}
              </Button>
            </Link>
            
            {/* Auth Section (if auth is enabled) */}
            {authEnabled ? user ? <DropdownMenu>
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
                    {isAdmin && <>
                        <DropdownMenuSeparator />
                        <Link to="/admin">
                          <DropdownMenuItem>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </DropdownMenuItem>
                        </Link>
                      </>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> : <Link to="/auth">
                  <Button variant="ghost" size="icon" aria-label="Account" className="h-8 w-8 md:h-10 md:w-10">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link> : <Button variant="ghost" size="icon" aria-label="Account" className="h-8 w-8 md:h-10 md:w-10">
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>}

            {cartEnabled && <CartDrawer>
                <Button variant="accent" size="icon" aria-label="Cart" className="relative h-8 w-8 md:h-10 md:w-10">
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                  {totalQty > 0 && <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 md:h-5 md:min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[8px] md:text-[10px] px-0.5 md:px-1 font-bold">
                      {totalQty}
                    </span>}
                </Button>
              </CartDrawer>}
          </div>
        </nav>
      </div>
      
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>;
}