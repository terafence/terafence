// src/app/support/files/[id]/[name]/route.ts
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Convert fs callbacks to promises
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; name: string } }
) {
  try {
    const fileId = params.id;
    const fileName = params.name;
    
    // Build path to file - we're looking in the uploads directory in public
    const filePath = path.join(process.cwd(), 'public', 'uploads', `${fileId}${path.extname(fileName)}`);
    
    // Check if file exists
    const fileExists = await exists(filePath);
    
    if (!fileExists) {
      return new Response('File not found', { status: 404 });
    }
    
    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream'; // default
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.doc':
      case '.docx':
        contentType = 'application/msword';
        break;
      case '.xls':
      case '.xlsx':
        contentType = 'application/vnd.ms-excel';
        break;
      case '.log':
        contentType = 'text/plain';
        break;
    }
    
    // Return file with appropriate content type
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('Error serving file', { status: 500 });
  }
}