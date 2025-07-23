// src/lib/partner-utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Partner email validation
export function isValidPartnerEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate secure OTP
export function generateOTP(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

// Format timestamp for display
export function formatTimestamp(timestamp: string | number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Validate OTP format
export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

// Security headers for partner routes
export const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
};

// Rate limiting configuration
export const rateLimitConfig = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
};

// Authorized partner domains (for additional security)
export const authorizedDomains = [
  "terafence.com",
  "terafence.in",
  "partner.com", // Add your partner domains here
];

export function isAuthorizedDomain(email: string): boolean {
  const domain = email.split('@')[1];
  return authorizedDomains.some(authDomain => 
    domain === authDomain || domain.endsWith(`.${authDomain}`)
  );
}