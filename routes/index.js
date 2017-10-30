const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();


router.get('/', (req, res) => {
    Account.find({}, function (err, people) {
        if (err) return handleError(err);

        // for (person in peopleArray) {
        //     console.log(peopleArray[person].username);
        //     // people.push(peopleArray[person]);
        // }
        res.render('index', {
            user   : req.user,
            people : people
        });
    });


    // res.render('index', { user : req.user });
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
    var user  = req.user;
    var notes = user.notes;
    var note  = req.body.text;
    console.log(note);

    Account.findOne({ 'username': user.username }, function (err, person) {
        if (err) return handleError(err);
        if (person) {
            notes.push(note); // adds note
            console.log(user);
            user.save(function(err) {
                if (err) {
                    return next(err);
                }
            });
            res.redirect('/');
        }
    });
});

router.post('/edit', (req, res) => {
    Account.findOne({ 'username': user }, function (err, person) {
        if (err) return handleError(err);
        if (person) {
            if ((foundIndex = notes.indexOf(req.params.note)) != -1)
                notes[foundIndex] = req.body.text; // change note if found
            user.save(function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    });
});

router.post('/delete', (req, res) => {
    Account.findOne({ 'username': user }, function (err, person) {
        if (err) return handleError(err);
        if (person) {
            if ((foundIndex = notes.indexOf(req.params.note)) != -1)
                notes.splice(foundIndex, 1); // remove note if found
            user.save(function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    });
});

module.exports = router;
