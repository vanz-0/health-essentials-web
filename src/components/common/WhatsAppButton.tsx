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
    <div className="!fixed !bottom-4 !right-4 !z-[9999] md:!bottom-6 md:!right-6">
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors duration-200 animate-float-subtle"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </a>
    </div>
  );
}
