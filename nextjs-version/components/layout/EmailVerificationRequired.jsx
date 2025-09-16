import { useState } from 'react';
import { useRouter } from 'next/router';

const EmailVerificationRequired = ({ email, onResendSuccess }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResendMessage('Verification email sent successfully! Please check your inbox.');
        if (onResendSuccess) onResendSuccess();
      } else {
        setResendMessage(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      setResendMessage('An error occurred. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-app-container">
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '28rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Main Card */}
          <div style={{
            background: 'var(--color-white-05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-white-10)',
            borderRadius: '1rem',
            padding: '2rem'
          }}>
            <div className="text-center">
              {/* Email Icon */}
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'var(--color-white-10)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <svg 
                  style={{ width: '2rem', height: '2rem', color: 'var(--color-purple)' }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--color-white)',
                marginBottom: '0.5rem'
              }}>
                Verify Your Email Address
              </h2>
              
              <p style={{
                color: 'var(--color-white-60)',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                We've sent a verification link to <strong style={{ color: 'var(--color-white)' }}>{email}</strong>. 
                Please check your inbox and click the verification link to continue.
              </p>

              {/* Instructions */}
              <div style={{
                background: 'var(--color-white-05)',
                border: '1px solid var(--color-white-10)',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontWeight: '600',
                  color: 'var(--color-white)',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  What to do next:
                </h3>
                <ol style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-white-60)',
                  paddingLeft: '1rem',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  <li>Check your email inbox</li>
                  <li>Look for an email from StudyAI</li>
                  <li>Click the verification link</li>
                  <li>You'll be automatically logged in</li>
                </ol>
              </div>

              {/* Resend Email Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-white-50)'
                }}>
                  Didn't receive the email? Check your spam folder or
                </p>
                
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(to right, var(--color-purple), var(--color-pink))',
                    border: 'none',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    cursor: isResending ? 'not-allowed' : 'pointer',
                    opacity: isResending ? 0.5 : 1,
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isResending ? (
                    <>
                      <svg 
                        className="animate-spin" 
                        style={{ width: '1.25rem', height: '1.25rem' }} 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>

                {resendMessage && (
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: resendMessage.includes('successfully') 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(236, 72, 153, 0.1)',
                    color: resendMessage.includes('successfully') 
                      ? 'var(--color-green)' 
                      : 'var(--color-pink)',
                    border: '1px solid',
                    borderColor: resendMessage.includes('successfully') 
                      ? 'rgba(34, 197, 94, 0.2)' 
                      : 'rgba(236, 72, 153, 0.2)'
                  }}>
                    {resendMessage}
                  </div>
                )}
              </div>

              {/* Back to Login */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-white-10)'
              }}>
                <button
                  onClick={() => router.push('/auth/login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-purple)',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-pink)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-purple)'}
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div style={{
            background: 'var(--color-white-05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-white-10)',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--color-white)',
              marginBottom: '0.75rem'
            }}>
              Need Help?
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-white-60)'
            }}>
              <p>• Make sure to check your spam/junk folder</p>
              <p>• The verification link expires in 24 hours</p>
              <p>• You can request a new verification email anytime</p>
              <p>• Contact support if you continue having issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationRequired;