const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    Address: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('profile', ProfileSchema)