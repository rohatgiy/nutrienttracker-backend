const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('this is the home page');
});

module.exports = router;