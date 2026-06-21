import { getAuth } from '@clerk/nextjs/server';
import { connectDB } from '../../../lib/mongodb.js';
import { getNoteById, updateNote, deleteNote } from '../../../utils/notes.controller.js';
import { getOrCreateUser } from '../../../utils/user.controller.js';

export default async function handler(req, res) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    req.user = { userId };

    await connectDB();
    await getOrCreateUser(userId);
    req.params = { id: req.query.id };
    if (req.method === 'GET') {
      return getNoteById(req, res);
    } else if (req.method === 'PUT') {
      return updateNote(req, res);
    } else if (req.method === 'DELETE') {
      return deleteNote(req, res);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}