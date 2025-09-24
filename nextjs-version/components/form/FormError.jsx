function FormError(formData) {
    const { username, email, password, confirmPassword } = formData;

    const passwordRequirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };

    const newErrors = {};

    if (username.length < 3 || username.length > 20) {
        newErrors.username = 'Username must be 3-20 characters';
    }

    if (!email || !email.includes('@')) {
        newErrors.email = 'Please enter a valid Email';
    }

    if (!password || Object.values(passwordRequirements).includes(false)) {
        newErrors.password = 'Enter a valid Password';
    }

    if (!confirmPassword || confirmPassword !== password) {
        newErrors.confirmPassword = 'Must match the Password above';
    }
    
    const errorMessage = Object.values(newErrors).join(', ');
    // Return true if no errors (form is valid)
    return [Object.keys(newErrors).length === 0, errorMessage];
}

export default FormError;