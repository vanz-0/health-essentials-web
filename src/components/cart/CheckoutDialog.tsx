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

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, totalPrice, clear } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"prompting" | "buygoods">("buygoods");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmOrder = () => {
    if (!customerName.trim()) {
      toast({ title: "Name Required", description: "Please enter your name", variant: "destructive" });
      return;
    }
    if (!phoneNumber.trim()) {
      toast({ title: "Phone Number Required", description: "Please enter your phone number", variant: "destructive" });
      return;
    }

    const phoneRegex = /^(?:254|\+254|0)?([71](?:(?:[0-6])|(?:[89]))\d{7})$/;
    const cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid Kenyan phone number", variant: "destructive" });
      return;
    }
    setIsProcessing(true);

    const formattedPhone = cleanPhone.startsWith("254") ? `+${cleanPhone}` : cleanPhone.startsWith("0") ? `+254${cleanPhone.slice(1)}` : `+254${cleanPhone}`;
    const orderDetails = items.map((item: CartItem) => `- ${item.name} x${item.qty} @ KSh ${item.price.toLocaleString()} = KSh ${(item.price * item.qty).toLocaleString()}`).join("\n");
    
    const paymentInstructions = paymentMethod === "prompting" 
      ? `*Payment Method:* M-Pesa Prompting Requested\n*Phone: ${formattedPhone}*\n*Account Name: ${customerName.trim()}*\n\nPlease send the M-Pesa prompt to the number above.`
      : `*Payment Method:* M-Pesa Buy Goods\n*Till Number: 5489026*\n*Account Name: ${customerName.trim()}*\n*Phone: ${formattedPhone}*\n\nI have completed/will complete the M-Pesa payment to Till 5489026.`;

    const message = `*Order Confirmation* 🛍️\n\n*Items:*\n${orderDetails}\n\n*Total Amount: KSh ${totalPrice.toLocaleString()}*\n\n${paymentInstructions}\n\nPlease confirm my order and proceed with delivery.\n\nThank you!`;
    window.open(`https://api.whatsapp.com/send?phone=254735558830&text=${encodeURIComponent(message)}`, "_blank");

    setTimeout(() => {
      clear();
      onOpenChange(false);
      setIsProcessing(false);
      setCustomerName("");
      setPhoneNumber("");
      toast({ title: "Order Sent!", description: "Please complete your order confirmation on WhatsApp" });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="absolute left-4 top-4 h-8 w-8 p-0">
            <span className="sr-only">Back</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
          <DialogTitle className="text-xl font-bold">Complete Your Order</DialogTitle>
          <DialogDescription>Provide your M-Pesa registered number for prompting or Pay via M-Pesa and confirm your order on WhatsApp</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Order Summary</h3>
            {items.slice(0, 3).map((item: CartItem) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="truncate mr-2">{item.name} x{item.qty}</span>
                <span className="whitespace-nowrap">KSh {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            {items.length > 3 && <div className="text-xs text-muted-foreground italic">+ {items.length - 3} more item{items.length - 3 > 1 ? "s" : ""}</div>}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">KSh {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPaymentMethod("prompting")} className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === "prompting" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <p className="font-semibold text-sm">M-Pesa Prompting</p>
                <p className="text-xs text-muted-foreground mt-1">We'll send prompt</p>
              </button>
              <button type="button" onClick={() => setPaymentMethod("buygoods")} className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === "buygoods" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <p className="font-semibold text-sm">Buy Goods</p>
                <p className="text-xs text-muted-foreground mt-1">Pay to Till 5489026</p>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
              <span className="text-lg">M-PESA</span>
              <span className="text-xs bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">{paymentMethod === "prompting" ? "PROMPTING" : "BUY GOODS"}</span>
            </h3>
            <div className="space-y-1 text-sm">
              {paymentMethod === "prompting" ? (
                <>
                  <p className="text-muted-foreground">We will send an M-Pesa prompt to your registered number</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-green-700 dark:text-green-400">KSh {totalPrice.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Till Number:</span>
                    <span className="font-mono font-bold">5489026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-green-700 dark:text-green-400">KSh {totalPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Go to M-Pesa → Lipa na M-Pesa → Buy Goods and Services → Enter Till: 5489026</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="customerName">Your Name</Label>
              <Input id="customerName" placeholder="Enter your full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} maxLength={100} />
              <p className="text-xs text-muted-foreground">Name registered with M-Pesa</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="tel" placeholder="0712345678 or 254712345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength={15} />
              <p className="text-xs text-muted-foreground">{paymentMethod === "prompting" ? "We'll send M-Pesa prompt to this number" : "Your M-Pesa registered number"}</p>
            </div>
          </div>

          <Button onClick={handleConfirmOrder} disabled={isProcessing} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold" size="lg">
            <MessageCircle className="h-5 w-5 mr-2" />
            {isProcessing ? "Processing..." : "Confirm Order via WhatsApp"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {paymentMethod === "prompting" ? "Click above to send order details. We'll send M-Pesa prompt to your number." : "After M-Pesa payment to Till 5489026, click above to send order confirmation"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
