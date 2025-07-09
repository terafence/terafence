"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, Loader2, Mail, Phone, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface InfoFormProps {
  onClose: () => void;
  onSuccess: () => void;
  title: string;
}

type FormState = {
  name: string;
  mobile: string;
  company: string;
  email: string;
  remarks: string;
};

type FormErrors = {
  name?: string;
  mobile?: string;
  company?: string;
  email?: string;
};

export default function InfoForm({ onClose, onSuccess, title }: InfoFormProps) {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    mobile: "",
    company: "",
    email: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing again
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formState.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    // Mobile validation
    if (!formState.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formState.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
      isValid = false;
    }

    // Company validation
    if (!formState.company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }

    // Email validation
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formState.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus("idle");

    try {
      const response = await fetch("/api/info-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          requestedInfo: title // Add the section title to know what was requested
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to submit form";
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (parseError) {
          // If parsing JSON fails, just use the default error message
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMsg);
      }

      setSubmissionStatus("success");
      
      // Reset form after successful submission
      setFormState({
        name: "",
        mobile: "",
        company: "",
        email: "",
        remarks: "",
      });
      
      // Notify parent component of success after the user has seen the success message
      setTimeout(() => {
        onSuccess();
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success screen instead of the form when submission is successful
  if (submissionStatus === "success") {
    return (
      <div className="relative p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <Image 
              src="/images/terafence.png" 
              alt="Terafence Logo" 
              width={180} 
              height={50} 
              className="object-contain"
            />
          </div>

          {/* Success icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 scale-110 animate-pulse"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full border border-green-200 flex items-center justify-center shadow-sm">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </motion.div>

          {/* Thank you message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
            <p className="text-gray-600 max-w-md mx-auto text-base leading-relaxed">
              Your request for <span className="font-semibold whitespace-nowrap">{title}</span> has been submitted successfully. 
              Our team will review your information and provide access shortly.
            </p>
          </div>
          
          {/* Contact info box */}
          <div className="w-full max-w-md bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="mr-3 pt-1">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Need immediate assistance?</p>
                <p className="text-gray-600 text-sm mt-1">
                  Contact our technical team at{" "}
                  <a 
                    href="mailto:info@terafence.in" 
                    className="text-blue-600 font-medium hover:underline"
                  >
                    info@terafence.in
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full mt-auto pt-6 border-t border-gray-100 text-center"
          >
            <p className="text-sm text-gray-500 font-medium">Terafence Private Limited</p>
            <p className="text-sm text-gray-500 mt-1">209, Suncity Success Tower, Sector-65, Gurugram, Haryana-122005, India</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <Image 
            src="/images/terafence.png" 
            alt="Terafence Logo" 
            width={180} 
            height={50} 
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">Request Access to {title}</h2>
        <p className="text-gray-600 mt-2 text-center max-w-xl">
          Please complete the form below to access our detailed specifications and resources.
          Our team will review your request and provide access promptly.
        </p>
      </div>

      {submissionStatus === "error" && (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <X className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            {errorMessage || "There was an error submitting your information. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
        <form onSubmit={handleSubmit} className="space-y-5 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                Full Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`pl-10 w-full ${errors.name ? "border-red-300 focus:ring-red-500" : ""}`}
                  placeholder="your full name"
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile" className="text-sm font-medium text-gray-700 flex items-center">
                Mobile Number <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="mobile"
                  name="mobile"
                  value={formState.mobile}
                  onChange={handleChange}
                  className={`pl-10 w-full ${errors.mobile ? "border-red-300 focus:ring-red-500" : ""}`}
                  placeholder="9876543210"
                  disabled={isSubmitting}
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center">
                Company Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="company"
                  name="company"
                  value={formState.company}
                  onChange={handleChange}
                  className={`pl-10 w-full ${errors.company ? "border-red-300 focus:ring-red-500" : ""}`}
                  placeholder="Your Organization"
                  disabled={isSubmitting}
                />
              </div>
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                Email Address <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`pl-10 w-full ${errors.email ? "border-red-300 focus:ring-red-500" : ""}`}
                  placeholder="you@company.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
              Remarks (Optional)
            </Label>
            <Textarea
              id="remarks"
              name="remarks"
              value={formState.remarks}
              onChange={handleChange}
              className="w-full min-h-[80px]"
              placeholder="Specific requirements or questions?"
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Fields marked with <span className="text-red-500">*</span> are mandatory
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-auto flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
        <p>Terafence Private Limited</p>
        <p>209, Suncity Success Tower, Sector-65, Gurugram, Haryana-122005, India</p>
        <p className="mt-2">
          <a href="mailto:info@terafence.in" className="text-blue-600 hover:underline">
            info@terafence.in
          </a>
        </p>
      </div>
    </div>
  );
}