/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconMail,
  IconLock,
  IconArrowRight,
  IconShieldCheck,
  IconHeadset,
  IconDeviceLaptop,
  IconLoader3,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { requestOTP, verifyOTP } from "../lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function OTPLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [emailSuspended, setEmailSuspended] = useState(false);
  const [suspensionTime, setSuspensionTime] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await requestOTP(email);

      if (success) {
        setStep("otp");
        setResendDisabled(true);
        setCountdown(59);
        toast({
          title: "OTP Sent",
          description: "Please check your email for the OTP",
        });
      } else {
        toast({
          title: "Failed to Send OTP",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the OTP sent to your email",
        variant: "destructive",
      });
      return;
    }

    if (emailSuspended) {
      toast({
        title: "Account Suspended",
        description: `Too many failed attempts. Try again in ${Math.ceil(
          suspensionTime / 60
        )} minutes.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await verifyOTP(email, otp);

      if (success) {
        // Reset attempt count on success
        setAttemptCount(0);

        toast({
          title: "Authentication Successful",
          description: "You are now logged in",
        });
        router.push("/support/dashboard");
      } else {
        // Increment attempt count
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        // Check if max attempts reached
        if (newAttemptCount >= 3) {
          // Suspend email for 10 minutes (600 seconds)
          setEmailSuspended(true);
          setSuspensionTime(600);

          toast({
            title: "Account Temporarily Suspended",
            description: "Too many failed attempts. Try again in 10 minutes.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Invalid OTP",
            description: `The OTP is incorrect or has expired. ${
              3 - newAttemptCount
            } attempts remaining.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setResendDisabled(true);
    setCountdown(59);

    try {
      const success = await requestOTP(email);

      if (success) {
        toast({
          title: "OTP Sent Again",
          description: "Please check your email for the new OTP",
        });
      } else {
        toast({
          title: "Failed to Send OTP",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  // COMPLETELY NEW OTP INPUT IMPLEMENTATION
  const NewOtpInput = () => {
    // Single ref for the hidden input that will hold the actual full OTP value
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    // Focus the hidden input whenever the component renders
    useEffect(() => {
      hiddenInputRef.current?.focus();
    }, []);

    // Handle changes to the hidden input
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Filter out non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, "");
      // Limit to 6 digits
      const limitedValue = numericValue.slice(0, 6);
      // Update the otp state
      setOtp(limitedValue);
    };

    // Display boxes showing each digit
    const renderBoxes = () => {
      const boxes = [];
      // Create array of 6 boxes
      for (let i = 0; i < 6; i++) {
        const digit = otp[i] || "";
        boxes.push(
          <div
            key={i}
            className={`w-12 h-14 flex items-center justify-center rounded-md border-2 ${
              otp.length === i
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            } ${digit ? "bg-white" : "bg-gray-50"}`}
            onClick={() => hiddenInputRef.current?.focus()}
          >
            <span className="text-2xl font-bold text-black">{digit}</span>
          </div>
        );
      }
      return boxes;
    };

    // Handle backspace key to clear the last digit
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && otp.length > 0) {
        setOtp(otp.slice(0, -1));
      }
    };

    return (
      <div className="w-full space-y-4">
        <div className="relative">
          {/* Hidden input that captures all digit input */}
          <input
            ref={hiddenInputRef}
            type="tel"
            inputMode="numeric"
            value={otp}
            onChange={handleOtpChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className="opacity-0 absolute left-0 top-0 w-0 h-0"
            autoFocus
          />

          {/* Visual display of OTP boxes */}
          <div
            className="flex justify-between gap-2 w-full"
            onClick={() => hiddenInputRef.current?.focus()}
          >
            {renderBoxes()}
          </div>
        </div>

        <div className="flex justify-end items-center">
          <button
            type="button"
            onClick={() => setOtp("")}
            className="text-sm text-gray-500 hover:text-red-600 font-medium"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <IconLock size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              OTP sent to{" "}
              <span className="font-medium text-blue-600">{email}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Change Email
          </button>
        </div>
      </div>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 } as const,
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate" as const,
    duration: 0.5,
  };

  // Logo animation
  const logoVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 200, damping: 15 },
    },
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Left Section - Brand and Welcome */}
      <motion.div
        className="w-full lg:w-1/2 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-16 overflow-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Top content */}
        <div className="mb-8 lg:mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-6 lg:mb-8"
          >
            <IconShieldCheck size={36} className="text-blue-200 mr-3" />
            <h1 className="text-2xl font-bold tracking-tight">TERAFENCE PRIVATE LIMITED</h1>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Data Diode Support Portal
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-blue-100 max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Securely access our customer support platform for Terafence data
            diode products, technical assistance, and advanced cyber security
            solutions.
          </motion.p>
        </div>

        {/* Feature highlights */}
        <motion.div
          className="flex flex-col gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* First row - original features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              variants={itemVariants}
              className="flex items-start space-x-4"
            >
              <div className="bg-blue-600 rounded-lg p-3">
                <IconHeadset size={24} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">24/7 Support</h3>
                <p className="text-blue-200">
                  Available around the clock for data diode issues
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-start space-x-4"
            >
              <div className="bg-blue-600 rounded-lg p-3">
                <IconDeviceLaptop size={24} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Remote Assistance</h3>
                <p className="text-blue-200">
                  Get help with device configuration and troubleshooting
                </p>
              </div>
            </motion.div>
          </div>

          {/* Second row - new features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              variants={itemVariants}
              className="flex items-start space-x-4"
            >
              <div className="bg-blue-600 rounded-lg p-3">
                <IconArrowRight size={24} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Ticket Management</h3>
                <p className="text-blue-200">
                  Create and track support tickets for data diode services
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-start space-x-4"
            >
              <div className="bg-blue-600 rounded-lg p-3">
                <IconShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Security Updates</h3>
                <p className="text-blue-200">
                  Access latest firmware for your data diode products
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trusted by section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-8 mb-6 lg:mt-10 lg:mb-8"
        >
          <p className="text-sm uppercase tracking-wider text-blue-300 mb-5">
            Trusted by industry leaders
          </p>
          <div className="flex space-x-8 md:space-x-10 items-center justify-center md:justify-start">
            <motion.div
              variants={logoVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-full relative h-20 w-20 md:h-24 md:w-24"
            >
              <Image
                src="/images/support/c1.png"
                alt="Company 1"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <motion.div
              variants={logoVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-full relative h-20 w-20 md:h-24 md:w-24"
            >
              <Image
                src="/images/support/c2.png"
                alt="Company 2"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <motion.div
              variants={logoVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-full relative h-20 w-20 md:h-24 md:w-24"
            >
              <Image
                src="/images/support/c3.png"
                alt="Company 3"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                style={{ objectFit: "contain" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Section - OTP Login Card */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 xl:p-16"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-none bg-white rounded-2xl overflow-hidden">
            <motion.div variants={itemVariants}>
              <CardHeader className="px-6 sm:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6 space-y-2 bg-blue-600 text-white">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight flex items-center">
                  <IconLock size={28} className="mr-3" />
                  Secure Access
                </CardTitle>
                <CardDescription className="text-blue-100 text-base sm:text-lg">
                  {step === "email"
                    ? "Enter your email to receive a one-time password"
                    : "Enter the one-time password sent to your email"}
                </CardDescription>
                {emailSuspended && (
                  <div className="bg-red-700 text-white px-3 py-2 rounded-md mt-2">
                    <p className="text-sm font-semibold">
                      Account temporarily suspended
                    </p>
                    <p className="text-xs">
                      Try again in {Math.floor(suspensionTime / 60)}:
                      {String(suspensionTime % 60).padStart(2, "0")}
                    </p>
                  </div>
                )}
              </CardHeader>
            </motion.div>

            <CardContent className="px-6 sm:px-8 py-6 sm:py-8">
              {step === "email" ? (
                <motion.form
                  onSubmit={handleRequestOTP}
                  className="space-y-6"
                  variants={itemVariants}
                >
                  <div className="relative">
                    <IconMail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-12 sm:h-14 rounded-xl border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all text-base"
                    />
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={pageTransition}
                >
                  <div className="flex justify-center items-center">
                    <NewOtpInput />
                  </div>
                </motion.form>
              )}
            </CardContent>

            <CardFooter className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50">
              <div className="w-full flex flex-col space-y-3">
                {step === "otp" && resendDisabled && countdown > 0 && (
                  <div className="h-5 text-center">
                    <span className="text-xs text-gray-500">
                      {`00:${String(countdown).padStart(2, "0")}`}
                    </span>
                  </div>
                )}
                {step === "otp" && !resendDisabled && (
                  <div className="h-5"></div>
                )}

                <div className="flex justify-between items-center w-full">
                  {step === "otp" && (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading || resendDisabled || emailSuspended}
                      className={`w-[48%] h-10 sm:h-12 px-4 py-2 text-sm sm:text-base rounded-md border border-gray-300 ${
                        isLoading || resendDisabled || emailSuspended
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                    >
                      Resend OTP
                    </button>
                  )}
                  {step === "email" && (
                    <div className="w-[48%]"></div> 
                  )}

                  <button
                    type="submit"
                    onClick={
                      step === "email" ? handleRequestOTP : handleVerifyOTP
                    }
                    disabled={isLoading || emailSuspended}
                    className={`w-[48%] h-10 sm:h-12 px-4 py-2 rounded-md font-medium text-sm sm:text-base ${
                      isLoading || emailSuspended
                        ? "bg-pink-400 text-pink-100 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-800 text-white"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <IconLoader3 className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        {step === "email" ? "Request OTP" : "Verify OTP"}
                        <IconArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    )}
                  </button>
                </div>

                {step === "otp" && attemptCount > 0 && !emailSuspended && (
                  <div className="text-center">
                    <span className="text-xs text-red-500">
                      {`${3 - attemptCount} attempts remaining`}
                    </span>
                  </div>
                )}
                <div className="text-center pt-3 border-t border-gray-200 mt-3">
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-gray-600"
                  >
                    New to Terafence Support Portal?{' '}
                    <Link
                      href="/support/register"
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      Register Now
                    </Link>
                  </motion.p>
                </div>
              </div>
            </CardFooter>
          </Card>

          <motion.div
            variants={itemVariants}
            className="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm px-4"
          >
            © {new Date().getFullYear()} Terafence Private Limited. All rights reserved.
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
