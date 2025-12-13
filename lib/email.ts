/**
 * Email notification service using EmailJS (free tier)
 * 
 * To set up EmailJS:
 * 1. Go to https://www.emailjs.com/
 * 2. Create a free account
 * 3. Create an email service (Gmail, Outlook, etc.)
 * 4. Create an email template
 * 5. Get your Public Key, Service ID, and Template ID
 * 6. Add them to environment variables or use the defaults below
 * 
 * For now, we'll use a simple API approach that can be configured later
 */

export interface EmailParams {
  to: string;
  subject: string;
  message: string;
  recruiterName?: string;
  status?: "approved" | "rejected";
}

export async function sendEmailNotification(params: EmailParams): Promise<boolean> {
  try {
    // Using EmailJS client-side approach (free solution)
    // This will be called from the client-side after approval/rejection
    
    // For server-side, we can use a service like Resend, SendGrid, etc.
    // For now, we'll create an API endpoint that can be configured
    
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

