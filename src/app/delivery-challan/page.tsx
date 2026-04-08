"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import OTPLogin from "./components/OTPLogin";
import ChallanForm from "./components/ChallanForm";
import ChallanPreview from "./components/ChallanPreview";
import { ChallanFormData, defaultChallanData } from "./lib/types";
import { Button } from "@/components/ui/button";
import { Printer, Download, LogOut, FileText } from "lucide-react";

export default function DeliveryChallanPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState<ChallanFormData>(defaultChallanData);
  const previewRef = useRef<HTMLDivElement>(null);

  // Check existing session on mount
  useEffect(() => {
    const email = document.cookie
      .split("; ")
      .find((row) => row.startsWith("dc-email="))
      ?.split("=")[1];
    const session = document.cookie
      .split("; ")
      .find((row) => row.startsWith("dc-session="));
    if (email && session) {
      setUserEmail(decodeURIComponent(email));
      setAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = useCallback((email: string) => {
    setUserEmail(email);
    setAuthenticated(true);
  }, []);

  const handleLogout = () => {
    document.cookie = "dc-session=; path=/; max-age=0";
    document.cookie = "dc-email=; path=/; max-age=0";
    setAuthenticated(false);
    setUserEmail("");
  };

  const handlePrint = () => {
    const printContents = document.getElementById("challan-preview");
    if (!printContents) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery Challan - ${formData.serialNo || "Draft"}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Calibri, 'Segoe UI', Arial, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table { page-break-inside: avoid; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>${printContents.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownloadPDF = () => {
    // Use print-to-PDF as the most reliable cross-browser method
    handlePrint();
  };

  if (!authenticated) {
    return <OTPLogin onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                Delivery Challan Generator
              </h1>
              <p className="text-xs text-slate-500">Terafence Pvt Ltd</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-2 hidden sm:inline">
              {userEmail}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save as PDF</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 text-xs text-slate-500 hover:text-red-600"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left: Form */}
          <div className="w-full xl:w-[420px] xl:min-w-[420px] space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-700">
                Fill in the details below. The preview on the right updates in
                real-time matching the exact Delivery Challan format.
              </p>
            </div>
            <ChallanForm data={formData} onChange={setFormData} />
          </div>

          {/* Right: Live Preview */}
          <div className="flex-1 overflow-auto">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">
                  Live Preview
                </h2>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                  ● Real-time
                </span>
              </div>
              <div className="overflow-auto rounded-xl border border-slate-200 bg-slate-200 p-4">
                <ChallanPreview ref={previewRef} data={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          header,
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
