/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/support/dashboard/ticket/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { IconArrowBack, IconClock, IconEdit, IconMail } from '@tabler/icons-react';
import Link from 'next/link';

// Moving server-side code to a separate API route
// These functions will be called from our component via API

export type TicketData = {
  id: string
  name: string
  email: string
  subject: string
  description: string
  userEmail: string
  category: string
  subcategory: string
  status: string
  createdAt: string
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        if (!params.id || params.id === 'undefined') {
          throw new Error('Invalid ticket ID');
        }

        // Use API route to get ticket
        const response = await fetch(`/api/tickets/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch ticket');
        }
        
        const data = await response.json();
        setTicket(data.ticket);
        
        // Also fetch comments
        const commentsResponse = await fetch(`/api/tickets/${params.id}/comments`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching ticket:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (!ticket?.id) return;
      
      const response = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // Update local state
      setTicket(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Ticket</h2>
          <p className="text-gray-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/support/dashboard')}
          >
            <IconArrowBack className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-amber-500 text-5xl mb-4">?</div>
          <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
          <p className="text-gray-600">The requested ticket could not be found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/support/dashboard')}
          >
            <IconArrowBack className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/support/dashboard">
          <Button variant="outline" size="sm">
            <IconArrowBack className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <Button variant="outline" size="sm">
          <IconEdit className="mr-2 h-4 w-4" />
          Edit Ticket
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">{ticket.subject}</CardTitle>
              <CardDescription>Ticket ID: {ticket.id}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
              <p className="mt-1">{ticket.name}</p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <IconMail className="h-4 w-4 mr-1" /> {ticket.email}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="text-sm text-gray-700 flex items-center mt-1">
                <IconClock className="h-4 w-4 mr-1" /> {formatDate(ticket.createdAt)}
              </p>
              
              <h3 className="text-sm font-medium text-gray-500 mt-2">Category</h3>
              <p className="mt-1">{ticket.category} &gt; {ticket.subcategory}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>
          
          {comments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Comments</h3>
                <div className="space-y-3">
                  {comments.map((comment, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <p>{comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('Open')}
                disabled={ticket.status === 'Open'}
              >
                Open
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('In Progress')}
                disabled={ticket.status === 'In Progress'}
              >
                In Progress
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('Resolved')}
                disabled={ticket.status === 'Resolved'}
              >
                Resolved
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('Closed')}
                disabled={ticket.status === 'Closed'}
              >
                Closed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}