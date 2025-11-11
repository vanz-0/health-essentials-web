import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, CartItem } from "@/contexts/CartContext";
import { MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function CheckoutDialog({
  open,
  onOpenChange
}: CheckoutDialogProps) {
  const {
    items,
    totalPrice,
    clear
  } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const handleConfirmOrder = () => {
    // Validate inputs
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name for M-Pesa account",
        variant: "destructive"
      });
      return;
    }
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    // Validate Kenyan phone format
    const phoneRegex = /^(?:254|\+254|0)?([71](?:(?:[0-6])|(?:[89]))\d{7})$/;
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);

    // Format phone number for display
    const formattedPhone = cleanPhone.startsWith('254') ? `+${cleanPhone}` : cleanPhone.startsWith('0') ? `+254${cleanPhone.slice(1)}` : `+254${cleanPhone}`;

    // Generate WhatsApp message
    const orderDetails = items.map((item: CartItem) => `- ${item.name} x${item.qty} @ KSh ${item.price.toLocaleString()} = KSh ${(item.price * item.qty).toLocaleString()}`).join('\n');
    const message = `*Order Confirmation* 🛍️

*Items:*
${orderDetails}

*Total Amount: KSh ${totalPrice.toLocaleString()}*

*Payment Details:*
M-Pesa Paybill: 211090
Account Number: ${customerName.trim()}
Phone: ${formattedPhone}

I have completed the M-Pesa payment and would like to confirm my order. Please proceed with delivery.

Thank you!`;
    const whatsappPhone = "254735558830";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear cart and close dialog after a brief delay
    setTimeout(() => {
      clear();
      onOpenChange(false);
      setIsProcessing(false);
      setCustomerName("");
      setPhoneNumber("");
      toast({
        title: "Order Sent!",
        description: "Please complete your order confirmation on WhatsApp"
      });
    }, 1000);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Complete Your Order</DialogTitle>
          <DialogDescription>
            Pay via M-Pesa and confirm your order on WhatsApp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Order Summary</h3>
            {items.slice(0, 3).map((item: CartItem) => <div key={item.id} className="flex justify-between text-sm">
                <span className="truncate mr-2">{item.name} x{item.qty}</span>
                <span className="whitespace-nowrap">KSh {(item.price * item.qty).toLocaleString()}</span>
              </div>)}
            {items.length > 3 && <div className="text-xs text-muted-foreground italic">
                + {items.length - 3} more item{items.length - 3 > 1 ? 's' : ''}
              </div>}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">KSh {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* M-Pesa Instructions */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
              <span className="text-lg">M-PESA</span>
              <span className="text-xs bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">PAYBILL</span>
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Number:</span>
                <span className="font-mono font-bold">211090</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-semibold">Your Name</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-green-700 dark:text-green-400">KSh {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="customerName">Your Name (M-Pesa Account Number)</Label>
              <Input id="customerName" placeholder="Enter your full name" value={customerName} onChange={e => setCustomerName(e.target.value)} maxLength={100} />
              <p className="text-xs text-muted-foreground"> Name that is registered with M-Pesa</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="tel" placeholder="0712345678 or 254712345678" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} maxLength={15} />
              <p className="text-xs text-muted-foreground">Your M-Pesa registered number</p>
            </div>
          </div>

          {/* Confirm Button */}
          <Button onClick={handleConfirmOrder} disabled={isProcessing} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold" size="lg">
            <MessageCircle className="h-5 w-5 mr-2" />
            {isProcessing ? "Processing..." : "Confirm Order via WhatsApp"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            After M-Pesa payment, click above to send order confirmation on WhatsApp
          </p>
        </div>
      </DialogContent>
    </Dialog>;
}