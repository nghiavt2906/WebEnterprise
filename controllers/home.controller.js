const Faculty = require('../models/Faculty')

const getHome = async (req, res) => {
    if (req.user.role === 'student' || req.user.role === 'guest') {
        return res.redirect('/contribution')
    }

    let faculties = await Faculty.find({})
    res.render('home', {
        faculties,
        active: { dashboard: true }
    })
}

module.exports = {
    getHome
}