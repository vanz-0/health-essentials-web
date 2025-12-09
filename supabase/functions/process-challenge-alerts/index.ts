import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing challenge alerts...");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all active user challenges
    const { data: activeUserChallenges, error: fetchError } = await supabase
      .from("user_challenges")
      .select(`
        *,
        challenges (*)
      `)
      .eq("status", "active");
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`Found ${activeUserChallenges?.length || 0} active challenges to process`);
    
    const results = [];
    
    for (const uc of activeUserChallenges || []) {
      const challenge = uc.challenges;
      const lastActivity = new Date(uc.last_activity_at);
      const now = new Date();
      const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      console.log(`User ${uc.email}: ${daysSinceActivity} days since last activity`);
      
      // Check if we need to send alerts
      let alertType: string | null = null;
      let shouldReset = false;
      
      if (daysSinceActivity >= 7) {
        alertType = "7_days_reset";
        shouldReset = true;
      } else if (daysSinceActivity >= 5) {
        alertType = "5_days";
      } else if (daysSinceActivity >= 2) {
        alertType = "2_days";
      }
      
      if (alertType) {
        // Check if we already sent this alert
        const { data: existingAlert } = await supabase
          .from("challenge_alerts")
          .select("*")
          .eq("user_challenge_id", uc.id)
          .eq("alert_type", alertType)
          .eq("sent", true)
          .single();
        
        if (!existingAlert) {
          // Send the alert email
          const emailHtml = generateAlertEmail(alertType, uc, challenge);
          const subject = getAlertSubject(alertType, challenge.title);
          
          try {
            await resend.emails.send({
              from: "1Health Essentials <onboarding@resend.dev>",
              to: [uc.email],
              subject,
              html: emailHtml,
            });
            
            // Record the alert
            await supabase.from("challenge_alerts").insert({
              user_challenge_id: uc.id,
              alert_type: alertType,
              sent: true,
              sent_at: new Date().toISOString(),
            });
            
            console.log(`Sent ${alertType} alert to ${uc.email}`);
            results.push({ email: uc.email, alertType, sent: true });
          } catch (emailError) {
            console.error(`Failed to send email to ${uc.email}:`, emailError);
            results.push({ email: uc.email, alertType, sent: false, error: emailError.message });
          }
        }
        
        // Update missed days streak
        await supabase
          .from("user_challenges")
          .update({ 
            missed_days_streak: daysSinceActivity,
            status: shouldReset ? "abandoned" : "active"
          })
          .eq("id", uc.id);
        
        if (shouldReset) {
          console.log(`Challenge ${uc.id} marked as abandoned`);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: activeUserChallenges?.length || 0,
        results 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error processing challenge alerts:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getAlertSubject(alertType: string, challengeTitle: string): string {
  switch (alertType) {
    case "2_days":
      return `⏰ Hey! We miss you in your ${challengeTitle}`;
    case "5_days":
      return `⚠️ Your ${challengeTitle} is at risk!`;
    case "7_days_reset":
      return `😢 Your ${challengeTitle} has been paused - Start Fresh?`;
    default:
      return `Update on your ${challengeTitle}`;
  }
}

function generateAlertEmail(alertType: string, uc: any, challenge: any): string {
  const userName = uc.full_name || "there";
  const challengeUrl = `https://1healthessentials.netlify.app/challenges/${uc.id}`;
  
  let title: string;
  let message: string;
  let ctaText: string;
  let bgColor: string;
  
  switch (alertType) {
    case "2_days":
      title = "We Miss You! 💚";
      message = `It's been 2 days since your last check-in on the ${challenge.title}. Don't worry, it happens to everyone! The key is to get back on track today.`;
      ctaText = "Continue My Challenge";
      bgColor = "#F59E0B";
      break;
    case "5_days":
      title = "Your Challenge is at Risk! ⚠️";
      message = `It's been 5 days since you've checked in. If you miss 2 more days, your challenge will reset. We know you can do this - let's get back on track today!`;
      ctaText = "Don't Give Up - Continue Now";
      bgColor = "#DC2626";
      break;
    case "7_days_reset":
      title = "Your Challenge Has Been Paused 😢";
      message = `After 7 days of inactivity, your ${challenge.title} has been paused. But don't be discouraged - every journey has setbacks. You can start fresh anytime!`;
      ctaText = "Start a New Challenge";
      bgColor = "#666666";
      break;
    default:
      title = "Challenge Update";
      message = "Here's an update on your challenge.";
      ctaText = "View Challenge";
      bgColor = "#16A34A";
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: ${bgColor}; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">${title}</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 18px; color: #333;">Hey ${userName}! 👋</p>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            ${message}
          </p>
          
          ${alertType !== "7_days_reset" ? `
          <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #666;">Your progress so far:</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #16A34A;">Day ${uc.current_day}/30</p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Don't let this go to waste!</p>
          </div>
          ` : `
          <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #666;">Remember:</p>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
              <li>Your discount code <strong>${uc.discount_code}</strong> is still valid!</li>
              <li>You can start a new challenge anytime</li>
              <li>Every day is a new opportunity</li>
            </ul>
          </div>
          `}
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${alertType === "7_days_reset" ? "https://1healthessentials.netlify.app/challenges" : challengeUrl}" 
               style="background: ${bgColor}; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              ${ctaText}
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Reply to this email or WhatsApp us at +254735558830
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #333; color: #fff; padding: 30px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">1Health Essentials</p>
          <p style="margin: 0; opacity: 0.8; font-size: 14px;">Your Partner in Health & Beauty</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
