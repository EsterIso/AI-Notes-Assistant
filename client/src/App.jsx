import PublicApp from './PublicApp';
import { useAuth } from './context/AuthContext.jsx';
import AuthenticatedApp from './AuthenticatedApp';
import { ToastContainer } from 'react-toastify';
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

  return (
    <>
      {isAuthenticated ? <AuthenticatedApp /> : <PublicApp />}
      
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
    </>
  );

}

export default App;
