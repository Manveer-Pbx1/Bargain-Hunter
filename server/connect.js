// connect to mongodb database
const mongoose = require('mongoose');
const connectDB = async () => {
    const URI = process.env.MONGO_URI
    if (!URI) {
        console.error('MongoDB URI is not defined in the environment variables.');
        process.exit(1); // Exit the process if URI is not defined
    }
    try {
        await mongoose.connect(URI)
        console.log('Connected to the MongoDB database');
    } catch (err) {
        console.error('Could not connect to the MongoDB database', err);
        process.exit(1); // Exit the process if the connection fails
    }
}
module.exports = connectDB;