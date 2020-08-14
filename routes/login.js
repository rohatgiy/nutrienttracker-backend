const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('login here');
});

router.post('/', (req, res, next) => {
    res.json(req.body);
});

module.exports = router;