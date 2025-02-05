import dbConnect from '../../../lib/dbConnect';
import Note from '../../../models/Note';

export default async function handler(req, res) {
  // Handle OPTIONS request first
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  const {
    query: { id },
    method,
    headers: { authorization },
  } = req;

  try {
    await dbConnect();

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = authorization.split(' ')[1];

    switch (method) {
      case 'PUT':
        try {
          const note = await Note.findOneAndUpdate(
            { _id: id, userId },
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
          );

          if (!note) {
            return res.status(404).json({ error: 'Note not found' });
          }

          return res.status(200).json(note);
        } catch (error) {
          console.error('Update error:', error);
          return res.status(400).json({ error: error.message });
        }

      case 'DELETE':
        try {
          const note = await Note.findOneAndDelete({ _id: id, userId });
          
          if (!note) {
            return res.status(404).json({ error: 'Note not found' });
          }
          
          return res.status(200).json({ success: true, message: 'Note deleted successfully' });
        } catch (error) {
          console.error('Delete error:', error);
          return res.status(400).json({ error: error.message });
        }

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 