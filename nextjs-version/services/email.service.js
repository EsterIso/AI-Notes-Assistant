import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Configure your email transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
      }
    });
  }

  // Email verification template
  getVerificationEmailTemplate(username, verificationUrl, companyName = 'YourApp') {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .header-subtitle {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 20px;
            }
            
            .message {
                font-size: 16px;
                color: #4a5568;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            
            .verify-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 16px 40px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            .info-box {
                background-color: #f7fafc;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
            }
            
            .info-box p {
                font-size: 14px;
                color: #4a5568;
                margin: 0;
            }
            
            .alternative-link {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                font-size: 14px;
                color: #718096;
            }
            
            .alternative-link a {
                color: #667eea;
                text-decoration: none;
                word-break: break-all;
            }
            
            .footer {
                background-color: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            
            .footer-content {
                font-size: 14px;
                color: #718096;
                line-height: 1.5;
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }
                
                .header, .content, .footer {
                    padding: 25px 20px;
                }
                
                .greeting {
                    font-size: 20px;
                }
                
                .verify-button {
                    padding: 14px 30px;
                    font-size: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">${companyName}</div>
                <div class="header-subtitle">Welcome to our platform</div>
            </div>
            
            <div class="content">
                <h1 class="greeting">Hi ${username}! 👋</h1>
                
                <div class="message">
                    <p>Thanks for signing up! We're excited to have you on board. To get started, please verify your email address by clicking the button below.</p>
                </div>
                
                <div class="button-container">
                    <a href="${verificationUrl}" class="verify-button">
                        Verify My Email
                    </a>
                </div>
                
                <div class="info-box">
                    <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons. If you didn't create an account, you can safely ignore this email.</p>
                </div>
                
                <div class="alternative-link">
                    <p>Having trouble with the button above? Copy and paste this link into your browser:</p>
                    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-content">
                    <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
                    <p>Need help? Contact us at support@${companyName.toLowerCase()}.com</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Welcome email template
getWelcomeEmailTemplate(username, companyName = 'StudyAI') {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${companyName}!</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
          }
          
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          
          .header {
              background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
          }
          
          .logo {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .header-subtitle {
              font-size: 16px;
              opacity: 0.9;
          }
          
          .content {
              padding: 40px 30px;
          }
          
          .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 20px;
          }
          
          .message {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 30px;
              line-height: 1.6;
          }
          
          .features {
              margin: 30px 0;
          }
          
          .feature-item {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 16px;
              padding: 16px;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(8px);
              border-radius: 12px;
              border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .feature-icon {
              font-size: 24px;
          }
          
          .button-container {
              text-align: center;
              margin: 30px 0;
          }
          
          .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
              color: white;
              text-decoration: none;
              padding: 16px 40px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              text-align: center;
              box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
              transition: all 0.3s ease;
          }
          
          .info-box {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-left: 4px solid #a855f7;
              padding: 20px;
              margin: 30px 0;
              border-radius: 0 12px 12px 0;
          }
          
          .info-box p {
              font-size: 16px;
              margin: 0;
          }
          
          .footer {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(8px);
              padding: 30px;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .footer-content {
              font-size: 14px;
              line-height: 1.5;
          }
          
          @media only screen and (max-width: 600px) {
              .email-container {
                  margin: 0;
                  border-radius: 0;
              }
              
              .header, .content, .footer {
                  padding: 25px 20px;
              }
              
              .greeting {
                  font-size: 20px;
              }
              
              .cta-button {
                  padding: 14px 30px;
                  font-size: 15px;
              }
              
              .feature-item {
                  padding: 12px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <div class="logo">${companyName}</div>
              <div class="header-subtitle">🎉 Welcome aboard!</div>
          </div>
          
          <div class="content">
              <h1 class="greeting">Hi ${username}! 👋</h1>
              
              <div class="message">
                  <p>Your email is now verified and you're ready to supercharge your studying with AI! Upload any PDF or text document and let our AI create:</p>
              </div>
              
              <div class="features">
                  <div class="feature-item">
                      <span class="feature-icon">📝</span>
                      <div class="feature-text">
                          <strong>In-depth Summaries</strong><br>
                          Get comprehensive, AI-generated summaries of your documents
                      </div>
                  </div>
                  <div class="feature-item">
                      <span class="feature-icon">🗂️</span>
                      <div class="feature-text">
                          <strong>Smart Flashcards</strong><br>
                          Automatically generated flashcards for active recall learning
                      </div>
                  </div>
                  <div class="feature-item">
                      <span class="feature-icon">🧠</span>
                      <div class="feature-text">
                          <strong>Interactive Quizzes</strong><br>
                          Test your knowledge with AI-created quizzes from your content
                      </div>
                  </div>
              </div>
              
              <div class="button-container">
                  <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">
                      Start Studying Now
                  </a>
              </div>
              
              <div class="info-box">
                  <p>Ready to transform how you study? Upload your first document and experience the power of AI-assisted learning!</p>
              </div>
          </div>
          
          <div class="footer">
              <div class="footer-content">
                  <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
                  <p>Need help? Contact us at support@${companyName.toLowerCase()}.com</p>
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
}

  // Send verification email
  async sendVerificationEmail(user, verificationToken) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      const companyName = process.env.COMPANY_NAME || 'StudyAI';
      
      const htmlContent = this.getVerificationEmailTemplate(
        user.username, 
        verificationUrl, 
        companyName
      );

      const mailOptions = {
        from: `"${companyName}" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Verify Your Email Address',
        html: htmlContent,
        text: `Hi ${user.username}, Please verify your email by visiting: ${verificationUrl}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Send welcome email after verification
  async sendWelcomeEmail(user) {
    try {
      const companyName = process.env.COMPANY_NAME || 'StudyAI';
      const htmlContent = this.getWelcomeEmailTemplate(user.username, companyName);

      const mailOptions = {
        from: `"${companyName}" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Welcome to StudyAI! 🎉',
        html: htmlContent,
        text: `Hi ${user.username}, Welcome to StudyAI! Your email is verified and you're ready to start studying with AI-powered summaries, flashcards, and quizzes.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw here as this is not critical
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

export default new EmailService();