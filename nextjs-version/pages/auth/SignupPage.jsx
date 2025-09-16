import { useState } from 'react';
import PublicHeader from '../../components/layout/PublicHeader';
import PasswordRequirements from '../../components/form/PasswordRequirements';
import useSignupForm from '../../hooks/useSignupForm';
import FormInput from '../../components/form/FormInput';
import EmailVerificationRequired from '@/components/layout/EmailVerificationRequired';

function SignupPage() {
  const { 
    formData, 
    handleInputChange, 
    handleSubmit, 
    errors,
    showVerificationRequired,
    registeredEmail,
    goBackToSignup
  } = useSignupForm();

  // Show email verification screen if needed
  if (showVerificationRequired) {
    return (
      <EmailVerificationRequired 
        email={registeredEmail}
        onResendSuccess={() => {
        toast.success('Verification email sent!');
        }}
      />
    );
  }

  // 🆕 Show regular signup form
  return (
    <div className="login-page-container">
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      
      <PublicHeader />
      <div className="content-area">
        <div className="signup-form-container">
          <h2 className="signup-title">Sign Up</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <FormInput
              type='username'
              name='username'
              label='username'
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
            />

            <FormInput 
              type='email'
              name='email'
              label='email'
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            <FormInput 
              type='password'
              name='password'
              label='password'
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />
            <PasswordRequirements formData={formData}/>

            <FormInput 
              type='password'
              name='confirmPassword'
              label='confirm password'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
            />

            <button type="submit" className="sign-up">Sign Up</button>
          </form>
          <p className="signup-link">Have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;