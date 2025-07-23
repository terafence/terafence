// src/lib/firebase/auth-service.ts
import { adminDb } from './admin';
import admin from './admin';

export interface UserProfile {
  email: string;
  role: 'admin' | 'user';
  createdAt: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue;
  lastLogin: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue | null;
  permissions?: string[];
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
  };
}

// Admin emails list
const adminEmails = [
  'chandra@terafence.in',
  'jose@terafence.in',
  'akshat@terafence.in',
  'yash@terafence.in'
];

/**
 * Determine user role based on email
 */
export function getUserRole(email: string): 'admin' | 'user' {
  return adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';
}

/**
 * Create or update user profile in Firestore using Admin SDK
 */
export async function createUserProfile(email: string): Promise<UserProfile> {
  const role = getUserRole(email);
  
  try {
    console.log(`👤 Creating/updating user profile for ${email} with role: ${role}`);
    
    // Use Admin SDK to bypass security rules
    const userRef = adminDb.collection('users').doc(email.toLowerCase());
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      // Update existing user
      const userData = userDoc.data() as UserProfile;
      const updatedData = {
        ...userData,
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await userRef.update(updatedData);
      console.log(`✅ Updated existing user profile for ${email}`);
      return updatedData;
    } else {
      // Create new user profile
      const newUser: UserProfile = {
        email: email.toLowerCase(),
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        permissions: role === 'admin' ? [
          'read_all_users',
          'manage_partners',
          'view_analytics',
          'export_data',
          'manage_resources',
          'admin_dashboard'
        ] : [
          'read_own_data',
          'download_resources',
          'submit_tickets',
          'view_own_analytics'
        ]
      };
      
      await userRef.set(newUser);
      console.log(`✅ Created new user profile for ${email}`);
      return newUser;
    }
  } catch (error) {
    console.error(`❌ Error creating user profile for ${email}:`, error);
    throw error;
  }
}

/**
 * Store OTP in Firestore (server-side only) with enhanced error handling
 */
export async function storeOTP(email: string, otp: string, expiresAt: number) {
  try {
    console.log(`🔐 Storing OTP for ${email}:`, { otp, expiresAt });
    
    // Use Firebase Admin SDK for server-side operations
    const otpData = {
      otp: otp.toString(),
      expiresAt: expiresAt,
      createdAt: Date.now(),
      email: email.toLowerCase()
    };

    await adminDb.collection('otp_storage').doc(email.toLowerCase()).set(otpData);
    console.log(`✅ OTP stored successfully for ${email}`);
    
    // Verify the OTP was stored by reading it back
    const storedDoc = await adminDb.collection('otp_storage').doc(email.toLowerCase()).get();
    if (storedDoc.exists) {
      console.log(`✅ OTP storage verified:`, storedDoc.data());
    } else {
      console.error(`❌ OTP storage verification failed for ${email}`);
    }
    
  } catch (error) {
    console.error('❌ Error storing OTP:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    throw new Error(`Failed to store OTP: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify OTP from Firestore (server-side only) with enhanced debugging
 */
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    console.log(`🔍 Verifying OTP for ${email}:`, { providedOTP: otp });
    
    // Use Firebase Admin SDK to get the OTP
    const otpDoc = await adminDb.collection('otp_storage').doc(email.toLowerCase()).get();
    
    if (!otpDoc.exists) {
      console.log(`❌ No OTP document found for ${email}`);
      return false;
    }
    
    const otpData = otpDoc.data();
    console.log(`📋 Found OTP data:`, otpData);
    
    if (!otpData) {
      console.log(`❌ OTP document exists but has no data for ${email}`);
      return false;
    }

    const storedOTP = otpData.otp?.toString();
    const providedOTP = otp.toString();
    const currentTime = Date.now();
    const isExpired = currentTime > otpData.expiresAt;
    
    console.log(`🔍 OTP verification details:`, {
      storedOTP,
      providedOTP,
      currentTime,
      expiresAt: otpData.expiresAt,
      isExpired,
      otpMatch: storedOTP === providedOTP
    });
    
    // Check if OTP is expired
    if (isExpired) {
      console.log(`❌ OTP expired for ${email}. Cleaning up...`);
      await adminDb.collection('otp_storage').doc(email.toLowerCase()).delete();
      return false;
    }
    
    // Check if OTP matches
    const isValid = storedOTP === providedOTP;
    
    if (isValid) {
      console.log(`✅ OTP verified successfully for ${email}. Cleaning up...`);
      // Delete OTP after successful verification
      await adminDb.collection('otp_storage').doc(email.toLowerCase()).delete();
      console.log(`✅ OTP cleaned up for ${email}`);
    } else {
      console.log(`❌ OTP mismatch for ${email}`);
    }
    
    return isValid;
    
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return false;
  }
}

/**
 * Clean expired OTPs (run periodically)
 */
export async function cleanExpiredOTPs() {
  try {
    console.log('🧹 Cleaning expired OTPs...');
    const currentTime = Date.now();
    
    const expiredOTPs = await adminDb
      .collection('otp_storage')
      .where('expiresAt', '<', currentTime)
      .get();
    
    if (expiredOTPs.empty) {
      console.log('✅ No expired OTPs found');
      return;
    }

    const batch = adminDb.batch();
    expiredOTPs.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`🧹 Cleaned ${expiredOTPs.size} expired OTPs`);
    
  } catch (error) {
    console.error('❌ Error cleaning expired OTPs:', error);
  }
}

/**
 * Debug function to list all OTPs (for development only)
 */
export async function debugListOTPs() {
  try {
    console.log('🔍 Debug: Listing all OTPs...');
    const otpCollection = await adminDb.collection('otp_storage').get();
    
    if (otpCollection.empty) {
      console.log('📋 No OTPs found in storage');
      return;
    }
    
    otpCollection.docs.forEach(doc => {
      console.log(`📋 OTP Document ${doc.id}:`, doc.data());
    });
    
  } catch (error) {
    console.error('❌ Error listing OTPs:', error);
  }
}