import { VercelRequest, VercelResponse } from '@vercel/node';

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

    // Log the contact form data
    // In production, you would:
    // 1. Store this in a database
    // 2. Send email using a service like SendGrid, Resend, or AWS SES
    // 3. Send confirmation email to the user
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      message,
      submittedAt: new Date().toISOString(),
    });

    // TODO: Integrate with email service
    // Example with Resend API:
    // const resendApiKey = process.env.RESEND_API_KEY;
    // const jdCompanyEmail = process.env.JD_COMPANY_EMAIL;
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${resendApiKey}`,
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@jdservices.com',
    //     to: jdCompanyEmail,
    //     subject: `New Contact Form Submission from ${name}`,
    //     html: `<p>${message}</p>`,
    //     replyTo: email,
    //   }),
    // });

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
