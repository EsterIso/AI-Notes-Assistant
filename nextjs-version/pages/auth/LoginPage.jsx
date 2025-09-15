import { useState } from 'react';
import PublicHeader from '../../components/layout/PublicHeader';
import useLoginForm from "../../hooks/useLoginForm"
import FormInput from '../../components/form/FormInput';

function LoginPage() {

  const { loginData, handleInputChange, handleSubmit, errors } = useLoginForm();

  return (
    
    <div className="login-page-container">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
      
      <PublicHeader />
      <div className="content-area">
        <div className="login-form-container">
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <FormInput 
              type='email'
              name='email'
              label='email'
              value={loginData.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            <FormInput 
              type='password'
              name='password'
              label='password'
              value={loginData.password}
              onChange={handleInputChange}
              error={errors.password}
            />
            <button type="submit" className="login">Login</button>
          </form>
          <p className="signup-link">Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;