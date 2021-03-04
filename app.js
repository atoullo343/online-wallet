  require("dotenv").config()


const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const flash = require("connect-flash")
const app = express()
const bodyParser = require('body-parser')

// Passport config
require("./config/passport")(passport)

// connect to mongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
// .then( () => console.log('MongoDB connected...'))
// .catch(err => console.log(err));
// Connect to MongoDB
const db = mongoose.connection

db.once("open", () => console.log("MongoDb connected..."))
db.on("error", (err) => console.log("Mongo DB ulanmadi: " + err))

//view engine set
// app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts' }))
// app.set('views', path.join(__dirname, 'views'));

// EJS
app.use(expressLayouts)
app.set("view engine", "ejs")

// Bodyparser
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash

app.use(flash())

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
})

// Routes
app.use("/", require("./routes/index"))
app.use("/", require("./routes/users"))
app.use('/expenses', require('./routes/expenses'))

// app.use('/files', require('./routes/files'))

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`Server started on ${port} port`);
})
