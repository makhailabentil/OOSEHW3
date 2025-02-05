import dbConnect from '../../../lib/dbConnect';
import Note from '../../../models/Note';

export default async function handler(req, res) {
  try {
    const {
      query: { id },
      method,
      headers: { authorization },
    } = req;

    await dbConnect();

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = authorization.split(' ')[1];

    switch (method) {
      case 'DELETE':
        try {
          const note = await Note.findOne({ _id: id, userId });
          if (!note) {
            return res.status(404).json({ error: 'Note not found' });
          }
          await Note.deleteOne({ _id: id, userId });
          return res.status(200).json({ success: true, message: 'Note deleted successfully' });
        } catch (error) {
          console.error('Delete Error:', error);
          return res.status(400).json({ error: error.message });
        }

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
          return res.status(200).json({ success: true, data: note });
        } catch (error) {
          console.error('Update Error:', error);
          return res.status(400).json({ error: error.message });
        }

      default:
        res.setHeader('Allow', ['DELETE', 'PUT']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 