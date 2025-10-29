import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // In serverless environments (Vercel), exiting the process crashes the function.
    // Throw the error so the caller can decide how to handle it.
    throw error;
  }
};

export default connectDB;
