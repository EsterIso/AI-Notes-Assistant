import { connectDB } from '../../../lib/mongodb.js';
import { createNote, getNotes } from '../../../utils/notes.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

// Helper to run middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Run auth middleware
    await runMiddleware(req, res, protect);
    
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