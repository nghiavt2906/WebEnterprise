const Semester = require('../models/Semester')

const getSemesters = async (req, res) => {
    let semesters = await Semester.find()

    for (const semester of semesters) {
        semester.responseStartDate = new Date(semester.startDate).toLocaleDateString('en-GB')
        semester.responseClosureDate = new Date(semester.closureDate).toLocaleDateString('en-GB')
        semester.responseSubmissionDeadline = new Date(semester.submissionDeadline).toLocaleDateString('en-GB')

        let startDateArr = semester.responseStartDate.split('/')
        semester.editStartDate = `${startDateArr[2]}-${startDateArr[1]}-${startDateArr[0]}`

        let closureDateArr = semester.responseClosureDate.split('/')
        semester.editClosureDate = `${closureDateArr[2]}-${closureDateArr[1]}-${closureDateArr[0]}`

        let submissionDeadlineArr = semester.responseSubmissionDeadline.split('/')
        semester.editSubmissionDeadline = `${submissionDeadlineArr[2]}-${submissionDeadlineArr[1]}-${submissionDeadlineArr[0]}`
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

    req.flash('success_msg', 'semester created successfully!')
    res.redirect('/semester')
}

const postEditSemseter = async (req, res) => {
    await Semester.findByIdAndUpdate(req.body.id, req.body)

    req.flash('success_msg', 'semester edited successfully!')
    res.redirect('/semester')
}

module.exports = {
    getSemesters,
    postSemester,
    postEditSemseter
}