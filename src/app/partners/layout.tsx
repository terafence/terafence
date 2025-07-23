// src/app/partners/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Portal | Terafence",
  description: "Secure partner access portal for Terafence cybersecurity solutions",
  robots: "noindex, nofollow", // Prevent search engine indexing
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}