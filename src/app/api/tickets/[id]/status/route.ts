// src/app/api/tickets/[id]/status/route.ts
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

// PATCH handler to update ticket status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { status } = await request.json();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Tickets!A2:K'
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const range = `Tickets!I${rowIndex + 2}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json({ error: 'Failed to update ticket status' }, { status: 500 });
  }
}