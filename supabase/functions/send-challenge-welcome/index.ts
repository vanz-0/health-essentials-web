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
    
    // Plain text version for better deliverability
    const plainText = `
1Health Essentials
---

Hi ${userName},

Thank you for joining the ${challenge.title}!

Your challenge code: ${discountCode}
This gives you ${challenge.discount_percent}% off on challenge products.

Getting Started:
1. Visit your challenge dashboard to see Day 1 instructions
2. Pick up your recommended products
3. Mark each day complete as you follow the routine
4. Stay consistent - we'll send reminders if you miss days

Challenge Details:
- Duration: ${challenge.duration_days} days
- Difficulty: ${challenge.difficulty}
- Category: ${challenge.category}

Start your challenge: https://1healthessentials.netlify.app/challenges/${userChallengeId}

Best regards,
The 1Health Essentials Team

---
1Health Essentials
Brentwood Arcade, Thindiqua, Kiambu, Kenya
+254735558830 | hello@1healthessentials.com

To unsubscribe from challenge emails, reply with "unsubscribe".
    `.trim();

    // Clean, simple HTML for Primary inbox
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${challenge.title} begins today</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #333333;">
  <div style="max-width: 580px; margin: 0 auto; padding: 20px;">
    
    <!-- Logo and Brand Name - kept small and simple -->
    <table role="presentation" style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td style="text-align: left;">
          <img 
            src="https://1healthessentials.netlify.app/logo.png" 
            alt="1Health Essentials" 
            width="40" 
            height="40" 
            style="display: inline-block; vertical-align: middle; margin-right: 10px;"
          />
          <span style="font-size: 18px; font-weight: 600; color: #333; vertical-align: middle;">1Health Essentials</span>
        </td>
      </tr>
    </table>
    
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Hi ${userName},
    </p>
    
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Thank you for joining the <strong>${challenge.title}</strong>. Here's everything you need to get started.
    </p>
    
    <!-- Challenge Code - Simple box -->
    <div style="background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Your challenge code</p>
      <p style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 1px; color: #333;">${discountCode}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
        ${challenge.discount_percent}% off on challenge products
      </p>
    </div>
    
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
      <strong>Getting started:</strong>
    </p>
    
    <ol style="font-size: 16px; line-height: 1.8; padding-left: 20px; margin-bottom: 24px; color: #333;">
      <li>Visit your challenge dashboard to see Day 1 instructions</li>
      <li>Pick up your recommended products using your code</li>
      <li>Mark each day complete as you follow the routine</li>
      <li>Stay consistent — we'll send reminders if you miss days</li>
    </ol>
    
    <!-- Simple text link instead of flashy button -->
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
      <a href="https://1healthessentials.netlify.app/challenges/${userChallengeId}" 
         style="color: #0066cc; text-decoration: underline;">
        View your challenge dashboard
      </a>
    </p>
    
    <!-- Challenge Details -->
    <div style="border-top: 1px solid #e0e0e0; padding-top: 16px; margin-top: 24px;">
      <p style="font-size: 14px; color: #666; margin: 0 0 8px 0;">
        <strong>Challenge details:</strong><br>
        Duration: ${challenge.duration_days} days | Difficulty: ${challenge.difficulty} | Category: ${challenge.category}
      </p>
    </div>
    
    <!-- Simple footer -->
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 14px; color: #666; margin: 0;">
        Best regards,<br>
        The 1Health Essentials Team
      </p>
      <p style="font-size: 12px; color: #999; margin: 16px 0 0 0;">
        Brentwood Arcade, Thindiqua, Kiambu, Kenya<br>
        +254735558830 | hello@1healthessentials.com
      </p>
      <p style="font-size: 11px; color: #999; margin: 12px 0 0 0;">
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
      subject: `Your ${challenge.title} begins today`,
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
