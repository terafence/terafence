'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Download, Settings, FileText, Loader2, AlertCircle, CheckCircle2, ArrowRight, Lock, Mail, User } from 'lucide-react';
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

// TypeScript interfaces
interface FormData {
  email: string;
  password: string;
  partnerId: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  partnerId?: string;
  general?: string;
}

const TerafencePartnerLogin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    partnerId: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>('');

  // Enhanced email validation regex - blocks personal domains
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com$|yahoo\.com$|outlook\.com$|hotmail\.com$|protonmail\.com$|aol\.com$|icloud\.com$|live\.com$|msn\.com$|yandex\.com$|mail\.ru$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validate form fields
  const validateField = (name: string, value: string): boolean => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please use your organization email address. Personal email accounts are not allowed.';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;
      case 'partnerId':
        if (!value) {
          newErrors.partnerId = 'Partner ID is required';
        } else if (value.length < 3) {
          newErrors.partnerId = 'Partner ID must be at least 3 characters';
        } else {
          delete newErrors.partnerId;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Check if form is valid
  useEffect(() => {
    const isValid = Boolean(
      formData.email && 
      formData.password && 
      formData.partnerId && 
      Object.keys(errors).length === 0
    );
    setIsFormValid(isValid);
  }, [formData, errors]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate all fields
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isPartnerIdValid = validateField('partnerId', formData.partnerId);

    if (!isEmailValid || !isPasswordValid || !isPartnerIdValid) {
      return;
    }

    setIsLoading(true);
    setErrors({ ...errors, general: undefined });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Login successful:', formData);
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ ...errors, general: 'Authentication failed. Please verify your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex h-[calc(100vh-140px)]">
        {/* Left Half - Premium Branded Content */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
          {/* Premium background with subtle pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(59,130,246,0.05)_49%,rgba(59,130,246,0.05)_51%,transparent_52%)] bg-[length:20px_20px]"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-8 h-full">
            {/* Premium Logo Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-xl mr-3">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Terafence</h1>
                  <p className="text-blue-300 font-medium">Partner Portal</p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                Secure Your<br />
                <span className="text-blue-400">Critical Infrastructure</span>
              </h2>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                Advanced Data Diode solutions engineered for enterprise-grade security.
              </p>
            </div>

            {/* Premium Feature Showcase */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
                  <Download className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Enterprise Resources</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Access technical documentation and certified firmware updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
                  <Settings className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Advanced Management</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Deploy and monitor Data Diode infrastructure with analytics.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Strategic Partnership</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Deal registration and partner enablement programs.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-slate-400 text-xs">Enterprise Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-slate-400 text-xs">Security Assurance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-slate-400 text-xs">Partner Support</div>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <div className="w-6 h-4 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded mr-2"></div>
                <span className="text-slate-300 text-sm font-medium">Made in India • CERT-In Approved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Half - Premium Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 overflow-y-auto">
          <div className="w-full max-w-lg px-8 py-6">
            {/* Premium Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Terafence Partner Portal</h1>
              <p className="text-slate-600">Secure Enterprise Access</p>
            </div>

            {/* Premium Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
              <p className="text-lg text-slate-600">Sign in to access your partner dashboard</p>
            </div>

            {/* Premium Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700 font-medium">{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Premium Email Field */}
              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl bg-white transition-all duration-200 ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="your.name@yourcompany.com"
                    required
                  />
                  {formData.email && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-2 text-red-600 font-medium flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Premium Password Field */}
              <div>
                <label htmlFor="password" className="block text-lg font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl bg-white transition-all duration-200 ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Enter your secure password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-red-600 font-medium flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Premium Partner ID Field */}
              <div>
                <label htmlFor="partnerId" className="block text-lg font-semibold text-slate-900 mb-2">
                  Partner ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 transition-colors ${focusedField === 'partnerId' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    id="partnerId"
                    name="partnerId"
                    value={formData.partnerId}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('partnerId')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl bg-white transition-all duration-200 uppercase ${
                      errors.partnerId
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="TF-PARTNER-001"
                    required
                  />
                  {formData.partnerId && !errors.partnerId && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.partnerId && (
                  <p className="mt-2 text-red-600 font-medium flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.partnerId}
                  </p>
                )}
              </div>

              {/* Premium Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${
                  isFormValid && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02] shadow-blue-600/25 hover:shadow-xl'
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Access Partner Portal</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Premium Links */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                >
                  Forgot Password?
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-800 transition-colors font-semibold"
                >
                  Request Partner Access
                </a>
              </div>
            </form>

            {/* Compact Support Section */}
            <div className="mt-8 text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Enterprise Support</h4>
                <p className="text-slate-600 mb-3">
                  24/7 dedicated partner success team
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:partner-support@terafence.in" 
                    className="block text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                  >
                    partner-support@terafence.in
                  </a>
                  <a 
                    href="tel:+911234567890" 
                    className="block text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                  >
                    +91 (123) 456-7890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TerafencePartnerLogin;