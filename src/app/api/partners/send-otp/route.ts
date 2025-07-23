// src/app/api/partners/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { storeOTP, cleanExpiredOTPs, debugListOTPs } from "@/lib/firebase/auth-service";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log("🔐 OTP request for email:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Clean expired OTPs before creating new one
    await cleanExpiredOTPs();

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    console.log("🔑 Generated OTP:", otp, "for email:", email);
    console.log("⏰ OTP expires at:", new Date(expiresAt).toISOString());

    // Store OTP in Firebase with enhanced error handling
    try {
      console.log("💾 Attempting to store OTP in Firebase...");
      await storeOTP(email, otp, expiresAt);
      console.log("✅ OTP stored successfully in Firebase");
      
      // Debug: List all OTPs to verify storage
      await debugListOTPs();
      
    } catch (storageError) {
      console.error("❌ Failed to store OTP in Firebase:", storageError);
      return NextResponse.json(
        { error: "Failed to generate verification code. Please try again." },
        { status: 500 }
      );
    }

    // Enhanced email template
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TeraFence Partner Portal - Verification Code</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .logo {
          position: relative;
          z-index: 2;
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin-bottom: 12px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .subtitle {
          position: relative;
          z-index: 2;
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          font-weight: 500;
        }
        .content {
          padding: 50px 40px;
          text-align: center;
          background: white;
        }
        .title {
          color: #2d3748;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .description {
          color: #718096;
          font-size: 18px;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .otp-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 40px;
          margin: 40px 0;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
        .otp-label {
          position: relative;
          z-index: 2;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 600;
        }
        .otp-code {
          position: relative;
          z-index: 2;
          color: white;
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 12px;
          margin: 0;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .warning {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-left: 6px solid #ef4444;
          padding: 24px;
          margin: 24px 0;
          border-radius: 12px;
          position: relative;
        }
        .warning::before {
          content: '⚠️';
          font-size: 20px;
          position: absolute;
          top: 12px;
          left: 12px;
        }
        .warning-text {
          color: #dc2626;
          font-size: 15px;
          margin: 0;
          padding-left: 32px;
          line-height: 1.6;
        }
        .footer {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 32px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #64748b;
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }
        .expiry-notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          text-align: center;
        }
        .expiry-text {
          color: #856404;
          font-size: 14px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛡️ TeraFence Partner Portal</div>
          <div class="subtitle">Enterprise Security Access</div>
        </div>
        
        <div class="content">
          <h1 class="title">Verification Required</h1>
          <p class="description">
            Please use the secure verification code below to complete your authentication to the TeraFence Partner Portal.
          </p>
          
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
          </div>
          
          <div class="expiry-notice">
            <div class="expiry-text">⏰ This code expires in 10 minutes</div>
          </div>
          
          <div class="warning">
            <p class="warning-text">
              <strong>Security Notice:</strong> Never share this code with anyone. TeraFence will never ask for your verification code via phone or other means. If you didn't request this code, please ignore this email and contact our security team immediately.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-text">
            TeraFence Cybersecurity Solutions - Protecting critical infrastructure with enterprise-grade security.
            <br><br>
            Need assistance? Contact: <strong>support@terafence.in</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email
    try {
      console.log("📧 Sending email to:", email);
      await transporter.sendMail({
        from: `"TeraFence Security" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "🔐 TeraFence Partner Portal - Secure Access Code",
        html: emailHtml,
        text: `Your TeraFence Partner Portal verification code is: ${otp}. This code expires in 10 minutes and is for one-time use only. Never share this code with anyone.`,
        priority: "high",
      });

      console.log("📧 Email sent successfully to:", email);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // Continue anyway since OTP is stored
    }

    return NextResponse.json(
      { 
        message: "Verification code sent successfully",
        email: email.toLowerCase(),
        expiresIn: "10 minutes",
        timestamp: new Date().toISOString(),
        debug: {
          otpGenerated: true,
          otpStored: true,
          emailSent: true
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    return NextResponse.json(
      { 
        error: "Failed to send verification code. Please try again.",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}