/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle?: string;
  businessSegment?: string;
  helpType?: string;
  referralSource?: string;
  additionalDetails?: string;
};

// ---------- Pooled transporter (reuse across requests) ----------
let cachedTransporter: Transporter | null = null;
function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    pool: true,                      // <— reuse connection(s)
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT || "465"),
    secure: process.env.EMAIL_SERVER_SECURE === "true", // 465:true, 587:false
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    maxConnections: 1,               // shared hosts prefer 1 at a time
    maxMessages: 100,
    // Gentle but tighter timeouts
    connectionTimeout: 8000,
    greetingTimeout: 7000,
    socketTimeout: 15000,
    tls: { minVersion: "TLSv1.2" },
    // logger: true, debug: true,
  });
  return cachedTransporter;
}

// ---------- Helpers ----------
function fromHeader(fallbackName = "Terafence Website") {
  // Expect EMAIL_FROM to be an address like info@terafence.in
  const addr = (process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER || "").trim();
  if (addr.includes("@")) return `"${fallbackName}" <${addr}>`;
  return `"${fallbackName}" <${process.env.EMAIL_SERVER_USER}>`;
}

export async function POST(request: Request) {
  const t0 = Date.now();
  try {
    const data: ContactData = await request.json();

    // ---- HTML templates (light mode) with your requested changes ----
    // Company notification (kept your structure, just minor tweaks)
    const companyEmailTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Contact Form Submission</title>
<!--[if mso]><style type="text/css">body, table, td {font-family: Arial, Helvetica, sans-serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;background-color:#f6f9fc;color:#333">
  <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%;background-color:#f6f9fc">
    <tr><td align="center" style="padding:30px 10px">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;box-shadow:0 3px 10px rgba(0,0,0,0.08)">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%)">
            <tr><td align="center" style="padding:30px 0">
              <img src="https://terafence.in/images/terafence.png" alt="Terafence" width="180" style="display:block;border:0;max-width:180px">
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:30px 40px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding-bottom:20px;border-bottom:1px solid #e5e7eb">
              <h1 style="color:#1e3a8a;font-size:24px;margin:0;font-weight:600">New Contact Form Submission</h1>
            </td></tr>
            <tr><td style="padding-top:25px;padding-bottom:10px">
              <p style="margin:0 0 15px;line-height:1.5;font-size:16px">A new inquiry has been submitted through the contact form. Here are the details:</p>
            </td></tr>
            <tr><td style="padding:20px 0">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:6px;border-left:4px solid #3b82f6">
                <tr><td style="padding:20px">
                  <p style="margin:0 0 15px;color:#1e3a8a;font-weight:600;font-size:16px">Contact Information</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;font-size:15px;vertical-align:top">Name:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;font-size:15px;vertical-align:top">${data.firstName} ${data.lastName}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Email:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top"><a href="mailto:${data.email}" style="color:#3b82f6;text-decoration:none">${data.email}</a></td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Phone:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.phone}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Company:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.company}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Job Title:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.jobTitle || "-"}</td></tr>
                  </table>
                </td></tr>
              </table>
            </td></tr>
            <tr><td style="padding:20px 0">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:6px;border-left:4px solid #3b82f6">
                <tr><td style="padding:20px">
                  <p style="margin:0 0 15px;color:#1e3a8a;font-weight:600;font-size:16px">Inquiry Details</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;font-size:15px;vertical-align:top">Business Segment:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;font-size:15px;vertical-align:top">${data.businessSegment || "-"}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Help Type:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.helpType || "-"}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Referral Source:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.referralSource || "Not specified"}</td></tr>
                  </table>
                </td></tr>
              </table>
            </td></tr>
            <tr><td align="center" style="padding:30px 0">
              <table cellpadding="0" cellspacing="0"><tr><td align="center" style="border-radius:6px;background:#1e3a8a">
                <a href="mailto:${data.email}" target="_blank" style="border:none;border-radius:6px;color:#fff;display:inline-block;font-size:16px;font-weight:500;line-height:1.2;padding:15px 25px;text-decoration:none;text-align:center">Reply to Inquiry</a>
              </td></tr></table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center">
          <table width="100%" style="background:#f8fafc;border-bottom-left-radius:8px;border-bottom-right-radius:8px"><tr>
            <td align="center" style="padding:20px">
              <p style="margin:0;font-size:14px;line-height:1.5;color:#64748b">
                This is an automated notification from the Terafence Private Limited website contact form.
              </p>
            </td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Customer acknowledgment (light mode), footer limited to LinkedIn + Website, updated address
    const customerEmailTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You for Contacting Terafence</title>
<!--[if mso]><style type="text/css">body, table, td {font-family: Arial, Helvetica, sans-serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;background-color:#f6f9fc;color:#333">
  <div style="display:none;max-height:0;overflow:hidden">Thank you for reaching out to Terafence. Your inquiry has been received.</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%;background-color:#f6f9fc">
    <tr><td align="center" style="padding:30px 10px">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;box-shadow:0 3px 10px rgba(0,0,0,0.08)">
        <tr><td align="center">
          <table width="100%" style="background: linear-gradient(135deg, #60a5fa 0%, #bfdbfe 100%)">
            <tr><td align="center" style="padding:30px 0">
              <img src="https://terafence.in/images/terafence.png" alt="Terafence" width="180" style="display:block;border:0;max-width:180px">
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:30px 40px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding-bottom:20px;border-bottom:1px solid #e5e7eb">
              <h1 style="color:#1e3a8a;font-size:24px;margin:0;font-weight:600">Thank You for Contacting Us</h1>
            </td></tr>
            <tr><td style="padding-top:25px;padding-bottom:10px">
              <p style="margin:0 0 15px;line-height:1.5;font-size:16px">Dear ${data.firstName},</p>
              <p style="margin:0 0 20px;line-height:1.5;font-size:16px">Thank you for your interest in Terafence's solutions. We've received your inquiry and our team is reviewing your information.</p>
              <p style="margin:0 0 20px;line-height:1.5;font-size:16px">We’ll contact you shortly. Meanwhile, learn more on our website.</p>
            </td></tr>
            <tr><td style="padding:20px 0">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:6px;border-left:4px solid #3b82f6">
                <tr><td style="padding:20px">
                  <p style="margin:0 0 15px;color:#1e3a8a;font-weight:600;font-size:16px">Your Information Summary</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;font-size:15px;vertical-align:top">Name:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;font-size:15px;vertical-align:top">${data.firstName} ${data.lastName}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Email:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.email}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Phone:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.phone}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Company:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.company}</td></tr>
                    <tr><td width="35%" style="padding:8px 0;color:#64748b;font-weight:500;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">Inquiry Type:</td>
                        <td width="65%" style="padding:8px 0;color:#0f172a;border-top:1px solid #e5e7eb;font-size:15px;vertical-align:top">${data.helpType || "-"}</td></tr>
                  </table>
                </td></tr>
              </table>
            </td></tr>
            <tr><td style="padding:10px 0 25px">
              <p style="margin:0 0 15px;line-height:1.5;font-size:16px">Need to add details? Reply to this email and it will reach our team.</p>
            </td></tr>
            <!-- CTA buttons: only Website + LinkedIn -->
            <tr><td align="center" style="padding:10px 0 30px">
              <table cellpadding="0" cellspacing="0"><tr>
                <td align="center" style="border-radius:6px;background:#1e3a8a">
                  <a href="https://terafence.in/" target="_blank" style="border:none;border-radius:6px;color:#fff;display:inline-block;font-size:16px;font-weight:500;line-height:1.2;padding:15px 22px;text-decoration:none">Visit Website</a>
                </td>
                <td width="10"></td>
                <td align="center" style="border-radius:6px;background:#3b82f6">
                  <a href="https://www.linkedin.com/company/terafence-private-limited/" target="_blank" style="border:none;border-radius:6px;color:#fff;display:inline-block;font-size:16px;font-weight:500;line-height:1.2;padding:15px 22px;text-decoration:none">Connect on LinkedIn</a>
                </td>
              </tr></table>
            </td></tr>
            <tr><td style="padding-top:15px;border-top:1px solid #e5e7eb">
              <p style="margin:0 0 5px;line-height:1.5;font-size:16px">Best regards,</p>
              <p style="margin:0;line-height:1.5;font-size:16px;font-weight:600;color:#1e3a8a">Terafence Private Limited</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center">
          <table width="100%" style="background:#f8fafc;border-bottom-left-radius:8px;border-bottom-right-radius:8px">
            <tr><td align="center" style="padding:25px 40px">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#718096;text-align:center">
                For more assistance, contact <a href="mailto:support@terafence.in" style="color:#3b82f6;text-decoration:none">support@terafence.in</a>
              </p>
              <p style="margin:10px 0 0 0;font-size:12px;line-height:1.5;color:#718096;text-align:center">
                209, Suncity Success Tower, Sector-65, Gurgaon-122005, Haryana, India
              </p>
              <p style="margin:10px 0 0 0;font-size:12px;line-height:1.5;color:#718096;text-align:center">
                &copy; 2025 Terafence Private Limited. All rights reserved.
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const companyPlainTextEmail = `
New Contact Form Submission

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Job Title: ${data.jobTitle || "-"}
Business Segment: ${data.businessSegment || "-"}
Help Type: ${data.helpType || "-"}
Referral Source: ${data.referralSource || "Not specified"}
Additional Details: ${data.additionalDetails || "None provided"}

This is an automated notification from the Terafence Private Limited website contact form.
`;

    const customerPlainTextEmail = `
Hello ${data.firstName},

Thank you for contacting Terafence Private Limited, Gurugram. We've received your inquiry and will be in touch shortly.

Your Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone}
- Company: ${data.company}
- Inquiry Type: ${data.helpType || "-"}

Best regards,
Terafence Private Limited
`;

    // ---------- Send both emails using the pooled transporter ----------
    const transporter = getTransporter();

    const companyMail = {
      from: fromHeader("Terafence Website"),
      to: "amandeep@terafence.in", // keep your recipient
      subject: `New Contact Form: ${data.firstName} ${data.lastName} from ${data.company}`,
      html: companyEmailTemplate,
      text: companyPlainTextEmail,
      replyTo: data.email,
    };

    const customerMail = {
      from: fromHeader("Terafence"),
      to: data.email,
      subject: "Thank You for Contacting Terafence Private Limited, Gurugram",
      html: customerEmailTemplate,
      text: customerPlainTextEmail,
      replyTo: "info@terafence.in",
    };

    const t1 = Date.now();
    const [toCompany, toCustomer] = await Promise.allSettled([
      transporter.sendMail(companyMail),
      transporter.sendMail(customerMail),
    ]);
    const t2 = Date.now();
    console.log(
      `[contact] build=${t1 - t0}ms send(concurrent)=${t2 - t1}ms total=${t2 - t0}ms`
    );

    if (toCompany.status === "rejected" || toCustomer.status === "rejected") {
      const err =
        (toCompany.status === "rejected" && toCompany.reason) ||
        (toCustomer.status === "rejected" && toCustomer.reason);
      throw err || new Error("Failed to send one or more emails");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
