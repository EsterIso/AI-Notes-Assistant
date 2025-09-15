import { connectDB } from '../../../lib/mongodb.js';
import { registerUser } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  await connectDB();
  return registerUser(req, res);
}