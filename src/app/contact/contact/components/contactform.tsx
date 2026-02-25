"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInView } from "react-intersection-observer";
import * as z from "zod";
import Link from "next/link";
import Script from "next/script";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Send, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ShieldCheck} from "lucide-react";
import {
  IconPlugConnected,
  IconRadar,
  IconTrophy,
  IconArrowUpRight,
  IconCircuitDiode,
  IconArrowRight,
  IconBoltFilled,
} from "@tabler/icons-react";

// ============================================
// VALIDATION UTILITIES - Enterprise Grade
// ============================================

// Disposable email domains list (commonly used for fake signups)
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

// Free email providers (for potential flagging in B2B context)
const FREE_EMAIL_PROVIDERS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'gmx.com', 'gmx.net', 'live.com', 'msn.com', 'me.com', 'inbox.com',
  'rediffmail.com', 'yahoo.co.in', 'yahoo.co.uk', 'hotmail.co.uk'
]);

// Common gibberish patterns
const GIBBERISH_PATTERNS = [
  /^[a-z]{1,2}$/i,                          // Too short (single/double letters)
  /^(.)\1{3,}$/,                            // Repeated characters (aaaa, bbbb)
  /^[qwerty]{5,}$/i,                        // Keyboard patterns
  /^[asdfgh]{5,}$/i,
  /^[zxcvbn]{5,}$/i,
  /^[0-9]+$/,                               // Only numbers
  /^[^aeiou]{6,}$/i,                        // Too many consonants in a row
  /test|fake|asdf|qwer|sample|demo|xxx|yyy|zzz|aaa|bbb|abc123|123abc/i,
  /^[!@#$%^&*()]+$/,                        // Only special characters
  /(.)\1{4,}/,                              // Any character repeated 5+ times
];

// Common fake name patterns
const FAKE_NAME_PATTERNS = [
  /^(test|fake|sample|demo|admin|user|guest|null|undefined|none|na|n\/a)$/i,
  /^(mr|mrs|ms|miss|dr|prof)\.?\s*$/i,     // Just titles
  /^[a-z]$/i,                               // Single letter
  /asdf|qwer|zxcv|1234|abcd/i,
  /^(john\s*doe|jane\s*doe|mickey\s*mouse|donald\s*duck|bugs\s*bunny)$/i,
  /^(batman|superman|spiderman|ironman)$/i,
];

// Validate name quality
const validateName = (name: string): { isValid: boolean; reason?: string } => {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, reason: "Name must be at least 2 characters" };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, reason: "Name is too long" };
  }
  
  // Check for fake name patterns
  for (const pattern of FAKE_NAME_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { isValid: false, reason: "Please enter your real name" };
    }
  }
  
  // Check for gibberish
  for (const pattern of GIBBERISH_PATTERNS) {
    if (pattern.test(trimmed.replace(/\s/g, ''))) {
      return { isValid: false, reason: "Please enter a valid name" };
    }
  }
  
  // Must contain at least one vowel (basic linguistic check)
  if (!/[aeiou]/i.test(trimmed) && trimmed.length > 3) {
    return { isValid: false, reason: "Please enter a valid name" };
  }
  
  // Check for proper capitalization hints (warning, not error)
  const hasCapital = /[A-Z]/.test(trimmed);
  
  if (!hasCapital && trimmed.length > 2) {
    return { isValid: true, reason: "Consider using proper capitalization" };
  }
  
  return { isValid: true };
};

// Validate email quality
const validateEmail = (email: string): { isValid: boolean; reason?: string; isDisposable?: boolean; isFreeProvider?: boolean } => {
  const trimmed = email.trim().toLowerCase();
  
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, reason: "Please enter a valid email address" };
  }
  
  const [localPart, domain] = trimmed.split('@');
  
  // Check local part quality
  if (localPart.length < 2) {
    return { isValid: false, reason: "Email username is too short" };
  }
  
  // Check for gibberish in local part
  for (const pattern of GIBBERISH_PATTERNS) {
    if (pattern.test(localPart) && localPart.length < 6) {
      return { isValid: false, reason: "Please enter a valid email address" };
    }
  }
  
  // Check for disposable email
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isValid: false, reason: "Disposable email addresses are not allowed", isDisposable: true };
  }
  
  // Check domain has valid TLD
  const tldMatch = domain.match(/\.([a-z]{2,})$/);
  if (!tldMatch) {
    return { isValid: false, reason: "Please enter a valid email domain" };
  }
  
  // Flag free providers (not an error, just informational)
  const isFreeProvider = FREE_EMAIL_PROVIDERS.has(domain);
  
  return { isValid: true, isFreeProvider };
};

// Validate phone number
const validatePhone = (phone: string, countryCode: string): { isValid: boolean; reason?: string } => {
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleanPhone)) {
    return { isValid: false, reason: "Phone number should contain only digits" };
  }
  
  // Check length based on country code
  const minLength = 6;
  const maxLength = 15;
  
  if (cleanPhone.length < minLength) {
    return { isValid: false, reason: `Phone number is too short (minimum ${minLength} digits)` };
  }
  
  if (cleanPhone.length > maxLength) {
    return { isValid: false, reason: `Phone number is too long (maximum ${maxLength} digits)` };
  }
  
  // Check for repeated digits (fake numbers)
  if (/^(\d)\1+$/.test(cleanPhone)) {
    return { isValid: false, reason: "Please enter a valid phone number" };
  }
  
  // Check for sequential numbers
  if (/^(0123456789|1234567890|9876543210|0987654321)/.test(cleanPhone)) {
    return { isValid: false, reason: "Please enter a valid phone number" };
  }
  
  // India-specific validation
  if (countryCode === '+91') {
    // Indian mobile numbers start with 6, 7, 8, or 9 and are 10 digits
    if (cleanPhone.length !== 10) {
      return { isValid: false, reason: "Indian phone numbers should be 10 digits" };
    }
    if (!/^[6-9]/.test(cleanPhone)) {
      return { isValid: false, reason: "Indian mobile numbers should start with 6, 7, 8, or 9" };
    }
  }
  
  return { isValid: true };
};

// Validate company name
const validateCompany = (company: string): { isValid: boolean; reason?: string } => {
  const trimmed = company.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, reason: "Company name must be at least 2 characters" };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, reason: "Company name is too long" };
  }
  
  // Check for gibberish
  for (const pattern of GIBBERISH_PATTERNS) {
    if (pattern.test(trimmed.replace(/\s/g, ''))) {
      return { isValid: false, reason: "Please enter a valid company name" };
    }
  }
  
  // Check for fake company patterns
  const fakePatterns = [
    /^(test|fake|sample|demo|company|corp|inc|llc|pvt|ltd)$/i,
    /^(abc|xyz|123|asdf|qwer)$/i,
    /^none$/i,
    /^n\/a$/i,
  ];
  
  for (const pattern of fakePatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, reason: "Please enter your actual company name" };
    }
  }
  
  return { isValid: true };
};

// Validate country code
const validateCountryCode = (code: string): { isValid: boolean; reason?: string } => {
  // Common country codes
  const validCodes = /^\+[1-9]\d{0,3}$/;
  
  if (!validCodes.test(code)) {
    return { isValid: false, reason: "Please enter a valid country code (e.g., +91, +1)" };
  }
  
  return { isValid: true };
};

// ============================================
// FORM SCHEMA WITH ENHANCED VALIDATION
// ============================================

const formSchema = z.object({
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name is too long" })
    .refine((val) => validateName(val).isValid, {
      message: "Please enter a valid first name"
    }),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name is too long" })
    .refine((val) => validateName(val).isValid, {
      message: "Please enter a valid last name"
    }),
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .refine((val) => validateEmail(val).isValid, {
      message: "Please enter a valid business email address"
    }),
  countryCode: z.string()
    .min(2, { message: "Country code is required" })
    .refine((val) => validateCountryCode(val).isValid, {
      message: "Please enter a valid country code"
    }),
  phone: z.string()
    .min(6, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" }),
  company: z.string()
    .min(2, { message: "Company name is required" })
    .max(100, { message: "Company name is too long" })
    .refine((val) => validateCompany(val).isValid, {
      message: "Please enter a valid company name"
    }),
  jobTitle: z.string().optional(),
  businessSegment: z.string().optional(),
  helpType: z.string().optional(),
  referralSource: z.string().optional(),
  additionalDetails: z.string()
    .max(2000, { message: "Message is too long (max 2000 characters)" })
    .optional(),
  // Honeypot fields (should remain empty)
  website: z.string().max(0, { message: "" }).optional(),
  faxNumber: z.string().max(0, { message: "" }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ============================================
// RECAPTCHA TYPES
// ============================================

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

// ============================================
// COMPONENT DEFINITIONS
// ============================================

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.1 + 0.3,
            duration: 0.5,
          },
        }),
      }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:bg-white/95 flex items-start"
    >
      <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-blue-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-xs leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// Required field label component with red asterisk
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center">
    {children}
    <span className="text-red-500 ml-1">*</span>
  </span>
);

// Validation status indicator
interface ValidationIndicatorProps {
  status: 'idle' | 'validating' | 'valid' | 'invalid' | 'warning';
  message?: string;
}

const ValidationIndicator = ({ status, message }: ValidationIndicatorProps) => {
  if (status === 'idle') return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="flex items-center gap-1 mt-1"
      >
        {status === 'validating' && (
          <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
        )}
        {status === 'valid' && (
          <CheckCircle2 className="h-3 w-3 text-green-500" />
        )}
        {status === 'invalid' && (
          <XCircle className="h-3 w-3 text-red-500" />
        )}
        {status === 'warning' && (
          <AlertCircle className="h-3 w-3 text-amber-500" />
        )}
        {message && (
          <span className={`text-xs ${
            status === 'valid' ? 'text-green-600' :
            status === 'invalid' ? 'text-red-500' :
            status === 'warning' ? 'text-amber-600' :
            'text-blue-500'
          }`}>
            {message}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

// Your reCAPTCHA v2 site key
const RECAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || '';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [captchaV2Token, setCaptchaV2Token] = useState<string | null>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  
  // Field validation states
  const [fieldValidation, setFieldValidation] = useState<Record<string, ValidationIndicatorProps['status']>>({});
  const [fieldMessages, setFieldMessages] = useState<Record<string, string>>({});
  
  // Anti-bot measures
  const formStartTime = useRef<number>(Date.now());
  const [submissionCount, setSubmissionCount] = useState(0);
  const lastSubmissionTime = useRef<number>(0);
  
  // reCAPTCHA widget ID for v2
  const captchaWidgetId = useRef<number | null>(null);

  // Animation triggers based on scroll position
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      phone: "",
      company: "",
      jobTitle: "",
      businessSegment: "",
      helpType: "",
      referralSource: "",
      additionalDetails: "",
      website: "", // Honeypot
      faxNumber: "", // Honeypot
    },
    mode: "onBlur",
  });

  // Reset form start time when form is reset
  useEffect(() => {
    formStartTime.current = Date.now();
  }, [isSubmitted]);

  // Initialize reCAPTCHA v2 via global onload callback
  const renderCaptcha = useCallback(() => {
    if (captchaWidgetId.current !== null || isSubmitted) return;
    const container = document.getElementById('recaptcha-v2-container');
    if (!container || !window.grecaptcha || typeof window.grecaptcha.render !== 'function') return;
    
    try {
      captchaWidgetId.current = window.grecaptcha.render(container, {
        sitekey: RECAPTCHA_V2_SITE_KEY,
        callback: (token: string) => {
          setCaptchaV2Token(token);
        },
        'expired-callback': () => {
          setCaptchaV2Token(null);
        },
        'error-callback': () => {
          setCaptchaV2Token(null);
          setFormError('CAPTCHA verification failed. Please try again.');
        },
        theme: 'light',
        size: 'normal',
      });
    } catch (error) {
      console.error('Error rendering reCAPTCHA v2:', error);
    }
  }, [isSubmitted]);

  // Register global onload callback for reCAPTCHA script
  useEffect(() => {
    (window as any).onRecaptchaLoad = () => {
      setRecaptchaLoaded(true);
      renderCaptcha();
    };
    
    // If script already loaded (e.g. hot reload), render immediately
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      setRecaptchaLoaded(true);
      renderCaptcha();
    }
    
    return () => {
      delete (window as any).onRecaptchaLoad;
    };
  }, [renderCaptcha]);

  // Re-render captcha when form resets from submitted state
  useEffect(() => {
    if (!isSubmitted && recaptchaLoaded) {
      // Small delay to let the DOM render the container
      const timer = setTimeout(() => {
        captchaWidgetId.current = null;
        renderCaptcha();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, recaptchaLoaded, renderCaptcha]);

  // Real-time field validation
  const validateFieldRealtime = useCallback((field: string, value: string) => {
    setFieldValidation(prev => ({ ...prev, [field]: 'validating' }));
    
    // Debounce validation
    setTimeout(() => {
      let result: { isValid: boolean; reason?: string };
      
      switch (field) {
        case 'firstName':
        case 'lastName':
          result = validateName(value);
          break;
        case 'email':
          const emailResult = validateEmail(value);
          result = emailResult;
          if (emailResult.isFreeProvider && emailResult.isValid) {
            setFieldValidation(prev => ({ ...prev, [field]: 'warning' }));
            setFieldMessages(prev => ({ ...prev, [field]: 'Consider using your business email' }));
            return;
          }
          break;
        case 'phone':
          result = validatePhone(value, form.getValues('countryCode'));
          break;
        case 'company':
          result = validateCompany(value);
          break;
        case 'countryCode':
          result = validateCountryCode(value);
          break;
        default:
          result = { isValid: true };
      }
      
      if (value.length === 0) {
        setFieldValidation(prev => ({ ...prev, [field]: 'idle' }));
        setFieldMessages(prev => ({ ...prev, [field]: '' }));
      } else if (result.isValid) {
        setFieldValidation(prev => ({ ...prev, [field]: 'valid' }));
        setFieldMessages(prev => ({ ...prev, [field]: result.reason || '' }));
      } else {
        setFieldValidation(prev => ({ ...prev, [field]: 'invalid' }));
        setFieldMessages(prev => ({ ...prev, [field]: result.reason || 'Invalid input' }));
      }
    }, 300);
  }, [form]);

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setFormError(null);
    
    // ============================================
    // ANTI-BOT CHECKS
    // ============================================
    
    // Check honeypot fields
    if (data.website || data.faxNumber) {
      // Silent fail for bots
      console.log('Bot detected via honeypot');
      setIsSubmitted(true);
      return;
    }
    
    // Check submission time (too fast = bot)
    const timeTaken = Date.now() - formStartTime.current;
    if (timeTaken < 3000) { // Less than 3 seconds
      setFormError('Please take your time to fill out the form completely.');
      return;
    }
    
    // Rate limiting
    const now = Date.now();
    if (now - lastSubmissionTime.current < 60000 && submissionCount >= 3) {
      setFormError('Too many submission attempts. Please wait a minute before trying again.');
      return;
    }
    
    // Validate phone with country code
    const phoneValidation = validatePhone(data.phone, data.countryCode);
    if (!phoneValidation.isValid) {
      form.setError('phone', { message: phoneValidation.reason });
      return;
    }
    
    setIsSubmitting(true);
    
    // ============================================
    // RECAPTCHA V2 VERIFICATION
    // ============================================
    
    if (!captchaV2Token) {
      setFormError('Please complete the CAPTCHA verification.');
      setIsSubmitting(false);
      return;
    }
    
    const recaptchaToken = captchaV2Token;
    const recaptchaVersion = 'v2' as const;
    
    // ============================================
    // SUBMIT FORM
    // ============================================
    
    // Format the phone number to include country code
    const formattedData = {
      ...data,
      phone: `${data.countryCode} ${data.phone}`,
      recaptchaToken,
      recaptchaVersion,
      submissionTime: timeTaken,
      // Remove honeypot fields from submission
      website: undefined,
      faxNumber: undefined,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setSubmissionCount(0);
        form.reset();
        setCaptchaV2Token(null);
      } else {
        setFormError(
          result.error || "Failed to send your message. Please try again."
        );
        // Reset captcha on error
        if (captchaWidgetId.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(captchaWidgetId.current);
        }
        setCaptchaV2Token(null);
        console.error("Failed to send email", result);
      }
    } catch (error) {
      setFormError("An unexpected error occurred. Please try again later.");
      console.error("Error submitting form", error);
    }

    setIsSubmitting(false);
    lastSubmissionTime.current = Date.now();
    setSubmissionCount(prev => prev + 1);
  };

  const inputVariants = {
    focus: { scale: 1.01, transition: { type: "spring" as const, stiffness: 300 } },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <>
      {/* Load reCAPTCHA v2 Script with explicit render + onload callback */}
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        strategy="afterInteractive"
      />
      
      <motion.section
        ref={formRef}
        initial={{ opacity: 0, y: 50 }}
        animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-8 px-4 max-w-7xl mx-auto"
      >
        <div className="absolute inset-0 bg-white/30 rounded-xl -z-10 mx-4 my-4"></div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-3xl font-bold text-center mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
            Information & Quote Requests
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 sm:min-h-[810px] md:min-h-[800px] lg:min-h-[780px] xl:min-h-[760px] 2xl:min-h-[740px] flex-col-reverse md:flex-row">
          {/* Left Column - Features and Benefits */}
          <div className="flex flex-col space-y-5 h-full justify-between order-2 md:order-1">
            {/* Introduction Section */}
            <div>
              <motion.h3
                custom={0}
                initial="hidden"
                animate={formInView ? "visible" : "hidden"}
                variants={fadeInUpVariants}
                className="text-2xl font-bold mb-3 text-blue-900"
              >
                Ready to secure your critical network?
              </motion.h3>
            </div>

            {/* Why Choose Our Solutions */}
            <motion.div
              custom={2}
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="space-y-1 flex-grow"
            >
              <h3 className="text-xl font-bold text-blue-900 flex items-center mb-3">
                <IconTrophy className="w-5 h-5 mr-2 text-blue-600" />
                Why Choose Our Solutions
              </h3>

              <div className="space-y-2.5 feature-card-container">
                <FeatureCard
                  icon={<IconCircuitDiode className="h-6 w-6 text-blue-600" />}
                  title="Hardware-Enforced Isolation"
                  description="Air-gap level protection through physical, hardware-based barriers that ensure data security with no software vulnerabilities."
                  delay={0}
                />

                <FeatureCard
                  icon={<IconArrowUpRight className="h-6 w-6 text-blue-600" />}
                  title="Unidirectional Data Flow"
                  description="Guarantees one-way data transmission using data diode technology, completely eliminating reverse-channel threats."
                  delay={1}
                />

                <FeatureCard
                  icon={<IconPlugConnected className="h-6 w-6 text-blue-600" />}
                  title="Plug & Play Deployment"
                  description="Simple installation with zero configuration – ready to secure your environment out of the box without network downtime."
                  delay={2}
                />

                <FeatureCard
                  icon={<IconBoltFilled className="h-6 w-6 text-blue-600" />}
                  title="Protocol-Aware Gateways"
                  description="Supports a wide range of industrial protocols without needing protocol converters or software agents."
                  delay={4}
                />

                <FeatureCard
                  icon={<IconRadar className="h-6 w-6 text-blue-600" />}
                  title="No IP Address Exposure"
                  description="Prevents any exposure of internal systems by design – Terafence devices do not require IPs, blocking unauthorized network access."
                  delay={5}
                />
              </div>
            </motion.div>

            {/* Support Button */}
            <div className="flex items-center space-x-4">
              <motion.div
                custom={6}
                initial="hidden"
                animate={formInView ? "visible" : "hidden"}
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href="/support" passHref>
                <Button
                  className="w-fit bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white"
                  size="lg"
                >
                  Looking for Technical Support?
                </Button>
                </Link>
              </motion.div>

              <motion.div
                custom={7}
                initial="hidden"
                animate={formInView ? "visible" : "hidden"}
                variants={fadeInUpVariants}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                <Link href="/usecases" passHref>
                <span className="mr-1 font-medium">
                  Learn about the various usecases
                </span>
                </Link>
                <IconArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-100 h-full order-1 md:order-2"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center h-full flex flex-col justify-between items-center p-4 overflow-auto"
                style={{ maxHeight: "100%" }}
              >
                <div className="flex flex-col items-center justify-start w-full">
                  <Image 
                    src="/images/terafence.png" 
                    alt="Terafence Logo" 
                    width={224}
                    height={64}
                    className="w-48 md:w-56 mb-12"
                    priority
                  />
                  
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="h-7 w-7 text-green-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-green-600 mb-12">
                    Thank you for contacting us!
                  </h2>
                  
                  <div className="w-full mx-auto bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-gray-800 font-medium mb-4 text-2xl">
                      Our team will get back to you shortly.
                    </p>
                    
                    <div className="space-y-3 text-left">
                      <p className="text-gray-700 text-base mb-12">
                        We appreciate your interest in Terafence&lsquo;s security solutions. Our specialists will review your information and contact you to discuss how our hardware-enforced isolation technology can protect your infrastructure.
                      </p>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h4 className="text-blue-800 font-semibold mb-1 text-base">Next Steps</h4>
                        <ul className="list-disc pl-4 text-gray-700 space-y-1 text-base">
                          <li>Expect a response within 1-2 business days</li>
                          <li>Explore our resources section for more information</li>
                          <li>Visit our case studies for industry examples</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                  
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setCaptchaV2Token(null);
                    captchaWidgetId.current = null;
                  }}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 mt-4 font-medium px-4 text-sm"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-3 flex items-start"
                    >
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{formError}</span>
                    </motion.div>
                  )}

                  {/* Honeypot fields - hidden from users */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      {...form.register('website')}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    <input
                      type="text"
                      {...form.register('faxNumber')}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-900 font-medium text-sm">
                            <RequiredLabel>First Name</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus="focus"
                              variants={inputVariants}
                            >
                              <Input
                                placeholder="First name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  validateFieldRealtime('firstName', e.target.value);
                                }}
                                className={`border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm ${
                                  fieldValidation.firstName === 'valid' ? 'border-green-400' :
                                  fieldValidation.firstName === 'invalid' ? 'border-red-400' :
                                  fieldValidation.firstName === 'warning' ? 'border-amber-400' : ''
                                }`}
                              />
                            </motion.div>
                          </FormControl>
                          <ValidationIndicator 
                            status={fieldValidation.firstName || 'idle'} 
                            message={fieldMessages.firstName}
                          />
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-900 font-medium text-sm">
                            <RequiredLabel>Last Name</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus="focus"
                              variants={inputVariants}
                            >
                              <Input
                                placeholder="Last name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  validateFieldRealtime('lastName', e.target.value);
                                }}
                                className={`border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm ${
                                  fieldValidation.lastName === 'valid' ? 'border-green-400' :
                                  fieldValidation.lastName === 'invalid' ? 'border-red-400' :
                                  fieldValidation.lastName === 'warning' ? 'border-amber-400' : ''
                                }`}
                              />
                            </motion.div>
                          </FormControl>
                          <ValidationIndicator 
                            status={fieldValidation.lastName || 'idle'} 
                            message={fieldMessages.lastName}
                          />
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-900 font-medium text-sm">
                          <RequiredLabel>Business Email</RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus="focus"
                            variants={inputVariants}
                            className="relative"
                          >
                            <Input
                              type="email"
                              placeholder="username@company.in"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                validateFieldRealtime('email', e.target.value);
                              }}
                              className={`border-gray-300 focus:border-blue-400 focus:ring-blue-200 pl-10 h-10 rounded-lg shadow-sm ${
                                fieldValidation.email === 'valid' ? 'border-green-400' :
                                fieldValidation.email === 'invalid' ? 'border-red-400' :
                                fieldValidation.email === 'warning' ? 'border-amber-400' : ''
                              }`}
                            />
                            <div className="absolute left-0 top-0 h-full w-9 flex items-center justify-center text-gray-400 border-r border-gray-200">
                              <Mail className="h-4 w-4" />
                            </div>
                          </motion.div>
                        </FormControl>
                        <ValidationIndicator 
                          status={fieldValidation.email || 'idle'} 
                          message={fieldMessages.email}
                        />
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel className="text-blue-900 font-medium text-sm">
                            <RequiredLabel>Country Code</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus="focus"
                              variants={inputVariants}
                            >
                              <Input
                                placeholder="+91"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  validateFieldRealtime('countryCode', e.target.value);
                                }}
                                className={`border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm ${
                                  fieldValidation.countryCode === 'valid' ? 'border-green-400' :
                                  fieldValidation.countryCode === 'invalid' ? 'border-red-400' : ''
                                }`}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel className="text-blue-900 font-medium text-sm">
                            <RequiredLabel>Phone Number</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus="focus"
                              variants={inputVariants}
                            >
                              <Input
                                placeholder="98765 43210"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  validateFieldRealtime('phone', e.target.value);
                                }}
                                className={`border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm ${
                                  fieldValidation.phone === 'valid' ? 'border-green-400' :
                                  fieldValidation.phone === 'invalid' ? 'border-red-400' : ''
                                }`}
                              />
                            </motion.div>
                          </FormControl>
                          <ValidationIndicator 
                            status={fieldValidation.phone || 'idle'} 
                            message={fieldMessages.phone}
                          />
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-900 font-medium text-sm">
                            <RequiredLabel>Company Name</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus="focus"
                              variants={inputVariants}
                              className="relative"
                            >
                              <Input
                                placeholder="Your organization's name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  validateFieldRealtime('company', e.target.value);
                                }}
                                className={`border-gray-300 focus:border-blue-400 focus:ring-blue-200 pl-10 h-10 rounded-lg shadow-sm ${
                                  fieldValidation.company === 'valid' ? 'border-green-400' :
                                  fieldValidation.company === 'invalid' ? 'border-red-400' : ''
                                }`}
                              />
                              <div className="absolute left-0 top-0 h-full w-9 flex items-center justify-center text-gray-400 border-r border-gray-200">
                                <Building className="h-4 w-4" />
                              </div>
                            </motion.div>
                          </FormControl>
                          <ValidationIndicator 
                            status={fieldValidation.company || 'idle'} 
                            message={fieldMessages.company}
                          />
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-900 font-medium text-sm">
                            Job Title
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus="focus"
                              variants={inputVariants}
                            >
                              <Input
                                placeholder="your designation"
                                {...field}
                                className="border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm"
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Three select fields in one row with controlled widths */}
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="businessSegment"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-blue-900 font-medium text-sm truncate">
                            Business Segment
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm bg-white text-sm whitespace-nowrap">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white max-h-[180px] overflow-y-auto">
                              <SelectItem value="manufacturing">
                                Manufacturing
                              </SelectItem>
                              <SelectItem value="healthcare">
                                Healthcare
                              </SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="technology">
                                Technology
                              </SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="government">
                                Government
                              </SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="helpType"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-blue-900 font-medium text-sm truncate">
                            How Can We Help?
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm bg-white text-sm whitespace-nowrap">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white max-h-[180px] overflow-y-auto">
                              <SelectItem value="product-info">
                                Product Information
                              </SelectItem>
                              <SelectItem value="quote">
                                Request a Quote
                              </SelectItem>
                              <SelectItem value="demo">Request a Demo</SelectItem>
                              <SelectItem value="support">
                                Technical Support
                              </SelectItem>
                              <SelectItem value="partnership">
                                Partnership Inquiry
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referralSource"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-blue-900 font-medium text-sm truncate">
                            How Did You Hear?
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-lg shadow-sm bg-white text-sm whitespace-nowrap">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white max-h-[180px] overflow-y-auto">
                              <SelectItem value="search">
                                Search Engine
                              </SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="referral">
                                Personal Referral
                              </SelectItem>
                              <SelectItem value="tradeshow">
                                Trade Show / Conference
                              </SelectItem>
                              <SelectItem value="advertisement">
                                Advertisement
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-900 font-medium text-sm">
                          Additional Details
                        </FormLabel>
                        <FormControl>
                          <motion.div whileFocus="focus" variants={inputVariants}>
                            <Textarea
                              placeholder="Please provide any additional information about your requirements..."
                              className="min-h-[80px] max-h-[140px] resize-y border-gray-300 focus:border-blue-400 focus:ring-blue-200 rounded-lg shadow-sm p-3"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* reCAPTCHA v2 checkbox - always visible */}
                  <div className="flex flex-col items-center py-3">
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
                      Please verify you are human
                    </p>
                    <div id="recaptcha-v2-container" className="flex justify-center"></div>
                    {captchaV2Token && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-green-600 mt-2 flex items-center"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verification complete
                      </motion.p>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 mt-4 bg-gray-50 p-3 rounded-md border border-gray-100 shadow-inner">
                    <p className="flex items-start">
                      <span className="bg-blue-100 p-1 rounded-full text-blue-600 mr-2 mt-0.5 flex-shrink-0">
                        <AlertCircle className="h-3 w-3" />
                      </span>
                      <span>
                        Terafence Private Limited needs the contact information you provide
                        to send you updates about our products and services. You may
                        unsubscribe at any time from these communications.
                      </span>
                    </p>
                    <p className="flex items-start mt-2">
                      <span className="bg-green-100 p-1 rounded-full text-green-600 mr-2 mt-0.5 flex-shrink-0">
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                      <span>
                        This form is protected by reCAPTCHA and the Google{' '}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Terms of Service
                        </a>{' '}
                        apply.
                      </span>
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative mt-5"
                  >
                    <div className="absolute inset-0 bg-blue-600 blur-md rounded-lg opacity-20 transform translate-y-1"></div>
                    <Button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md relative rounded-lg"
                      disabled={isSubmitting || !captchaV2Token}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Verifying & Submitting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Submit Securely</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            )}
          </motion.div>
        </div>

        {/* Responsive adjustments */}
        <style jsx global>{`
          @media (max-width: 768px) {
            .grid {
              grid-template-columns: 1fr !important;
            }

            .flex.items-center.space-x-4 {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .flex.items-center.space-x-4 > div {
              width: 100%;
            }

            .flex.items-center.space-x-4 button {
              width: 100%;
            }
          }

          @media (min-width: 769px) and (max-width: 1023px) {
            .feature-card-container {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            }
          }

          @media (min-width: 1024px) {
            .feature-card-container {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            }
          }
        `}</style>
      </motion.section>
    </>
  );
}