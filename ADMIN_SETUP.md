# Admin Panel Setup Guide

## Authentication

The admin panel is protected with password authentication.

**Credentials:**

- Username: `vimal`
- Password: `racerk66`

Access the admin panel at `/admin/login`

## Features Implemented

### ✅ Password Protection

- Login page at `/admin/login`
- Session-based authentication (24-hour duration)
- Automatic redirect to login if not authenticated

### ✅ Search and Filter

- Search by name, company, bio, specialization, or submitter email
- Filter by status (All, Pending, Approved, Rejected)
- Filter by country
- Real-time filtering

### ✅ Bulk Actions

- Select all / Deselect all
- Bulk approve multiple submissions
- Bulk reject multiple submissions
- Visual selection indicators

### ✅ Intelligent ID Generation

- Format: `{country}-{timestamp}-{hash}`
- Example: `in-1704067200000-a3f5`
- Prevents duplicate IDs
- More reliable than sequential numbering

### ✅ Email Notifications

- Automatic emails sent when submissions are approved/rejected
- Emails sent to the submitter's email address (if provided)
- Currently logs emails to console (see setup below to enable actual sending)

## Email Setup (Optional)

The email notification system is currently set up to log emails to the console. To enable actual email sending, you can configure one of these free services:

### Option 1: Resend (Recommended - Free Tier: 3,000 emails/month)

1. Sign up at https://resend.com
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Update `/app/api/send-email/route.ts` to use Resend SDK

### Option 2: EmailJS (Free - 200 emails/month)

1. Sign up at https://www.emailjs.com
2. Create an email service
3. Create an email template
4. Get your Public Key, Service ID, and Template ID
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxx
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=xxxxx
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=xxxxx
   ```
6. Update the email sending logic to use EmailJS client-side SDK

### Option 3: SendGrid (Free Tier: 100 emails/day)

1. Sign up at https://sendgrid.com
2. Get your API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
4. Update `/app/api/send-email/route.ts` to use SendGrid SDK

## Current Email Behavior

Currently, emails are logged to the console for development/testing. The email API endpoint (`/api/send-email`) is ready to be configured with any email service.

To see email logs, check your server console when approving/rejecting submissions.

## Admin Panel Usage

1. Navigate to `/admin/login`
2. Enter credentials: `vimal` / `racerk66`
3. You'll be redirected to `/admin`
4. Use search and filters to find submissions
5. Select submissions using checkboxes
6. Use bulk actions or individual approve/reject buttons
7. Logout using the logout button in the top right

## Security Notes

- The password is hardcoded for simplicity
- For production, consider implementing:
  - Environment variable-based credentials
  - JWT tokens
  - Database-backed authentication
  - Rate limiting
  - IP whitelisting
