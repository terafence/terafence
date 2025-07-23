'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface TicketData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  createdBy: string;
  subject: string;
  userEmail: string;
  category: string;
  subcategory: string;
  ccEmails?: string | string[]; 
  companyName: string;  
}
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { IconArrowBack, IconDeviceFloppy } from '@tabler/icons-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ticketSchema = z.object({
  category: z.string().min(1, { message: 'Please select a category' }),
  subcategory: z.string().min(1, { message: 'Please select a subcategory' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  priority: z.string().default('Medium'),
  ccEmails: z.string().optional(),
  companyName: z.string().min(1, { message: 'Please enter your company name' }),
  representativeName: z.string().min(1, { message: 'Please enter your name' }),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

const categories = {
  Device: ['GUI-related', 'Hardware Failure','File Transfer Failure','Logs-related', 'Network Connectivity', 'Storage','Other'],
  Technical: ['Access Control', 'Resources', 'Documentation', 'Other'],
  Feature: ['Bug Report', 'Feature Request', 'Enhancement', 'Other'],
  Demo : ['New Requirement', 'Enable new protocol', 'Training Session', 'Other'],
};

export default function TicketForm() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCcEnabled, setIsCcEnabled] = useState(false);

  // Get user email from localStorage or a prop
  const getUserEmail = () => {
    // If running in browser
    if (typeof window !== 'undefined') {
      try {
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
          const session = JSON.parse(userSession);
          return session.email || 'user@example.com';
        }
      } catch (e) {
        console.error('Error parsing user session:', e);
      }
    }
    return 'user@company.com';
  };

  // Generate sequential ticket number
  const generateTicketNumber = () => {
    // Check localStorage for last ticket number
    if (typeof window !== 'undefined') {
      try {
        const lastTicketNumber = localStorage.getItem('lastTicketNumber');
        let nextNumber = 1;
        
        if (lastTicketNumber) {
          nextNumber = parseInt(lastTicketNumber, 10) + 1;
        }
        
        // Store the new number
        localStorage.setItem('lastTicketNumber', nextNumber.toString());
        
        // Format to 4 digits with leading zeros
        return nextNumber.toString().padStart(4, '0');
      } catch (e) {
        console.error('Error handling ticket number:', e);
      }
    }
    return '0001'; // Default if localStorage is not available
  };

  // Format current date for ID
  const getFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return { year, month, day };
  };

  // Format current time in Indian Standard Time
  const getFormattedTimestamp = () => {
    const now = new Date();
    
    // Format for Indian Standard Time (IST)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    
    const timeFormatter = new Intl.DateTimeFormat('en-US', options);
    const timeString = timeFormatter.format(now);
    
    // Get day, month, year
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    
    // Format as DD:MM:YYYY HH:MM:SS AM/PM IST
    return `${day}:${month}:${year} ${timeString} IST`;
  };

  // Generate ticket ID
  const generateTicketId = (companyName: string) => {
    const { year, month, day } = getFormattedDate();
    const ticketNumber = generateTicketNumber();
    
    // Format company name - handle spaces and special chars
    const formattedCompanyName = companyName
      .toUpperCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^A-Z0-9-]/g, ''); // Remove special characters except hyphens
    
    return `TFG-${year}-${month}-${day}-${formattedCompanyName}-${ticketNumber}`;
  };

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: '',
      subcategory: '',
      subject: '',
      description: '',
      priority: 'Medium',
      ccEmails: '',
      companyName: '',
      representativeName: '',
    },
  });

  const createTicket = async (ticketData: TicketData): Promise<TicketData> => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }
      
      const result = await response.json();
      return result.ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  };

  const onSubmit = async (values: TicketFormValues) => {
    // Get user email
    const userEmail = getUserEmail();
    
    if (!userEmail) {
      toast.error('You must be logged in to create a ticket');
      return;
    }

    try {
      // Generate ticket ID using company name
      const ticketId = generateTicketId(values.companyName);
      const timestamp = getFormattedTimestamp();
      
      // Create ticket data object with the companyName field
      const ticketData: TicketData = {
        id: ticketId,
        title: values.subject,
        subject: values.subject,
        description: values.description,
        status: 'Open',
        priority: values.priority,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: values.representativeName,
        userEmail: userEmail,
        category: values.category,
        subcategory: values.subcategory,
        ccEmails: isCcEnabled ? values.ccEmails : '',
        companyName: values.companyName,
      };

      const result = await createTicket(ticketData);
      
      if (result) {
        toast.success('Ticket created successfully');
        router.push('/support/dashboard');
      }
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      toast.error('Failed to create ticket. Please try again later.');
    }
  };

  // Watch for category changes to update subcategory options
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'category') {
        setSelectedCategory(value.category || '');
        form.setValue('subcategory', '');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card className="w-full shadow-md bg-white border-t-4 border-t-blue-500">
      <CardHeader className="bg-gray-50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-blue-700">Create Support Ticket</CardTitle>
            <CardDescription className="text-gray-600">
              Please provide details about your issue
            </CardDescription>
          </div>
          <Link href="/support/dashboard">
            <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
              <IconArrowBack className="mr-2 h-4 w-4 text-blue-500" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                    <FormLabel className="text-gray-700 font-medium">Company Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your company name" 
                        className="border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              
              {/* Representative Name */}
              <FormField
                control={form.control}
                name="representativeName"
                render={({ field }) => (
                  <FormItem className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                    <FormLabel className="text-gray-700 font-medium">Representative Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        className="border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                    <FormLabel className="text-gray-700 font-medium">Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(categories).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Subcategory */}
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                    <FormLabel className="text-gray-700 font-medium">Subcategory</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!selectedCategory}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategory && 
                          categories[selectedCategory as keyof typeof categories]?.map((subcat) => (
                            <SelectItem key={subcat} value={subcat}>
                              {subcat}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                  <FormLabel className="text-gray-700 font-medium">Subject</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Brief description of your issue" 
                      className="border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                  <FormLabel className="text-gray-700 font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed information about your issue" 
                      className="min-h-[150px] border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                    <FormLabel className="text-gray-700 font-medium">Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* CC Email toggle */}
              <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox 
                    id="cc-emails" 
                    checked={isCcEnabled}
                    onCheckedChange={(checked) => {
                      setIsCcEnabled(checked === true);
                      if (!checked) {
                        form.setValue('ccEmails', '');
                      }
                    }}
                    className="text-blue-500 border-gray-300 focus:ring-blue-200"
                  />
                  <Label htmlFor="cc-emails" className="text-gray-700 font-medium">CC additional emails</Label>
                </div>
                
                {isCcEnabled && (
                  <FormField
                    control={form.control}
                    name="ccEmails"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="email1@example.com, email2@example.com" 
                            className="border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500 text-sm">
                          Separate multiple emails with commas
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator className="my-2" />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6"
                disabled={form.formState.isSubmitting}
              >
                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}