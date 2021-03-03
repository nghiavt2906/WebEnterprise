const getProfile = (req, res, next) => {
    res.render('profile', {
        user: req.user
    })
}

module.exports = {
    getProfile
}

