const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

PORT = process.env.PORT || 5000;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);
app.use('/add', router);

/*
    all routes:
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
        / - home 
            methods: GET
*/

router.get('/', (req, res, next) => {
    res.send('this is the home page');
});

router.get('/add', (req, res, next) => {
    res.send('this is where you can add foods to today\'s entry');
});

router.post('/add', (req, res, next) => {
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

module.exports = router;