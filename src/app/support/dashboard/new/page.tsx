/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../components/SessionProvider';

// Use type assertion to fix the TypeScript error
const TicketForm = dynamic(
  () => import('../../components/TicketForm') as any, 
  {
    ssr: false, 
    loading: () => <div className="p-4 rounded border border-gray-200">Loading form...</div>
  }
);

export default function NewTicketPage() {
  return (
    <SessionProvider requireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Ticket</h1>
        <p className="text-gray-600">
          Please provide detailed information about your issue to help us assist you better.
        </p>
        <Suspense fallback={<div className="p-4 rounded border border-gray-200">Loading ticket form...</div>}>
          <TicketForm />
        </Suspense>
      </div>
    </SessionProvider>
  );
}