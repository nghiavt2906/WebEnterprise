const express = require('express')

const controller = require('../controllers/stats.controller')

const router = express.Router()

router.get('/', controller.getStats)
router.get('/donut', controller.getDonut)
router.get('/bar', controller.getBar)
router.get('/numbers', controller.getNumbers)

module.exports = router