// src/app/api/tickets/[id]/comments/route.ts
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

// GET handler to fetch ticket comments
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Comments!A2:B'
    });

    const rows = response.data.values || [];
    const comments = rows.filter(row => row[0] === ticketId).map(row => row[1]);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}