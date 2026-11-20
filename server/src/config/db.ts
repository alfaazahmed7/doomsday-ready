import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MongoDB connection failed');
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connection is successful');
        console.log('Database:', mongoose.connection.name);
    }
    catch (error) {
        console.error('MongoDB connection failed with:', error);
        process.exit(1);
    }
}