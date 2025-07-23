/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/sheets/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = '1cRVD8ro-qYwItAcMRAhGW0Dp5DnzS5qqu4mglaySkFY';
const SHEET_NAME = 'Tickets';

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

// Helper function to append data to the sheet
async function appendToSheet(row: string[]) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
}

// GET handler to fetch all tickets
export async function GET() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:Z1000`,
    });

    const values = res.data.values || [];
    
    let tickets = [];
    if (values.length > 0) {
      const headers = values[0];
      tickets = values.slice(1).map(row => {
        const ticket: any = {};
        headers.forEach((header, index) => {
          if (index < row.length) {
            ticket[header.toLowerCase()] = row[index];
          }
        });
        return ticket;
      });
    }
    
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
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
      typeof ticketData.ccEmails === 'string' 
        ? ticketData.ccEmails 
        : (ticketData.ccEmails ? JSON.stringify(ticketData.ccEmails) : ''),
    ];
    
    await appendToSheet(row);
    
    return NextResponse.json({ success: true, ticket: ticketData });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}