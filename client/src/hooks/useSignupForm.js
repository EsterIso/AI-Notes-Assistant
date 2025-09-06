import { useState } from 'react';
import { registerUser } from '../services/authService'
import FormError from '../components/form/FormError'

function useSignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
      e.preventDefault();

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
          setErrors({ general: "No response from server." });
          return;
      }

        const { success, message } = response;
        if (success) {
          // Redirect to login page or show success message
          alert(message);
          window.location.href = '/login';
        } else {
          // Handle error messages from the server
          if (typeof message === 'object') {
            setErrors({
              username: message.username || '',
              email: message.email || '',
              password: message.password || '',
              confirmPassword: message.confirmPassword || '',
              general: message.general || ''
            });
          } else {
            setErrors({ general: message });
          }
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setErrors({
          general: 'An error occurred during signup. Please try again later.'
        });
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