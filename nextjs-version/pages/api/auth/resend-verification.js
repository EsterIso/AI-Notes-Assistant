import { connectDB } from '@/lib/mongodb'; 
import { resendVerificationEmail } from '@/utils/user.controller.js'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }
  
  try {
    await connectDB();
    
    return resendVerificationEmail(req, res);
  } catch (error) {
    console.error('API Route Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}