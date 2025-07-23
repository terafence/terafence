'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  IconSearch,
  IconFilter,
  IconEye,
  IconUserCircle,
  IconCalendar,
  IconTag,
  IconTicket,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getAllTickets, TicketData } from '../../lib/googleSheets';
import { checkSession } from '../../lib/auth';
import SessionProvider from '../../components/SessionProvider';

export default function AdminPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const session = checkSession();
    if (!session.isValid) {
      router.push('/support/session-expired');
      return;
    }

    // Ensure the user is an admin
    if (!session.isAdmin) {
      router.push('/support/dashboard');
      return;
    }

    fetchAllTickets();

    // Refresh tickets every 30 seconds
    const interval = setInterval(fetchAllTickets, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchAllTickets = async () => {
    setIsLoading(true);
    try {
      // Admin view: fetch all tickets regardless of user
      const allTickets = await getAllTickets();
      setTickets(allTickets);
      setFilteredTickets(allTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters and search
    let result = [...tickets];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(ticket => ticket.category === categoryFilter);
    }
    
    // Apply user filter
    if (userFilter !== 'all') {
      result = result.filter(ticket => ticket.userEmail === userFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        ticket =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.userEmail.toLowerCase().includes(query) ||
          ticket.category.toLowerCase().includes(query) ||
          ticket.subcategory.toLowerCase().includes(query)
      );
    }
    
    setFilteredTickets(result);
  }, [tickets, statusFilter, categoryFilter, userFilter, searchQuery]);

  // Get unique categories and users from tickets for filter dropdowns
  const uniqueCategories = Array.from(
    new Set(tickets.map(ticket => ticket.category))
  );
  
  const uniqueUsers = Array.from(
    new Set(tickets.map(ticket => ticket.userEmail))
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700';
      case 'Closed':
        return 'bg-green-100 text-green-700';
      case 'Re-opened':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Ticket counts by status
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const closedCount = tickets.filter(t => t.status === 'Closed').length;
  const reopenedCount = tickets.filter(t => t.status === 'Re-opened').length;

  return (
    <SessionProvider requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Tickets</p>
                  <h2 className="text-3xl font-bold">{tickets.length}</h2>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <IconTicket className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Open</p>
                  <h2 className="text-3xl font-bold">{openCount}</h2>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <IconTicket className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Closed</p>
                  <h2 className="text-3xl font-bold">{closedCount}</h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <IconTicket className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Re-opened</p>
                  <h2 className="text-3xl font-bold">{reopenedCount}</h2>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <IconTicket className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <IconSearch className="text-gray-400" />
                <Input
                  placeholder="Search by ID, subject, or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <IconFilter className="text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Re-opened">Re-opened</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <IconTag className="text-gray-400" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <IconUserCircle className="text-gray-400" />
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="Open">Open</TabsTrigger>
            <TabsTrigger value="Closed">Closed</TabsTrigger>
            <TabsTrigger value="Re-opened">Re-opened</TabsTrigger>
          </TabsList>
          
          {['all', 'Open', 'Closed', 'Re-opened'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <IconTicket className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="text-lg font-medium">No tickets found</h3>
                  <p className="mt-2">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTickets
                    .filter(ticket => tabValue === 'all' || ticket.status === tabValue)
                    .map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="hover:border-blue-200 transition-colors">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="font-mono text-xs">
                                      {ticket.id}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={`${getStatusBadgeClass(ticket.status)} border-none text-xs`}
                                    >
                                      {ticket.status}
                                    </Badge>
                                  </div>
                                  <h3 className="text-lg font-medium">{ticket.subject}</h3>
                                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <IconUserCircle size={14} />
                                      <span>{ticket.userEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <IconTag size={14} />
                                      <span className="capitalize">{ticket.category}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <IconCalendar size={14} />
                                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/support/dashboard/ticket/${ticket.id}`}>
                                      <IconEye className="mr-2 h-4 w-4" />
                                      View & Manage
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SessionProvider>
  );
}