"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import {
  IconHeadphones,
  IconMail,
  IconMessageCircle,
  IconBuilding,
  IconCheck,
  IconHelp,
  IconChevronRight,
  IconArrowRight,
  IconClock,
  IconExternalLink,
  IconFileText,
} from "@tabler/icons-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    supportType: "technical",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log(formData);
    // Show success message
    setIsSubmitted(true);
    // Reset after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        supportType: "technical",
        message: "",
      });
    }, 5000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-30"></div>

        <div className="container mx-auto py-16 px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              We&lsquo;re Here to Help
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get in touch with our dedicated support team for assistance with
              any questions or technical issues
            </p>
          </div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 -mt-12 relative z-20 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border border-slate-100">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <IconHeadphones size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Technical Support
            </h3>
            <p className="text-slate-600 mb-4">
              Product assistance and debugging
            </p>
            <a
              href="mailto:support@terafence.in"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              support@terafence.in <IconArrowRight size={16} className="ml-1" />
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border border-slate-100">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <IconBuilding size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Sales Inquiries
            </h3>
            <p className="text-slate-600 mb-4">Demos and product information</p>
            <a
              href="mailto:info@terafence.in"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              info@terafence.in <IconArrowRight size={16} className="ml-1" />
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border border-slate-100">
            <div className="bg-violet-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <IconMessageCircle size={24} className="text-violet-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              General Inquiries
            </h3>
            <p className="text-slate-600 mb-4">
              Partnership opportunities and QnA
            </p>
            <a
              href="mailto:info@terafence.in"
              className="inline-flex items-center text-violet-600 hover:text-violet-800 font-medium text-sm"
            >
              info@terafence.in <IconArrowRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Support Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-5">
                  Contact Details
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="bg-blue-50 rounded-md p-2 mr-4">
                      <IconMail size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        Email Support
                      </h3>
                      <p className="text-slate-600">support@terafence.in</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Quick Response time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl text-white p-6">
                <div className="flex items-center mb-4">
                  <IconClock size={20} className="mr-2" />
                  <h3 className="font-semibold">Support Hours</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Monday - Friday</span>
                    <span>10 : 00 AM - 07 : 00 PM </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Saturday-Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>

                <div className="text-sm text-blue-100 pt-4 border-t border-blue-600">
                  <p>
                    Emergency support available for critical security issues for
                    enterprise customers.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Documentation</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/docs/getting-started"
                      className="flex items-center text-slate-700 hover:text-blue-600 group"
                    >
                      <IconFileText
                        size={16}
                        className="mr-2 text-slate-400 group-hover:text-blue-500"
                      />
                      <span>Getting Started Guide</span>
                      <IconExternalLink
                        size={14}
                        className="ml-auto text-slate-300 group-hover:text-blue-500"
                      />
                    </a>
                  </li>
                  <li></li>
                  <li>
                    <a
                      href="/docs/faq"
                      className="flex items-center text-slate-700 hover:text-blue-600 group"
                    >
                      <IconFileText
                        size={16}
                        className="mr-2 text-slate-400 group-hover:text-blue-500"
                      />
                      <span>FAQs & Troubleshooting</span>
                      <IconExternalLink
                        size={14}
                        className="ml-auto text-slate-300 group-hover:text-blue-500"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Get Support
              </h2>
              <p className="text-slate-600 mb-6">
                Fill out the form below and we&lsquo;ll get back to you shortly
              </p>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-4">
                    <IconCheck size={28} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                    Message Sent Successfully
                  </h3>
                  <p className="text-emerald-700 max-w-md mx-auto">
                    Thank you for reaching out. A member of our team will get
                    back to you shortly. Your reference number is{" "}
                    <strong>
                      TF-{Math.floor(Math.random() * 900000) + 100000}
                    </strong>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your organization"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="supportType"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Support Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="supportType"
                        name="supportType"
                        required
                        value={formData.supportType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="technical">Technical Support</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="product">Product Information</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      How can we help? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Please provide details about your inquiry or issue. Include any relevant error messages or steps to reproduce the problem."
                    ></textarea>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        required
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="privacy"
                        className="font-medium text-slate-700"
                      >
                        I agree to the{" "}
                        <a
                          href="/privacy"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a
                          href="/terms"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Terms of Service
                        </a>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out flex justify-center items-center"
                    >
                      Submit Support Request
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions about Data Diodes
              </h2>

              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-start">
                    <IconHelp
                      size={16}
                      className="text-blue-500 mr-2 mt-1 flex-shrink-0"
                    />
                    What details should I share when requesting data diode
                    technical support?
                  </h3>
                  <p className="text-slate-600 pl-6">
                    When contacting support for a data diode solution, please
                    include the product model, firmware version, system
                    configuration, and a clear description of the issue. Log
                    files, error messages, or screenshots can also help speed up
                    resolution.
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-start">
                    <IconHelp
                      size={16}
                      className="text-blue-500 mr-2 mt-1 flex-shrink-0"
                    />
                    What is the typical response time for data diode support
                    queries?
                  </h3>
                  <p className="text-slate-600 pl-6">
                    We aim to respond to data diode support tickets within 24
                    business hours. Customers with enterprise or premium support
                    plans receive faster response times in accordance with their
                    SLA.
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-start">
                    <IconHelp
                      size={16}
                      className="text-blue-500 mr-2 mt-1 flex-shrink-0"
                    />
                    Do you offer deployment, integration, or training services
                    for data diodes?
                  </h3>
                  <p className="text-slate-600 pl-6">
                    Yes, we offer tailored deployment assistance, integration
                    support, and training for data diode installations. These
                    services help ensure proper configuration and secure
                    implementation across critical networks.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-start">
                    <IconHelp
                      size={16}
                      className="text-blue-500 mr-2 mt-1 flex-shrink-0"
                    />
                    Where can I access data diode documentation and advanced
                    technical resources?
                  </h3>
                  <p className="text-slate-600 pl-6">
                    Technical documentation, hardware manuals, deployment
                    guides, and best practice references for data diodes are
                    available through our support portal. Contact us to request
                    access or for credentials to restricted resources.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <a
                  href="/support/faq"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all data diode FAQs
                  <IconChevronRight size={18} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}