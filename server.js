const express = require('express');
const bodyParser = require('body-parser');
const { request } = require('express');
var router = express.Router();

PORT = process.env.PORT || 5000;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);
app.use('/add', router);
app.use('/dashboard', router);
app.use('/history', router);
app.use('/login', router);
app.use('/createacc', router);

/*
    all routes:
        / - home 
                methods: GET
        /add - add a food to today's entry
            methods: GET, POST
        /dashboard - shows today's nutrients
            methods: GET, POST
        /history - shows history of nutrients 
            methods: GET, POST(?)
        /login - where user logs in
            methods: GET, POST 
        /createacc - create account
            methods: GET, POST
*/

// --> /
router.get('/', (req, res, next) => {
    res.send('this is the home page');
});

// --> /add
router.get('/add', (req, res, next) => {
    res.send('this is where you can add foods to today\'s entry');
});

router.post('/add', (req, res, next) => {
    res.json(req.body);
});

// --> /dashboard
router.get('/dashboard',  (req, res, next) => {
    res.send('view today\'s nutrients');
});

router.post('/dashboard', (req, res, next) => {
    res.json(request.body);
});

// --> /history
router.get('/history', (req, res, next) => {
    res.send('view the history of your nutrients');
});

router.post('/history', (req, res, next) => {
    res.json(req.body);
});

// --> /login
router.get('/login', (req, res, next) => {
    res.send('login here');
});

router.post('/login', (req, res, next) => {
    res.json(res.body);
});

// --> /createacc
router.get('/createacc', (req, res, next) => {
    res.send('create an account here');
});

router.post('/createacc', (req, res, next) => {
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

module.exports = router;