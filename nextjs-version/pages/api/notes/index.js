import { getAuth } from '@clerk/nextjs/server';
import { connectDB } from '../../../lib/mongodb.js';
import { createNote, getNotes } from '../../../utils/notes.controller.js';
import { getOrCreateUser } from '../../../utils/user.controller.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default async function handler(req, res) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    req.user = { userId };

    await connectDB();
    await getOrCreateUser(userId);

    if (req.method === 'POST') {
      return createNote(req, res);
    } else if (req.method === 'GET') {
      return getNotes(req, res);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}