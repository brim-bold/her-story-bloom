import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  template?: 'contact' | 'welcome' | 'notification' | 'password_reset' | 'password_reset_lockout';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject = "Message from Her Story Collective", message = "", template = "contact" }: ContactEmailRequest = await req.json();

    console.log(`Sending email to ${email} with template: ${template}`);

    let emailHtml = "";
    let emailSubject = subject;

    // Different email templates
    switch (template) {
      case 'welcome':
        emailSubject = "Welcome to Her Story Collective!";
        emailHtml = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #df9152;">Welcome to Her Story Collective, ${name}!</h1>
            <p>We're excited to have you join our community of women sharing their stories and supporting each other.</p>
            <p>Get started by exploring:</p>
            <ul>
              <li>Discover inspiring stories from other women</li>
              <li>Join upcoming events and workshops</li>
              <li>Connect with like-minded individuals</li>
            </ul>
            <p>Best regards,<br>The Her Story Collective Team</p>
          </div>
        `;
        break;
      
      case 'notification':
        emailHtml = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #df9152;">Hello ${name}!</h1>
            <p>${message}</p>
            <p>Best regards,<br>The Her Story Collective Team</p>
          </div>
        `;
        break;
      
      case 'password_reset':
        emailSubject = "Reset Your Password - Her Story Collective";
        emailHtml = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #df9152;">Password Reset Request</h1>
            <p>Hello ${name},</p>
            <p>We received a request to reset your password for your Her Story Collective account.</p>
            <p>You should receive a password reset link shortly. If you didn't request this reset, please ignore this email.</p>
            <p>For security reasons, this link will expire in 1 hour.</p>
            <p>Best regards,<br>The Her Story Collective Team</p>
          </div>
        `;
        break;
      
      case 'password_reset_lockout':
        emailSubject = "Account Locked - Her Story Collective";
        emailHtml = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #df9152;">Account Temporarily Locked</h1>
            <p>Hello,</p>
            <p>Your Her Story Collective account has been temporarily locked due to multiple failed login attempts.</p>
            <p>For your security, please reset your password to regain access to your account.</p>
            <p>You can reset your password by visiting our login page and clicking "Forgot your password?"</p>
            <p>This lockout will automatically expire in 15 minutes, but we recommend resetting your password for security.</p>
            <p>If you didn't attempt to log in, please contact our support team immediately.</p>
            <p>Best regards,<br>The Her Story Collective Team</p>
          </div>
        `;
        break;
      
      default: // contact
        emailHtml = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #df9152;">Thank you for contacting us, ${name}!</h1>
            <p>We have received your message and will get back to you as soon as possible.</p>
            ${message ? `<div style="background-color: #FAF9F6; padding: 15px; border-left: 4px solid #df9152; margin: 20px 0;"><strong>Your message:</strong><br>${message}</div>` : ''}
            <p>Best regards,<br>The Her Story Collective Team</p>
          </div>
        `;
    }

    const emailResponse = await resend.emails.send({
      from: "Her Story Collective <onboarding@resend.dev>",
      to: [email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);