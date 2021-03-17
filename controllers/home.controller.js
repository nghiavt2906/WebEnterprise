const Faculty = require('../models/Faculty')

const getHome = async (req, res) => {
    let faculties = await Faculty.find({})
    res.render('home', {
        faculties,
        active: { dashboard: true }
    })
}

module.exports = {
    getHome
}