const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['guest', 'student', 'marketing coordinator', 'marketing manager', 'admin'],
        default: 'guest'
    },
    profileId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'profile'
    },
    avatarUrl: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('user', UserSchema)