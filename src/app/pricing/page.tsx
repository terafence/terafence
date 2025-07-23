"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Star, Shield, Zap, Database, Network, Server, Eye, Puzzle } from "lucide-react";
import NumberFlow from "@number-flow/react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

interface DeviceFeature {
  name: string;
  supported: boolean;
  details?: string;
}

interface Device {
  id: string;
  name: string;
  fullName: string;
  description: string;
  price: number;
  popular?: boolean;
  enterprise?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  features: DeviceFeature[];
  specialFeatures: string[];
  powerSupply: string;
  category: "Security" | "Replication" | "Processing" | "Networking" | "Monitoring" | "Infrastructure";
}

const devices: Device[] = [
  {
    id: "vsecure",
    name: "VSECURE",
    fullName: "TFG VSECURE",
    description: "Advanced security platform with comprehensive protocol support and database replication",
    price: 12999,
    popular: true,
    icon: Shield,
    category: "Security",
    powerSupply: "External",
    features: [
      { name: "SYSLOG (TCP/UDP)", supported: true },
      { name: "File Transfer (8GB)", supported: true, details: "FTP/SFTP/SMB" },
      { name: "RTSP/Onvif", supported: true },
      { name: "SMTP", supported: true },
      { name: "NTP", supported: true },
      { name: "Passive HDMI Replication", supported: true },
      { name: "HTTP/S REST API", supported: true },
      { name: "OPC/DA/UA", supported: true },
      { name: "MQTT", supported: true },
      { name: "MODBUS/TCP", supported: true },
      { name: "IEC-104", supported: false },
    ],
    specialFeatures: ["MS-SQL Server Replication", "OSIsoft PI Server Database"],
  },
  {
    id: "tfg1u-rp",
    name: "1U-RP",
    fullName: "TFG 1U-RP",
    description: "Compact 1U rackmount platform with internal power redundancy",
    price: 8999,
    icon: Server,
    category: "Replication",
    powerSupply: "Internal",
    features: [
      { name: "SYSLOG (TCP/UDP)", supported: true },
      { name: "File Transfer (4GB)", supported: true, details: "FTP/SFTP/SMB" },
      { name: "RTSP/Onvif", supported: true },
      { name: "SMTP", supported: true },
      { name: "NTP", supported: true },
      { name: "Passive HDMI Replication", supported: true },
      { name: "HTTP/S REST API", supported: true },
      { name: "OPC/DA/UA", supported: true },
      { name: "MQTT", supported: true },
      { name: "MODBUS/TCP", supported: true },
      { name: "IEC-104", supported: true },
    ],
    specialFeatures: [],
  },
  {
    id: "tfg1u-rp-bf",
    name: "1U-RP-BF",
    fullName: "TFG 1U-RP Big File",
    description: "High-capacity file processing with 100GB transfer capability",
    price: 15999,
    enterprise: true,
    icon: Database,
    category: "Processing",
    powerSupply: "Internal",
    features: [
      { name: "SYSLOG (TCP/UDP)", supported: true },
      { name: "File Transfer (100GB)", supported: true, details: "FTP/SFTP/SMB" },
      { name: "RTSP/Onvif", supported: true },
      { name: "SMTP", supported: true },
      { name: "NTP", supported: true },
      { name: "Passive HDMI Replication", supported: true },
      { name: "HTTP/S REST API", supported: true },
      { name: "OPC/DA/UA", supported: true },
      { name: "MQTT", supported: true },
      { name: "MODBUS/TCP", supported: true },
      { name: "IEC-104", supported: true },
    ],
    specialFeatures: [],
  },
  {
    id: "tfg-121",
    name: "TFG-121",
    fullName: "TFG-121",
    description: "Versatile platform with external power and comprehensive connectivity",
    price: 6999,
    icon: Network,
    category: "Networking",
    powerSupply: "External",
    features: [
      { name: "SYSLOG (TCP/UDP)", supported: true },
      { name: "File Transfer (4GB)", supported: true, details: "FTP/SFTP/SMB" },
      { name: "RTSP/Onvif", supported: true },
      { name: "SMTP", supported: true },
      { name: "NTP", supported: true },
      { name: "Passive HDMI Replication", supported: true },
      { name: "HTTP/S REST API", supported: true },
      { name: "OPC/DA/UA", supported: true },
      { name: "MQTT", supported: true },
      { name: "MODBUS/TCP", supported: true },
      { name: "IEC-104", supported: true },
    ],
    specialFeatures: [],
  },
  {
    id: "tfg-821",
    name: "TFG-821",
    fullName: "TFG-821 (8 Port PoE)",
    description: "8-port Power over Ethernet solution with external power supply",
    price: 9999,
    icon: Zap,
    category: "Infrastructure",
    powerSupply: "External",
    features: [
      { name: "SYSLOG (TCP/UDP)", supported: true },
      { name: "File Transfer (4GB)", supported: true, details: "FTP/SFTP/SMB" },
      { name: "RTSP/Onvif", supported: true },
      { name: "SMTP", supported: true },
      { name: "NTP", supported: true },
      { name: "Passive HDMI Replication", supported: true },
      { name: "HTTP/S REST API", supported: true },
      { name: "OPC/DA/UA", supported: true },
      { name: "MQTT", supported: true },
      { name: "MODBUS/TCP", supported: true },
      { name: "IEC-104", supported: true },
    ],
    specialFeatures: [],
  },
  {
    id: "tf-mirroring",
    name: "TF-Mirroring",
    fullName: "TF-Mirroring",
    description: "Specialized L2 Ethernet packet replication and mirroring solution",
    price: 4999,
    icon: Eye,
    category: "Monitoring",
    powerSupply: "Not Required",
    features: [
      { name: "SYSLOG (TCP/UDP)", supported: false },
      { name: "File Transfer", supported: false },
      { name: "RTSP/Onvif", supported: false },
      { name: "SMTP", supported: false },
      { name: "NTP", supported: false },
      { name: "Passive HDMI Replication", supported: false },
      { name: "HTTP/S REST API", supported: false },
      { name: "OPC/DA/UA", supported: false },
      { name: "MQTT", supported: false },
      { name: "MODBUS/TCP", supported: false },
      { name: "IEC-104", supported: false },
    ],
    specialFeatures: ["L2 Ethernet Packet Replicator"],
  },
  {
    id: "terafence-bypass",
    name: "TF-Bypass",
    fullName: "Terafence Bypass",
    description: "Network bypass solution for continuous connectivity assurance",
    price: 3999,
    icon: Puzzle,
    category: "Infrastructure",
    powerSupply: "Not Required",
    features: [
      { name: "SYSLOG (TCP/UDP)", supported: false },
      { name: "File Transfer", supported: false },
      { name: "RTSP/Onvif", supported: false },
      { name: "SMTP", supported: false },
      { name: "NTP", supported: false },
      { name: "Passive HDMI Replication", supported: false },
      { name: "HTTP/S REST API", supported: false },
      { name: "OPC/DA/UA", supported: false },
      { name: "MQTT", supported: false },
      { name: "MODBUS/TCP", supported: false },
      { name: "IEC-104", supported: false },
    ],
    specialFeatures: ["Terafence Network Bypass"],
  },
];

const categoryColors = {
  "Security": "from-red-500 to-pink-500",
  "Replication": "from-blue-500 to-cyan-500", 
  "Processing": "from-purple-500 to-indigo-500",
  "Networking": "from-green-500 to-emerald-500",
  "Monitoring": "from-yellow-500 to-orange-500",
  "Infrastructure": "from-gray-500 to-slate-500",
};

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(devices.map(d => d.category)))];

  const filteredDevices = selectedCategory === "All" 
    ? devices 
    : devices.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Terafence Platforms
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Advanced network security and data replication solutions for enterprise infrastructure
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                <Network className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Protocol Support</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                <Database className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Data Replication</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-50 border shadow-sm hover:shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative group ${
                  device.popular ? "md:-mt-8" : ""
                }`}
              >
                {device.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                {device.enterprise && (
                  <div className="absolute -top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-medium">
                      Enterprise
                    </div>
                  </div>
                )}

                <div className={`h-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 ${
                  device.popular ? "ring-2 ring-blue-500/20 shadow-2xl" : ""
                }`}>
                  {/* Header */}
                  <div className={`p-8 bg-gradient-to-r ${categoryColors[device.category]} text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <device.icon className="w-8 h-8" />
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {device.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{device.name}</h3>
                    <p className="text-sm opacity-90 mb-4">{device.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        $<NumberFlow value={device.price} />
                      </span>
                      <span className="text-sm opacity-75">one-time</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">IT Protocols</h4>
                      <div className="space-y-3">
                        {device.features.slice(0, 6).map((feature) => (
                          <div key={feature.name} className="flex items-center gap-3">
                            {feature.supported ? (
                              <Check className="w-5 h-5 text-green-500 shrink-0" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 shrink-0" />
                            )}
                            <span className={`text-sm ${
                              feature.supported ? "text-gray-700" : "text-gray-400"
                            }`}>
                              {feature.name}
                              {feature.details && (
                                <span className="text-gray-500 ml-1">({feature.details})</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">OT Protocols</h4>
                      <div className="space-y-3">
                        {device.features.slice(6).map((feature) => (
                          <div key={feature.name} className="flex items-center gap-3">
                            {feature.supported ? (
                              <Check className="w-5 h-5 text-green-500 shrink-0" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 shrink-0" />
                            )}
                            <span className={`text-sm ${
                              feature.supported ? "text-gray-700" : "text-gray-400"
                            }`}>
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {device.specialFeatures.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Special Features</h4>
                        <div className="space-y-3">
                          {device.specialFeatures.map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                              <Star className="w-5 h-5 text-yellow-500 shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Power Supply:</span>
                        <span className="font-medium text-gray-900">{device.powerSupply}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-8 pt-0">
                    <button className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      device.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25"
                        : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg"
                    }`}>
                      Request Quote
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Compare All Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed feature comparison across all Terafence platforms to help you choose the right solution
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-x-auto bg-white rounded-3xl shadow-xl border"
          >
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-semibold text-gray-900">Feature</th>
                  {devices.map((device) => (
                    <th key={device.id} className="text-center p-6 font-semibold text-gray-900 min-w-[120px]">
                      {device.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {devices[0].features.map((_, featureIndex) => (
                  <tr key={featureIndex} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-6 font-medium text-gray-700">
                      {devices[0].features[featureIndex].name}
                    </td>
                    {devices.map((device) => (
                      <td key={device.id} className="p-6 text-center">
                        {device.features[featureIndex]?.supported ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Secure Your Network?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get in touch with our experts to find the perfect Terafence solution for your infrastructure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                Schedule Consultation
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-300">
                Download Datasheet
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}