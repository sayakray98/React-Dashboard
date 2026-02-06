const mongoose = require('mongoose');
const mongooseURI = 'mongodb://localhost:27017/';

const connectToMongoose = () => {

    mongoose.connect(mongooseURI);
    console.log('Database Connection Successfully!')

}

module.exports = connectToMongoose;