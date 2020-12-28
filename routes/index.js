const router = require('express').Router();

router.get('/', (req, res, next) => {
    if (req.user)
    {
        res.send(req.user)
    } 
    else
    {
        res.send({});
    }
    
});

module.exports = router;