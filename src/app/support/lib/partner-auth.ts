// src/lib/partner-auth.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface PartnerUser {
  email: string;
  role: string;
  exp: number;
}

export function verifyPartnerToken(request: NextRequest): PartnerUser | null {
  try {
    // Try to get token from cookie first, then Authorization header
    let token = request.cookies.get("partner_auth_token")?.value;
    
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
    const decoded = jwt.verify(token, jwtSecret) as PartnerUser;
    
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function createPartnerAuthHeader(token: string) {
  return {
    "Authorization": `Bearer ${token}`,
  };
}