import { connectDB } from '../../../lib/mongodb.js';
import { deleteUser } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  await connectDB();
  return deleteUser(req, res);
}