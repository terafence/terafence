// src/app/partners/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Download,
  Search,
  Filter,
  MoreVertical,
  Crown,
  Activity,
  UserCheck,
  AlertTriangle,
  CheckCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
  status: 'active' | 'inactive' | 'pending';
  company?: string;
  joinDate: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  pendingApprovals: number;
  monthlyGrowth: number;
  securityAlerts: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 4,
    pendingApprovals: 0,
    monthlyGrowth: 0,
    securityAlerts: 0
  });

  useEffect(() => {
    // Mock data - replace with Firebase queries
    setUsers([
      {
        id: '1',
        email: 'chandra@terafence.in',
        role: 'admin',
        lastLogin: '2 hours ago',
        status: 'active',
        company: 'TeraFence',
        joinDate: '2024-01-15'
      },
      {
        id: '2',
        email: 'jose@terafence.in',
        role: 'admin',
        lastLogin: '1 day ago',
        status: 'active',
        company: 'TeraFence',
        joinDate: '2024-01-15'
      },
      {
        id: '3',
        email: 'partner@enterprise.com',
        role: 'user',
        lastLogin: '5 hours ago',
        status: 'active',
        company: 'Enterprise Corp',
        joinDate: '2024-03-20'
      }
    ]);

    setStats({
      totalUsers: 147,
      activeUsers: 132,
      totalAdmins: 4,
      pendingApprovals: 3,
      monthlyGrowth: 18.5,
      securityAlerts: 0
    });
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSignOut = () => {
    localStorage.removeItem("partner_token");
    document.cookie = "partner_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/partners";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-pink-500/5 to-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Premium Header */}
        <motion.header 
          className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur-lg opacity-50" />
                    <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl p-2 rounded-xl border border-yellow-400/30">
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-slate-400 text-xs">System Administration Portal</p>
                  </div>
                </div>
                
                {/* Admin Navigation */}
                <nav className="hidden md:flex items-center space-x-1 bg-white/5 backdrop-blur-xl rounded-full p-1 border border-white/10">
                  {["overview", "users", "analytics", "settings"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-white/10 relative"
                >
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <AlertTriangle className="w-5 h-5" />
                </Button>
                
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                
                <Button
                  onClick={handleSignOut}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
              System Administration
            </h2>
            <p className="text-slate-400">
              Manage partner access, monitor security, and oversee system operations.
            </p>
          </motion.div>

          {/* Admin Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              { 
                title: "Total Users", 
                value: stats.totalUsers.toString(), 
                change: `+${stats.monthlyGrowth}%`, 
                color: "from-blue-500 to-cyan-500", 
                icon: Users,
                trend: "up"
              },
              { 
                title: "Active Users", 
                value: stats.activeUsers.toString(), 
                change: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%`, 
                color: "from-emerald-500 to-green-500", 
                icon: UserCheck,
                trend: "up"
              },
              { 
                title: "Admin Users", 
                value: stats.totalAdmins.toString(), 
                change: "4 active", 
                color: "from-yellow-500 to-orange-500", 
                icon: Crown,
                trend: "neutral"
              },
              { 
                title: "Security Alerts", 
                value: stats.securityAlerts.toString(), 
                change: "All clear", 
                color: "from-green-500 to-emerald-500", 
                icon: Shield,
                trend: "up"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 
                      stat.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { action: "New user registered", user: "partner@enterprise.com", time: "2 hours ago", type: "user" },
                      { action: "Admin login", user: "chandra@terafence.in", time: "3 hours ago", type: "admin" },
                      { action: "Resource downloaded", user: "client@company.com", time: "5 hours ago", type: "download" },
                      { action: "Support ticket created", user: "help@startup.com", time: "1 day ago", type: "support" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'admin' ? 'bg-yellow-400' :
                          activity.type === 'user' ? 'bg-blue-400' :
                          activity.type === 'download' ? 'bg-emerald-400' :
                          'bg-purple-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{activity.action}</p>
                          <p className="text-slate-400 text-xs">{activity.user} • {activity.time}</p>
                        </div>
                        <Badge variant={activity.type === 'admin' ? 'default' : 'secondary'}>
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-purple-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "Export User Data", icon: Download, color: "from-blue-500 to-cyan-500" },
                      { title: "Send Broadcast", icon: Users, color: "from-purple-500 to-pink-500" },
                      { title: "Security Scan", icon: Shield, color: "from-emerald-500 to-green-500" },
                      { title: "System Backup", icon: CheckCircle, color: "from-orange-500 to-red-500" }
                    ].map((action, index) => (
                      <Button
                        key={index}
                        className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                        variant="ghost"
                      >
                        <action.icon className="w-4 h-4 mr-3" />
                        {action.title}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* User Management */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-400" />
                      User Management
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <Button size="sm" variant="outline" className="border-white/20 text-white">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === 'admin' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}>
                            {user.role === 'admin' ? <Crown className="w-5 h-5 text-white" /> : <Users className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.email}</p>
                            <p className="text-slate-400 text-sm">{user.company} • Last seen {user.lastLogin}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">Advanced analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-400" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">System configuration options coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}