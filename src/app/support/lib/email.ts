'use server';

import nodemailer from 'nodemailer';

// Email configuration function to ensure it only runs on server
const getEmailConfig = () => {
  return {
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  };
};

// Initialize transporter on demand
const getTransporter = () => {
  // Create a new transporter each time to avoid issues with stale connections
  // and to ensure proper server-side execution
  return nodemailer.createTransport(getEmailConfig());
};

/**
 * Send OTP email for login
 */
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Terafence Support Portal Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://terafence.com/wp-content/uploads/2023/08/site-logo.svg" alt="Terafence Logo" style="max-width: 180px;" />
          </div>
          <h1 style="color: #2563eb; font-size: 22px; margin-bottom: 15px;">Your One-Time Password</h1>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">Use the following code to log in to your Terafence Support Portal account:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af;">${otp}</span>
          </div>
          <p style="color: #4b5563; font-size: 14px;">This code will expire in 10 minutes and can only be used once.</p>
          <p style="color: #4b5563; font-size: 14px;">If you didn&apos;t request this code, please ignore this email or contact us if you have concerns.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Terafence Ltd. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
}

/**
 * Send verification email for new registrations
 */
export async function sendVerificationEmail(email: string, firstName: string, otp: string): Promise<boolean> {
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Terafence Support Portal Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://terafence.com/wp-content/uploads/2023/08/site-logo.svg" alt="Terafence Logo" style="max-width: 180px;" />
          </div>
          <h1 style="color: #2563eb; font-size: 22px; margin-bottom: 15px;">Welcome to Terafence Support Portal</h1>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">Hi ${firstName},</p>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">Thank you for registering. Please use the following verification code to complete your account setup:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af;">${otp}</span>
          </div>
          <p style="color: #4b5563; font-size: 14px;">This code will expire in 10 minutes and can only be used once.</p>
          <p style="color: #4b5563; font-size: 14px;">If you didn&apos;t create an account with us, please ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Terafence Ltd. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Terafence Support Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://terafence.com/wp-content/uploads/2023/08/site-logo.svg" alt="Terafence Logo" style="max-width: 180px;" />
          </div>
          <h1 style="color: #2563eb; font-size: 22px; margin-bottom: 15px;">Welcome to Terafence Support!</h1>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">Hi ${firstName},</p>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">Thank you for joining the Terafence Support Portal. Your account has been successfully created and verified.</p>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">You now have access to:</p>
          <ul style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">
            <li style="margin-bottom: 10px;">24/7 Technical support for Terafence data diode products</li>
            <li style="margin-bottom: 10px;">Product documentation and security updates</li>
            <li style="margin-bottom: 10px;">Ticket management for ongoing support issues</li>
            <li style="margin-bottom: 10px;">Remote assistance for device configuration</li>
          </ul>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
            <a href="https://terafence.com/support/login" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Sign In to Your Account</a>
          </div>
          <p style="color: #4b5563; font-size: 14px;">If you have any questions, please don&apos;t hesitate to contact our support team.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Terafence Ltd. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send ticket acknowledgment email
 */
export async function sendTicketAcknowledgment({
  ticketId,
  category,
  subcategory, 
  userEmail,
  subject,
  description,
  ccEmails = [],
  toEmails = []
}: {
  ticketId: string;
  category: string;
  subcategory: string;
  userEmail: string;
  subject: string;
  description: string;
  ccEmails?: string[];
  toEmails?: string[];
}): Promise<boolean> {
  try {
    const allRecipients = [userEmail, ...ccEmails, ...toEmails].filter(Boolean);
    
    if (allRecipients.length === 0) {
      console.error('No recipients provided for ticket acknowledgment email');
      return false;
    }
    
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      cc: [...new Set([...ccEmails, ...toEmails])].join(','), // Remove duplicates
      subject: `Ticket #${ticketId} Created: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://terafence.com/wp-content/uploads/2023/08/site-logo.svg" alt="Terafence Logo" style="max-width: 180px;" />
          </div>
          <h1 style="color: #2563eb; font-size: 22px; margin-bottom: 15px;">Support Ticket Created</h1>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">We have received your support request and created ticket #${ticketId}.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
            <p style="margin: 0 0 10px 0;"><strong>Category:</strong> ${category}</p>
            <p style="margin: 0 0 10px 0;"><strong>Subcategory:</strong> ${subcategory}</p>
            <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 0 0 0 0;"><strong>Description:</strong></p>
            <div style="background-color: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
              ${description.replace(/\n/g, '<br/>')}
            </div>
          </div>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">Our support team will review your request and respond shortly. You can track the status of your ticket in the support portal.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
            <a href="https://terafence.com/support/dashboard" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">View Ticket Status</a>
          </div>
          <p style="color: #4b5563; font-size: 14px;">Please do not reply to this email. For updates or to provide additional information, please log in to the support portal.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Terafence Ltd. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send ticket acknowledgment email:', error);
    return false;
  }
}