const express = require('express')
const controller = require('../controllers/semester.controller')

const router = express.Router()

router.get('/', controller.getSemesters)
router.post('/edit', controller.postEditSemseter)
router.post('/', controller.postSemester)
router.post('/delete', controller.postDeleteSemester)

module.exports = router