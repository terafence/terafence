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
  // Additional properties required based on error messages
  subject: string;
  userEmail: string;
  category: string;
  subcategory: string;
  ccEmails?: string | string[]; // Modified to accept either string or string array
  // Keep any existing properties you might be using
}

export async function appendTicket(row: string[]): Promise<void> {
  // Create a ticket data object from the row
  const ticketData: TicketData = {
    id: row[0] || '',
    title: row[1] || '',
    description: row[2] || '',
    status: row[3] || '',
    priority: row[4] || '',
    createdAt: row[5] || '',
    updatedAt: row[6] || '',
    assignedTo: row[7] || '',
    createdBy: row[8] || '',
    subject: row[9] || '',
    userEmail: row[10] || '',
    category: row[11] || '',
    subcategory: row[12] || '',
    ccEmails: row[13] || '',
  };
  
  // Use fetch to call the API endpoint
  await createTicket(ticketData);
}

// Client-side implementation using fetch
export async function createTicket(ticketData: TicketData): Promise<TicketData> {
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
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Client-side implementation using fetch
export async function getAllTickets(): Promise<TicketData[]> {
  try {
    const response = await fetch('/api/tickets');
    
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    
    const result = await response.json();
    return result.tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}