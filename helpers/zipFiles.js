const Semester = require('../models/Semester')
const Contribution = require('../models/Contribution')
const AdmZip = require('adm-zip')
const fs = require('fs')

const zipFiles = () => {
    setInterval(async () => {
        let currentDate = new Date()
        let semester = await Semester.findOne({
            $and: [
                {
                    startDate: {
                        $lte: currentDate
                    },
                },
                {
                    closureDate: {
                        $gte: currentDate
                    }
                }
            ]
        })

        if (semester)
            return

        const lastestSemester = await Semester.findOne({}, {}, { sort: { 'created_at': -1 } })
        if (!lastestSemester)
            return

        if (!fs.existsSync(__dirname + '\\..\\media\\zip')) {
            fs.mkdirSync(__dirname + '\\..\\media\\zip');
        }

        const contributions = await Contribution.find({ semesterId: lastestSemester._id })

        const zip = new AdmZip()

        for (const contribution of contributions) {
            zip.addLocalFile(`./media/docs/${contribution.fileName}`)
        }

        zip.writeZip(`./media/zip/${lastestSemester.name}.zip`)
    }, 1000)
}

module.exports = zipFiles