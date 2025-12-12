import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userChallengeId: string;
  email: string;
  fullName?: string;
  discountCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userChallengeId, email, fullName, discountCode }: WelcomeEmailRequest = await req.json();
    
    console.log("Sending challenge welcome email to:", email);
    
    // Get challenge details from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: userChallenge, error: ucError } = await supabase
      .from("user_challenges")
      .select(`
        *,
        challenges (*)
      `)
      .eq("id", userChallengeId)
      .single();
    
    if (ucError || !userChallenge) {
      console.error("Error fetching user challenge:", ucError);
      throw new Error("Could not find challenge details");
    }
    
    const challenge = userChallenge.challenges;
    const userName = fullName || "there";
    
    // Plain text version
    const plainText = `
🎉 1Health Essentials - Your Challenge Starts Now!

Hi ${userName},

Congratulations on starting your ${challenge.title}!

YOUR EXCLUSIVE DISCOUNT CODE: ${discountCode}
Use this code to get ${challenge.discount_percent}% OFF on all challenge products!

Getting Started:
1. Visit your challenge dashboard to see Day 1 instructions
2. Pick up your recommended products using your discount code
3. Mark each day complete as you follow the routine
4. Stay consistent - we'll send reminders if you miss days

Challenge Details:
- Duration: ${challenge.duration_days} days
- Difficulty: ${challenge.difficulty}
- Category: ${challenge.category}

View Your Challenge Dashboard: https://1healthessentials.com/challenges/${userChallengeId}

Best regards,
The 1Health Essentials Team

---
1Health Essentials
Brentwood Arcade, Thindiqua, Kiambu, Kenya
+254735558830 | hello@1healthessentials.com

To unsubscribe from challenge emails, reply with "unsubscribe".
    `.trim();

    // Colorful HTML email design
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${challenge.title} Starts Now! 🎉</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header Banner with Gradient -->
    <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 25%, #f59e0b 50%, #eab308 75%, #dc2626 100%); padding: 30px 20px; text-align: center;">
      <!-- Logo -->
      <img 
        src="https://1healthessentials.com/1health-logo.png" 
        alt="1Health Essentials" 
        width="80" 
        height="80" 
        style="display: block; margin: 0 auto 15px auto; border-radius: 50%;"
      />
      <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
        🎉 Your Challenge Starts Now!
      </h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0;">
        ${challenge.title}
      </p>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 30px 25px;">
      <p style="font-size: 18px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        Hi <strong>${userName}</strong>,
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 0 0 25px 0;">
        Congratulations on taking the first step towards your transformation! Your <strong>${challenge.title}</strong> is ready to begin.
      </p>
      
      <!-- Discount Code Box -->
      <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #15803d 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
        <p style="color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">
          🎁 Your Exclusive Discount Code
        </p>
        <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; margin: 10px 0;">
          <p style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 3px; margin: 0;">
            ${discountCode}
          </p>
        </div>
        <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 15px 0 0 0;">
          ${challenge.discount_percent}% OFF on Challenge Products!
        </p>
      </div>
      
      <!-- Getting Started Section -->
      <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">
          ✨ Getting Started
        </h3>
        <ol style="font-size: 15px; line-height: 2; color: #555; padding-left: 20px; margin: 0;">
          <li>Visit your challenge dashboard to see Day 1 instructions</li>
          <li>Pick up your recommended products using your discount code</li>
          <li>Mark each day complete as you follow the routine</li>
          <li>Stay consistent — we'll send reminders if you miss days</li>
        </ol>
      </div>
      
      <!-- Challenge Details -->
      <div style="display: flex; justify-content: space-between; background-color: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 15px; margin: 25px 0;">
        <div style="text-align: center; flex: 1;">
          <p style="font-size: 12px; color: #888; margin: 0 0 5px 0;">Duration</p>
          <p style="font-size: 16px; font-weight: 600; color: #333; margin: 0;">${challenge.duration_days} Days</p>
        </div>
        <div style="text-align: center; flex: 1; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #888; margin: 0 0 5px 0;">Difficulty</p>
          <p style="font-size: 16px; font-weight: 600; color: #333; margin: 0; text-transform: capitalize;">${challenge.difficulty}</p>
        </div>
        <div style="text-align: center; flex: 1;">
          <p style="font-size: 12px; color: #888; margin: 0 0 5px 0;">Category</p>
          <p style="font-size: 16px; font-weight: 600; color: #333; margin: 0; text-transform: capitalize;">${challenge.category}</p>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://1healthessentials.com/challenges/${userChallengeId}" 
           style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);">
          Start Your Challenge →
        </a>
      </div>
      
      <p style="font-size: 14px; color: #888; text-align: center; margin: 20px 0 0 0;">
        Click the button above to access your personalized challenge dashboard
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">
        Best regards,<br>
        <strong>The 1Health Essentials Team</strong>
      </p>
      <p style="font-size: 12px; color: #888; margin: 15px 0 0 0;">
        Brentwood Arcade, Thindiqua, Kiambu, Kenya<br>
        <a href="tel:+254735558830" style="color: #16a34a; text-decoration: none;">+254735558830</a> | 
        <a href="mailto:hello@1healthessentials.com" style="color: #16a34a; text-decoration: none;">hello@1healthessentials.com</a>
      </p>
      <p style="font-size: 11px; color: #aaa; margin: 15px 0 0 0;">
        To unsubscribe from challenge emails, reply with "unsubscribe".
      </p>
    </div>
    
  </div>
</body>
</html>
    `.trim();

    const emailResponse = await resend.emails.send({
      from: "1Health Essentials <hello@1healthessentials.com>",
      to: [email],
      subject: `🎉 Your ${challenge.title} Starts Now!`,
      html: emailHtml,
      text: plainText,
      headers: {
        "List-Unsubscribe": "<mailto:hello@1healthessentials.com?subject=unsubscribe>",
      },
    });

    // Check for Resend API errors
    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      return new Response(
        JSON.stringify({ success: false, error: emailResponse.error }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully:", emailResponse.data);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-challenge-welcome:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
