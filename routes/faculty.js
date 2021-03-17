const express = require('express')

const router = express.Router()
const controller = require('../controllers/faculty.controller')

router.get('/', controller.getFaculty)
router.post('/', controller.postFaculty)

module.exports = router