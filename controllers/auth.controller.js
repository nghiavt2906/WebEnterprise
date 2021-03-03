const _ = require('lodash')
const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../models/User')

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

const getSignup = (req, res) => {
    res.render('auth/signUp', {
        layout: 'auth'
    })
}

const postSignup = async (req, res) => {
    let data = _.pick(req.body, ['username', 'email', 'password'])
    let user = User(data)
    let errors = []

    try {
        await user.validate()
    } catch (err) {
        console.error(err.message)
        return res.status(400).send({
            message: err.message
        })
    }

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

    const hashedPassword = await bcrypt.hash(data.password, 10)
    user.password = hashedPassword

    const result = await user.save()

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