import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { deleteUser } from '@/services/auth.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing token on app startup
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      // In production, you'd validate this token with your server
    }
    setIsLoading(false);
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logout Successful!')
  };

  const deleteAccount = async () => {
    try {
      const result = await deleteUser(); // Use your existing API function
      
      if (result.success) {
        // Clear local state
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUser(null);
        toast.success('Account deleted successfully');
        return { success: true };
      } else {
        toast.error(result.message || 'Failed to delete account');
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error deleting account. Please try again.');
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}