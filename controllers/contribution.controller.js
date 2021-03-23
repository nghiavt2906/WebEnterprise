const _ = require('lodash')
const path = require('path')
const fs = require('fs/promises')
const moment = require('moment')
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
const nodemailer = require('nodemailer')

const { getThumbnail } = require('../helpers/thumbnailExtractor')
const Contribution = require('../models/Contribution')
const Profile = require('../models/Profile')
const Semester = require('../models/Semester')
const User = require('../models/User')

TimeAgo.addDefaultLocale(en)
// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

const getContributions = async (req, res) => {
    let perPage = 8
    let currentPage = parseInt(req.query.page)
    if (!currentPage)
        currentPage = 1

    let contributions = await Contribution
        .find({
            status: 'approve'
        })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage)
    let count = await Contribution.countDocuments({ status: 'approve' })

    let numOfPages = Math.ceil(count / perPage)

    let isPreviousEnabled = false
    let isNextEnabled = false

    let previousPageNum, nextPageNum
    if (currentPage > 1) {
        isPreviousEnabled = true
        previousPageNum = currentPage - 1
    }

    if (currentPage < numOfPages) {
        isNextEnabled = true
        nextPageNum = currentPage + 1
    }

    let numList = _.range(1, numOfPages + 1).map(x => ({ number: x, isActive: currentPage === x ? true : false }))

    res.render('contribution/viewContributions', {
        contributions,
        numList,
        currentPage,
        isPreviousEnabled,
        isNextEnabled,
        previousPageNum,
        nextPageNum
    })
}

const getMyContributions = async (req, res) => {
    let perPage = 8
    let currentPage = parseInt(req.query.page)
    if (!currentPage)
        currentPage = 1

    let contributions = await Contribution
        .find({
            userId: req.user._id
        })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage)
    let count = await Contribution.countDocuments({ userId: req.user._id })

    let numOfPages = Math.ceil(count / perPage)

    let isPreviousEnabled = false
    let isNextEnabled = false

    let previousPageNum, nextPageNum
    if (currentPage > 1) {
        isPreviousEnabled = true
        previousPageNum = currentPage - 1
    }

    if (currentPage < numOfPages) {
        isNextEnabled = true
        nextPageNum = currentPage + 1
    }

    let numList = _.range(1, numOfPages + 1).map(x => ({ number: x, isActive: currentPage === x ? true : false }))

    res.render('contribution/viewMyContributions', {
        contributions,
        numList,
        currentPage,
        isPreviousEnabled,
        isNextEnabled,
        previousPageNum,
        nextPageNum,
        active: { myContributions: true }
    })
}

const getMyContributionById = async (req, res) => {
    let contribution = await Contribution.findById(req.params.id)

    let status = 'pending'
    let statusColor = ''

    switch (contribution.status) {
        case 'approve':
            status = 'approved'
            statusColor = '#28a745'
            break;
        case 'refer':
            status = 'referred'
            statusColor = '#dc3545'
            break;
    }

    let submissionDate = moment(contribution.createdAt).format('DD-MM-YYYY')

    await contribution.populate('userId').execPopulate()

    for (let index = 0; index < contribution.contributionFeedbacks.length; index++) {
        let feedback = contribution.contributionFeedbacks[index]
        await contribution.populate(`contributionFeedbacks.${index}.userId`).execPopulate()

        feedback.timeAgo = timeAgo.format(feedback.updatedAt)

        if (index === 0)
            feedback.isNotFirst = false
        else
            feedback.isNotFirst = true
    }

    res.render('contribution/viewMyContributionById', {
        contribution,
        status,
        statusColor,
        submissionDate
    })
}

const getContributionById = async (req, res) => {
    let contribution = await Contribution.findById(req.params.id)
    let recommendContributions = []
    let count = await Contribution.countDocuments()
    let numForRand = 6

    let i = 0
    if (count > numForRand)
        while (i < numForRand) {
            let random = Math.floor(Math.random() * count)
            let randContribution = await Contribution.findOne().skip(random)
            if (!recommendContributions.map(x => x._id.toString()).includes(randContribution._id.toString()) && randContribution._id.toString() !== contribution._id.toString()) {
                recommendContributions.push(randContribution)
                i++
            }
        }

    res.render('contribution/details', {
        contribution,
        recommendContributions
    })
}

const getUploadContribution = async (req, res) => {
    let perPage = 8
    let currentPage = parseInt(req.query.page)
    if (!currentPage)
        currentPage = 1

    let contributions = await Contribution
        .find({ userId: req.user._id })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage)

    for (const contribution of contributions) {
        switch (contribution.status) {
            case 'pending':
                contribution.status = 'pending'
                contribution.statusBadge = 'badge-secondary'
                contribution.isEditEnabled = true
                break;
            case 'approve':
                contribution.status = 'approved'
                contribution.statusBadge = 'badge-success'
                contribution.isEditEnabled = false
                break;
            case 'refer':
                contribution.status = 'referred'
                contribution.statusBadge = 'badge-danger'
                contribution.isEditEnabled = false
                break;
        }
    }


    let count = await Contribution.countDocuments({ userId: req.user._id })

    let numOfPages = Math.ceil(count / perPage)

    let isPreviousEnabled = false
    let isNextEnabled = false

    let previousPageNum, nextPageNum
    if (currentPage > 1) {
        isPreviousEnabled = true
        previousPageNum = currentPage - 1
    }

    if (currentPage < numOfPages) {
        isNextEnabled = true
        nextPageNum = currentPage + 1
    }

    let numList = _.range(1, numOfPages + 1).map(x => ({ number: x, isActive: currentPage === x ? true : false }))

    let currentDate = new Date()

    let semester = await Semester.findOne({
        $and: [
            {
                startDate: {
                    $lte: currentDate
                },
            },
            {
                closureDate: {
                    $gt: currentDate
                }
            }
        ]
    })

    semester.startDateDisplay = semester.startDate.toLocaleDateString('en-GB')
    semester.closureDateDisplay = semester.closureDate.toLocaleDateString('en-GB')
    semester.submissionDeadlineDisplay = semester.submissionDeadline.toLocaleDateString('en-GB')

    res.render('contribution/uploadContribution', {
        active: { uploadDocument: true },
        contributions,
        numList,
        currentPage,
        isPreviousEnabled,
        isNextEnabled,
        previousPageNum,
        nextPageNum,
        numOfUploads: count,
        semester
    })
}

const getPendingContributions = async (req, res) => {
    let perPage = 8
    let currentPage = parseInt(req.query.page)
    if (!currentPage)
        currentPage = 1

    let contributions = await Contribution
        .find({ status: 'pending' })
        .skip((perPage * currentPage) - perPage)
        .limit(perPage)
    let count = await Contribution.countDocuments({ status: 'pending' })

    let numOfPages = Math.ceil(count / perPage)

    let isPreviousEnabled = false
    let isNextEnabled = false

    let previousPageNum, nextPageNum
    if (currentPage > 1) {
        isPreviousEnabled = true
        previousPageNum = currentPage - 1
    }

    if (currentPage < numOfPages) {
        isNextEnabled = true
        nextPageNum = currentPage + 1
    }

    let numList = _.range(1, numOfPages + 1).map(x => ({ number: x, isActive: currentPage === x ? true : false }))

    res.render('contribution/pendingContributions', {
        contributions,
        numList,
        currentPage,
        isPreviousEnabled,
        isNextEnabled,
        previousPageNum,
        nextPageNum,
        active: { contributions: true }
    })
}

const getProcessContribution = async (req, res) => {
    let contribution = await Contribution.findById(req.params.id)

    await contribution.populate('userId').execPopulate()

    for (let index = 0; index < contribution.contributionFeedbacks.length; index++) {
        let feedback = contribution.contributionFeedbacks[index]
        await contribution.populate(`contributionFeedbacks.${index}.userId`).execPopulate()

        feedback.timeAgo = timeAgo.format(feedback.updatedAt)

        if (index === 0)
            feedback.isNotFirst = false
        else
            feedback.isNotFirst = true
    }

    res.render('contribution/processContribution', {
        contribution
    })
}

const postContribution = async (req, res) => {
    let profile = await Profile.findById(req.user.profileId)
    let arr = req.file.originalname.split('.')
    arr.pop()

    let data = {
        title: req.body.title,
        content: req.body.content,
        fileName: req.file.filename,
        thumbnailFileName: `${req.file.filename.split('.')[0]}.jpg`,
        userId: req.user._id,
        facultyId: profile.facultyId,
        originalFileName: req.file.originalname
    }

    let contribution = Contribution(data)
    try {
        getThumbnail(data.fileName)
        contribution = await contribution.save()
    } catch (err) {
        console.error(err.message)
        return res.status(400).send({
            message: err.message
        })
    }

    let smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nghiademo312@gmail.com',
            pass: 'BxFU*8hNULYq#=YW'
        }
    })

    let body = '<p>A new pending contribution has been uploaded by a student of your faculty.</p>' +
        '<p>Please make a comment within 14 days in the link below</p>' +
        `<b>Link:</b>${process.env.DOMAIN}/contribution/process/${contribution._id}`

    let user = await User.findById(req.user._id)
    await user.populate('profileId').execPopulate()

    let coordinators = await User.find({
        role: 'marketing coordinator'
    })

    let email = ''

    for (const coordinator of coordinators) {
        await coordinator.populate('profileId').execPopulate()

        if (coordinator.profileId.facultyId.toString() == user.profileId.facultyId.toString())
            email = coordinator.email
    }

    let mailOptions = {
        to: email,
        from: 'journal@gmail.com',
        subject: 'New uploaded contribution',
        html: body
    }

    await smtpTransport.sendMail(mailOptions);

    req.flash('success_msg', 'contribution posted successfully!')
    res.redirect('/contribution/upload')
}

const postDeleteContribution = async (req, res) => {
    let contribution = await Contribution.findById(req.body.id)
    let filePath = path.join('./media/docs', contribution.fileName)
    let thumbnailPath = path.join('./media/thumbnails', contribution.thumbnailFileName)

    if (contribution.userId.toString() !== req.user._id.toString())
        return res.send('Permission denied.')

    await contribution.remove()
    await fs.unlink(filePath)
    await fs.unlink(thumbnailPath)

    req.flash('success_msg', 'contribution deleted successfully!')
    res.redirect(req.body.redirect)
}

const postProcessContribution = async (req, res) => {
    await Contribution.findByIdAndUpdate(req.body.id, {
        status: req.body.action
    })

    switch (req.body.action) {
        case 'approve':
            req.flash('success_msg', 'contribution has been approved!')
            break;
        case 'refer':
            req.flash('success_msg', 'contribution has been referred!')
            break;
        default:
            break;
    }
    res.redirect('/contribution/pending')
}

const postProcessFeedbackContribution = async (req, res) => {
    let { content, userId, contributionId } = req.body

    let contribution = await Contribution.findById(contributionId)

    await contribution.contributionFeedbacks.push({
        content,
        userId
    })

    await contribution.save()

    req.flash('success_msg', 'sent feedback successfully!')
    res.redirect(`/contribution/process/${contributionId}`)
}

module.exports = {
    getContributions,
    getContributionById,
    getMyContributions,
    getMyContributionById,
    getPendingContributions,
    getProcessContribution,
    getUploadContribution,
    postContribution,
    postDeleteContribution,
    postProcessContribution,
    postProcessFeedbackContribution
}