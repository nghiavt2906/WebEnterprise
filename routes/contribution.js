const express = require('express')
const router = express.Router()

const controller = require('../controllers/contribution.controller')

router.get('/', controller.getContributions)
router.post('/', controller.postContribution)

module.exports = router
