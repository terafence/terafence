// src/app/api/tickets/[id]/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Load environment variables
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

// Auth setup
const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

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

// GET handler to fetch a ticket by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Tickets!A2:K'
    });

    const rows = response.data.values || [];
    let ticket = null;
    
    for (const row of rows) {
      if (row[0] === id) {
        ticket = {
          id: row[0],
          name: row[1],
          email: row[2],
          subject: row[3],
          description: row[4],
          userEmail: row[5],
          category: row[6],
          subcategory: row[7],
          status: row[8],
          createdAt: row[9]
        };
        break;
      }
    }

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}