/**
 * Email template system for newsletter subscriptions
 */

interface CustomerEmailProps {
    name: string;
    currentDate: string;
  }
  
  interface AdminEmailProps {
    subscriberEmail: string;
    subscriberName: string;
    subscriberCompany: string;
    subscriberInterests: string;
    subscriptionSource: string;
    subscriptionDate: string;
  }
  
  /**
   * Generates the HTML email template for customer confirmation
   */
  export function generateCustomerEmailTemplate({ name, currentDate }: CustomerEmailProps): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Terafence Newsletter</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background-color: #0c1e35;
            padding: 30px 20px;
            text-align: center;
          }
          .header img {
            max-width: 180px;
            height: auto;
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            background-color: #0c1e35;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .social-links {
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            text-decoration: none;
          }
          h1 {
            color: #0c1e35;
            margin-top: 0;
            margin-bottom: 20px;
          }
          .highlight-box {
            background-color: #f1f5f9;
            border-left: 4px solid #0c1e35;
            padding: 15px;
            margin: 20px 0;
          }
          .date {
            font-size: 12px;
            color: #777;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <img src="https://terafence.in/images/terafence.png" alt="Terafence Logo">
          </div>
          
          <div class="content">
            <div class="date">${currentDate}</div>
            <h1>Welcome to Our Newsletter, ${name}!</h1>
            
            <p>Thank you for subscribing to the Terafence newsletter. We're excited to have you join our community!</p>
            
            <div class="highlight-box">
              <p><strong>What you'll receive:</strong></p>
              <ul>
                <li>Latest cybersecurity insights and trends</li>
                <li>Updates on data diode technology</li>
                <li>Exclusive security advisories and best practices</li>
                <li>Product updates and feature announcements</li>
              </ul>
            </div>
            
            <p>Our newsletter is sent out monthly, so you can expect your first edition soon. We respect your inbox and will never share your information with third parties.</p>
            
            <p>To ensure our emails reach you, please add <strong>info@terafence.in</strong> to your contacts.</p>
            
            <div style="text-align: center;">
              <a href="https://terafence.in/download" class="button">Explore Our Resources</a>
            </div>
            
            <p>If you have any questions or feedback, don't hesitate to reply to this email.</p>
            
            <p>Best regards,<br>Terafence Private Limited</p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="https://www.linkedin.com/company/terafence-private-limited" target="_blank">
                <img src="https://terafence.in/images/social/linkedin.png" alt="LinkedIn" width="24" height="24">
              </a>
              <a href="https://www.youtube.com/@terafenceprivatelimited9541" target="_blank">
                <img src="https://terafence.in/images/social/youtube.png" alt="Twitter" width="24" height="24">
              </a>
            </div>
            
            <p>&copy; ${new Date().getFullYear()} Terafence Private Limited. All rights reserved.</p>
            <p>209, Suncity Success Tower, Sector-65, Gurgaon, Haryana-122005, India</p>
            
            <p>
              <a href="https://terafence.in/privacy" style="color: #666;">Privacy Policy</a> | 
              <a href="https://terafence.in/unsubscribe?email={{email}}" style="color: #666;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
 
  export function generateAdminEmailTemplate({
    subscriberEmail,
    subscriberName,
    subscriberCompany,
    subscriberInterests,
    subscriptionSource,
    subscriptionDate,
  }: AdminEmailProps): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Newsletter Subscriber</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
          }
          .header {
            background-color: #0c1e35;
            padding: 20px;
            text-align: center;
          }
          .header h2 {
            color: #ffffff;
            margin: 0;
          }
          .content {
            padding: 25px;
          }
          .subscriber-info {
            background-color: #f9fafb;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            margin-bottom: 12px;
            border-bottom: 1px solid #eee;
            padding-bottom: 12px;
          }
          .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .info-label {
            font-weight: bold;
            width: 140px;
            color: #555;
          }
          .info-value {
            flex: 1;
          }
          .highlight {
            background-color: #f1f5f9;
            border-left: 4px solid #0c1e35;
            padding: 15px;
            margin-top: 20px;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .action-button {
            display: inline-block;
            background-color: #0c1e35;
            color: #ffffff !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h2>New Newsletter Subscriber</h2>
          </div>
          
          <div class="content">
            <p>A new user has subscribed to the Terafence newsletter. Here are their details:</p>
            
            <div class="subscriber-info">
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${subscriberEmail}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${subscriberName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Company:</div>
                <div class="info-value">${subscriberCompany}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Interests:</div>
                <div class="info-value">${subscriberInterests}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Source:</div>
                <div class="info-value">${subscriptionSource}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Date:</div>
                <div class="info-value">${subscriptionDate}</div>
              </div>
            </div>
            
            <div class="highlight">
              <p><strong>Subscriber Statistics (Last 30 Days)</strong></p>
              <ul>
                <li>Total new subscribers: 23</li>
                <li>Blog page conversions: 14</li>
                <li>Newsletter campaign conversions: 9</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://terafence.in/admin/subscribers" class="action-button">View All Subscribers</a>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the Terafence Newsletter System.</p>
            <p>&copy; ${new Date().getFullYear()} Terafence Private Limited. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }