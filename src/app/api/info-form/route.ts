import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, company, email, remarks, title } = body;

    // Validation checks
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { message: "Name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return NextResponse.json(
        { message: "Please provide a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    if (!company || company.trim() === "") {
      return NextResponse.json(
        { message: "Company name is required" },
        { status: 400 }
      );
    }

    if (
      !email ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Get current date and time
    const currentDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 465),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Professional HTML email template for admin
    const adminEmailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Information Request: ${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eaeaea;
          }
          .logo {
            max-width: 180px;
            height: auto;
          }
          .content {
            padding: 30px 20px;
          }
          .info-box {
            background-color: #f5f9ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
          }
          .info-item {
            margin-bottom: 15px;
          }
          .info-label {
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 5px;
            display: block;
          }
          .info-value {
            margin: 0;
          }
          .highlight {
            background-color: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #eaeaea;
            font-size: 14px;
            color: #666;
          }
          .footer-text {
            margin: 5px 0;
          }
          .timestamp {
            color: #888;
            font-size: 12px;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://terafence.in/images/terafence.png" alt="Terafence Logo" class="logo">
            <h1 style="color: #1e40af; margin-top: 15px; font-size: 24px;">New Product Information Request</h1>
          </div>
          
          <div class="content">
            <div class="highlight">
              <p style="margin: 0; font-weight: 600;">A new user has requested access to: <span style="color: #f97316;">${title || 'Product Information'}</span></p>
            </div>
            
            <div class="info-box">
              <div class="info-item">
                <span class="info-label">Name:</span>
                <p class="info-value">${name}</p>
              </div>
              
              <div class="info-item">
                <span class="info-label">Mobile:</span>
                <p class="info-value">${mobile}</p>
              </div>
              
              <div class="info-item">
                <span class="info-label">Company:</span>
                <p class="info-value">${company}</p>
              </div>
              
              <div class="info-item">
                <span class="info-label">Email:</span>
                <p class="info-value">${email}</p>
              </div>
              
              <div class="info-item">
                <span class="info-label">Remarks:</span>
                <p class="info-value">${remarks || 'None provided'}</p>
              </div>
            </div>
            
            <p style="color: #666;">Please follow up with the customer as soon as possible to provide the requested information.</p>
          </div>
          
          <div class="footer">
            <p class="footer-text"><strong>Terafence Private Limited</strong></p>
            <p class="footer-text">209, Suncity Success Tower, Sector-65, Gurgaon-122005, Haryana, India</p>
            <p class="footer-text">
              <a href="mailto:info@terafence.in" style="color: #2563eb; text-decoration: none;">info@terafence.in</a>
            </p>
            <p class="timestamp">Request received on: ${currentDate}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // User acknowledgment email template
    const userEmailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Request</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eaeaea;
          }
          .logo {
            max-width: 180px;
            height: auto;
          }
          .content {
            padding: 30px 20px;
          }
          .thank-you {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 20px;
            text-align: center;
          }
          .message-box {
            background-color: #f0f9ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
          }
          .details-box {
            background-color: #f5f5f5;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .detail-item {
            margin-bottom: 10px;
          }
          .detail-label {
            font-weight: 600;
            color: #333;
          }
          .what-next {
            margin: 30px 0;
            padding: 20px;
            background-color: #f0f9ff;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
          }
          .cta-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #eaeaea;
            font-size: 14px;
            color: #666;
          }
          .footer-text {
            margin: 5px 0;
          }
          .social-icons {
            margin-top: 20px;
          }
          .social-icons a {
            display: inline-block;
            margin: 0 10px;
          }
          .timestamp {
            color: #888;
            font-size: 12px;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://terafence.in/images/terafence.png" alt="Terafence Logo" class="logo">
          </div>
          
          <div class="content">
            <h1 class="thank-you">Thank You for Your Request!</h1>
            
            <div class="message-box">
              <p>Dear <strong>${name}</strong>,</p>
              <p>We have received your request for access to <strong>${title || 'product information'}</strong>. Thank you for your interest in Terafence solutions.</p>
              <p>Our team is reviewing your request and will get back to you shortly with the information you need.</p>
            </div>
            
            <div class="details-box">
              <h3 style="margin-top: 0;">Request Details:</h3>
              <div class="detail-item">
                <span class="detail-label">Requested Information:</span> ${title || 'Product Information'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Request Date:</span> ${currentDate}
              </div>
              <div class="detail-item">
                <span class="detail-label">Name:</span> ${name}
              </div>
              <div class="detail-item">
                <span class="detail-label">Company:</span> ${company}
              </div>
            </div>
            
            <div class="what-next">
              <h3 style="margin-top: 0;">What Happens Next?</h3>
              <p>Our team will review your request and contact you within 24-48 business hours with the information you requested. If you have any immediate questions, please feel free to contact us directly.</p>
              <div style="text-align: center;">
                <a href="mailto:info@terafence.in" class="cta-button">Contact Us</a>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text"><strong>Terafence Private Limited</strong></p>
            <p class="footer-text">209, Suncity Success Tower, Sector-65, Gurgaon-122005, Haryana, India</p>
            <p class="footer-text">
              <a href="mailto:info@terafence.in" style="color: #2563eb; text-decoration: none;">info@terafence.in</a>
            </p>
            <div class="social-icons">
              <!-- Add your social media icons here if needed -->
            </div>
            <p class="timestamp">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM, // Send to admin email
      subject: `Product Information Request: ${title} - ${name} from ${company}`,
      html: adminEmailContent,
    });

    // Send acknowledgment email to user
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email, // Send to the user's email
      subject: `Thank You for Your Request - Terafence Private Limited`,
      html: userEmailContent,
    });

    // Respond with success
    return NextResponse.json(
      { 
        message: "Form submitted successfully", 
        success: true 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing form submission:", error);
    
    return NextResponse.json(
      { 
        message: "An error occurred while processing your request",
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}