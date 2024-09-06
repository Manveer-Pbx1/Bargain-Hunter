// connect to mongodb database
const mongoose = require('mongoose');

const connectDB = () => {
mongoose.connect('mongodb://localhost:27017/bargainHunter')
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Could not connect to database', err));
}
module.exports = connectDB;