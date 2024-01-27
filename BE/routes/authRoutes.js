var express = require('express');
var router = express.Router();
var authServices = require('../services/authServices');
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET home page. */
// const isAuth = authMiddleware.isAuth;

router.get('/', (req, res) => {
  res.render('index', { title: 'LOGIN PAGE'});
});

router.post ('/login', authServices.login);

router.post ('/register', authServices.register);

router.post('/refresh', authServices.refreshToken);

router.get(
  '/google-login',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);


router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);


module.exports = router;