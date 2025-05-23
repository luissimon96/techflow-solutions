import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let client: MongoClient | null = null;

export const connectToDatabase = async (): Promise<MongoClient> => {
  if (client) {
    return client;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    console.log('Disconnected from MongoDB');
  }
};

export const getDatabase = async () => {
  const client = await connectToDatabase();
  return client.db();
}; 