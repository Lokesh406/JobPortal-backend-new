import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas connected successfully!');
        console.log('Database:', mongoose.connection.name);
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
};

testConnection();
