// src/components/resources/ResourcesSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Settings,
  Clock,
  LogOut,
  FileText,
  Users,
  ChevronRight,
  ChevronDown,
  Home,
  BarChart2,
  AlertTriangle,
  Download,
  Tags,
  Database,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@/hooks/useAuth";

interface ResourcesSidebarProps {
  user: User;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  admin?: boolean;
  children?: SidebarItem[];
}

export default function ResourcesSidebar({ user }: ResourcesSidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Define sidebar items
  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      path: "/resources",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Document Types",
      path: "#",
      icon: <FileText className="h-5 w-5" />,
      children: [
        {
          name: "Whitepapers",
          path: "/resources?path=/whitepapers/",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          name: "Datasheets",
          path: "/resources?path=/datasheets/",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          name: "Use Cases",
          path: "/resources?path=/usecases/",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          name: "Presentations",
          path: "/resources?path=/presentations/",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          name: "Articles",
          path: "/resources?path=/articles/",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      name: "Starred",
      path: "/resources?tab=starred",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Recent",
      path: "/resources?tab=recent",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Tags",
      path: "/resources/tags",
      icon: <Tags className="h-5 w-5" />,
    },
    {
      name: "Download Requests",
      path: "/resources/download-requests",
      icon: <Download className="h-5 w-5" />,
    },
    {
      name: "Issue Reports",
      path: "/resources/issues",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      path: "/resources/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "User Management",
      path: "/resources/users",
      icon: <Users className="h-5 w-5" />,
      admin: true,
    },
    {
      name: "Access Logs",
      path: "/resources/logs",
      icon: <Database className="h-5 w-5" />,
      admin: true,
    },
    {
      name: "Settings",
      path: "/resources/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Toggle item expansion
  const toggleItemExpansion = (name: string) => {
    setExpandedItems((prevItems) =>
      prevItems.includes(name)
        ? prevItems.filter((item) => item !== name)
        : [...prevItems, name]
    );
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 70 : 240 }}
      className={`relative flex h-screen flex-col border-r bg-white`}
    >
      {/* Toggle button */}
      <button
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm"
        onClick={toggleSidebar}
      >
        <ChevronRight
          className={`h-4 w-4 text-gray-500 transition-transform ${
            collapsed ? "" : "rotate-180"
          }`}
        />
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/resources" className="flex items-center">
          {!collapsed && (
            <span className="ml-2 font-semibold text-gray-900">
              <Image
                src="/images/terafence.png"
                alt="Terafence Logo"
                width={120}
                height={30}
                priority
              />
            </span>
          )}
        </Link>
      </div>

      {/* Sidebar menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            // Skip admin items for non-admin users
            if (item.admin && !user.isAdmin) {
              return null;
            }

            const isExpanded = expandedItems.includes(item.name);

            return (
              <div key={item.name}>
                {item.children ? (
                  // Item with dropdown
                  <div>
                    <button
                      className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                      onClick={() => toggleItemExpansion(item.name)}
                    >
                      <span className="mr-3 text-gray-500">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Dropdown items */}
                    {!collapsed && isExpanded && (
                      <div className="mt-1 space-y-1 pl-6">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.path}
                            className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                          >
                            <span className="mr-3 text-gray-500">
                              {child.icon}
                            </span>
                            {!collapsed && (
                              <span className="flex-1">{child.name}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : // Regular item
                collapsed ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.path}
                          className="flex items-center justify-center rounded-md px-2 py-2 text-gray-600 hover:bg-gray-100"
                        >
                          <span className="text-gray-500">{item.icon}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Link
                    href={item.path}
                    className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User profile */}
      <div className="border-t p-4">
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                {user.name} ({user.email})
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 rounded-full p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
