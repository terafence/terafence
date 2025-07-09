// src/app/api/resources/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

// Base directory for resources
const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

// Create resources directory if it doesn't exist
if (!fs.existsSync(RESOURCES_DIR)) {
  fs.mkdirSync(RESOURCES_DIR, { recursive: true });
}

// Initialize the resources directory with default folders if empty
const initializeResourcesDirectory = async () => {
  // Check if directory is empty
  const contents = await fsPromises.readdir(RESOURCES_DIR);
  
  if (contents.length === 0) {
    // Create default directories
    const defaultDirs = [
      "whitepapers",
      "datasheets",
      "usecases",
      "presentations",
      "articles"
    ];
    
    for (const dir of defaultDirs) {
      const dirPath = path.join(RESOURCES_DIR, dir);
      await fsPromises.mkdir(dirPath, { recursive: true });
    }
  }
};

// Run initialization once
initializeResourcesDirectory().catch(console.error);

// GET handler - List files and folders
export async function GET(request: NextRequest) {
  try {
    // Get the requested path from query parameters
    const { searchParams } = new URL(request.url);
    let requestedPath = searchParams.get("path") || "/";
    
    // Normalize the path
    if (!requestedPath.startsWith("/")) {
      requestedPath = `/${requestedPath}`;
    }
    
    // Convert relative path to absolute
    const absolutePath = path.join(RESOURCES_DIR, ...requestedPath.split("/").filter(Boolean));
    
    // Check if the path exists
    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json(
        { error: "Path not found" },
        { status: 404 }
      );
    }
    
    // Get files and directories
    const entries = await fsPromises.readdir(absolutePath, { withFileTypes: true });
    
    // Format the response
    const items = await Promise.all(entries.map(async (entry) => {
      const entryPath = path.join(absolutePath, entry.name);
      const stats = await fsPromises.stat(entryPath);
      
      // Get relative path for client
      const relativePath = path.join(
        requestedPath === "/" ? "" : requestedPath, 
        entry.name
      ).replace(/\\/g, "/");
      
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          type: "folder",
          path: relativePath,
          lastModified: stats.mtime.toISOString(),
        };
      } else {
        // Get file extension
        const extension = path.extname(entry.name).slice(1);
        
        return {
          name: entry.name,
          type: "file",
          path: relativePath,
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          extension,
        };
      }
    }));
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error listing resources:", error);
    return NextResponse.json(
      { error: "Failed to list resources" },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete file or folder
export async function DELETE(request: NextRequest) {
  try {
    const { path: itemPath, type } = await request.json();
    
    // Convert relative path to absolute
    const absolutePath = path.join(RESOURCES_DIR, ...itemPath.split("/").filter(Boolean));
    
    // Check if the path exists
    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json(
        { error: "Path not found" },
        { status: 404 }
      );
    }
    
    if (type === "folder") {
      // Delete folder recursively
      await fsPromises.rm(absolutePath, { recursive: true });
    } else {
      // Delete file
      await fsPromises.unlink(absolutePath);
    }
    
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}