// src/app/support/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconEye,
  IconClock,
  IconCircleCheckFilled,
  IconAlertCircle,
  IconTicket
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
import { getAllTickets, TicketData } from '../lib/googleSheets';
import { checkSession } from '../lib/auth';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      
      const session = checkSession();
      if (!session.isValid || !session.email) {
        return;
      }
      
      const userTickets = await getAllTickets();
      setTickets(userTickets);
      setFilteredTickets(userTickets);
      setIsLoading(false);
    };
    
    fetchTickets();
    
    // Refresh tickets every 60 seconds
    const interval = setInterval(fetchTickets, 60000);
    
    return () => clearInterval(interval);
  }, []);

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
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        ticket =>
          ticket.id.toLowerCase().includes(query) ||
          (ticket.subject && ticket.subject.toLowerCase().includes(query)) ||
          (ticket.description && ticket.description.toLowerCase().includes(query)) ||
          (ticket.category && ticket.category.toLowerCase().includes(query)) ||
          (ticket.subcategory && ticket.subcategory.toLowerCase().includes(query))
      );
    }
    
    setFilteredTickets(result);
  }, [tickets, statusFilter, categoryFilter, searchQuery]);

  // Get unique categories from tickets for filter dropdown
  // Filter out any null or undefined values before creating the Set
  const uniqueCategories = Array.from(
    new Set(tickets.map(ticket => ticket.category).filter(Boolean))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <IconClock className="text-blue-500" />;
      case 'Closed':
        return <IconCircleCheckFilled className="text-green-500" />;
      case 'Re-opened':
        return <IconAlertCircle className="text-amber-500" />;
      default:
        return <IconClock className="text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
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

  // Helper function to safely capitalize text
  const capitalize = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Support Tickets</h1>
        <Link href="/support/dashboard/new">
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <IconSearch className="text-gray-400" />
              <Input
                placeholder="Search by ID, subject, or keyword"
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
              <IconFilter className="text-gray-400" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {capitalize(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create a new ticket to get help from our support team'}
                </p>
                {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
                  <Button className="mt-4" asChild>
                    <Link href="/support/dashboard/new">
                      <IconPlus className="mr-2 h-4 w-4" />
                      New Ticket
                    </Link>
                  </Button>
                )}
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
                                  <span className="font-mono text-sm text-gray-500">
                                    {ticket.id}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                      ticket.status
                                    )}`}
                                  >
                                    {getStatusIcon(ticket.status)}
                                    <span className="ml-1">{ticket.status}</span>
                                  </span>
                                </div>
                                <h3 className="text-lg font-medium">{ticket.subject}</h3>
                                <div className="mt-1 text-sm text-gray-500">
                                  <span className="capitalize">{ticket.category || 'Unknown'}</span> &bull;{' '}
                                  <span className="capitalize">
                                    {ticket.subcategory ? ticket.subcategory.replace('_', ' ') : 'Unknown'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                  {new Date(ticket.createdAt).toLocaleDateString()}
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/support/dashboard/ticket/${ticket.id}`}>
                                    <IconEye className="mr-2 h-4 w-4" />
                                    View
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
  );
}