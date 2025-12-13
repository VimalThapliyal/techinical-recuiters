import { NextRequest, NextResponse } from "next/server";

/**
 * Email notification API endpoint
 * 
 * This endpoint can be configured to use:
 * - EmailJS (free, client-side)
 * - Resend (free tier: 3,000 emails/month)
 * - SendGrid (free tier: 100 emails/day)
 * - Nodemailer with Gmail (free but requires OAuth)
 * 
 * For now, this is a placeholder that logs the email.
 * To enable actual email sending, configure one of the services above.
 */

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, recruiterName, status } = await request.json();

    // Log email (for development/testing)
    console.log("📧 Email Notification:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Message:", message);
    console.log("Recruiter:", recruiterName);
    console.log("Status:", status);

    // TODO: Implement actual email sending
    // Example with Resend (free tier):
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: to,
    //   subject: subject,
    //   html: message,
    // });

    // For now, return success (emails are logged for testing)
    return NextResponse.json({
      success: true,
      message: "Email notification logged (configure email service to send actual emails)",
    });
  } catch (error) {
    console.error("Error in email API:", error);
    return NextResponse.json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
}

