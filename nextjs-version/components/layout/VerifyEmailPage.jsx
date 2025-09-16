import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; 

const VerifyEmailPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); 
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const { token } = router.query;
  const { login } = useAuth(); 

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`);
      const data = await response.json();

      if (data.success) {
        setVerificationStatus('success');
        setMessage(data.message);
        
        // Auto-login the user after successful verification
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Update auth context if you have one
          if (login) {
            login(data.user, data.token);
          }
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('An error occurred during verification. Please try again.');
      console.error('Verification error:', error);
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      alert('Please enter your email address');
      return;
    }

    setResendLoading(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Verification email sent successfully! Please check your inbox.');
      } else {
        alert(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-white)' }}>
              Verifying your email...
            </h2>
            <p style={{ color: 'var(--color-white-60)' }}>
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'var(--color-green)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-white)' }}>
              Email Verified Successfully! 🎉
            </h2>
            <p className="mb-4" style={{ color: 'var(--color-white-60)' }}>
              {message}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-white-50)' }}>
              Redirecting you to dashboard...
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'var(--color-pink)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-white)' }}>
              Verification Failed
            </h2>
            <p className="mb-6" style={{ color: 'var(--color-white-60)' }}>
              {message}
            </p>
            
            <div className="p-6 rounded-lg mb-6" 
                 style={{ 
                   background: 'var(--color-white-05)', 
                   border: '1px solid var(--color-white-10)' 
                 }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-white)' }}>
                Need a new verification link?
              </h3>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-none outline-none"
                  style={{ 
                    background: 'var(--color-white-10)', 
                    color: 'var(--color-white)',
                    border: '1px solid var(--color-white-10)'
                  }}
                />
                <button
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: 'linear-gradient(to right, var(--color-purple), var(--color-pink))',
                    color: 'white'
                  }}
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push('/auth/login')}
                className="font-medium transition-colors duration-300"
                style={{ color: 'var(--color-purple)' }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-pink)'}
                onMouseOut={(e) => e.target.style.color = 'var(--color-purple)'}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
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
          background: 'var(--color-white-05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--color-white-10)',
          borderRadius: '1rem',
          padding: '2rem'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;