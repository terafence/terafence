// src/app/partners/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  FileText, 
  BarChart3, 
  Shield, 
  Bell,
  Filter,
  Calendar,
  TrendingUp,
  Package,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface DashboardStats {
  totalDownloads: number;
  activeProjects: number;
  supportTickets: number;
  lastLogin: string;
}

interface RecentActivity {
  id: string;
  type: "download" | "support" | "meeting" | "update";
  title: string;
  description: string;
  timestamp: string;
  status?: "completed" | "pending" | "in-progress";
}

export default function PartnerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalDownloads: 0,
    activeProjects: 0,
    supportTickets: 0,
    lastLogin: ""
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data and stats
    const token = localStorage.getItem("partner_token");
    if (token) {
      // In production, verify token with backend
      setUser({
        email: "partner@company.com",
        company: "Enterprise Corp",
        role: "Technical Partner"
      });
      
      setStats({
        totalDownloads: 47,
        activeProjects: 3,
        supportTickets: 2,
        lastLogin: "2 hours ago"
      });

      setRecentActivity([
        {
          id: "1",
          type: "download",
          title: "Downloaded Whitepaper",
          description: "Critical Infrastructure Protection Guide",
          timestamp: "2 hours ago",
          status: "completed"
        },
        {
          id: "2",
          type: "support",
          title: "Support Ticket Created",
          description: "Integration assistance for TeraFence deployment",
          timestamp: "1 day ago",
          status: "in-progress"
        },
        {
          id: "3",
          type: "meeting",
          title: "Technical Review Meeting",
          description: "Q1 partnership review scheduled",
          timestamp: "3 days ago",
          status: "pending"
        },
        {
          id: "4",
          type: "update",
          title: "Product Update Available",
          description: "New firmware version v2.1.3 released",
          timestamp: "1 week ago",
          status: "completed"
        }
      ]);
    }
    setIsLoading(false);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("partner_token");
    window.location.href = "/partners";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/terafence.png"
                alt="Terafence"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Partner Portal</h1>
                <p className="text-slate-400 text-sm">Welcome back, {user?.company}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-500 text-white text-sm">
                  {user?.company?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Downloads</p>
                  <p className="text-3xl font-bold text-white">{stats.totalDownloads}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                <span className="text-emerald-400">+12%</span>
                <span className="text-slate-400 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold text-white">{stats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={75} className="h-2" />
                <span className="text-slate-400 text-sm mt-1">75% completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Support Tickets</p>
                  <p className="text-3xl font-bold text-white">{stats.supportTickets}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                  1 urgent
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Last Login</p>
                  <p className="text-lg font-semibold text-white">{stats.lastLogin}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-emerald-400 text-sm">🟢 Online</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="resources" className="text-slate-300 data-[state=active]:text-white">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-slate-300 data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="support" className="text-slate-300 data-[state=active]:text-white">
                  Support
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white h-12 justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resources
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-12 justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Create Support Ticket
                    </Button>
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white h-12 justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12 justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Critical Infrastructure Protection Guide", type: "PDF", size: "2.3 MB", updated: "2 days ago" },
                      { name: "TeraFence Technical Specifications", type: "PDF", size: "1.8 MB", updated: "1 week ago" },
                      { name: "Integration Best Practices", type: "PDF", size: "3.1 MB", updated: "2 weeks ago" }
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{resource.name}</p>
                            <p className="text-slate-400 text-sm">{resource.type} • {resource.size} • {resource.updated}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Resource Library</CardTitle>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Search resources..."
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">Resource library will be implemented here with search and filtering capabilities.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Partnership Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">Analytics dashboard with charts and metrics will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Support Center</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">Support ticket system and knowledge base will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      activity.type === "download" ? "bg-blue-500/20 text-blue-400" :
                      activity.type === "support" ? "bg-orange-500/20 text-orange-400" :
                      activity.type === "meeting" ? "bg-purple-500/20 text-purple-400" :
                      "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {activity.type === "download" && <Download className="w-4 h-4" />}
                      {activity.type === "support" && <MessageSquare className="w-4 h-4" />}
                      {activity.type === "meeting" && <Calendar className="w-4 h-4" />}
                      {activity.type === "update" && <Shield className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{activity.title}</p>
                      <p className="text-slate-400 text-xs">{activity.description}</p>
                      <p className="text-slate-500 text-xs mt-1">{activity.timestamp}</p>
                    </div>
                    {activity.status && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          activity.status === "completed" ? "bg-emerald-500/20 text-emerald-300" :
                          activity.status === "in-progress" ? "bg-blue-500/20 text-blue-300" :
                          "bg-orange-500/20 text-orange-300"
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Technical Documentation", icon: FileText },
                  { title: "API Reference", icon: ExternalLink },
                  { title: "Support Portal", icon: MessageSquare },
                  { title: "Partner Agreement", icon: Shield }
                ].map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <div className="flex items-center">
                      <link.icon className="w-4 h-4 mr-3" />
                      {link.title}
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}