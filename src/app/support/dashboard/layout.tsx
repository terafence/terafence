'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  IconTicket, 
  IconPlus, 
  IconLogout, 
  IconUser, 
  IconSettings,
  IconMenu2,
  IconX
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { checkSession, logoutUser } from '../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import SessionProvider from '../components/SessionProvider';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const session = checkSession();
    if (!session.isValid) {
      router.push('/support/session-expired');
      return;
    }

    setUserName(session.email || '');
    setIsAdmin(session.isAdmin || false);
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/support');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IconTicket className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Terafence Support</h1>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMobileMenu}
              className="p-1"
            >
              {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </Button>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{userName}</span>
              {isAdmin && <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Admin</span>}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <IconLogout className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-200"
            >
              <nav className="flex flex-col p-4 space-y-2">
                <NavItem 
                  href="/support/dashboard" 
                  icon={<IconTicket size={18} />} 
                  label="My Tickets" 
                  isActive={pathname === '/support/dashboard'} 
                />
                <NavItem 
                  href="/support/dashboard/new" 
                  icon={<IconPlus size={18} />} 
                  label="New Ticket" 
                  isActive={pathname === '/support/dashboard/new'} 
                />
                {isAdmin && (
                  <NavItem 
                    href="/support/dashboard/admin" 
                    icon={<IconSettings size={18} />} 
                    label="Admin Panel" 
                    isActive={pathname === '/support/dashboard/admin'} 
                  />
                )}
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    <IconUser size={16} className="inline mr-2" />
                    <span className="font-medium">{userName}</span>
                    {isAdmin && <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Admin</span>}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    <IconLogout className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <div className="flex flex-1">
          {/* Sidebar - desktop only */}
          <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
            <nav className="flex flex-col space-y-2">
              <NavItem 
                href="/support/dashboard" 
                icon={<IconTicket size={18} />} 
                label="My Tickets" 
                isActive={pathname === '/support/dashboard'} 
              />
              <NavItem 
                href="/support/dashboard/new" 
                icon={<IconPlus size={18} />} 
                label="New Ticket" 
                isActive={pathname === '/support/dashboard/new'} 
              />
              {isAdmin && (
                <NavItem 
                  href="/support/dashboard/admin" 
                  icon={<IconSettings size={18} />} 
                  label="Admin Panel" 
                  isActive={pathname === '/support/dashboard/admin'} 
                />
              )}
            </nav>
          </div>
          
          {/* Content area */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}