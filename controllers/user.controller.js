const _ = require('lodash')
const bcrypt = require('bcrypt')

const Faculty = require('../models/Faculty')
const User = require('../models/User')
const Profile = require('../models/Profile')

const getUsers = async (req, res) => {
    let users = await User.find({
        role: { $ne: 'admin' }
    })

    let faculties = await Faculty.find()

    let idx = 0
    for (const user of users) {
        await user.populate('profileId').execPopulate()
        await user.profileId.populate('facultyId').execPopulate()
        user.idx = ++idx
    }

    res.render('user/viewUsers', { faculties, users, active: { accounts: true } })
}

const postUser = async (req, res) => {
    let userData = _.pick(req.body, ['username', 'email', 'password', 'role'])
    let profileData = _.pick(req.body, [
        'firstName',
        'lastName',
        'gender',
        'address',
        'phoneNumber',
        'description'
    ])

    if (req.body.facultyId)
        profileData.facultyId = req.body.facultyId

    let user = User(userData)
    let profile = Profile(profileData)

    let existingUsername = await User.findOne({ username: user.username })

    if (existingUsername) {
        return res.status(400).send({
            message: 'username already exists'
        })
    }

    let existingEmail = await User.findOne({ email: user.email })

    if (existingEmail) {
        return res.status(400).send({
            message: 'email already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    user.password = hashedPassword

    try {
        await profile.validate()
        const profileResult = await profile.save()

        user.profileId = profileResult._id
        await user.validate()
        await user.save()
    } catch (err) {
        console.error(err.message)
        return res.status(400).send({
            message: err.message
        })
    }

    req.flash('success_msg', 'created a new user successfully!')
    res.redirect('/user')
}

const postDeleteUser = async (req, res) => {
    let userId = req.body.id

    let user = await User.findById(userId)
    let profile = await Profile.findById(user.profileId)

    await user.remove()
    await profile.remove()

    req.flash('success_msg', 'deleted user successfully!')
    res.redirect('/user')
}

const postAvatar = async (req, res) => {
    let user = await User.findByIdAndUpdate(req.user._id, {
        avatarUrl: req.file.filename
    })

    req.flash('success_msg', 'uploaded avatar successfully!')
    res.redirect('/profile')
}

const getEditUser = async (req, res) => {
    let user = await User.findById(req.params.id)
    await user.populate('profileId').execPopulate()
    let faculties = await Faculty.find()

    if (user.profileId.gender === 'male') {
        isMaleSelected = true
        isFemaleSelected = false
    }
    else {
        isFemaleSelected = true
        isMaleSelected = false
    }

    for (let index = 0; index < faculties.length; index++) {
        if (faculties[index]._id.toString() === user.profileId.facultyId.toString())
            faculties[index].isSelected = true
        else
            faculties[index].isSelected = false
    }

    res.render('user/edit', { user, faculties, isMaleSelected, isFemaleSelected })
}

const postEditUser = async (req, res) => {
    let user = await User.findById(req.body.id)
    user.email = req.body.email
    await Profile.findByIdAndUpdate(user.profileId, req.body)
    await user.save()

    req.flash('success_msg', 'updated user successfully!')
    res.redirect('/user')
}

module.exports = {
    getUsers,
    getEditUser,
    postUser,
    postEditUser,
    postDeleteUser,
    postAvatar
}