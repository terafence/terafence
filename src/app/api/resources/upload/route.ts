/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/resources/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fsPromises } from "fs";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Base directory for resources
const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

// Helper function to ensure directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await fsPromises.access(dirPath);
  } catch (error) {
    await fsPromises.mkdir(dirPath, { recursive: true });
  }
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  
  return Buffer.concat(chunks);
}

// POST handler for file uploads
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const path_param = formData.get("path") as string || "/";
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Normalize the path
    let normalizedPath = path_param;
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/${normalizedPath}`;
    }

    // Get the target directory
    const targetDir = path.join(RESOURCES_DIR, ...normalizedPath.split("/").filter(Boolean));
    
    // Ensure the target directory exists
    await ensureDirectoryExists(targetDir);

    // Process each file
    const results = await Promise.all(
      files.map(async (fileData: FormDataEntryValue) => {
        const file = fileData as File;
        const fileName = file.name;
        const filePath = path.join(targetDir, fileName);

        // Check if file already exists
        const fileExists = fs.existsSync(filePath);
        let finalPath = filePath;
        
        // If file exists, create a unique name by adding a timestamp
        if (fileExists) {
          const extension = path.extname(fileName);
          const nameWithoutExt = path.basename(fileName, extension);
          const timestamp = new Date().getTime();
          const newFileName = `${nameWithoutExt}_${timestamp}${extension}`;
          finalPath = path.join(targetDir, newFileName);
        }

        // Convert file to buffer and write to filesystem
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fsPromises.writeFile(finalPath, buffer);

        // Return info about the uploaded file
        return {
          originalName: fileName,
          savedName: path.basename(finalPath),
          path: finalPath.replace(RESOURCES_DIR, "").replace(/\\/g, "/"),
          size: buffer.length,
          type: file.type || "application/octet-stream",
        };
      })
    );

    return NextResponse.json({
      message: `${files.length} file(s) uploaded successfully`,
      files: results,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

// Set larger body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};