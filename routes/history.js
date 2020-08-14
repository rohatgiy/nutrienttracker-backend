const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('view the history of your nutrients');
});

router.post('/', (req, res, next) => {
    res.json(req.body);
});

module.exports = router;