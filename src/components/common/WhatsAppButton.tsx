import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface WhatsAppButtonProps {
  productName?: string;
}

export default function WhatsAppButton({ productName }: WhatsAppButtonProps) {
  const phoneNumber = "254735558830";
  const baseMessage = productName 
    ? `Hi! I'd like to know more about ${productName}`
    : "Hello 1Health Essentials! I'm interested in your products.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide button when cart/dialog overlays are open
    const observer = new MutationObserver(() => {
      const hasOpenOverlay = document.querySelector('[data-radix-presence]') !== null;
      setIsVisible(!hasOpenOverlay);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state']
    });

    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] md:bottom-6 md:right-6" style={{ position: 'fixed' }}>
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors duration-200 animate-breathe"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </a>
    </div>
  );
}
