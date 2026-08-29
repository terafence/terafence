"use client";
import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function EventPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("deftech2026-popup-v2-dismissed");
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("deftech2026-popup-v2-dismissed", "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          style={{
            backgroundColor: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => e.target === e.currentTarget && dismiss()}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Banner */}
            <div className="w-full">
              <Image
                src="/images/events/deftech-banner.png"
                alt="DEF-TECH Bharat 2026 — Terafence Limited"
                width={1400}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-slate-100">
              <Link
                href="https://forms.gle/tGpxNrkJ7MTG6V896"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200"
              >
                Book a Meeting
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={dismiss}
                className="text-slate-400 hover:text-slate-600 text-sm px-3 py-2 rounded-lg hover:bg-slate-50 transition"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
