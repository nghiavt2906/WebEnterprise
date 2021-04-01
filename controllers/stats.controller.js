const Contribution = require('../models/Contribution')
const Semester = require('../models/Semester')
const Faculty = require('../models/Faculty')

const getStats = async (req, res) => {
    const lastestSemester = await Semester.findOne({}, {}, { sort: { 'created_at': -1 } })
    res.render('stats/view', { active: { stats: true }, semester: lastestSemester })
}

const getDonut = async (req, res) => {
    const lastestSemester = await Semester.findOne({}, {}, { sort: { 'created_at': -1 } })
    const faculties = await Faculty.find()
    let contributions = await Contribution.find({ semesterId: lastestSemester._id, status: 'approve' })

    let data = []

    for (const faculty of faculties) {
        let count = await contributions.filter(x => x.facultyId.toString() === faculty._id.toString()).length
        data.push({
            label: faculty.name,
            value: ((count * 100) / contributions.length).toFixed(2)
        })
    }

    res.json(data)
}

const getBar = async (req, res) => {
    const lastestSemester = await Semester.findOne({}, {}, { sort: { 'created_at': -1 } })
    const faculties = await Faculty.find()
    let contributions = await Contribution.find({ semesterId: lastestSemester._id, status: 'approve' })

    let data = []

    for (const faculty of faculties) {
        let count = await contributions.filter(x => x.facultyId.toString() === faculty._id.toString()).length
        data.push({
            y: faculty.name,
            a: count
        })
    }

    res.json(data)
}

const getNumbers = async (req, res) => {
    const lastestSemester = await Semester.findOne({}, {}, { sort: { 'created_at': -1 } })
    let contributions = await Contribution.find({ semesterId: lastestSemester._id })

    let num1 = await contributions.filter(x => x.contributionFeedbacks.length === 0).length
    let num2 = await contributions.filter(x => x.contributionFeedbacks.length === 0 && ((new Date()).getTime() - x.createdAt.getTime()) / (1000 * 3600 * 24) > 14).length

    res.json({
        num1,
        num2
    })
}

module.exports = {
    getStats,
    getBar,
    getDonut,
    getNumbers
}