const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('this is where you can add foods to today\'s entry');
});

// router.post('/add', (req, res, next) => {
//     res.json(req.body);
// });

module.exports = router;