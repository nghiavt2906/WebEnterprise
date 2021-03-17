const _ = require('lodash')

const Faculty = require('../models/Faculty')

const getFaculty = (req, res) => {

}

const postFaculty = async (req, res) => {
    const data = _.pick(req.body, ['name'])
    let faculty = Faculty(data)
    try {
        await faculty.validate()
    } catch (err) {
        console.error(err.message)
        return res.status(400).send({
            message: err.message
        })
    }

    let existingFacultyName = await Faculty.findOne({ name: faculty.name })

    if (existingFacultyName) {
        return res.status(400).send({
            message: 'faculty name already exists'
        })
    }

    try {
        await faculty.save()
    } catch (err) {
        console.error(err.message)
        return res.status(400).send({
            message: err.message
        })
    }

    req.flash('success_msg', 'created faculty successfully!')
    res.redirect('/faculty')
}

module.exports = {
    getFaculty,
    postFaculty
}