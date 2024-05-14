const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/me', (req, res) => {
    let user = req.user;
    res.json( user );
    });

module.exports = router;
