import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const VERCEL_URL = process.env.VERCEL_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Add URL configuration for Vercel
const opts = {
  bufferCommands: false,
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  ...(VERCEL_URL && { 
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000
  })
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;