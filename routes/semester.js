const express = require('express')
const controller = require('../controllers/semester.controller')

const router = express.Router()

router.get('/', controller.getSemesters)
router.post('/', controller.postSemester)

module.exports = router