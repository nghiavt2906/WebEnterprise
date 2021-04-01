const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContributionFeedbackSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'user'
    }
}, { timestamps: true })

const ContributionCommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'user'
    }
}, { timestamps: true })

const ContributionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
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
        required: true,
        ref: 'user'
    },
    semesterId: {
        type: Schema.ObjectId,
        required: true
    },
    contributionFeedbacks: [ContributionFeedbackSchema],
    contributionComments: [ContributionCommentSchema]
}, { timestamps: true })

module.exports = mongoose.model('contribution', ContributionSchema)