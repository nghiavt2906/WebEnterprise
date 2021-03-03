const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return next()

    req.flash('error_msg', 'Permission denied')
    res.redirect('/auth/login')
}

const checkNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated())
        return next()

    res.redirect('/')
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}