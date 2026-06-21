import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { connectDB } from '../../../lib/mongodb.js';
import Note from '../../../models/notes.model.js';
import User from '../../../models/user.model.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    await connectDB();

    await Note.deleteMany({ userId });
    await User.findOneAndDelete({ clerkId: userId });

    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return res.json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting user account', error: error.message });
  }
}
