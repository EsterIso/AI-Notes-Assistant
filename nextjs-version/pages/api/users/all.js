import { connectDB } from '../../../lib/mongodb.js';
import { getAllUsers } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  await connectDB();
  return getAllUsers(req, res);
}