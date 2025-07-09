// src/hooks/useAuth.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user type
export interface User {
  email: string;
  isAdmin: boolean;
  name: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; message: string; sessionId?: string }>;
  verifyOtp: (email: string, otp: string, sessionId: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// List of admin emails
const ADMIN_EMAILS = [
  "yash@terafence.in",
  "jose@terafence.in",
  "chandra@terafence.in",
  "dinesh@terafence.in",
];

// Valid domain
const VALID_DOMAIN = "@terafence.in";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - Sends OTP to email
  const login = async (email: string): Promise<{ success: boolean; message: string; sessionId?: string }> => {
    // Validate email domain
    if (!email.endsWith(VALID_DOMAIN)) {
      return { 
        success: false, 
        message: "Only @terafence.in email addresses are allowed" 
      };
    }

    try {
      // In a real implementation, this would call your API endpoint
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      return { 
        success: true, 
        message: "OTP sent to your email",
        sessionId: data.sessionId
      };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to send OTP" 
      };
    }
  };

  // Verify OTP
  const verifyOtp = async (
    email: string, 
    otp: string,
    sessionId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // In a real implementation, this would call your API endpoint
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, sessionId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      // If successful, set user
      const isAdmin = ADMIN_EMAILS.includes(email);
      const name = email.split("@")[0]; // Simple name extraction
      
      const userData: User = {
        email,
        isAdmin,
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize name
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error("OTP verification error:", error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "OTP verification failed" 
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};