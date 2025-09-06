import express from 'express';
import { registerUser,  loginUser, getUserProfile, updateUserProfile, changePassword, deleteUser, getAllUsers} from '../controllers/user.controller.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// Get user profile route
router.get('/profile', getUserProfile); 

// Update user profile route
router.put('/profile', updateUserProfile);

// Change password route
router.put('/change-password', changePassword);

// Delete user route
router.delete('/delete', deleteUser);

// Get all users route
router.get('/all', getAllUsers);

export default router;