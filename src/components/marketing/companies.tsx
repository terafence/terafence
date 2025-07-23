"use client";

import { useState } from "react";
import Image from "next/image";

interface CompanyData {
  id: number;
  logo: string;
  name: string;
  bgImage: string;
  description: string;
}

const companiesData: CompanyData[] = [
  {
    id: 1,
    logo: "/images/c4.png",
    name: "ISRO",
    bgImage: "/images/company/bg-1.png",
    description:
      "Indian Space Research Organisation (ISRO) is India's national space agency, headquartered in Bengaluru. Established in 1969, ISRO has achieved remarkable milestones including Mars Orbiter Mission, Chandrayaan missions, and cost-effective satellite launches. With a vision to harness space technology for national development, ISRO continues to push boundaries in space exploration, satellite technology, and launch vehicle development.",
  },
  {
    id: 2,
    logo: "/images/c6.png",
    name: "POSOCO",
    bgImage: "/images/company/bg-2.png",
    description:
      "Power System Operation Corporation Limited (POSOCO) is the national load dispatch center responsible for ensuring integrated operation of the Indian power system. Operating 24x7, POSOCO manages real-time grid operations, maintains grid security, and facilitates electricity trading across regions. As the apex body for power system operation, POSOCO plays a crucial role in maintaining grid stability.",
  },
  {
    id: 3,
    logo: "/images/c3.png",
    name: "C-DAC",
    bgImage: "/images/company/bg-3.png",
    description:
      "Centre for Development of Advanced Computing (C-DAC) is India's premier R&D organization under the Ministry of Electronics & Information Technology, dedicated to advanced computing and IT research. Since 1988, C-DAC has been at the forefront of developing indigenous supercomputing technologies, software solutions, and cyber security systems, driving India's technological self-reliance.",
  },
  {
    id: 4,
    logo: "/images/c2.png",
    name: "NCRTC",
    bgImage: "/images/company/bg-4.png",
    description:
      "National Capital Region Transport Corporation (NCRTC) is pioneering India's first Regional Rapid Transit System (RRTS) to revolutionize public transportation in the NCR. The RRTS will connect Delhi, Gurgaon, Alwar, and Meerut with high-speed, comfortable, and sustainable transit solutions, reducing travel time and enhancing connectivity through modern rail-based transportation.",
  },
  {
    id: 5,
    logo: "/images/c1.png",
    name: "URSC",
    bgImage: "/images/company/bg-5.png",
    description:
      "U R Rao Satellite Centre (URSC), a key facility of ISRO, is India's lead institution for satellite technology. URSC is responsible for designing, developing, and delivering satellites that support communication, remote sensing, meteorology, navigation, and scientific missions. With cutting-edge infrastructure and indigenous innovation, URSC plays a critical role in advancing India’s space program.",
  },
  {
    id: 6,
    logo: "/images/c5.png",
    name: "MP Power",
    bgImage: "/images/company/bg-6.png",
    description:
      "Madhya Pradesh Power Management Company Limited (MPPMCL) is the nodal agency for power trading and coordination across the state of Madhya Pradesh. Entrusted with bulk power procurement, financial management, and inter-agency coordination, MPPMCL ensures optimal power distribution planning and cost-effective energy availability for the state's DISCOMs and consumers.",
  },
];

const PremiumCompanies = () => {
  const [activeCompany, setActiveCompany] = useState(0);
  const currentCompany = companiesData[activeCompany];

  return (
    <div className="relative w-full py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Professional Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Trusted Globally to Defend <br />
            <span className="text-blue-600">What&apos;s Critical</span>
          </h2>
        </div>

        {/* Professional Company Logos */}
        <div className="mb-12 sm:mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {companiesData.map((company, index) => (
              <div key={company.id} className="group">
                <button
                  onClick={() => setActiveCompany(index)}
                  className={`relative w-full p-4 sm:p-6 bg-white rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    index === activeCompany
                      ? "border-blue-500 shadow-md ring-2 ring-blue-100 scale-105"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="relative h-12 sm:h-16 flex items-center justify-center">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={120}
                      height={60}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Professional Active Indicator */}
                  {index === activeCompany && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-1 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Company Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  FEATURED ORGANIZATION
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {currentCompany.name}
              </h3>
            </div>

            <div className="relative pl-6 border-l-2 border-blue-600">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {currentCompany.description}
              </p>
            </div>
          </div>

          {/* Right Side - Company Showcase */}
          <div className="relative">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={currentCompany.bgImage}
                  alt={`${currentCompany.name} showcase`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-all duration-500"
                />

                {/* Professional Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCompanies;
