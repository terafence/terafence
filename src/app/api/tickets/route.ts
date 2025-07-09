// This should be in src/app/api/tickets/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = '1cRVD8ro-qYwItAcMRAhGW0Dp5DnzS5qqu4mglaySkFY';
const SHEET_NAME = 'Tickets'; // Using the correct sheet name

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

// Defined interface for ticket data
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
}

// GET handler to fetch all tickets
export async function GET() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:Z1000`,
    });

    const values = res.data.values || [];
    
    // Convert the raw data to ticket objects
    const tickets: Record<string, string>[] = [];
    if (values.length > 0) {
      const headers = values[0];
      values.slice(1).forEach(row => {
        const ticket: Record<string, string> = {};
        headers.forEach((header, index) => {
          if (index < row.length) {
            ticket[header.toLowerCase()] = row[index];
          }
        });
        tickets.push(ticket);
      });
    }
    
    return NextResponse.json({ tickets });
  } catch (error: unknown) {
    console.error('Error fetching tickets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch tickets', details: errorMessage }, { status: 500 });
  }
}

// POST handler to create a new ticket
export async function POST(request: Request) {
  try {
    const ticketData = await request.json();
    
    const row = [
      ticketData.id,
      ticketData.title,
      ticketData.description,
      ticketData.status,
      ticketData.priority,
      ticketData.createdAt,
      ticketData.updatedAt,
      ticketData.assignedTo || '',
      ticketData.createdBy,
      ticketData.subject,
      ticketData.userEmail,
      ticketData.category,
      ticketData.subcategory,
      // Handle ccEmails based on its type
      typeof ticketData.ccEmails === 'string' 
        ? ticketData.ccEmails 
        : (ticketData.ccEmails ? JSON.stringify(ticketData.ccEmails) : ''),
    ];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
    
    return NextResponse.json({ success: true, ticket: ticketData });
  } catch (error: unknown) {
    console.error('Error creating ticket:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create ticket', details: errorMessage }, { status: 500 });
  }
}