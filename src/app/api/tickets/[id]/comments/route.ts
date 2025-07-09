import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

type RouteParams = {
  params: {
    id: string
  }
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SHEET_ID = process.env.GOOGLE_SHEET_ID!

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  SCOPES
)

const sheets = google.sheets({ version: 'v4', auth })

export async function GET(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const ticketId = context.params.id

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Comments!A2:B',
    })

    const rows = response.data.values || []
    const comments = rows
      .filter(row => row[0] === ticketId)
      .map(row => row[1])

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
