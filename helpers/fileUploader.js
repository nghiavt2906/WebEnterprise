const multer = require('multer')
const fs = require('fs')

const createFileUploader = path => {
    if (!fs.existsSync(__dirname + '\\..\\media')) {
        fs.mkdirSync(__dirname + '\\..\\media');
    }

    let parts = path.split('/')
    parts.shift()

    let modifiedPath = __dirname + "\\..\\" + parts.join("\\")
    if (!fs.existsSync(modifiedPath)) {
        fs.mkdirSync(modifiedPath);
    }
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