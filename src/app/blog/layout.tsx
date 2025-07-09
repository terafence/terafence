import type { Metadata } from 'next';
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Blog | Terafence',
  description: 'Explore the latest insights on cybersecurity, IoT protection, and critical infrastructure security from Terafence experts.'
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-4 pb-16 w-full mx-auto">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}