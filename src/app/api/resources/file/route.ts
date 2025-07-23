// src/app/api/resources/file/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

// Base directory for resources
const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

// GET handler - Get file details
export async function GET(request: NextRequest) {
  try {
    // Get file path from query parameters
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
    
    // Get file stats
    const stats = await fsPromises.stat(absolutePath);
    
    // Check if it's a file
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: "Path is not a file" },
        { status: 400 }
      );
    }
    
    // Get file extension
    const extension = path.extname(absolutePath).slice(1).toLowerCase();
    
    // Read file content for text-based files
    let content = null;
    const textExtensions = ["txt", "md", "csv", "json", "html", "xml", "js", "css", "ts", "jsx", "tsx"];
    
    if (textExtensions.includes(extension) && stats.size < 1024 * 1024) {  // Only for files less than 1MB
      content = await fsPromises.readFile(absolutePath, "utf-8");
    }
    
    // Return file details
    return NextResponse.json({
      name: path.basename(absolutePath),
      type: "file",
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime.toISOString(),
      extension,
      content,
    });
  } catch (error) {
    console.error("Error getting file details:", error);
    return NextResponse.json(
      { error: "Failed to get file details" },
      { status: 500 }
    );
  }
}