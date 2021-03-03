const { getThumbnail } = require('../helpers/thumbnailExtractor')

const getContributions = (req, res) => {

    res.send('get contributions')
}

const postContribution = (req, res) => {

    res.send('posted successfully')
}

module.exports = {
    getContributions,
    postContribution
}