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
    const userName = fullName || "Beauty Enthusiast";
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your ${challenge.title} Starts Now!</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #DC2626 0%, #16A34A 50%, #F59E0B 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Your Challenge Starts Now!</h1>
            <p style="color: #ffffff; opacity: 0.9; margin-top: 10px;">${challenge.title}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #333;">Hello ${userName}! 👋</p>
            
            <p style="color: #666; line-height: 1.6;">
              Congratulations on taking the first step towards your transformation! 
              You've officially enrolled in our <strong>${challenge.title}</strong>.
            </p>
            
            <!-- Discount Code Box -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #16A34A 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
              <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 14px;">YOUR EXCLUSIVE DISCOUNT CODE</p>
              <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; display: inline-block;">
                <code style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${discountCode}</code>
              </div>
              <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 16px;">
                <strong>${challenge.discount_percent}% OFF</strong> all challenge products
              </p>
            </div>
            
            <!-- What's Next -->
            <h2 style="color: #333; font-size: 20px; margin-top: 30px;">What's Next?</h2>
            
            <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <div style="margin-bottom: 15px;">
                <span style="background: #16A34A; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; margin-right: 10px;">1</span>
                <strong>Visit your challenge dashboard</strong> to see Day 1 instructions
              </div>
              <div style="margin-bottom: 15px;">
                <span style="background: #16A34A; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; margin-right: 10px;">2</span>
                <strong>Get your products</strong> using your exclusive discount
              </div>
              <div style="margin-bottom: 15px;">
                <span style="background: #16A34A; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; margin-right: 10px;">3</span>
                <strong>Mark each day complete</strong> as you follow the routine
              </div>
              <div>
                <span style="background: #16A34A; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; margin-right: 10px;">4</span>
                <strong>Stay consistent</strong> - we'll send gentle reminders if you miss days
              </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://1healthessentials.netlify.app/challenges/${userChallengeId}" 
                 style="background: linear-gradient(135deg, #DC2626 0%, #16A34A 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Start Day 1 Now →
              </a>
            </div>
            
            <!-- Challenge Details -->
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <h3 style="color: #333; font-size: 16px;">Challenge Details</h3>
              <table style="width: 100%; color: #666; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0;">Duration:</td>
                  <td style="padding: 8px 0; text-align: right;"><strong>${challenge.duration_days} days</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">Difficulty:</td>
                  <td style="padding: 8px 0; text-align: right;"><strong style="text-transform: capitalize;">${challenge.difficulty}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">Category:</td>
                  <td style="padding: 8px 0; text-align: right;"><strong style="text-transform: capitalize;">${challenge.category}</strong></td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #333; color: #fff; padding: 30px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">1Health Essentials</p>
            <p style="margin: 0; opacity: 0.8; font-size: 14px;">Your Partner in Health & Beauty</p>
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.6;">
              Brentwood Arcade, Thindiqua, Kiambu, Kenya<br>
              +254735558830 | hello@1healthessentials.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "1Health Essentials <onboarding@resend.dev>",
      to: [email],
      subject: `🎉 Your ${challenge.title} Starts Now! Here's Your ${challenge.discount_percent}% Discount`,
      html: emailHtml,
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
