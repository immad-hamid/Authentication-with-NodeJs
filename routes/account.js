const router    = require('express').Router();
// using json web token npm module
const jwt       = require('jsonwebtoken');
// importing user
const User      = require('../models/user');
const config    = require('../config');

// signup API
router.post('/signup', (req, res, next) => {
    let user = new User();
    // user properties we need to capture
    user.name       = req.body.name;
    user.email      = req.body.email;
    user.password   = req.body.password;
    user.picture    = user.gravatar();
    user.isSeller   = req.body.isSeller;

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            console.log(existingUser);
            res.json({
                success: false,
                message: 'Account with that  email already exist'
            });
        } else {
            user.save();
            const token = jwt.sign({
                user: user
            }, config.secret, {
                expiresIn: '7d'
            });

            res.json({
                success: true,
                message: 'Enjoy your token',
                token: token
            });
        }
    });
});

// login api
router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed, User not found'
            });
        }
        else if (user) {
            const validPassword = user.comparePassword(req.body.password);
            
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed, wrong password'
                });
            } else {
                const token = jwt.sign({
                    user: user
                }, config.secret, {
                    expiresIn: '7d'
                });

                res.json({
                    success: true,
                    message: 'Authentication Success',
                    token: token
                });
            }            
        }
    });
});

module.exports = router;