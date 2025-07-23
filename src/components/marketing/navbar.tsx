"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";

type SubLink = {
  name: string;
  href: string;
  description?: string;
};

type NavLink = {
  name: string;
  href: string;
  subMenu?: SubLink[];
};

const NAV_LINKS: NavLink[] = [
  {
    name: "About",
    href: "/about",
    subMenu: [
      {
        name: "Our Story",
        href: "/about/story",
        description: "Learn about our company's journey"
      },
      {
        name: "Team",
        href: "/about/team",
        description: "Meet our leadership team"
      },
    ],
  },
  {
    name: "Technology",
    href: "/technology",
  },
  // {
  //   name: "Partners",
  //   href: "/partners",
  // },
  {
    name: "Blogs",
    href: "/blog",
  },
  {
    name: "Products",
    href: "/products",
    subMenu: [
      {
        name: "TFG 121",
        href: "/devices",
        description: "Unidirectional Security Gateway"
      },
      {
        name: "TFG 1U-RP",
        href: "/devices",
        description: "Unified - Redundant Power"
      },
      {
        name: "TFG BSG",
        href: "/devices",
        description: "Bi-directional Security Gateway"
      },
    ],
  },
  {
    name: "Use Cases",
    href: "/usecases",
    subMenu: [
      {
        name: "Overview",
        href: "/usecases",
        description: "Explore all security use cases"
      },
      {
        name: "Energy Management",
        href: "/usecases",
        description: "Security solutions for power infrastructure"
      },
      {
        name: "Petroleum Industry",
        href: "/usecases",
        description: "Protection for oil and gas infrastructure"
      },
      {
        name: "Mission Critical Systems",
        href: "/usecases",
        description: "Solutions for high availability environments"
      },
      {
        name: "OT Data Transfer to SIEM",
        href: "/usecases",
        description: "Safe operational data transfer"
      },
      {
        name: "Cloud Security",
        href: "/usecases/cloud-security",
        description: "Secure cloud connectivity solutions"
      },
      {
        name: "Defense Export Programs",
        href: "/usecases",
        description: "Solutions for foreign military sales"
      },
    ],
  },
  {
    name: "Downloads",
    href: "/download",
  },
  {
    name: "Contact",
    href: "/contact/contact",
  },
];

const MenuDropdown = ({ link }: { link: NavLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!link.subMenu) {
    return (
      <Link 
        href={link.href} 
        className="px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
      >
        {link.name}
      </Link>
    );
  }
  
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {link.name}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="py-2">
              {link.subMenu.map((subLink, idx) => (
                <Link
                  key={idx}
                  href={subLink.href}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="font-medium text-gray-900 text-sm">{subLink.name}</div>
                  {subLink.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {subLink.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        className="flex h-10 w-10 items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 z-50 bg-white"
          >
            <div className="h-full overflow-y-auto">
              <div className="px-6 py-4 space-y-1">
                {NAV_LINKS.map((link, index) => (
                  <div key={index} className="border-b border-gray-100 py-2">
                    {link.subMenu ? (
                      <div>
                        <button
                          className="flex w-full items-center justify-between py-3 text-base font-medium text-gray-900"
                          onClick={() =>
                            setOpenSubmenu(openSubmenu === link.name ? null : link.name)
                          }
                        >
                          {link.name}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openSubmenu === link.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubmenu === link.name && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pt-2 space-y-2">
                                {link.subMenu.map((subLink, idx) => (
                                  <Link
                                    key={idx}
                                    href={subLink.href}
                                    className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subLink.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-3 text-base font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="pt-6">
                  <div className="space-y-3">
                    <Link href="/supports" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Get Support
                      </Button>
                    </Link>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = "mailto:info@terafence.in";
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full h-20 bg-white z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm border-b border-gray-100" : ""
      }`}
    >
      <Wrapper className="h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/terafence.png"
              alt="Terafence"
              width={150}
              height={55}
              priority
              className="h-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {NAV_LINKS.map((link, index) => (
              <MenuDropdown key={index} link={link} />
            ))}
          </nav>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/supports"className="hidden lg:block">
              <Button className="px-6 bg-blue-600 hover:bg-blue-700">
                    Get Support
              </Button>
            </Link>
            <MobileMenu />
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;