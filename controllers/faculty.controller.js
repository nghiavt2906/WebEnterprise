const _ = require('lodash')

const Faculty = require('../models/Faculty')

const getFaculty = async (req, res) => {
    let faculties = await Faculty.find()
    let idx = 0
    for (const faculty of faculties) {
        faculty.idx = ++idx
    }
    res.render('faculty/view', { faculties, active: { faculty: true } })
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

const postDeleteFaculty = async (req, res) => {
    await Faculty.findByIdAndDelete(req.body.id)

    req.flash('success_msg', 'deleted faculty successfully!')
    res.redirect('/faculty')
}

const postEditFaculty = async (req, res) => {
    await Faculty.findByIdAndUpdate(req.body.id, req.body)

    req.flash('success_msg', 'edited faculty successfully!')
    res.redirect('/faculty')
}

module.exports = {
    getFaculty,
    postFaculty,
    postDeleteFaculty,
    postEditFaculty
}