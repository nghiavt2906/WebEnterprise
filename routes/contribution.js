const express = require('express')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './media/docs')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.${file.originalname.split('.').pop()}`)
    }
})
const upload = multer({ storage })

const router = express.Router()

const controller = require('../controllers/contribution.controller')

router.get('/', controller.getContributions)
router.post('/', upload.single('file'), controller.postContribution)

router.get('/my', controller.getMyContributions)
router.get('/my/:id', controller.getMyContributionById)

router.get('/upload', controller.getUploadContribution)
router.get('/details/:id', controller.getContributionById)
router.post('/delete', controller.postDeleteContribution)

router.get('/pending', controller.getPendingContributions)
router.get('/process/:id', controller.getProcessContribution)
router.post('/process/', controller.postProcessContribution)

module.exports = router
