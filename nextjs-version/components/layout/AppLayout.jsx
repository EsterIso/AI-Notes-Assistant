import { useState, useEffect } from "react";
import AuthHeader from "./AuthHeader";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {  // Change: Accept children prop instead of using Outlet
  // Initialize sidebar state based on screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // On initial load, check if we're on desktop
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return false;
  });

  // Handle initial window size check after component mounts
  useEffect(() => {
    const handleInitialResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    // Check size on mount
    handleInitialResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleInitialResize);
    
    return () => window.removeEventListener('resize', handleInitialResize);
  }, []);

  return (
    <div className="app-layout">
      <AuthHeader 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;