import { useState } from 'react';
import { loginUser } from '../services/auth.service'
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

function useLoginForm() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    
    // email verification state
    const [showVerificationRequired, setShowVerificationRequired] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');

    const { login } = useAuth();
    const router = useRouter();

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

            const { success, message, token, needsEmailVerification, email } = response;
            
            if (success) {
                // Successful login
                toast.success(message || 'Welcome back! Login successful.');
                login(response.token, response.user)
                router.push('/');
            } else if (needsEmailVerification) {
                // Handle email verification required
                setUnverifiedEmail(email || loginData.email);
                setShowVerificationRequired(true);
                toast.error(message || 'Please verify your email before logging in');
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

    // Function to go back to login form
    const goBackToLogin = () => {
        setShowVerificationRequired(false);
        setUnverifiedEmail('');
        setErrors({});
    };

    return{
        loginData,
        handleInputChange,
        handleSubmit,
        errors,
        showVerificationRequired,
        unverifiedEmail,
        goBackToLogin
    }
}

export default useLoginForm;