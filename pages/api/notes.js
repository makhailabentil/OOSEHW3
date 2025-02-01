import dbConnect from '../../lib/dbConnect';
import Note from '../../models/Note';

export default async function handler(req, res) {
  try {
    await dbConnect();

    switch (req.method) {
      case 'GET':
        try {
          const notes = await Note.find({}).sort({ createdAt: -1 }).lean();
          return res.status(200).json(notes);
        } catch (error) {
          return res.status(400).json({ success: false, error: error.message });
        }

      case 'POST':
        try {
          const note = await Note.create(req.body);
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