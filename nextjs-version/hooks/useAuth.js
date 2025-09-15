export function useAuth() {
  const context = useContext(AuthContext);
  
  // Safety check: make sure hook is used within provider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}