// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, otp, sessionId } = await request.json();

    // Validate inputs
    if (!email || !otp || !sessionId) {
      return NextResponse.json(
        { message: "Email, OTP, and session ID are required" },
        { status: 400 }
      );
    }

    // Get the OTP data from cookies
    const cookieStore = await cookies();
    const otpCookie = cookieStore.get(`otp_${sessionId}`);
    
    if (!otpCookie || !otpCookie.value) {
      return NextResponse.json(
        { message: "No OTP found for this email. Please request a new one." },
        { status: 400 }
      );
    }

    // Parse the stored OTP data
    const otpData = JSON.parse(otpCookie.value);
    
    // Verify the email matches
    if (otpData.email !== email) {
      return NextResponse.json(
        { message: "Invalid email. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > otpData.expires) {
      // Clean up expired OTP cookie
      await cookieStore.delete(`otp_${sessionId}`);
      
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // Clean up used OTP cookie
    await cookieStore.delete(`otp_${sessionId}`);

    // In a production environment, you would create a session or JWT token here
    return NextResponse.json(
      { 
        message: "OTP verified successfully",
        user: {
          email,
          // Other user data would typically come from a database
        }
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}