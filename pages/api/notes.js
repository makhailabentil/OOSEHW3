import dbConnect from '../../lib/dbConnect';
import Note from '../../models/Note';

export default async function handler(req, res) {
  try {
    await dbConnect();

    // Get userId from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = authHeader.split(' ')[1];

    switch (req.method) {
      case 'GET':
        try {
          // Only fetch notes for the specific user
          const notes = await Note.find({ userId })
            .sort({ createdAt: -1 })
            .lean();
          return res.status(200).json(notes);
        } catch (error) {
          return res.status(400).json({ success: false, error: error.message });
        }

      case 'POST':
        try {
          // Add userId to the note data
          const noteData = { ...req.body, userId };
          const note = await Note.create(noteData);
          return res.status(201).json({ success: true, data: note });
        } catch (error) {
          return res.status(400).json({ success: false, error: error.message });
        }

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}