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

const port = process.env.PORT || 3000

const app = express()

const serveDocs = express.static(path.join(__dirname, 'media'))

const authRouter = require(path.join(__dirname, 'routes/auth'))
const contributionRouter = require(path.join(__dirname, 'routes/contribution'))
const profileRouter = require(path.join(__dirname, 'routes/profile'))

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

app.use('/auth', authRouter)
app.use(checkAuthenticated)
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/docs/*.docx', serveDocs)
app.use('/contribution', contributionRouter)
app.use('/profile', profileRouter)

app.listen(port, err => {
    if (err) throw err
    console.log(`running on port ${port}`)
})