import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

// Base directory for resources
const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

// POST handler - Create a new folder
export async function POST(request: NextRequest) {
  try {
    const { path: folderPath, name } = await request.json();
    
    // Validate inputs
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }
    
    // Sanitize folder name (remove characters that are invalid for file names)
    const sanitizedName = name.trim().replace(/[\\/:*?"<>|]/g, "_");
    
    // Normalize the path
    let normalizedPath = folderPath || "/";
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/${normalizedPath}`;
    }
    
    // Convert relative path to absolute
    const parentDir = path.join(RESOURCES_DIR, ...normalizedPath.split("/").filter(Boolean));
    const absolutePath = path.join(parentDir, sanitizedName);
    
    // Check if the parent directory exists
    if (!fs.existsSync(parentDir)) {
      return NextResponse.json(
        { error: "Parent directory not found" },
        { status: 404 }
      );
    }
    
    // Check if the folder already exists
    if (fs.existsSync(absolutePath)) {
      return NextResponse.json(
        { error: "A folder with this name already exists" },
        { status: 409 }
      );
    }
    
    // Create the folder
    await fsPromises.mkdir(absolutePath);
    
    return NextResponse.json({
      message: "Folder created successfully",
      path: path.join(normalizedPath, sanitizedName).replace(/\\/g, "/"),
    });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}