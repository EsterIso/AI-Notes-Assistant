import { connectDB } from '../../../lib/mongodb.js';
import { getUserProfile, updateUserProfile } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === 'GET') {
    return getUserProfile(req, res);
  } else if (req.method === 'PUT') {
    return updateUserProfile(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}