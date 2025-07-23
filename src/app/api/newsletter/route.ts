import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { 
  generateCustomerEmailTemplate, 
  generateAdminEmailTemplate 
} from '@/lib/email-templates/newsletter';

// Validation schema for incoming requests
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  interests: z.array(z.string()).optional(),
  company: z.string().optional(),
  source: z.string().optional(),
});

type NewsletterData = z.infer<typeof newsletterSchema>;

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

// Initialize transporter
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Newsletter subscription API endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = newsletterSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data: NewsletterData = validationResult.data;
    
    // Store subscription in database (implement this according to your database setup)
    // Example: await db.insert('newsletter_subscribers', data);
    
    // Send confirmation email to subscriber
    await sendCustomerConfirmationEmail(data);
    
    // Send notification email to admin
    await sendAdminNotificationEmail(data);

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

/**
 * Sends confirmation email to the customer
 */
async function sendCustomerConfirmationEmail(data: NewsletterData) {
  const { email, name } = data;
  const customerName = name || email.split('@')[0];
  
  const mailOptions = {
    from: `"Terafence Security" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Welcome to Terafence Newsletter',
    html: generateCustomerEmailTemplate({
      name: customerName,
      currentDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }),
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Sends notification email to the admin
 */
async function sendAdminNotificationEmail(data: NewsletterData) {
  const { email, name, company, interests, source } = data;
  
  const mailOptions = {
    from: `"Terafence Newsletter System" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_FROM, // Send to admin email
    subject: 'New Newsletter Subscriber',
    html: generateAdminEmailTemplate({
      subscriberEmail: email,
      subscriberName: name || 'Not provided',
      subscriberCompany: company || 'Not provided',
      subscriberInterests: interests?.join(', ') || 'Not specified',
      subscriptionSource: source || 'Website',
      subscriptionDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }),
  };

  return transporter.sendMail(mailOptions);
}