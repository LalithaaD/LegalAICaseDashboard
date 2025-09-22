# 📧 Email Setup Guide - Send Real Team Invitations

## Current Status
The team invitation system is now set up to send **real emails**, but it's currently in **simulation mode** because the email service isn't configured yet.

## What Happens Now
When you send a team invitation:
1. ✅ **Form validation** works perfectly
2. ✅ **Email content** is generated with all details
3. ✅ **Console logging** shows exactly what would be sent
4. ❌ **No actual email** is sent (simulation mode)

## To Send Real Emails - Choose One Option:

### Option 1: EmailJS (Recommended - Easiest)
**Free tier: 200 emails/month**

1. **Sign up** at [EmailJS.com](https://www.emailjs.com/)
2. **Create a service** (Gmail, Outlook, etc.)
3. **Create email templates** for team invitations
4. **Get your credentials**:
   - Service ID
   - Template ID  
   - Public Key

5. **Update the configuration** in `src/services/emailService.ts`:
   ```typescript
   const EMAILJS_SERVICE_ID = 'your_service_id_here';
   const EMAILJS_TEMPLATE_ID = 'your_template_id_here';
   const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
   ```

### Option 2: SendGrid (Professional)
**Free tier: 100 emails/day**

1. **Sign up** at [SendGrid.com](https://sendgrid.com/)
2. **Create API key**
3. **Update email service** to use SendGrid API
4. **Configure templates**

### Option 3: Nodemailer (Backend Required)
**Requires Node.js backend**

1. **Set up Express.js backend**
2. **Install Nodemailer**
3. **Configure SMTP settings**
4. **Create API endpoints**

## Quick Test - See What Would Be Sent

1. **Go to Settings → Users → Invite Team Member**
2. **Fill out the form** with any email address
3. **Click "Send Invitation"**
4. **Open browser console** (F12 → Console tab)
5. **See the email details** that would be sent

## Email Template Preview

The system generates professional emails with:
- ✅ **Personalized greeting**
- ✅ **Role assignment**
- ✅ **Custom message**
- ✅ **Invitation link**
- ✅ **Expiration notice**
- ✅ **Professional signature**

## Example Email Content

```
Subject: You're invited to join Doe & Associates on LegalAI Dashboard

Dear john,

John Doe has invited you to join Doe & Associates on our LegalAI Dashboard.

Your Role: Editor
Welcome to our legal dashboard! You've been invited to join as an Editor.

To accept this invitation, click the link below:
http://localhost:8082/invite?token=abc123def456

This invitation will expire in 7 days.

Best regards,
The Doe & Associates Team
```

## Next Steps

1. **Choose an email service** (EmailJS recommended)
2. **Set up the service** following their documentation
3. **Update the configuration** in the code
4. **Test with a real email address**
5. **Check your inbox** for the invitation!

## Need Help?

- **EmailJS Setup**: [EmailJS Documentation](https://www.emailjs.com/docs/)
- **SendGrid Setup**: [SendGrid Documentation](https://docs.sendgrid.com/)
- **Issues**: Check browser console for detailed error messages

---

**Current Status**: ✅ Ready to send real emails once email service is configured!
