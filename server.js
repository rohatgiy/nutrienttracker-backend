const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const uri = process.env.ATLAS_URI;

var app = express();
var router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


/*
    all routes:
        / - home 
                methods: GET
        /add - add a food to today's entry
            methods: GET, POST
        /dashboard - shows today's nutrients
            methods: GET
        /history - shows history of nutrients 
            methods: GET, POST(?)
        /login - where user logs in
            methods: GET, POST 
        /createacc - create account
            methods: GET, POST
*/

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch(err => {
    console.log(`Connection error: ${err.message}`);
});

global.db = mongoose.connection;

// --> /
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// --> /add
const addRouter = require('./routes/add');
app.use('/add', addRouter);

// --> /edit
const editRouter = require('./routes/edit');
app.use('/edit', editRouter);

// --> /dashboard
const dashboardRouter = require('./routes/dashboard');
app.use('/dashboard', dashboardRouter);

// --> /history
const historyRouter = require('./routes/history');
app.use('/history', historyRouter);

// --> /login
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

// --> /createacc
const createaccRouter = require('./routes/createacc');
app.use('/createacc', createaccRouter);

// --> /editacc
const editaccRouter = require('./routes/editacc');
app.use('/editacc', editaccRouter);

// --> /test
const testRouter = require('./routes/test');
app.use('/test', testRouter);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = router;