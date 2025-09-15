import { connectDB } from '../../../lib/mongodb.js';
import { loginUser } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  await connectDB();
  return loginUser(req, res);
}