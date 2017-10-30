const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();


router.get('/', (req, res) => {
    Account.find({}, function (err, people) {
        if (err) return console.log(err);

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
    // console.log(note);

    // Account.findOne({ 'username': user.username }, function (err, person) {
    //     if (err) return next(err);
    //     if (person) {
            notes.push(note); // adds note
            // console.log(user);
            user.save(function(err) {
                if (err) return console.log(err);
            });
            res.redirect('/');
    //     }
    // });
});

router.post('/edit', (req, res) => {
    var user  = req.user;
    var notes = user.notes;
    var i     = req.body.i;
    var note  = req.body.text;

    // Account.findOne({ 'username': user.username }, function (err, person) {
    //     if (err) return console.log(err);
    //     if (person) {
            notes.set(i, note); // change note with new value
            user.save(function(err) {
                if (err) return console.log(err);
            });
            res.redirect('/');
    //     }
    // });
});

router.post('/delete', (req, res) => {
    var user  = req.user;
    var notes = user.notes;
    var i     = req.body.i;
    var note  = req.body.text;

    // Account.findOne({ 'username': user.username }, function (err, person) {
    //     if (err) return console.log(err);
    //     if (person) {
            console.log(notes[i]);
            notes.splice(i, 1)
            // notes[i] = note; // change note if found
            // Account.update(
            //         { _id: 1, notes: no },
            //         { $set: { "notes.$" : 82 } }
            //     )
            console.log(notes[i]);
            console.log(notes);
            user.save(function(err) {
                if (err) return console.log(err);
            });
            res.redirect('/');
    //     }
    // });
});

module.exports = router;
