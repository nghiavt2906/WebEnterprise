const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    facultyId: {
        type: Schema.ObjectId,
        ref: 'faculty'
    }
}, { timestamps: true })

module.exports = mongoose.model('profile', ProfileSchema)