import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

const contactSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone_number: z.string().trim().optional().refine(
    (val) => !val || /^\+254[17]\d{8}$/.test(val),
    "Phone must be in format +2547XXXXXXXX or +2541XXXXXXXX"
  ),
  consent_given: z.boolean().refine((val) => val === true, "You must agree to continue"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactCaptureFormProps {
  source: string;
  variant?: 'popup' | 'inline' | 'footer';
  showPhoneField?: boolean;
  onSuccess?: () => void;
  incentiveText?: string;
}

export default function ContactCaptureForm({
  source,
  variant = 'inline',
  showPhoneField = false,
  onSuccess,
  incentiveText = "Join 5,000+ health-conscious Kenyans"
}: ContactCaptureFormProps) {
  const { isEnabled } = useFeatureFlag('bit_10_capture');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      consent_given: false
    }
  });

  const consentValue = watch('consent_given');

  const onSubmit = async (data: ContactFormData) => {
    if (!isEnabled) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contacts').insert({
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number || null,
        source,
        consent_given: data.consent_given,
        subscribed: true,
        preferences: {
          email: true,
          sms: !!data.phone_number
        }
      });

      if (error) {
        // Handle duplicate email gracefully
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already in our system. Thank you!",
            variant: "default"
          });
          reset();
          onSuccess?.();
          return;
        }
        throw error;
      }

      toast({
        title: "Success!",
        description: "You've been added to our community. Check your email for a welcome message.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Contact capture error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEnabled) return null;

  const isPopup = variant === 'popup';
  const containerClass = isPopup 
    ? "space-y-4" 
    : variant === 'footer' 
    ? "flex flex-col sm:flex-row gap-3 items-start" 
    : "space-y-4";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={containerClass}>
      {isPopup && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">🎁 Get 15% OFF Your First Order</h3>
          <p className="text-sm text-muted-foreground">{incentiveText}</p>
        </div>
      )}

      <div className={variant === 'footer' ? "flex-1 space-y-3" : "space-y-3"}>
        <div>
          <Label htmlFor={`name-${source}`} className={variant === 'footer' ? 'sr-only' : ''}>
            Full Name
          </Label>
          <Input
            id={`name-${source}`}
            placeholder="Your full name"
            {...register('full_name')}
            aria-invalid={errors.full_name ? 'true' : 'false'}
            className="bg-background"
          />
          {errors.full_name && (
            <p className="text-sm text-destructive mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor={`email-${source}`} className={variant === 'footer' ? 'sr-only' : ''}>
            Email
          </Label>
          <Input
            id={`email-${source}`}
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            className="bg-background"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {showPhoneField && (
          <div>
            <Label htmlFor={`phone-${source}`}>
              Phone (Optional)
            </Label>
            <Input
              id={`phone-${source}`}
              type="tel"
              placeholder="+254712345678"
              {...register('phone_number')}
              aria-invalid={errors.phone_number ? 'true' : 'false'}
              className="bg-background"
            />
            {errors.phone_number && (
              <p className="text-sm text-destructive mt-1">{errors.phone_number.message}</p>
            )}
          </div>
        )}

        <div className="flex items-start space-x-2">
          <Checkbox
            id={`consent-${source}`}
            checked={consentValue}
            onCheckedChange={(checked) => setValue('consent_given', checked as boolean)}
            aria-invalid={errors.consent_given ? 'true' : 'false'}
          />
          <Label 
            htmlFor={`consent-${source}`} 
            className="text-xs leading-tight cursor-pointer"
          >
            I agree to receive marketing emails and SMS. I can unsubscribe anytime. 
            <a href="/privacy" className="underline ml-1" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.consent_given && (
          <p className="text-sm text-destructive">{errors.consent_given.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={variant === 'footer' ? 'w-full sm:w-auto shrink-0' : 'w-full'}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe'
        )}
      </Button>

      {isPopup && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Offer expires in 10 minutes. Free Nairobi delivery on first order.
        </p>
      )}
    </form>
  );
}
