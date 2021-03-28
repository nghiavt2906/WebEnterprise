const express = require('express')
const createFileUploader = require('../helpers/fileUploader')

const controller = require('../controllers/user.controller')

const uploader = createFileUploader('./media/avatars')

const router = express.Router()

router.get('/', controller.getUsers)
router.get('/edit/:id', controller.getEditUser)
router.post('/', controller.postUser)
router.post('/edit', controller.postEditUser)
router.post('/delete', controller.postDeleteUser)
router.post('/avatar', uploader.single('avatar'), controller.postAvatar)

module.exports = router