import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Support Center by Terafence Limited',
  description: 'Customer support portal for Terafence customers',
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      {children}
    </div>
  );
}