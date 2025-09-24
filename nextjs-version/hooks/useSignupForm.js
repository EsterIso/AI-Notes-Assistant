import { useState } from 'react';
import { registerUser } from '../services/auth.service'
import FormError from '../components/form/FormError'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

function useSignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    
    // email verification state
    const [showVerificationRequired, setShowVerificationRequired] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
      e.preventDefault();
      setErrors({});
      
      const isValid = FormError(formData);
      if (isValid[0] === false) {
          toast.error(isValid[1]);
          return;
      }

      try {
        const response = await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })

        if (!response) {
          const errorMsg = "No response from server.";
          setErrors({ general: errorMsg });
          toast.error(errorMsg);
          return;
        }

        const { success, message, requiresEmailVerification } = response;
        if (success) {
          // Check if email verification is required
          if (requiresEmailVerification) {
            // Show email verification screen instead of redirecting
            setRegisteredEmail(formData.email);
            setShowVerificationRequired(true);
            toast.success(message || 'Account created! Please check your email to verify.');
          } else {
            toast.success(message || 'Signup Successful!');
            router.push('/login');
          }
        } else {
          // Handle error messages from the server
          if (typeof message === 'object') {
            // Set field-specific errors
            const fieldErrors = {
                username: message.username || '',
                email: message.email || '',
                password: message.password || '',
                confirmPassword: message.confirmPassword || '',
                general: message.general || ''
            };
            setErrors(fieldErrors);
            
            // Show toast with combined field errors (excluding general)
            const fieldErrorMessages = Object.entries(fieldErrors)
                .filter(([key, value]) => key !== 'general' && value)
                .map(([key, value]) => value);
                
            if (fieldErrorMessages.length > 0) {
                toast.error(fieldErrorMessages.join(', '));
            } else if (fieldErrors.general) {
                toast.error(fieldErrors.general);
            }
          } else {
            setErrors({ general: message });
            toast.error(message || 'Invalid credentials');
          }
        }
      } catch (error) {
        console.error("Error during signup:", error);
        const errorMsg = 'An error occurred during signup. Please try again later.';
        
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
      }
    };

    // Function to go back to signup form (if needed)
    const goBackToSignup = () => {
        setShowVerificationRequired(false);
        setRegisteredEmail('');
    };

    return {
        formData,
        handleInputChange,
        handleSubmit,
        errors,
        showVerificationRequired,
        registeredEmail,
        goBackToSignup
    };
}

export default useSignupForm;