import { useState } from 'react';
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


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
                setErrors({ general: "No response from server."});
                return;
            }

            const { success, message, token } = response;
            if (success) {
                // reminder to redirect to user homepage
                alert(message);
                login(response.token, response.user)
                navigate('/');
            } else {
                // Handle error messages from the server
                if (typeof message === 'object') {
                    setErrors({
                        email: message.email || '',
                        password: message.password || ''
                    });
                } else {
                    setErrors({ general: message })
                }
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setErrors({
                general: 'An error occured during signup. Please try again later.'
            });
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