const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContributionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    originalFileName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    thumbnailFileName: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'refer', 'approve'],
        default: 'pending'
    },
    facultyId: {
        type: Schema.ObjectId,
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('contribution', ContributionSchema)