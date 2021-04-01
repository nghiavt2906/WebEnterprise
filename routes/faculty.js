const express = require('express')

const router = express.Router()
const controller = require('../controllers/faculty.controller')

router.get('/', controller.getFaculty)
router.post('/', controller.postFaculty)
router.post('/delete', controller.postDeleteFaculty)
router.post('/edit', controller.postEditFaculty)

module.exports = router