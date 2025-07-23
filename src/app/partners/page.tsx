// src/app/partners/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mail, Shield, ArrowRight, Check, Loader2, X, Building2, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface OTPState {
  digits: string[];
  isLoading: boolean;
  resendTimer: number;
}

interface ToastState {
  id: string;
  type: "success" | "error";
  title: string;
  description?: string;
}

export default function PartnerPortal() {
  const [step, setStep] = useState<"email" | "otp" | "dashboard">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [otpState, setOtpState] = useState<OTPState>({
    digits: ["", "", "", "", "", ""],
    isLoading: false,
    resendTimer: 0,
  });

  const showToast = (type: "success" | "error", title: string, description?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastState = { id, type, title, description };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fixed animation variants with proper TypeScript types
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        staggerChildren: 0.08
      }
    },
    exit: { 
      opacity: 0, 
      y: -8,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 4 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/partners/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStep("otp");
        setOtpState(prev => ({ ...prev, resendTimer: 60 }));
        showToast("success", "Authentication code sent", "Please check your email for the verification code");
      } else {
        showToast("error", "Authentication failed", "Please verify your credentials and try again");
      }
    } catch {
      showToast("error", "Connection error", "Please check your network connection and retry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newDigits = [...otpState.digits];
    newDigits[index] = value;
    setOtpState(prev => ({ ...prev, digits: newDigits }));

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpState.digits.join("");
    if (otp.length !== 6) return;

    setOtpState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/partners/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("partner_token", data.token);
        setStep("dashboard");
        showToast("success", "Authentication successful", "Welcome to the Partner Portal");
      } else {
        showToast("error", "Invalid verification code", "Please check your code and try again");
        setOtpState(prev => ({ 
          ...prev, 
          digits: ["", "", "", "", "", ""],
          isLoading: false 
        }));
      }
    } catch {
      showToast("error", "Verification failed", "Please try again or contact support");
      setOtpState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleResendOTP = async () => {
    if (otpState.resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/partners/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpState(prev => ({ 
          ...prev, 
          resendTimer: 60,
          digits: ["", "", "", "", "", ""]
        }));
        showToast("success", "Verification code resent");
      }
    } catch {
      showToast("error", "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpState.resendTimer > 0) {
      interval = setInterval(() => {
        setOtpState(prev => ({ 
          ...prev, 
          resendTimer: prev.resendTimer - 1 
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpState.resendTimer]);

  if (step === "dashboard") {
    return <PartnerDashboard />;
  }

  return (
    <>
      {/* Professional Toast System */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full rounded-lg border shadow-lg backdrop-blur-sm ${
                toast.type === "success" 
                  ? "bg-white border-green-200 text-green-900" 
                  : "bg-white border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-start p-4">
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === "success" ? (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium leading-5">
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="mt-1 text-sm text-gray-600 leading-5">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col lg:flex-row">
        {/* Left Panel - Hero Background Image (unchanged) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/partners/hero.gif"
              alt="Partner Portal Hero"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50" />
          
          <div className="absolute top-8 left-8 z-10 flex items-center space-x-3">
            <Image
              src="/images/terafence.png"
              alt="Terafence"
              width={56}
              height={56}
              className="brightness-0 invert drop-shadow-lg"
            />
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              Partner Portal
            </span>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden w-full bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-center space-x-3">
            <Image
              src="/images/terafence.png"
              alt="Terafence"
              width={32}
              height={32}
            />
            <span className="text-lg font-semibold text-gray-900">Partner Portal</span>
          </div>
        </div>

        {/* Right Panel - Professional Corporate Authentication */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-12 lg:px-12 min-h-screen lg:min-h-0">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.div
                  key="email"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <motion.div variants={itemVariants} className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-xl mb-6">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                      Partner Authentication
                    </h1>
                    <p className="text-base text-gray-600 max-w-sm mx-auto leading-6">
                      Please enter your registered email address to access the partner portal
                    </p>
                  </motion.div>

                  <motion.form variants={itemVariants} onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                        Email Address
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </motion.form>

                  <motion.div variants={itemVariants} className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secured with enterprise-grade authentication</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  key="otp"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <motion.div variants={itemVariants} className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-xl mb-6">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                      Email Verification
                    </h1>
                    <p className="text-base text-gray-600 max-w-sm mx-auto leading-6">
                      We&apos;ve sent a verification code to
                      <br />
                      <span className="font-medium text-gray-900">{email}</span>
                    </p>
                  </motion.div>

                  <motion.form variants={itemVariants} onSubmit={handleOTPSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900">
                        Verification Code
                      </Label>
                      <div className="flex space-x-3 justify-center">
                        {otpState.digits.map((digit, index) => (
                          <Input
                            key={index}
                            name={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={otpState.isLoading || otpState.digits.some(d => !d)}
                      className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {otpState.isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Verify and Continue"
                      )}
                    </Button>
                  </motion.form>

                  <motion.div variants={itemVariants} className="text-center space-y-4">
                    <button
                      onClick={handleResendOTP}
                      disabled={otpState.resendTimer > 0 || isLoading}
                      className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                    >
                      {otpState.resendTimer > 0 
                        ? `Resend code in ${otpState.resendTimer} seconds`
                        : "Resend verification code"
                      }
                    </button>
                    <p className="text-sm text-gray-500">
                      Code not received? Check your spam folder or contact technical support
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

// Professional Corporate Dashboard
function PartnerDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/terafence.png"
                  alt="Terafence"
                  width={40}
                  height={40}
                />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Partner Portal</h1>
                  <p className="text-sm text-gray-600">Enterprise Partner Management</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                localStorage.removeItem("partner_token");
                window.location.reload();
              }}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Access partner resources, support, and analytics from your centralized dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resources Card */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm leading-6">
                Access comprehensive documentation, technical specifications, and implementation guides for all partner solutions.
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
              >
                Access Resources
              </Button>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Support Center</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm leading-6">
                Get dedicated technical support, submit service requests, and connect with our partner success team.
              </p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm leading-6">
                Monitor partnership performance, track key metrics, and access detailed reporting and insights.
              </p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </motion.div>
  );
}