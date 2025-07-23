/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/resources/tabs/InsightsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  BarChart2, Calendar, ArrowUp, ArrowDown, 
  Users, Clock, Download, Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User } from "@/hooks/useAuth";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { JSX } from "react/jsx-runtime";

interface InsightsTabProps {
  resourcePath: string;
  user: User;
}

interface ViewsData {
  date: string;
  views: number;
}

interface DownloadsData {
  date: string;
  downloads: number;
}

interface UserTypeData {
  name: string;
  value: number;
}

interface DeviceData {
  name: string;
  value: number;
}

export default function InsightsTab({  }: InsightsTabProps): JSX.Element {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [viewsData, setViewsData] = useState<ViewsData[]>([]);
  const [downloadsData, setDownloadsData] = useState<DownloadsData[]>([]);
  const [userTypeData, setUserTypeData] = useState<UserTypeData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [viewsChange, setViewsChange] = useState(0);
  const [downloadsChange, setDownloadsChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Generate sample data based on timeRange
  useEffect(() => {
    setIsLoading(true);
    
    // In a real implementation, this would be an API call
    setTimeout(() => {
      // Generate dates based on time range
      const dates: string[] = [];
      const now = new Date();
      
      if (timeRange === "week") {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          dates.push(date.toISOString().split("T")[0]);
        }
      } else if (timeRange === "month") {
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          dates.push(date.toISOString().split("T")[0]);
        }
      } else {
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(now.getMonth() - i);
          dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
        }
      }
      
      // Generate sample views data
      const views = dates.map(date => {
        // Add some randomness to make it look realistic
        // Base value plus random component
        const baseValue = Math.floor(Math.random() * 10) + 5;
        const randomComponent = Math.floor(Math.random() * 15);
        return {
          date,
          views: baseValue + randomComponent
        };
      });
      
      // Generate sample downloads data (fewer than views)
      const downloads = dates.map(date => {
        const baseValue = Math.floor(Math.random() * 5) + 1;
        const randomComponent = Math.floor(Math.random() * 5);
        return {
          date,
          downloads: baseValue + randomComponent
        };
      });
      
      // Calculate totals
      const totalViewsCount = views.reduce((sum, item) => sum + item.views, 0);
      const totalDownloadsCount = downloads.reduce((sum, item) => sum + item.downloads, 0);
      
      // Calculate percentage changes (comparing first half to second half)
      const halfIndex = Math.floor(views.length / 2);
      const firstHalfViews = views.slice(0, halfIndex).reduce((sum, item) => sum + item.views, 0);
      const secondHalfViews = views.slice(halfIndex).reduce((sum, item) => sum + item.views, 0);
      const viewsChangePercent = firstHalfViews > 0 
        ? ((secondHalfViews - firstHalfViews) / firstHalfViews) * 100 
        : 0;
      
      const firstHalfDownloads = downloads.slice(0, halfIndex).reduce((sum, item) => sum + item.downloads, 0);
      const secondHalfDownloads = downloads.slice(halfIndex).reduce((sum, item) => sum + item.downloads, 0);
      const downloadsChangePercent = firstHalfDownloads > 0 
        ? ((secondHalfDownloads - firstHalfDownloads) / firstHalfDownloads) * 100 
        : 0;
      
      // Sample user type data
      const userTypes = [
        { name: "Admin", value: 15 },
        { name: "Regular User", value: 65 },
        { name: "Guest", value: 20 }
      ];
      
      // Sample device data
      const devices = [
        { name: "Desktop", value: 60 },
        { name: "Mobile", value: 25 },
        { name: "Tablet", value: 15 }
      ];
      
      setViewsData(views);
      setDownloadsData(downloads);
      setUserTypeData(userTypes);
      setDeviceData(devices);
      setTotalViews(totalViewsCount);
      setTotalDownloads(totalDownloadsCount);
      setViewsChange(viewsChangePercent);
      setDownloadsChange(downloadsChangePercent);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  // Format date label based on time range
  const formatDateLabel = (date: string) => {
    if (timeRange === "year") {
      // Format YYYY-MM to MMM
      const [, month] = date.split("-");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return monthNames[parseInt(month) - 1];
    }
    
    // For week and month, format YYYY-MM-DD to DD MMM
    const [, month, day] = date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${monthNames[parseInt(month) - 1]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          <BarChart2 className="mr-2 inline-block h-5 w-5" />
          Document Insights
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={timeRange === "week" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button 
            variant={timeRange === "month" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button 
            variant={timeRange === "year" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeRange("year")}
          >
            Year
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Loading insights...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Key metrics summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500">Total Views</h4>
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{totalViews}</span>
                <span className={`ml-2 flex items-center text-xs font-medium ${viewsChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {viewsChange >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(viewsChange).toFixed(1)}%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Compared to previous {timeRange}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500">Total Downloads</h4>
                <Download className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{totalDownloads}</span>
                <span className={`ml-2 flex items-center text-xs font-medium ${downloadsChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {downloadsChange >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(downloadsChange).toFixed(1)}%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Compared to previous {timeRange}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500">Download Rate</h4>
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">
                  {totalViews > 0 ? `${((totalDownloads / totalViews) * 100).toFixed(1)}%` : "0%"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Downloads as % of views
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500">Avg. Daily Views</h4>
                <Users className="h-4 w-4 text-orange-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">
                  {(totalViews / viewsData.length).toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Per day over {timeRange}
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            {/* Views and Downloads Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h4 className="mb-4 text-lg font-medium">Views & Downloads</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={viewsData.map((item, index) => ({
                      date: item.date,
                      views: item.views,
                      downloads: downloadsData[index]?.downloads || 0,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDateLabel}
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `${value}`, 
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                      labelFormatter={(label) => formatDateLabel(label as string)}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="downloads" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* User Types and Device Distribution Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h4 className="mb-4 text-lg font-medium">User Types</h4>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: string, props: any) => [
                          `${value} (${(props.payload.percent * 100).toFixed(0)}%)`, 
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h4 className="mb-4 text-lg font-medium">Device Distribution</h4>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={deviceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: any) => [`${value} views`, "Count"]}
                      />
                      <Bar dataKey="value" fill="#8884d8">
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Activity Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <h4 className="mb-4 text-lg font-medium">Activity Summary</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium">Highest Traffic Day</h5>
                    <p className="text-xs text-gray-500">
                      {(() => {
                        const maxViewsIndex = viewsData.reduce(
                          (maxIndex, item, currentIndex, array) => 
                            item.views > array[maxIndex].views ? currentIndex : maxIndex,
                          0
                        );
                        return formatDateLabel(viewsData[maxViewsIndex].date);
                      })()}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold">
                  {(() => {
                    const maxViews = Math.max(...viewsData.map(item => item.views));
                    return maxViews;
                  })()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium">Most Downloaded On</h5>
                    <p className="text-xs text-gray-500">
                      {(() => {
                        const maxDownloadsIndex = downloadsData.reduce(
                          (maxIndex, item, currentIndex, array) => 
                            item.downloads > array[maxIndex].downloads ? currentIndex : maxIndex,
                          0
                        );
                        return formatDateLabel(downloadsData[maxDownloadsIndex].date);
                      })()}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold">
                  {(() => {
                    const maxDownloads = Math.max(...downloadsData.map(item => item.downloads));
                    return maxDownloads;
                  })()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium">Average Session Duration</h5>
                    <p className="text-xs text-gray-500">Time spent viewing this document</p>
                  </div>
                </div>
                <span className="text-lg font-bold">3m 42s</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}