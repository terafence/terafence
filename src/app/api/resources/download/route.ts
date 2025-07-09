import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

// Base directory for resources
const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

// GET handler - Download a file
export async function GET(request: NextRequest) {
  try {
    // Get the file path from query parameters
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");
    
    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }
    
    // Convert relative path to absolute
    const absolutePath = path.join(RESOURCES_DIR, ...filePath.split("/").filter(Boolean));
    
    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    // Check if it's a file
    const stats = await fsPromises.stat(absolutePath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: "Path is not a file" },
        { status: 400 }
      );
    }
    
    // Read the file
    const fileBuffer = await fsPromises.readFile(absolutePath);
    
    // Get file name
    const fileName = path.basename(absolutePath);
    
    // Get MIME type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = "application/octet-stream"; // Default
    
    // Set content type based on file extension
    switch (ext) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".txt":
        contentType = "text/plain";
        break;
      case ".html":
        contentType = "text/html";
        break;
      case ".csv":
        contentType = "text/csv";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".xml":
        contentType = "application/xml";
        break;
      case ".doc":
      case ".docx":
        contentType = "application/msword";
        break;
      case ".xls":
      case ".xlsx":
        contentType = "application/vnd.ms-excel";
        break;
      case ".ppt":
      case ".pptx":
        contentType = "application/vnd.ms-powerpoint";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }
    
    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": stats.size.toString(),
      },
    });
    
    // Log this download (in production, you'd store this in a database)
    console.log(`File downloaded: ${filePath}`);
    
    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}