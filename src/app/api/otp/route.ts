import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define types for our OTP store
interface OtpData {
  otp: string;
  expiryTime: number;
}

interface OtpStore {
  [email: string]: OtpData;
}

// Declare the global variable with proper typing
declare global {
  // eslint-disable-next-line no-var
  var otpStore: OtpStore;
}

// Initialize the OTP store if it doesn't exist
if (!global.otpStore) {
  global.otpStore = {};
}

// Configure the email transporter
const getEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT ? parseInt(process.env.EMAIL_SERVER_PORT) : 465,
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
};

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action, otp } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Handle OTP request
    if (action === 'request') {
      const generatedOTP = generateOTP();
      
      try {
        // Store OTP in server memory
        // Make sure otpStore is initialized
        if (!global.otpStore) {
          global.otpStore = {};
        }
        
        global.otpStore[email] = {
          otp: generatedOTP,
          expiryTime: Date.now() + 10 * 60 * 1000 // 10 minutes
        };
        
        // Send email with OTP
        const transporter = getEmailTransporter();
        
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@terafence.in',
          to: email,
          subject: 'Your OTP for Terafence Support',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Terafence Support Access</h2>
              <p>Your one-time password (OTP) is:</p>
              <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px; text-align: center;">${generatedOTP}</h1>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this OTP, please ignore this email.</p>
            </div>
          `
        });
        
        return NextResponse.json({ success: true });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return NextResponse.json(
          { error: 'Failed to send OTP email', details: emailError instanceof Error ? emailError.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }
    
    // Handle OTP verification
    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json(
          { error: 'OTP is required' },
          { status: 400 }
        );
      }
      
      // Make sure otpStore is initialized
      if (!global.otpStore) {
        global.otpStore = {};
        return NextResponse.json(
          { error: 'No OTP found for this email. Please request a new OTP.' },
          { status: 400 }
        );
      }
      
      const storedOtpData = global.otpStore[email];
      
      if (!storedOtpData) {
        return NextResponse.json(
          { error: 'No OTP found for this email. Please request a new OTP.' },
          { status: 400 }
        );
      }
      
      // Check if OTP is expired
      if (Date.now() > storedOtpData.expiryTime) {
        // Remove expired OTP
        delete global.otpStore[email];
        
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new OTP.' },
          { status: 400 }
        );
      }
      
      // Verify OTP
      if (otp !== storedOtpData.otp) {
        return NextResponse.json(
          { error: 'Invalid OTP. Please try again.' },
          { status: 400 }
        );
      }
      
      // OTP verified successfully
      // Remove the used OTP
      delete global.otpStore[email];
      
      // Check if user is admin
      const isAdmin = [
        'yash@terafence.in',
        'dinesh@terafence.in',
        'akshat@terafence.in',
        'jose@terafence.in',
        'chandra@terafence.in',
        'amandeep@terafence.in'
      ].includes(email);
      
      // Return session details
      return NextResponse.json({
        success: true,
        email,
        expiryTime: Date.now() + 10 * 60 * 1000, // 10 minutes
        isAdmin
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('OTP API error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}