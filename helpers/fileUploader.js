const multer = require('multer')

const createFileUploader = path => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path)
        },
        filename: function (req, file, cb) {
            cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.${file.originalname.split('.').pop()}`)
        }
    })
    const upload = multer({ storage })

    return upload
}

module.exports = createFileUploader