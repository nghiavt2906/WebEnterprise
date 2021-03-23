const getProfile = async (req, res, next) => {
    let user = await req.user.populate('profileId').execPopulate()
    await user.profileId.populate('facultyId').execPopulate()

    res.render('profile', {
        user
    })
}

module.exports = {
    getProfile
}

