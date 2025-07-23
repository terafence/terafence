/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { user, isLoading, login, verifyOtp } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to resources page
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/resources");
    }
  }, [user, isLoading, router]);

  // Handle email submission to get OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(email);
      
      if (result.success) {
        setIsOtpSent(true);
        // Store the session ID
        if (result.sessionId) {
          setSessionId(result.sessionId);
        }
        toast({
          title: "OTP Sent",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || !otp.trim()) {
      toast({
        title: "OTP required",
        description: "Please enter the OTP sent to your email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await verifyOtp(email, otp, sessionId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Login successful. Redirecting...",
        });
        
        // Redirect will happen automatically due to useEffect
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button in OTP view
  const handleBack = () => {
    setIsOtpSent(false);
    setOtp("");
    setSessionId("");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to resources page
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Terafence Resource Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isOtpSent
              ? `Enter the OTP sent to ${email}`
              : "Sign in with your @terafence.in email"}
          </p>
        </div>

        {!isOtpSent ? (
          <motion.form 
            className="mt-8 space-y-6"
            onSubmit={handleRequestOtp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="h-12 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Sending OTP...
                  </>
                ) : (
                  "Get OTP"
                )}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.form 
            className="mt-8 space-y-6"
            onSubmit={handleVerifyOtp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2 rounded-md shadow-sm">
              <div>
                <label htmlFor="otp" className="sr-only">
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-12"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                type="submit"
                className="h-12 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            </div>
          </motion.form>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Only @terafence.in email addresses are allowed
          </p>
        </div>
      </motion.div>
    </div>
  );
}