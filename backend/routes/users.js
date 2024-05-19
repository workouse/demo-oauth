const express = require('express');
const passport = require('passport');
const {createUser} = require('../services/database');
const crypto = require('crypto');

const router = express.Router();

router.get('/me', (req, res) => {
    let user = req.user;
    if(!user){
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
    res.json( user );
});
const createPassword = async (password) => {
    return new Promise((resolve,reject)=>{
        let salt = crypto.randomBytes(16).toString('base64');
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { 
                return reject(err); 
            }
            let hashed = hashedPassword.toString('hex');
            resolve({salt,hashedPassword:hashed});
        });
   });
}
router.post('/register', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;


    let {salt,hashedPassword} = await createPassword(password);
    
    let user = await createUser(req.db,username, hashedPassword,salt, username,null, 'local');

    res.json({
        message: 'User created successfully.',
        user:user 
    });
});

module.exports = router;
