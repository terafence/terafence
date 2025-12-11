// app/api/contact/route.ts
// Server-side API route for contact form with reCAPTCHA verification

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// CONFIGURATION
// ============================================

const RECAPTCHA_V3_SECRET_KEY = process.env.RECAPTCHA_V3_SECRET_KEY || ''; 
const RECAPTCHA_V2_SECRET_KEY = process.env.RECAPTCHA_V2_SECRET_KEY || ''; 

// Minimum score for reCAPTCHA v3 (0.0 - 1.0)
// Lower = more suspicious, Higher = more likely human
// Default threshold is 0.5, we're being slightly more permissive at 0.4
const RECAPTCHA_V3_THRESHOLD = 0.4;

// Minimum time (ms) a human would take to fill the form
const MIN_SUBMISSION_TIME = 3000; // 3 seconds

// ============================================
// VALIDATION UTILITIES (Server-side)
// ============================================

// Disposable email domains list
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
  'getairmail.com', 'temp.email', 'burnermail.io', 'mailsac.com'
]);

// Gibberish patterns
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
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name is too short' };
  }
  
  for (const pattern of FAKE_NAME_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Invalid name detected' };
    }
  }
  
  for (const pattern of GIBBERISH_PATTERNS) {
    if (pattern.test(trimmed.replace(/\s/g, ''))) {
      return { isValid: false, error: 'Invalid name format' };
    }
  }
  
  return { isValid: true };
}

function validateEmail(email: string): ValidationResult {
  const trimmed = email?.trim()?.toLowerCase() || '';
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  const domain = trimmed.split('@')[1];
  
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isValid: false, error: 'Disposable email addresses are not allowed' };
  }
  
  return { isValid: true };
}

function validatePhone(phone: string): ValidationResult {
  const cleanPhone = phone?.replace(/[\s\-\(\)\.+]/g, '') || '';
  
  if (!/^\d{6,15}$/.test(cleanPhone)) {
    return { isValid: false, error: 'Invalid phone number' };
  }
  
  if (/^(\d)\1+$/.test(cleanPhone)) {
    return { isValid: false, error: 'Invalid phone number pattern' };
  }
  
  return { isValid: true };
}

function validateCompany(company: string): ValidationResult {
  const trimmed = company?.trim() || '';
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Company name is too short' };
  }
  
  for (const pattern of GIBBERISH_PATTERNS) {
    if (pattern.test(trimmed.replace(/\s/g, ''))) {
      return { isValid: false, error: 'Invalid company name' };
    }
  }
  
  const fakePatterns = [
    /^(test|fake|sample|demo|company|corp|inc|llc|pvt|ltd)$/i,
    /^(abc|xyz|123|asdf|qwer)$/i,
    /^none$/i,
    /^n\/a$/i,
  ];
  
  for (const pattern of fakePatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Please enter your actual company name' };
    }
  }
  
  return { isValid: true };
}

// ============================================
// RECAPTCHA VERIFICATION
// ============================================

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

async function verifyRecaptcha(
  token: string, 
  version: 'v3' | 'v2',
  remoteIp?: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = version === 'v3' ? RECAPTCHA_V3_SECRET_KEY : RECAPTCHA_V2_SECRET_KEY;
  
  if (!secretKey) {
    console.error('reCAPTCHA secret key not configured');
    return { success: false, error: 'Server configuration error' };
  }
  
  try {
    // Build the request body properly typed
    const params: Record<string, string> = {
      secret: secretKey,
      response: token,
    };
    
    if (remoteIp) {
      params.remoteip = remoteIp;
    }
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
    });
    
    if (!response.ok) {
      console.error('reCAPTCHA API error:', response.status);
      return { success: false, error: 'reCAPTCHA verification failed' };
    }
    
    const data: RecaptchaResponse = await response.json();
    
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return { success: false, error: 'reCAPTCHA verification failed' };
    }
    
    // For v3, check the score
    if (version === 'v3') {
      const score = data.score || 0;
      
      if (score < RECAPTCHA_V3_THRESHOLD) {
        console.log(`reCAPTCHA v3 score too low: ${score}`);
        return { 
          success: false, 
          score,
          error: 'Additional verification required' 
        };
      }
      
      return { success: true, score };
    }
    
    // For v2, success is enough
    return { success: true };
    
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'reCAPTCHA verification error' };
  }
}

// ============================================
// RATE LIMITING (Simple in-memory implementation)
// For production, use Redis or a proper rate limiting service
// ============================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // Max 5 requests per minute per IP

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { 
      allowed: false, 
      retryAfter: Math.ceil((record.resetTime - now) / 1000) 
    };
  }
  
  record.count++;
  return { allowed: true };
}

// ============================================
// MAIN API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.` 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
          }
        }
      );
    }
    
    // Parse request body
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
      recaptchaVersion,
      submissionTime,
    } = body;
    
    // ============================================
    // VALIDATION
    // ============================================
    
    // Check submission time (bot detection)
    if (submissionTime && submissionTime < MIN_SUBMISSION_TIME) {
      console.log(`Suspicious submission time: ${submissionTime}ms from IP ${ip}`);
      // Return success to not tip off bots
      return NextResponse.json({ success: true });
    }
    
    // Validate required fields
    const validations = [
      { field: 'firstName', result: validateName(firstName) },
      { field: 'lastName', result: validateName(lastName) },
      { field: 'email', result: validateEmail(email) },
      { field: 'phone', result: validatePhone(phone) },
      { field: 'company', result: validateCompany(company) },
    ];
    
    for (const { field, result } of validations) {
      if (!result.isValid) {
        return NextResponse.json(
          { success: false, error: `${field}: ${result.error}` },
          { status: 400 }
        );
      }
    }
    
    // ============================================
    // RECAPTCHA VERIFICATION
    // ============================================
    
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA verification required' },
        { status: 400 }
      );
    }
    
    const recaptchaResult = await verifyRecaptcha(
      recaptchaToken, 
      recaptchaVersion || 'v3',
      ip
    );
    
    if (!recaptchaResult.success) {
      // If v3 score was too low, ask for v2 verification
      if (recaptchaVersion === 'v3' && recaptchaResult.score !== undefined) {
        return NextResponse.json(
          { 
            success: false, 
            requiresCaptchaV2: true,
            error: 'Additional verification required' 
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: recaptchaResult.error },
        { status: 400 }
      );
    }
    
    // ============================================
    // PROCESS FORM SUBMISSION
    // ============================================
    
    // Log the submission (replace with your actual processing logic)
    console.log('✅ Form submission received:', {
      firstName,
      lastName,
      email,
      phone: `${countryCode} ${phone}`,
      company,
      jobTitle,
      businessSegment,
      helpType,
      referralSource,
      additionalDetails,
      recaptchaScore: recaptchaResult.score,
      ip,
      timestamp: new Date().toISOString(),
    });
    
    // TODO: Add your email sending logic here
    // Example with nodemailer, SendGrid, Resend, etc.
    
    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
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