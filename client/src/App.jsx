// import { useAuth } from './hooks/useAuth'; // or however you handle auth
import React from 'react';
import PublicApp from './PublicApp';
import { useAuth } from './context/AuthContext.jsx';
import AuthenticatedApp from './AuthenticatedApp';
// import Loading from './components/common/Loading';
import './App.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">Checking authentication...</div>
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("AppContent rendering:", { isAuthenticated, isLoading });
   if (isLoading) {
    console.log("Still checking auth status...");
    return <Loading />;
  }

  console.log(`🎯 Showing ${isAuthenticated ? 'authenticated' : 'public'} app`);

  return isAuthenticated ? <AuthenticatedApp /> : <PublicApp />;

}

export default App;
