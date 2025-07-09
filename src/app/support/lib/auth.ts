export const requestOTP = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        action: 'request',
      }),
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Failed to request OTP:', error);
    return false;
  }
};

// Verify the OTP entered by the user
export const verifyOTP = async (email: string, userEnteredOTP: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp: userEnteredOTP,
        action: 'verify',
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Create session in localStorage
      createSession(data.email, data.expiryTime, data.isAdmin);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    return false;
  }
};

// Create user session in localStorage
export const createSession = (email: string, expiryTime: number, isAdmin: boolean): void => {
  localStorage.setItem('userSession', JSON.stringify({
    email,
    expiryTime,
    isAuthenticated: true,
    isAdmin,
  }));
};

// Check if user session is valid
export const checkSession = (): { isValid: boolean; email?: string; isAdmin?: boolean } => {
  if (typeof window === 'undefined') {
    // Running on server side, no session
    return { isValid: false };
  }
  
  const sessionDataStr = localStorage.getItem('userSession');
  
  if (!sessionDataStr) return { isValid: false };
  
  const sessionData = JSON.parse(sessionDataStr);
  
  // Check if session is expired
  if (Date.now() > sessionData.expiryTime) {
    localStorage.removeItem('userSession');
    return { isValid: false };
  }
  
  return { 
    isValid: true, 
    email: sessionData.email,
    isAdmin: sessionData.isAdmin 
  };
};

// Log out user and clear session
export const logoutUser = (): void => {
  localStorage.removeItem('userSession');
};