const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SemesterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    closureDate: {
        type: Date,
        required: true
    },
    submissionDeadline: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('semester', SemesterSchema)