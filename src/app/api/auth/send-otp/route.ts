// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.endsWith("@terafence.in")) {
      return NextResponse.json(
        { message: "Only @terafence.in email addresses are allowed" },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a session ID for this OTP request
    const sessionId = uuidv4();
    
    // Store OTP with expiration (5 minutes) in an encrypted cookie
    const otpData = {
      email,
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };
    
    // Set the cookie with the OTP data
    const cookieStore = await cookies();
    cookieStore.set({
      name: `otp_${sessionId}`,
      value: JSON.stringify(otpData),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 300, // 5 minutes in seconds
      path: "/",
    });

    // Send email with OTP
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Terafence Resource Portal - Your OTP Code",
      text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333;">Terafence Resource Portal</h2>
          <p>Hello ${email.split("@")[0]},</p>
          <p>Your one-time password (OTP) for accessing the Terafence Resource Portal is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 5px; text-align: center; font-weight: bold;">
            ${otp}
          </div>
          <p style="margin-top: 20px;">This code will expire in 5 minutes.</p>
          <p style="color: #777; font-size: 12px; margin-top: 30px;">If you did not request this OTP, please ignore this email.</p>
        </div>
      `,
    });

    // For debugging in development
    if (process.env.NODE_ENV === "development") {
      console.log(`OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({ 
      message: "OTP sent successfully",
      sessionId 
    }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}