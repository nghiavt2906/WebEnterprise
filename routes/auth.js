const express = require('express')
const controller = require('../controllers/auth.controller')

const router = express.Router()

router.get('/login', controller.getLogin)
router.get('/signup', controller.getSignup)
router.get('/logout', controller.getLogout)
router.post('/login', controller.postLogin)
router.post('/signup', controller.postSignup)

module.exports = router