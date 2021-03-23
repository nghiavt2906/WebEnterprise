module.exports = (req, res, next) => {
    res.locals.currentUser = req.user

    switch (req.user.role) {
        case 'student':
            res.locals.isStudent = true
            break;
        case 'marketing coordinator':
            res.locals.isCoordinator = true
            break;
        case 'marketing manager':
            res.locals.isManager = true
            break;
        case 'admin':
            res.locals.isAdmin = true
            break;
    }

    next()
}