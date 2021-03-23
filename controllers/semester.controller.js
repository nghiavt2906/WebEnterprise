const Semester = require('../models/Semester')

const getSemesters = async (req, res) => {
    let semesters = await Semester.find()

    for (const semester of semesters) {
        semester.responseStartDate = new Date(semester.startDate).toLocaleDateString('en-GB')
        semester.responseClosureDate = new Date(semester.closureDate).toLocaleDateString('en-GB')
        semester.responseSubmissionDeadline = new Date(semester.submissionDeadline).toLocaleDateString('en-GB')
    }

    res.render('semester/viewSemesters', { semesters, active: { semesters: true } })
}

const postSemester = async (req, res) => {
    try {
        await Semester(req.body).save()
    } catch (err) {
        console.error(err)
        return res.status(400).send({
            message: err.message
        })
    }

    req.flash('success_msg', 'contribution posted successfully!')
    res.redirect('/semester')
}

module.exports = {
    getSemesters,
    postSemester,
}