import * as mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/task-db';

export const connectDb = async (uri = mongodbUrl) => {
    await mongoose.connect(uri);
    console.log('DB connected')

    return mongoose.connection;
}
