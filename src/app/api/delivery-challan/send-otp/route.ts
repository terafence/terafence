import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { setOTP } from "@/app/delivery-challan/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    setOTP(email, otp);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM || "Terafence"}" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: "Delivery Challan Portal - OTP Verification",
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <h2 style="color:#1a1a2e;margin:0;font-size:20px;">Terafence Private Limited</h2>
            <p style="color:#64748b;margin:4px 0 0;font-size:13px;">Delivery Challan Portal</p>
          </div>
          <div style="background:#f8fafc;border-radius:12px;padding:24px;text-align:center;border:1px solid #e2e8f0;">
            <p style="color:#475569;margin:0 0 16px;font-size:14px;">Your verification code is</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#1a1a2e;font-family:monospace;">${otp}</div>
            <p style="color:#94a3b8;margin:16px 0 0;font-size:12px;">Valid for 5 minutes</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
