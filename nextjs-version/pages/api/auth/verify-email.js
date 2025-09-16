import { connectDB } from '../../../lib/mongodb.js';
import { verifyEmail } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use GET.' 
    });
  }
  
  try {
    await connectDB();
    
    return verifyEmail(req, res);
  } catch (error) {
    console.error('API Route Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}