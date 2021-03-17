const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GuestSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('guest', GuestSchema)