const router = require('express').Router();

router.get('/',  (req, res, next) => {
    res.send('view today\'s nutrients');
});

router.post('/', (req, res, next) => {
    res.json(req.body);
});

module.exports = router;