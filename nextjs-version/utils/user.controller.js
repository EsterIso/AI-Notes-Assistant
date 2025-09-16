import User from '../models/user.model.js';
import emailService from '@/services/email.service.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Register User with email verification
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const validationErrors = {};

        if (!username) validationErrors.username = 'Username is required';
        if (!email) validationErrors.email = 'Email is required';
        if (!password) validationErrors.password = 'Password is required';

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({ success: false, message: validationErrors });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: { email: 'Invalid email format' } });
        }

        // Validate username
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: { username: 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores' }
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: { username: 'User with this email or username already exists' } 
            });
        }

        // Validate password
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        if (password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
            return res.status(400).json({
                success: false,
                message: { password: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character' }
            });
        }

        // 🆕 Create new user (email verification is false by default)
        const user = new User({ 
            username, 
            email, 
            password, 
            isEmailVerified: false // 🆕 Start with unverified email
        });
        
        // 🆕 Generate verification token
        const verificationToken = user.generateEmailVerificationToken();
        
        // Save user
        const savedUser = await user.save();

        // 🆕 Send verification email
        try {
            await emailService.sendVerificationEmail(savedUser, verificationToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
        }

        // Don't return token, require email verification first
        res.status(201).json({
            success: true,
            message: 'Account created successfully! Please check your email to verify your account before logging in.',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                isEmailVerified: savedUser.isEmailVerified
            },
            requiresEmailVerification: true // 🆕 Signal to frontend
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
};

// Email verification endpoint
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        // Find user with verification token that hasn't expired
        const user = await User.findOne({
            emailVerificationToken: { $ne: null },
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        // Verify the token
        if (!user.verifyEmailToken(token)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token'
            });
        }

        // Mark email as verified
        user.markEmailAsVerified();
        await user.save();

        // Send welcome email
        try {
            await emailService.sendWelcomeEmail(user);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail verification if welcome email fails
        }

        // 🆕 Generate token for automatic login after verification
        const authToken = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You are now logged in.',
            token: authToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during email verification'
        });
    }
};

// Resend verification email
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        await emailService.sendVerificationEmail(user, verificationToken);

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resending verification email'
        });
    }
};

// Login with email verification check
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // CHECK EMAIL VERIFICATION
        if (!user.isEmailVerified) {
            return res.status(401).json({ 
                success: false, 
                message: 'Please verify your email before logging in',
                needsEmailVerification: true,
                email: user.email // Send email for resend functionality
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isEmailVerified: user.isEmailVerified // 🆕 Include verification status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
};

// Get user profile 
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user profile', error: error.message });
    }
};

// Update user profile 
export const updateUserProfile = async (req, res) => {
    try {
        const allowedUpdates = ['username', 'email'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ success: false, message: 'Invalid updates. Only username and email can be updated.' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check for existing email or username
        if (req.body.email && req.body.email !== user.email) {
            const existingEmail = await User.findOne({ email: req.body.email });
            if (existingEmail) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        if (req.body.username && req.body.username !== user.username) {
            const existingUsername = await User.findOne({ username: req.body.username });
            if (existingUsername) {
                return res.status(400).json({ success: false, message: 'Username already in use' });
            }
        }

        updates.forEach(update => (user[update] = req.body[update]));
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
};

// Change password 
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error changing password', error: error.message });
    }
};

// Delete user account 
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(req.user.id);

        res.json({ success: true, message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user account', error: error.message });
    }
};

// Get all users 
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = search
            ? {
                  $or: [
                      { username: { $regex: search, $options: 'i' } },
                      { email: { $regex: search, $options: 'i' } }
                  ]
              }
            : {};

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            totalUsers: total
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
};