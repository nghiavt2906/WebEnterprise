const _ = require('lodash')
const bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

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

const getForgotPassword = (req, res) => {
    res.render('auth/forgotPassword', { layout: 'auth' })
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

const postForgotPassword = async (req, res) => {
    let smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nghiademo312@gmail.com',
            pass: 'BxFU*8hNULYq#=YW'
        }
    })

    let user = await User.findOne({ email: req.body.email })
    let secret = user._id.toString() + user.password
    let token = jwt.sign(
        {
            user: {
                id: user._id,
                email: user.email
            }
        },
        secret,
        {
            expiresIn: '30m'
        }
    )

    let body = `<p>Please click <a href='${process.env.DOMAIN}/auth/resetPassword/${token}'>here</a> for password reset</p>`

    let mailOptions = {
        to: req.body.email,
        from: 'journal@gmail.com',
        subject: 'Password recovery',
        html: body
    }

    await smtpTransport.sendMail(mailOptions);

    req.flash('success_msg', 'Please check your email.')
    res.redirect('/auth/login')
}

const getResetPassword = async (req, res) => {
    const token = req.params.token
    let payload = jwt.decode(token)
    let user = await User.findById(payload.user.id)
    let secret = payload.user.id + user.password

    try {
        await jwt.verify(token, secret)
    } catch (err) {
        return res.send('Invalid token')
    }

    res.render('auth/resetPassword', { layout: 'auth', userId: payload.user.id })
}

const postResetPassword = async (req, res) => {
    let password = req.body.password
    let hashedPassword = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(req.body.userId, {
        password: hashedPassword
    })

    req.flash('success_msg', 'Password changed successfully.')
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
    getForgotPassword,
    getResetPassword,
    postLogin,
    postSignup,
    postForgotPassword,
    postResetPassword
}