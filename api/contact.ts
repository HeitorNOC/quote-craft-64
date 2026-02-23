import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message }: ContactFormData = req.body;

    // Validate input
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    // Initialize Resend with API key
    const resendApiKey = process.env.RESEND_API_KEY;
    const jdCompanyEmail = process.env.VITE_JD_COMPANY_EMAIL || 'contact@jdservices.com';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({
        error: 'Email service not configured. Please contact support.',
      });
    }

    const resend = new Resend(resendApiKey);

    // Send email to company
    const companyEmailPromise = resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: jdCompanyEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Submitted on ${new Date().toLocaleString()}</p>
        </div>
      `,
      replyTo: email,
    });

    // Send confirmation email to user
    const confirmationEmailPromise = resend.emails.send({
      from: 'JD Services <onboarding@resend.dev>',
      to: email,
      subject: 'We received your message - JD Services',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Thank you for contacting JD Services!</h2>
          <p>Hi ${name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <h3>Your Message Summary:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="margin: 20px 0;">
          <p>If you need to reach us urgently, please call us at (555) 123-4567.</p>
          <p style="color: #666;">Best regards,<br>JD Services Team</p>
        </div>
      `,
    });

    // Wait for both emails to send
    const [companyResult, confirmationResult] = await Promise.all([
      companyEmailPromise,
      confirmationEmailPromise,
    ]);

    if (companyResult.error || confirmationResult.error) {
      console.error('Email send error:', companyResult.error || confirmationResult.error);
      return res.status(500).json({
        error: 'Failed to send email. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully. We will contact you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to process your request. Please try again later.',
    });
  }
}
