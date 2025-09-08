import { useState } from 'react';
import { registerUser } from '../services/authService'
import FormError from '../components/form/FormError'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function useSignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

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
      if (!isValid) {
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

        const { success, message } = response;
        if (success) {
          // Redirect to login page or show success message
          toast.success(message || 'Signup Successful!');
          navigate('/login');
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

    return {
        formData,
        handleInputChange,
        handleSubmit,
        errors
    };
}

export default useSignupForm;