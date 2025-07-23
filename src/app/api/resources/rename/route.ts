import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

// Base directory for resources
const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

// PATCH handler - Rename a file or folder
export async function PATCH(request: NextRequest) {
  try {
    const { path: itemPath, newName, type } = await request.json();
    
    // Validate inputs
    if (!newName || !newName.trim()) {
      return NextResponse.json(
        { error: "New name is required" },
        { status: 400 }
      );
    }
    
    // Sanitize new name (remove characters that are invalid for file names)
    const sanitizedName = newName.trim().replace(/[\\/:*?"<>|]/g, "_");
    
    // Convert relative path to absolute
    const absolutePath = path.join(RESOURCES_DIR, ...itemPath.split("/").filter(Boolean));
    
    // Check if the item exists
    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    
    // Get the parent directory
    const parentDir = path.dirname(absolutePath);
    
    // Get new path
    const newPath = path.join(parentDir, sanitizedName);
    
    // Check if a file/folder with the new name already exists
    if (fs.existsSync(newPath)) {
      return NextResponse.json(
        { error: `A ${type} with this name already exists` },
        { status: 409 }
      );
    }
    
    // Rename the file/folder
    await fsPromises.rename(absolutePath, newPath);
    
    // Calculate the new relative path for the client
    const oldParts = itemPath.split("/");
    const newParts = [...oldParts.slice(0, -1), sanitizedName];
    const newRelativePath = newParts.join("/");
    
    return NextResponse.json({
      message: `${type === "folder" ? "Folder" : "File"} renamed successfully`,
      path: newRelativePath,
    });
  } catch (error) {
    console.error("Error renaming item:", error);
    return NextResponse.json(
      { error: "Failed to rename item" },
      { status: 500 }
    );
  }
}