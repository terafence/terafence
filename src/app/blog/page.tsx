"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Eye,
  Calendar,
  ChevronRight,
  Star,
  Award,
} from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import Wrapper from "@/components/global/wrapper";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  views: string;
  featured: boolean;
  tags: string[];
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 11,
    title: "What is a Data Diode?",
    excerpt:
      "Exploring critical cybersecurity vulnerabilities in modern supply chains and implementing robust defense strategies to protect against sophisticated attacks.",
    category: "Data Diode",
    readTime: "10 min read",
    publishDate: "2024-01-10",
    views: "45.3K",
    featured: true,
    tags: ["Core Technology", "Working Principle"],
    slug: "cybersecurity-challenges-supply-chain",
  },
  {
    id: 2,
    title: "Securing Syslog Transfer from OT to IT",
    excerpt:
      "Best practices for secure syslog data transfer between operational technology and information technology networks while maintaining data integrity and compliance.",
    category: "OT Security",
    readTime: "6 min read",
    publishDate: "2024-01-12",
    views: "21.8K",
    featured: true,
    tags: ["Syslog", "OT Security", "Data Transfer"],
    slug: "securing-syslog-transfer-ot-it",
  },
  {
    id: 3,
    title:
      "Securing RDP using TFG – BSG",
    excerpt:
      "Comprehensive guide to securing RDP connections in enterprise environments using advanced bidirectional security gateways and industry best practices for maximum protection.",
    category: "Network Security",
    readTime: "8 min read",
    publishDate: "2024-01-15",
    views: "12.4K",
    featured: true,
    tags: ["RDP", "Network Security", "TFG-BSG"],
    slug: "securing-rdp-access-tfg-bsg",
  },
  {
    id: 3,
    title: "Cybersecurity Challenges in Supply Chain Management",
    excerpt:
      "Exploring critical cybersecurity vulnerabilities in modern supply chains and implementing robust defense strategies to protect against sophisticated attacks.",
    category: "Supply Chain",
    readTime: "10 min read",
    publishDate: "2024-01-10",
    views: "33.2K",
    featured: false,
    tags: ["Supply Chain", "Risk Management"],
    slug: "cybersecurity-challenges-supply-chain",
  },
  {
    id: 4,
    title:
      "Cybersecurity Challenges in Water Treatment Plants and How Terafence Solves Them",
    excerpt:
      "Critical infrastructure protection for water treatment facilities using advanced cybersecurity solutions and comprehensive monitoring systems for operational security.",
    category: "Critical Infrastructure",
    readTime: "12 min read",
    publishDate: "2024-01-08",
    views: "22.1K",
    featured: false,
    tags: ["Water Treatment", "Critical Infrastructure"],
    slug: "cybersecurity-water-treatment-plants",
  },
  {
    id: 5,
    title:
      "Cybersecurity Challenges in the Pharmaceutical Industry and How Terafence Solves Them",
    excerpt:
      "Protecting sensitive pharmaceutical data and manufacturing processes from sophisticated cyber threats while ensuring regulatory compliance and data protection.",
    category: "Pharmaceutical",
    readTime: "9 min read",
    publishDate: "2024-01-05",
    views: "31.9K",
    featured: false,
    tags: ["Pharmaceutical", "FDA Compliance"],
    slug: "cybersecurity-pharmaceutical-industry",
  },
  {
    id: 6,
    title: "Cybersecurity Challenges in the Integrated Transportation Sector",
    excerpt:
      "Securing modern transportation systems against cyber threats while maintaining operational efficiency and passenger safety in connected infrastructure environments.",
    category: "Transportation",
    readTime: "11 min read",
    publishDate: "2024-01-03",
    views: "22.7K",
    featured: false,
    tags: ["Transportation", "ITS Security"],
    slug: "cybersecurity-transportation-sector",
  },
  {
    id: 7,
    title: "Challenges to OT Cybersecurity",
    excerpt:
      "Understanding and addressing the unique cybersecurity challenges facing operational technology environments in industrial settings and critical infrastructure systems.",
    category: "OT Security",
    readTime: "7 min read",
    publishDate: "2024-01-01",
    views: "32.5K",
    featured: false,
    tags: ["OT Security", "Industrial Control"],
    slug: "challenges-ot-cybersecurity",
  },
  {
    id: 8,
    title:
      "Reinforcing CCTV Security in the Era of Hyperconnected Infrastructure",
    excerpt:
      "Strengthening surveillance system security against sophisticated attacks in interconnected smart infrastructure environments and IoT-enabled monitoring systems.",
    category: "Surveillance Security",
    readTime: "8 min read",
    publishDate: "2023-12-28",
    views: "11.6K",
    featured: false,
    tags: ["CCTV Security", "Video Surveillance"],
    slug: "reinforcing-cctv-security-hyperconnected",
  },
  {
    id: 9,
    title:
      "Bridging the Divide, Securely: Transferring Large Files Between Secure and Unsecure Networks",
    excerpt:
      "Secure methods for transferring large files across network boundaries while maintaining data integrity and confidentiality in air-gapped and segmented environments.",
    category: "Data Transfer",
    readTime: "9 min read",
    publishDate: "2023-12-25",
    views: "22.8K",
    featured: false,
    tags: ["File Transfer", "Network Security"],
    slug: "secure-large-file-transfer-networks",
  },
  {
    id: 10,
    title:
      "Securing the Patch and Software Distribution for Air-Gapped Networks",
    excerpt:
      "Best practices for maintaining software updates and security patches in isolated network environments while ensuring system integrity and operational continuity.",
    category: "Air-Gap Security",
    readTime: "10 min read",
    publishDate: "2023-12-22",
    views: "22.0K",
    featured: false,
    tags: ["Air-Gapped Networks", "Patch Management"],
    slug: "securing-patch-distribution-air-gapped",
  },
];

const categories = [
  "All",
  "Network Security",
  "OT Security",
  "Critical Infrastructure",
  "Supply Chain",
  "Transportation",
  "Pharmaceutical",
  "Surveillance Security",
  "Data Transfer",
  "Air-Gap Security",
];

export default function BlogLanding() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  // Filter posts based on search and category
  React.useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Ultra Premium Dark Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Sophisticated Dark Background Elements */}
        <div className="absolute inset-0">
          {/* Premium gradient overlays */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-600/10 to-transparent"></div>

          {/* Floating orbs with blur */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Premium tech pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.3) 2px, transparent 0)`,
              backgroundSize: "100px 100px",
            }}
          ></div>

          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>
        </div>

        <Wrapper className="relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Ultra Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-xl rounded-full border border-blue-400/30 shadow-2xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <Award className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-blue-300 text-sm tracking-wider uppercase">
                  Expert Cybersecurity Intelligence
                </span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>

            {/* Ultra Premium Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="text-white">Terafence</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 animate-pulse">
                  Knowledge Vault
                </span>
              </h1>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg lg:text-xl text-gray-300 mb-4 leading-relaxed font-light">
                  Unlock expert insights & cutting-edge strategies for the most sophisticated
                  cybersecurity challenges.
                </p>
                <p className="text-base text-gray-400 max-w-3xl mx-auto">
                  Trusted by security professionals defending critical
                  infrastructure worldwide.
                </p>
              </div>
            </motion.div>

            {/* Ultra Premium Search Interface */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="relative group">
                {/* Glowing border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-2">
                  <div className="flex items-center">
                    <div className="pl-4 pr-2">
                      <Search className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search our knowledge vault..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base font-medium"
                    />
                    <div className="pr-2">
                      <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 cursor-pointer text-sm">
                        Search
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ultra Premium Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="text-center group">
                <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-5 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {blogPosts.length}
                  </div>
                  <div className="text-blue-300 font-semibold text-xs uppercase tracking-wider">
                    Expert Articles
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    Deep-dive analysis
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-5 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {categories.length - 1}
                  </div>
                  <div className="text-purple-300 font-semibold text-xs uppercase tracking-wider">
                    Specializations
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    Industry domains
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-5 border border-gray-700/50 hover:border-green-500/50 transition-all duration-500 hover:scale-105">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    30K+
                  </div>
                  <div className="text-green-300 font-semibold text-xs uppercase tracking-wider">
                    Monthly Readers
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    Security professionals
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Premium Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center items-center gap-8 mt-10 pt-8 border-t border-gray-800"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Enterprise Trusted</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Industry Certified</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Expert Validated</span>
              </div>
            </motion.div>
          </div>
        </Wrapper>
      </section>

      {/* Premium Category Filter */}
      <section className="py-6 bg-white border-y border-gray-200">
        <Wrapper>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* Featured Articles - Premium Grid */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <Wrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600 fill-current" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Featured Insights
                </h2>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer h-full"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col hover:scale-[1.02] border border-gray-100">
                      {/* Premium Image Section */}
                      <div className="aspect-[16/9] bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                        <Image
                          src={`/images/blog/${post.id}.png`}
                          alt={post.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg border border-white/20">
                            {post.category}
                          </span>
                        </div>

                        {/* Views Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-2 px-2 py-1 bg-blue-600 backdrop-blur-sm rounded-lg">
                            <Eye className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">
                              {post.views}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Premium Content Section */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(post.publishDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Read More CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                            <span>Read Full Article</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </Wrapper>
        </section>
      )}

      {/* Regular Articles - Uniform Height Grid */}
      <section className="py-16 bg-white">
        <Wrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedCategory === "All"
                ? "Latest Cybersecurity Insights"
                : `${selectedCategory} Expertise`}
            </h2>
          </motion.div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No articles found
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Try adjusting your search terms or category filter
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Show All Articles
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer h-full"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col hover:scale-[1.02] border border-gray-200">
                      {/* Uniform Image Section */}
                      <div className="aspect-[16/9] bg-gradient-to-br from-gray-600 to-gray-800 relative overflow-hidden">
                        <Image
                          src={`/images/blog/${post.id}.png`}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded border border-white/20">
                            {post.category}
                          </span>
                        </div>

                        {/* Views Badge */}
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-600 backdrop-blur-sm rounded">
                            <Eye className="w-3 h-3 text-slate-200" />
                            <span className="text-slate-100 text-xs">
                              {post.views}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        {/* Meta Information */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(post.publishDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        {/* Title - Fixed Height */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight min-h-[4.5rem]">
                          {post.title}
                        </h3>

                        {/* Excerpt - Fixed Height */}
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed min-h-[4rem] flex-1">
                          {post.excerpt}
                        </p>

                        {/* Tags - Fixed Height */}
                        <div className="flex flex-wrap gap-1 mb-4 min-h-[2rem]">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Read More CTA */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                            <span>Read More</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </Wrapper>
      </section>

      <Footer />
    </div>
  );
}
