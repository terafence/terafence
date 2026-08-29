"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Live Now");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function EventAnnouncementBar() {
  // IST = UTC+5:30 → explicitly set
  const countdown = useCountdown("2026-05-20T10:00:00+05:30");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-blue-950 border-b border-blue-800/50"
    >
      <div className="px-3 sm:px-6 py-2.5 max-w-screen-xl mx-auto flex items-center justify-between gap-2 sm:gap-4">

        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">

          {/* Pulse */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            <span className="text-blue-300 font-bold text-[9px] sm:text-[10px] tracking-[0.18em] uppercase hidden xs:inline">
              Live Event
            </span>
          </div>

          <span className="h-4 w-px bg-blue-800 flex-shrink-0 hidden sm:block" />

          {/* Text */}
          <p className="text-white text-[11px] sm:text-sm font-medium truncate">
            <span className="text-blue-100 font-bold">DEF-TECH Bharat 2026</span>
            <span className="text-blue-700 mx-1.5 hidden sm:inline">·</span>
            <span className="text-blue-300/80 hidden sm:inline">Booth A3A, Hall 2</span>
            <span className="text-blue-700 mx-1.5 hidden lg:inline">·</span>
            <span className="text-blue-400/70 hidden lg:inline">
              <MapPin className="inline h-3 w-3 mb-0.5 mr-0.5" />
              KTPO, Whitefield, Bengaluru
            </span>
          </p>
        </div>

        {/* Countdown */}
        <div className="hidden md:flex items-center text-[11px] sm:text-xs font-semibold text-blue-200 bg-blue-900/40 px-3 py-1.5 rounded-full border border-blue-800/60">
          {countdown}
        </div>

        {/* CTA */}
        <Link
          href="https://forms.gle/tGpxNrkJ7MTG6V896"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap"
        >
          Book a Slot
          <ArrowRight className="h-3 w-3" />
        </Link>

      </div>
    </motion.div>
  );
}
