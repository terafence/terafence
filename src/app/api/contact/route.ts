// app/api/contact/route.ts
// Server-side API route for contact form with reCAPTCHA + email notifications

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ============================================
// CONFIGURATION
// ============================================

const RECAPTCHA_V2_SECRET_KEY = process.env.RECAPTCHA_V2_SECRET_KEY || '';
const SKIP_RECAPTCHA = !RECAPTCHA_V2_SECRET_KEY;
const MIN_SUBMISSION_TIME = 3000;

// SMTP Configuration
const SMTP_HOST = process.env.EMAIL_SERVER_HOST || 'sg2plzcpnl458828.prod.sin2.secureserver.net';
const SMTP_PORT = parseInt(process.env.EMAIL_SERVER_PORT || '465');
const SMTP_SECURE = (process.env.EMAIL_SERVER_SECURE || 'true') === 'true';
const SMTP_USER = process.env.EMAIL_SERVER_USER || 'info@terafence.in';
const SMTP_PASS = process.env.EMAIL_SERVER_PASSWORD || '';
const SMTP_FROM_NAME = 'Terafence';
const SMTP_FROM_EMAIL = 'info@terafence.in';

// Internal email recipients
const INTERNAL_TO = 'info@terafence.in';
const INTERNAL_CC = 'jose@terafence.in, akshat@terafence.in, amandeep@terafence.in, yash@terafence.in, shruti@terafence.in';

// ============================================
// SEQUENTIAL TICKET COUNTER
// ============================================
// NOTE: This in-memory counter resets on serverless cold starts.
// For persistent sequential numbering across deployments, replace
// this with a database (e.g. Vercel KV, Supabase, MongoDB).
// The counter is per-year and resets to 0001 each new year.

let ticketCounter = 100;
let ticketYear = new Date().getFullYear();

function getNextTicketId(): string {
  const currentYear = new Date().getFullYear();

  // Reset counter on new year
  if (currentYear !== ticketYear) {
    ticketYear = currentYear;
    ticketCounter = 0;
  }

  ticketCounter++;
  const paddedCounter = String(ticketCounter).padStart(4, '0');
  return `TF-Contact-${currentYear}-${paddedCounter}`;
}

// ============================================
// SMTP TRANSPORTER
// ============================================

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('⚠️ SMTP not configured — emails will not be sent');
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      // GoDaddy/cPanel servers may use self-signed certs
      rejectUnauthorized: false,
    },
  });
}

// ============================================
// DISPLAY-FRIENDLY LABEL MAPS
// ============================================

const BUSINESS_SEGMENT_LABELS: Record<string, string> = {
  defense: 'Defense & Military',
  government: 'Government',
  energy: 'Energy & Utilities',
  oil_gas: 'Oil & Gas',
  manufacturing: 'Manufacturing',
  banking: 'Banking & Finance',
  healthcare: 'Healthcare',
  transportation: 'Transportation',
  telecom: 'Telecommunications',
  it: 'Information Technology',
  other: 'Other',
};

const HELP_TYPE_LABELS: Record<string, string> = {
  product_info: 'Product Information',
  pricing: 'Pricing & Quote',
  demo: 'Request a Demo',
  partnership: 'Partnership Inquiry',
  support: 'Technical Support',
  other: 'Other',
};

const REFERRAL_SOURCE_LABELS: Record<string, string> = {
  search: 'Search Engine',
  social: 'Social Media',
  referral: 'Personal Referral',
  tradeshow: 'Trade Show / Conference',
  advertisement: 'Advertisement',
  other: 'Other',
};

function displayLabel(value: string | undefined, map: Record<string, string>): string {
  if (!value) return '—';
  return map[value] || value;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  company: string;
  jobTitle?: string;
  businessSegment?: string;
  helpType?: string;
  referralSource?: string;
  additionalDetails?: string;
}

function buildFormTableHtml(data: ContactFormData): string {
  const rows = [
    { label: 'Full Name', value: `${data.firstName} ${data.lastName}` },
    { label: 'Email Address', value: `<a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${data.email}</a>` },
    { label: 'Phone Number', value: `${data.countryCode} ${data.phone}` },
    { label: 'Company / Organisation', value: data.company },
    { label: 'Job Title', value: data.jobTitle || '—' },
    { label: 'Business Segment', value: displayLabel(data.businessSegment, BUSINESS_SEGMENT_LABELS) },
    { label: 'How Can We Help?', value: displayLabel(data.helpType, HELP_TYPE_LABELS) },
    { label: 'How Did You Hear?', value: displayLabel(data.referralSource, REFERRAL_SOURCE_LABELS) },
    { label: 'Additional Details', value: data.additionalDetails || '—' },
  ];

  const rowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 14px;border:1px solid #e2e8f0;background-color:#f8fafc;font-weight:600;color:#1e3a5f;width:200px;font-size:14px;vertical-align:top;">
          ${r.label}
        </td>
        <td style="padding:10px 14px;border:1px solid #e2e8f0;color:#334155;font-size:14px;">
          ${r.value}
        </td>
      </tr>`
    )
    .join('');

  return `
    <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      ${rowsHtml}
    </table>`;
}

function buildInternalEmailHtml(data: ContactFormData, ticketId: string): string {
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:24px auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
        New Contact Form Submission
      </h1>
      <p style="margin:8px 0 0;color:#bfdbfe;font-size:13px;">
        ${ticketId} &nbsp;&bull;&nbsp; ${submittedAt} IST
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      <p style="margin:0 0 6px;color:#334155;font-size:15px;">Dear Sir/Ma'am,</p>
      <p style="margin:0 0 24px;color:#334155;font-size:15px;">
        Please find below the customer details and take it forward.
      </p>

      ${buildFormTableHtml(data)}

    </div>

    <!-- Footer -->
    <div style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#1e3a5f;">
        TERAFENCE PRIVATE LIMITED
      </p>
      <p style="margin:0;font-size:12px;color:#64748b;">
        209, Suncity Success Tower, Sector-65, Gurugram, Haryana-122005, India
      </p>
      <p style="margin:6px 0 0;font-size:12px;color:#64748b;">
        <a href="https://www.terafence.in" style="color:#2563eb;text-decoration:none;">www.terafence.in</a>
        &nbsp;|&nbsp;
        <a href="mailto:info@terafence.in" style="color:#2563eb;text-decoration:none;">info@terafence.in</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

function buildCustomerAckHtml(data: ContactFormData, ticketId: string): string {
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:24px auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
        Thank You for Contacting Us!
      </h1>
      <p style="margin:8px 0 0;color:#bfdbfe;font-size:13px;">
        Reference: ${ticketId}
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      <p style="margin:0 0 6px;color:#334155;font-size:15px;">
        Dear ${data.firstName} ${data.lastName},
      </p>
      <p style="margin:0 0 20px;color:#334155;font-size:15px;">
        Thank you for reaching out to Terafence. We have received your inquiry and our team will review your requirements shortly. You can expect a response within 1–2 business days.
      </p>
      <p style="margin:0 0 24px;color:#334155;font-size:15px;">
        For your reference, here is a summary of the details you submitted:
      </p>

      ${buildFormTableHtml(data)}

      <!-- Reference Box -->
      <div style="margin-top:24px;padding:14px 18px;background-color:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;">
        <p style="margin:0;font-size:13px;color:#1e40af;">
          <strong>Your Reference ID:</strong> ${ticketId}<br/>
          <strong>Submitted on:</strong> ${submittedAt} IST
        </p>
        <p style="margin:8px 0 0;font-size:13px;color:#1e40af;">
          Please quote this reference ID in any follow-up communication.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#1e3a5f;">
        TERAFENCE PRIVATE LIMITED
      </p>
      <p style="margin:0;font-size:12px;color:#64748b;">
        209, Suncity Success Tower, Sector-65, Gurugram, Haryana-122005, India
      </p>
      <p style="margin:6px 0 0;font-size:12px;color:#64748b;">
        <a href="https://www.terafence.in" style="color:#2563eb;text-decoration:none;">www.terafence.in</a>
        &nbsp;|&nbsp;
        <a href="mailto:info@terafence.in" style="color:#2563eb;text-decoration:none;">info@terafence.in</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ============================================
// SEND EMAILS
// ============================================

async function sendEmails(data: ContactFormData, ticketId: string): Promise<void> {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 SMTP not configured. Would have sent:');
    console.log(`   Internal → To: ${INTERNAL_TO}, CC: ${INTERNAL_CC}`);
    console.log(`   Customer → To: ${data.email}`);
    console.log(`   Subject:  ${ticketId}`);
    return;
  }

  const fromAddress = `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`;

  // 1) Internal notification email
  await transporter.sendMail({
    from: fromAddress,
    to: INTERNAL_TO,
    cc: INTERNAL_CC,
    replyTo: `"${data.firstName} ${data.lastName}" <${data.email}>`,
    subject: ticketId,
    html: buildInternalEmailHtml(data, ticketId),
  });
  console.log(`📧 Internal email sent → ${INTERNAL_TO} (CC: ${INTERNAL_CC})`);

  // 2) Customer acknowledgment email
  await transporter.sendMail({
    from: fromAddress,
    to: `"${data.firstName} ${data.lastName}" <${data.email}>`,
    subject: `${ticketId} — Thank You for Contacting Terafence`,
    html: buildCustomerAckHtml(data, ticketId),
  });
  console.log(`📧 Customer acknowledgment sent → ${data.email}`);
}

// ============================================
// VALIDATION UTILITIES (Server-side)
// ============================================

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
  'getnada.com', 'maildrop.cc', 'yopmail.com', 'sharklasers.com',
  'guerrillamail.info', 'grr.la', 'spam4.me', 'dispostable.com',
  'mailnesia.com', 'tempr.email', 'discard.email', 'discardmail.com',
  'spamgourmet.com', 'mytrashmail.com', 'mt2009.com', 'thankyou2010.com',
  'trash2009.com', 'mt2014.com', 'tempail.com', 'tempmailaddress.com',
  'emailondeck.com', 'emailfake.com', 'crazymailing.com', 'tempinbox.com',
  'emkei.cz', 'mohmal.com', 'fakemailgenerator.com', 'emailtemporario.com.br',
  'getairmail.com', 'temp.email', 'burnermail.io', 'mailsac.com',
]);

const GIBBERISH_PATTERNS = [
  /^[a-z]{1,2}$/i,
  /^(.)\1{3,}$/,
  /^[qwerty]{5,}$/i,
  /^[asdfgh]{5,}$/i,
  /^[zxcvbn]{5,}$/i,
  /^[0-9]+$/,
  /^[^aeiou]{6,}$/i,
  /test|fake|asdf|qwer|sample|demo|xxx|yyy|zzz|aaa|bbb|abc123|123abc/i,
  /^[!@#$%^&*()]+$/,
  /(.)\1{4,}/,
];

const FAKE_NAME_PATTERNS = [
  /^(test|fake|sample|demo|admin|user|guest|null|undefined|none|na|n\/a)$/i,
  /^(mr|mrs|ms|miss|dr|prof)\.?\s*$/i,
  /^[a-z]$/i,
  /asdf|qwer|zxcv|1234|abcd/i,
  /^(john\s*doe|jane\s*doe|mickey\s*mouse|donald\s*duck|bugs\s*bunny)$/i,
  /^(batman|superman|spiderman|ironman)$/i,
];

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

function validateName(name: string): ValidationResult {
  const trimmed = name?.trim() || '';
  if (trimmed.length < 2) return { isValid: false, error: 'Name is too short' };
  for (const p of FAKE_NAME_PATTERNS) if (p.test(trimmed)) return { isValid: false, error: 'Invalid name detected' };
  for (const p of GIBBERISH_PATTERNS) if (p.test(trimmed.replace(/\s/g, ''))) return { isValid: false, error: 'Invalid name format' };
  return { isValid: true };
}

function validateEmail(email: string): ValidationResult {
  const trimmed = email?.trim()?.toLowerCase() || '';
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!re.test(trimmed)) return { isValid: false, error: 'Invalid email format' };
  const domain = trimmed.split('@')[1];
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return { isValid: false, error: 'Disposable email addresses are not allowed' };
  return { isValid: true };
}

function validatePhone(phone: string): ValidationResult {
  const clean = phone?.replace(/[\s\-\(\)\.+]/g, '') || '';
  if (!/^\d{6,15}$/.test(clean)) return { isValid: false, error: 'Invalid phone number' };
  if (/^(\d)\1+$/.test(clean)) return { isValid: false, error: 'Invalid phone number pattern' };
  return { isValid: true };
}

function validateCompany(company: string): ValidationResult {
  const trimmed = company?.trim() || '';
  if (trimmed.length < 2) return { isValid: false, error: 'Company name is too short' };
  for (const p of GIBBERISH_PATTERNS) if (p.test(trimmed.replace(/\s/g, ''))) return { isValid: false, error: 'Invalid company name' };
  const fakes = [/^(test|fake|sample|demo|company|corp|inc|llc|pvt|ltd)$/i, /^(abc|xyz|123|asdf|qwer)$/i, /^none$/i, /^n\/a$/i];
  for (const p of fakes) if (p.test(trimmed)) return { isValid: false, error: 'Please enter your actual company name' };
  return { isValid: true };
}

// ============================================
// RECAPTCHA VERIFICATION
// ============================================

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

async function verifyRecaptcha(
  token: string,
  remoteIp?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!RECAPTCHA_V2_SECRET_KEY) {
    console.warn('reCAPTCHA secret key not configured, skipping verification');
    return { success: true };
  }

  try {
    const params: Record<string, string> = { secret: RECAPTCHA_V2_SECRET_KEY, response: token };
    if (remoteIp) params.remoteip = remoteIp;

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params),
    });

    if (!response.ok) return { success: false, error: 'reCAPTCHA verification failed' };
    const data: RecaptchaResponse = await response.json();
    if (!data.success) return { success: false, error: 'reCAPTCHA verification failed' };
    return { success: true };
  } catch {
    return { success: false, error: 'reCAPTCHA verification error' };
  }
}

// ============================================
// RATE LIMITING
// ============================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }
  record.count++;
  return { allowed: true };
}

// ============================================
// MAIN API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
      );
    }

    // Parse body
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      company,
      jobTitle,
      businessSegment,
      helpType,
      referralSource,
      additionalDetails,
      recaptchaToken,
      submissionTime,
    } = body;

    // Bot check — fast submission
    if (submissionTime && submissionTime < MIN_SUBMISSION_TIME) {
      console.log(`Suspicious submission time: ${submissionTime}ms from IP ${ip}`);
      return NextResponse.json({ success: true }); // silent pass
    }

    // Validate fields
    const validations = [
      { field: 'firstName', result: validateName(firstName) },
      { field: 'lastName', result: validateName(lastName) },
      { field: 'email', result: validateEmail(email) },
      { field: 'phone', result: validatePhone(phone) },
      { field: 'company', result: validateCompany(company) },
    ];
    for (const { field, result } of validations) {
      if (!result.isValid) {
        return NextResponse.json({ success: false, error: `${field}: ${result.error}` }, { status: 400 });
      }
    }

    // reCAPTCHA v2
    if (!SKIP_RECAPTCHA) {
      if (!recaptchaToken) {
        return NextResponse.json({ success: false, error: 'Please complete the CAPTCHA verification' }, { status: 400 });
      }
      const rc = await verifyRecaptcha(recaptchaToken, ip);
      if (!rc.success) {
        return NextResponse.json({ success: false, error: rc.error || 'Verification failed' }, { status: 400 });
      }
    } else {
      console.warn('⚠️ reCAPTCHA is disabled — no secret key configured');
    }

    // ============================================
    // GENERATE TICKET & SEND EMAILS
    // ============================================

    const ticketId = getNextTicketId();

    const formData: ContactFormData = {
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      company,
      jobTitle,
      businessSegment,
      helpType,
      referralSource,
      additionalDetails,
    };

    console.log(`✅ ${ticketId} — Form submission from ${firstName} ${lastName} <${email}> @ ${company}`);

    try {
      await sendEmails(formData, ticketId);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Still return success — form data is logged; email failure shouldn't block the user
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      ticketId,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
