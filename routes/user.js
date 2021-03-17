const express = require('express')
const controller = require('../controllers/user.controller')

const router = express.Router()

router.get('/', controller.getUsers)
router.post('/', controller.postUser)

module.exports = router