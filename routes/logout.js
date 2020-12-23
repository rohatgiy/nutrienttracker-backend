const router = require('express').Router();

router.get("/", (req, res) => {
    req.logOut();
    res.end();
})

module.exports = router