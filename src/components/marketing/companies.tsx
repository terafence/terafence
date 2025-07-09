/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import company1 from "../../../public/images/c1.png";
import company2 from "../../../public/images/c2.png";
import company3 from "../../../public/images/c3.png";
import company4 from "../../../public/images/c4.png";
import company5 from "../../../public/images/c5.png";
import company6 from "../../../public/images/c6.png";

interface CompanyLogo {
  src: any;
  alt: string;
  name: string;
}

const companyLogos: CompanyLogo[] = [
  { src: company1, alt: "Powergrid Logo", name: "POWERGRID" },
  { src: company4, alt: "ISRO Logo", name: "ISRO" },
  { src: company6, alt: "POSOCO Logo", name: "POSOCO" },
  { src: company5, alt: "Delhi Transco Logo", name: "DELHI TRANSCO" },
  { src: company2, alt: "NCRTC Logo", name: "NCRTC" },
  { src: company3, alt: "CDAC Logo", name: "CDAC" },
];

const CompanyCard: FC<{ logo: CompanyLogo; index: number }> = ({
  logo,
  index,
}) => {
  return (
    <div
      className="flex items-center justify-center h-full opacity-0 animate-[fadeInUp_0.6s_ease_forwards]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm w-full h-56 flex items-center justify-center overflow-hidden">
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-md shadow-sm z-10">
          {logo.name}
        </div>
        <div className="flex items-center justify-center overflow-visible hover:scale-125 transition-transform duration-300">
          <Image
            src={logo.src}
            alt={logo.alt}
            className="h-auto w-auto max-w-[75%] max-h-32 object-contain"
            priority={index < 4}
          />
        </div>
      </div>
    </div>
  );
};

const Companies: FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const decorationVariants = {
    hidden: { width: 0 },
    visible: {
      width: "8rem",
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={ref}
      className="w-full py-24 md:py-32 lg:py-36 mt-12 md:mt-20 overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="flex flex-col items-center justify-center mb-16 md:mb-20"
        >
          <motion.h2
            variants={headingVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-center"
          >
            Trusted by{" "}
            <span className="font-subheading italic text-blue-700">
              industry leaders <br/>
            </span>{" "}
            for the Data Diode Solutions
          </motion.h2>

          <motion.div
            variants={decorationVariants}
            className="h-1 bg-blue-600 mx-auto mt-6 rounded-full"
          ></motion.div>

          <motion.p
            variants={subtitleVariants}
            className="text-gray-600 text-lg md:text-xl mt-6 text-center max-w-3xl"
          >
            Empowering Critical Infrastructure with Trusted Data Diode Solutions
            and Innovation{" "}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {companyLogos.map((logo, index) => (
            <CompanyCard key={logo.alt} logo={logo} index={index} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Companies;