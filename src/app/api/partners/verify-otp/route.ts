// src/app/api/partners/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyOTP, createUserProfile, getUserRole } from "@/lib/firebase/auth-service";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    console.log("🔐 Verification attempt for:", email);
    console.log("🔑 Provided OTP:", otp);

    if (!email || !otp) {
      console.log("❌ Missing email or OTP");
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      console.log("❌ Invalid OTP format:", otp);
      return NextResponse.json(
        { error: "Invalid verification code format" },
        { status: 400 }
      );
    }

    // Verify OTP from Firebase
    console.log("🔍 Verifying OTP in Firebase...");
    const isValidOTP = await verifyOTP(email, otp);

    console.log("✅ OTP verification result:", isValidOTP);

    if (!isValidOTP) {
      console.log("❌ Invalid OTP for:", email);
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    console.log("✅ OTP verified successfully for:", email);

    // Create or update user profile in Firebase
    console.log("👤 Creating/updating user profile...");
    const userProfile = await createUserProfile(email);
    const userRole = getUserRole(email);

    console.log("📋 User profile:", { 
      email: userProfile.email, 
      role: userProfile.role,
      permissions: userProfile.permissions?.length || 0
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
    const tokenPayload = {
      email: email.toLowerCase(),
      role: userRole,
      permissions: userProfile.permissions || [],
      isAdmin: userRole === 'admin',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    const token = jwt.sign(tokenPayload, jwtSecret);

    console.log("🎉 Authentication successful for:", email, "- Role:", userRole);

    // Determine redirect URL based on role
    const redirectTo = userRole === 'admin' ? '/partners/admin' : '/partners/dashboard';

    // Set secure response
    const response = NextResponse.json(
      { 
        message: "Authentication successful",
        token,
        user: {
          email: email.toLowerCase(),
          role: userRole,
          permissions: userProfile.permissions || [],
          isAdmin: userRole === 'admin',
          profile: userProfile.profile || {}
        },
        redirectTo,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set("partner_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    response.cookies.set("user_role", userRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    response.cookies.set("user_email", email.toLowerCase(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    return NextResponse.json(
      { 
        error: "Authentication failed. Please try again.",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}