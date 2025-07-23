import { ShieldIcon, ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import Container from "../global/container";
import Image from "next/image";
import Link from "next/link";
const DataDiodes = () => {
  return (
    <div
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-gray-900"
      style={{
        backgroundImage: "url('/images/bg/grid-dark.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900/60"></div>

      <Container>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative mx-4 sm:mx-6 lg:mx-0">
                <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px]">
                  <Image
                    src="/images/home/technology-1.png"
                    alt="Data Diode Technology"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl -z-10"></div>
                {/* Additional subtle border glow */}
                <div className="absolute inset-0 rounded-2xl border border-blue-500/20 pointer-events-none"></div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2 text-white">
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <ShieldIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">
                      Mission-Critical Infrastructure Cybersecurity
                    </span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                    Secure Transfer for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      Mission-Critical Data
                    </span>{" "}
                    <br />
                    with Data Diode
                  </h2>
                </div>

                {/* Main Description */}
                <p className="text-lg text-gray-300 leading-relaxed">
                  For{" "}
                  <strong className="text-white">
                    mission-critical infrastructure
                  </strong>
                  , <strong className="text-white">secure data transfer</strong>{" "}
                  is non-negotiable.{" "}
                  <strong className="text-white">Data diode </strong> (
                  unidirectional security gateway ) offers an{" "}
                  <strong className="text-white">
                    unbreachable hardware-enforced solution
                  </strong>
                  , ensuring{" "}
                  <strong className="text-white">one-way data flow</strong> from{" "}
                  <strong className="text-white">OT/ICS networks</strong>.
                </p>

                {/* Benefits List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Prevents{" "}
                      <strong className="text-white">cyberattacks</strong> and{" "}
                      <strong className="text-white">data exfiltration</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Guarantees{" "}
                      <strong className="text-white">cyber resilience</strong>{" "}
                      and <strong className="text-white">data integrity</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Ensures{" "}
                      <strong className="text-white">
                        regulatory compliance
                      </strong>{" "}
                      for sensitive operations
                    </span>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="pt-6">
                  <Link href="/technology">
                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                      Learn More About Data Diode
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </Link>
                </div>

                {/* Additional highlight */}
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 italic">
                    Hardware-enforced unidirectional data flow for absolute impenetrable
                    security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DataDiodes;
