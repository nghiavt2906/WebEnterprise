const _ = require('lodash')
const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../models/User')
const Profile = require('../models/Profile')
const Faculty = require('../models/Faculty')

const getLogin = (req, res) => {
    res.render('auth/login', {
        layout: 'auth'
    })
}

const postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next)
}

const getSignup = async (req, res) => {
    let faculties = await Faculty.find()
    res.render('auth/signUp', {
        layout: 'auth',
        faculties
    })
}

const postSignup = async (req, res) => {
    let userData = _.pick(req.body, ['username', 'email', 'password'])
    let profileData = _.pick(req.body, [
        'firstName',
        'lastName',
        'gender',
        'address',
        'phoneNumber',
        'facultyId'
    ])

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

    req.flash('success_msg', 'registered successfully!')
    res.redirect('/auth/login')
}

const getLogout = (req, res) => {
    req.logOut()
    req.flash('success_msg', 'You are logged out.')
    res.redirect('/auth/login')
}

module.exports = {
    getLogin,
    getSignup,
    getLogout,
    postLogin,
    postSignup
}