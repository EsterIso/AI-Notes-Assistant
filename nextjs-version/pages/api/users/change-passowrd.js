import { connectDB } from '../../../lib/mongodb.js';
import { changePassword } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  await connectDB();
  return changePassword(req, res);
}