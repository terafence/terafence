import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";
import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <>
            <Navbar />
            <main className="mx-auto w-full z-40 relative">
                {children}
                <Toaster />
                <SpeedInsights/>
            </main>
            <Footer />
            <Analytics/>
        </>
    );
};

export default MarketingLayout
