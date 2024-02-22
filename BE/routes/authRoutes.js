var express = require('express');
var router = express.Router();
var authServices = require('../services/authServices');

router.get('/', (req, res) => {
  res.render('index', { title: 'LOGIN PAGE'});
});

router.post ('/google', authServices.login);

router.post ('/register', authServices.register);


module.exports = router;
