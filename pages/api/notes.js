import dbConnect from '../../lib/dbConnect';
import Note from '../../models/Note';

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = authHeader.split(' ')[1];

    switch (req.method) {
      case 'GET':
        try {
          const notes = await Note.find({ userId })
            .sort({ createdAt: -1 })
            .lean();
          return res.status(200).json(notes);
        } catch (error) {
          console.error('GET Error:', error);
          return res.status(400).json({ error: error.message });
        }

      case 'POST':
        try {
          const noteData = { ...req.body, userId };
          const note = await Note.create(noteData);
          return res.status(201).json({ success: true, data: note });
        } catch (error) {
          console.error('POST Error:', error);
          return res.status(400).json({ error: error.message });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}