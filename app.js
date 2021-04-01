const path = require('path')
const express = require('express')
const hbs = require('handlebars')
const exphbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

require('dotenv').config()
require('./config/passport')(passport)

const { checkAuthenticated } = require('./helpers/auth')
const withCurrentUser = require('./middlewares/withCurrentUser')

const port = process.env.PORT || 3000

const app = express()

const serveMedia = express.static(path.join(__dirname, 'media'))

const homeRouter = require(path.join(__dirname, 'routes/home'))
const authRouter = require(path.join(__dirname, 'routes/auth'))
const contributionRouter = require(path.join(__dirname, 'routes/contribution'))
const profileRouter = require(path.join(__dirname, 'routes/profile'))
const facultyRouter = require(path.join(__dirname, 'routes/faculty'))
const userRouter = require(path.join(__dirname, 'routes/user'))
const semesterRouter = require(path.join(__dirname, 'routes/semester'))
const statsRouter = require(path.join(__dirname, 'routes/stats'))

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connected to MongoDB.'))
    .catch(err => console.log(err))

app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(hbs)
}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use(session({
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

require('./helpers/zipFiles')()

app.use('/auth', authRouter)
app.use(checkAuthenticated)
app.use(withCurrentUser)
app.use('/', homeRouter)
app.get('/docs/*.docx', serveMedia)
app.get('/thumbnails/*.jpg', serveMedia)
app.get('/avatars/*', serveMedia)
app.get('/zip/*.zip', serveMedia)
app.use('/contribution', contributionRouter)
app.use('/profile', profileRouter)
app.use('/faculty', facultyRouter)
app.use('/user', userRouter)
app.use('/semester', semesterRouter)
app.use('/stats', statsRouter)

app.listen(port, err => {
    if (err) throw err
    console.log(`running on port ${port}`)
})