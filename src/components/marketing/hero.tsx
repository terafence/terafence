import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { OrbitingCircles } from "../ui/orbiting-circles";

const Hero = () => {
  return (
    <section className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden ">
      {/* Full-screen video background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/hero.mp4" type="video/mp4" />
        </video>

        {/* Professional dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      </div>

      {/* Orbiting circles - only for desktop */}
      <div className="hidden lg:block absolute inset-0">
        <OrbitingCircles speed={0.3} radius={350}>
          <div className="w-3 h-3 bg-blue-500/30 rounded-full"></div>
          <div className="w-2 h-2 bg-indigo-400/40 rounded-full"></div>
        </OrbitingCircles>
        <OrbitingCircles speed={0.15} radius={450}>
          <div className="w-2 h-2 bg-blue-400/30 rounded-full"></div>
          <div className="w-4 h-4 bg-indigo-500/30 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-400/40 rounded-full"></div>
        </OrbitingCircles>
        <OrbitingCircles speed={0.08} radius={550}>
          <div className="w-2 h-2 bg-cyan-400/30 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500/30 rounded-full"></div>
          <div className="w-2 h-2 bg-indigo-400/40 rounded-full"></div>
        </OrbitingCircles>
      </div>

      {/* Main content - truly full width */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 lg:space-y-12">
          {/* Premium badge */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  MADE IN INDIA
                </span>
                <span className="text-white/90 font-medium hidden sm:inline">
                  India&apos;s Leading FPGA-Based Data Diode Manufacturer for
                  Critical Infrastructure Security
                </span>
                <span className="text-white/90 font-medium sm:hidden">
                  Leading FPGA Security Solutions
                </span>
              </div>
            </div>
          </div>

          {/* Hero title */}
          <div className="space-y-4 max-w-6xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="text-white">Transform your </span>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                security
              </span>
              <br />
              <span className="text-white">with iTF Protection</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-4xl leading-relaxed">
            FPGA-Based Hardware Data Diode — Unidirectional Gateway with Zero
            Downtime to Protect Critical Infrastructure and Eliminate Cyber
            Threats.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/contact/contact" className="group inline-block">
              <div className="relative">
                <div className="absolute -inset-1 bg-[#3f72b5] rounded-lg opacity-60 blur group-hover:opacity-80 transition-opacity"></div>
                <Button
                  size="lg"
                  className="relative bg-blue-600 text-white border-0 px-8 py-6 text-lg font-semibold rounded-lg shadow-xl transform group-hover:scale-105 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    Secure Your Network
                    <ShieldCheckIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
