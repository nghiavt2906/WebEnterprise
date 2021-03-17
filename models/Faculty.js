const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FacultySchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('faculty', FacultySchema)