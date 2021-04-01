const express = require('express')

const controller = require('../controllers/auth.controller')
const { checkAuthenticated, checkNotAuthenticated } = require('../helpers/auth')

const router = express.Router()

router.get('/login', checkNotAuthenticated, controller.getLogin)
router.get('/signup', checkNotAuthenticated, controller.getSignup)
router.get('/logout', checkAuthenticated, controller.getLogout)
router.get('/forgotPassword', checkNotAuthenticated, controller.getForgotPassword)
router.get('/resetPassword/:token', checkNotAuthenticated, controller.getResetPassword)
router.post('/login', checkNotAuthenticated, controller.postLogin)
router.post('/signup', checkNotAuthenticated, controller.postSignup)
router.post('/forgotPassword', checkNotAuthenticated, controller.postForgotPassword)
router.post('/resetPassword', checkNotAuthenticated, controller.postResetPassword)

module.exports = router