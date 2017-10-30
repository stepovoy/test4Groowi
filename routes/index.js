const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.post('/add', (req, res) => {
    var user = req.username;

    Account.findOne({ 'username': user }, function (err, person) {
        if (err) {
            return next(err);
        }
        if (person) {
            notes.addToSet(req.params.note); // adds note
            user.save(function(err) {
                if (err) {
                    return next(err);
                }
            });
        }
    });
});

router.post('/edit', (req, res) => {
    var user = req.username;

Account.findOne({ 'username': user }, function (err, person) {
    if (err) {
        return next(err);
    }
    if (person) {
        if ((foundIndex = notes.indexOf(req.params.note)) != -1)
            notes[foundIndex] = req.params.note; // change note if found
        user.save(function(err) {
            if (err) {
                return next(err);
            }
        });
    }
});
});

router.post('/delete', (req, res) => {
    var user = req.username;

    Account.findOne({ 'username': user }, function (err, person) {
        if (err) {
            return next(err);
        }
        if (person) {
            if ((foundIndex = notes.indexOf(req.params.note)) != -1)
                notes.splice(foundIndex, 1); // remove note if found
            user.save(function(err) {
                if (err) {
                    return next(err);
                }
            });
        }
    });
});

module.exports = router;
