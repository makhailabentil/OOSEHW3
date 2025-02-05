import dbConnect from '../../../lib/dbConnect';
import Note from '../../../models/Note';
import { config } from './config';

export { config };

export default async function handler(req, res) {
  const { method, headers: { authorization } } = req;

  await dbConnect();

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = authorization.split(' ')[1];

  switch (method) {
    case 'GET':
      try {
        const notes = await Note.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json(notes);
      } catch (error) {
        console.error('GET error:', error);
        return res.status(400).json({ error: error.message });
      }

    case 'POST':
      try {
        const note = await Note.create({ ...req.body, userId });
        return res.status(201).json(note);
      } catch (error) {
        console.error('POST error:', error);
        return res.status(400).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 