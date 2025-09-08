import { useState } from 'react';
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function useLoginForm() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const { login } = useAuth();

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {

            const response = await loginUser({
                email: loginData.email,
                password: loginData.password
            })

            if (!response) {
                const errorMsg = "No response from server.";
                setErrors({ general: errorMsg });
                toast.error(errorMsg);
                return;
            }

            const { success, message, token } = response;
            if (success) {
                // reminder to redirect to user homepage
                toast.success(message || 'Welcome back! Login successful.');
                login(response.token, response.user)
                navigate('/');
            } else {
                // Handle error messages from the server
                if (typeof message === 'object') {
                    const fieldErrors = {
                        email: message.email || '',
                        password: message.password || ''
                    };
                    setErrors(fieldErrors);
                    
                    // Show toast for general error
                    const errorMessage = Object.values(fieldErrors).filter(Boolean).join(', ');
                    toast.error(errorMessage || 'Please check your credentials');
                } else {
                    setErrors({ general: message })
                    toast.error(message || 'Invalid credentials');
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            const errorMsg = 'An error occurred during login. Please try again later.';
            
            setErrors({ general: errorMsg });
            toast.error(errorMsg);
        }
    };

    return{
        loginData,
        handleInputChange,
        handleSubmit,
        errors
    }
}

export default useLoginForm;