const express = require('express')

const createFileUploader = require('../helpers/fileUploader')

const upload = createFileUploader('./media/docs')

const router = express.Router()

const controller = require('../controllers/contribution.controller')

router.get('/', controller.getContributions)
router.post('/', upload.single('file'), controller.postContribution)

router.get('/my', controller.getMyContributions)
router.get('/my/:id', controller.getMyContributionById)

router.get('/upload', controller.getUploadContribution)
router.get('/details/:id', controller.getContributionById)
router.post('/details/comment', controller.postCommentContribution)
router.post('/delete', controller.postDeleteContribution)

router.get('/pending', controller.getPendingContributions)
router.get('/process/:id', controller.getProcessContribution)
router.post('/process/', controller.postProcessContribution)
router.post('/process/feedback', controller.postProcessFeedbackContribution)

router.get('/management', controller.getContributionManagement)

module.exports = router
