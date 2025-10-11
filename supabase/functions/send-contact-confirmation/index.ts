import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactConfirmationRequest {
  name: string;
  email: string;
  source: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, source }: ContactConfirmationRequest = await req.json();

    console.log(`Sending confirmation email to ${email} (source: ${source})`);

    const emailResponse = await resend.emails.send({
      from: "1Health <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to 1Health - Thank You for Subscribing!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: white; margin: 0; font-size: 28px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .content h2 { color: #10b981; margin-top: 0; }
              .content p { margin: 15px 0; }
              .benefits { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .benefits ul { margin: 10px 0; padding-left: 20px; }
              .benefits li { margin: 8px 0; }
              .cta { text-align: center; margin: 30px 0; }
              .cta a { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              .footer a { color: #10b981; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to 1Health! 🌿</h1>
              </div>
              <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thank you for subscribing to 1Health! We're thrilled to have you join our community of health-conscious individuals.</p>
                
                <div class="benefits">
                  <p><strong>As a subscriber, you'll receive:</strong></p>
                  <ul>
                    <li>🎁 Exclusive discounts and early access to new products</li>
                    <li>📚 Health and wellness tips from our experts</li>
                    <li>🔔 First notifications about special promotions</li>
                    <li>💚 Personalized product recommendations</li>
                  </ul>
                </div>

                <p>We're committed to providing you with high-quality, natural health products that make a difference in your life.</p>

                <div class="cta">
                  <a href="https://syymqotfxkmchtjsmhkr.supabase.co">Explore Our Products</a>
                </div>

                <p style="margin-top: 30px;">If you have any questions or need assistance, feel free to reply to this email. We're here to help!</p>

                <p>Stay healthy,<br><strong>The 1Health Team</strong></p>
              </div>
              <div class="footer">
                <p>You received this email because you subscribed to 1Health updates.</p>
                <p><a href="#">Manage your preferences</a> | <a href="#">Unsubscribe</a></p>
                <p>© 2025 1Health. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw emailResponse.error;
    }

    console.log("Email sent successfully:", emailResponse.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
