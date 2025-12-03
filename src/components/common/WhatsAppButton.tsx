import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  productName?: string;
}

export default function WhatsAppButton({ productName }: WhatsAppButtonProps) {
  const phoneNumber = "254735558830";
  const baseMessage = productName 
    ? `Hi! I'd like to know more about ${productName}`
    : "Hello 1Health Essentials! I'm interested in your products.";
  
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(baseMessage)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed z-[9999] animate-float-super-slow"
      style={{ 
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        right: '1rem',
      }}
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
}
