/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config({ path: '../.env.local' });
const admin = require('firebase-admin');

console.log('🚀 TeraFence Firebase Setup Starting...');

// Check environment variables
const requiredEnvVars = [
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL', 
  'FIREBASE_ADMIN_PRIVATE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing ${envVar} in .env.local`);
    process.exit(1);
  }
}

// Clean up the private key
let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

// Remove quotes if they exist
if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
  privateKey = privateKey.slice(1, -1);
}

// Replace \\n with actual newlines
privateKey = privateKey.replace(/\\n/g, '\n');

console.log('✅ Environment variables loaded');
console.log('📋 Project ID:', process.env.FIREBASE_ADMIN_PROJECT_ID);
console.log('📧 Client Email:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);

// Initialize Firebase Admin with better error handling
if (admin.apps.length === 0) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:');
    console.error('Error details:', error.message);
    
    if (error.message.includes('DECODER')) {
      console.error('\n💡 This is likely a private key format issue.');
      console.error('Try removing quotes around FIREBASE_ADMIN_PRIVATE_KEY in .env.local');
    }
    
    process.exit(1);
  }
}

const db = admin.firestore();

const adminEmails = [
  'chandra@terafence.in',
  'jose@terafence.in',
  'akshat@terafence.in',
  'yash@terafence.in'
];

async function setupFirebase() {
  console.log('\n📁 Creating Firestore collections...');
  
  try {
    // Test Firestore connection first
    console.log('🔍 Testing Firestore connection...');
    await db.collection('_test').doc('connection').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      test: true
    });
    await db.collection('_test').doc('connection').delete();
    console.log('✅ Firestore connection successful');

    // Create system analytics
    console.log('📊 Creating analytics collection...');
    await db.collection('analytics').doc('system').set({
      totalUsers: 0,
      activeUsers: 0,
      totalLogins: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'setup-script'
    });
    console.log('✅ Analytics collection created');

    // Create system settings
    console.log('⚙️  Creating settings collection...');
    await db.collection('settings').doc('system').set({
      maintenanceMode: false,
      allowNewRegistrations: true,
      maxLoginAttempts: 5,
      otpExpiryMinutes: 10,
      sessionTimeoutHours: 24,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'setup-script'
    });
    console.log('✅ Settings collection created');

    // Create admin users
    console.log('\n👥 Creating admin users...');
    let createdCount = 0;
    let existingCount = 0;

    for (const email of adminEmails) {
      try {
        const userDoc = await db.collection('users').doc(email).get();
        
        if (userDoc.exists) {
          console.log(`ℹ️  Admin already exists: ${email}`);
          existingCount++;
          continue;
        }

        const adminUserData = {
          email: email,
          role: 'admin',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastLogin: null,
          permissions: [
            'read_all_users',
            'manage_partners',
            'view_analytics',
            'export_data',
            'manage_resources',
            'admin_dashboard',
            'system_settings'
          ],
          profile: {
            company: 'TeraFence',
            department: 'Administration'
          },
          status: 'active',
          createdBy: 'setup-script'
        };

        await db.collection('users').doc(email).set(adminUserData);
        console.log(`✅ Created admin: ${email}`);
        createdCount++;

      } catch (userError) {
        console.error(`❌ Failed to create admin ${email}:`, userError.message);
      }
    }

    console.log('\n🎉 Firebase setup completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   • ${createdCount} new admin users created`);
    console.log(`   • ${existingCount} admin users already existed`);
    console.log(`   • Total admin users: ${adminEmails.length}`);
    
    console.log('\n📋 What you can do now:');
    console.log('1. Start your app: npm run dev');
    console.log('2. Go to: http://localhost:3000/partners');
    console.log('3. Login with any admin email:');
    adminEmails.forEach(email => console.log(`   • ${email}`));
    console.log('4. Check your email for OTP code');
    
    // Verify the setup
    console.log('\n🔍 Verifying setup...');
    const analyticsDoc = await db.collection('analytics').doc('system').get();
    const settingsDoc = await db.collection('settings').doc('system').get();
    
    if (analyticsDoc.exists && settingsDoc.exists) {
      console.log('✅ All collections verified successfully');
    } else {
      console.log('⚠️  Some collections may not have been created properly');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Check your Firebase project exists and Firestore is enabled');
    console.error('2. Verify your service account has Firestore permissions');
    console.error('3. Make sure your private key format is correct');
    process.exit(1);
  }
}

setupFirebase();