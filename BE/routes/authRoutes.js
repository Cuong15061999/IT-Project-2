var express = require('express');
var router = express.Router();
var authServices = require('../services/authServices');

/* GET home page. */
const authMiddleware = require('../services/middlewares/authMiddlewares');
const isAuth = authMiddleware.isAuth;

router.get('/', isAuth, (req, res) => {
  res.render('index', { title: 'LOGIN PAGE'});
});

router.post ('/login', authServices.login);
router.post ('/register', authServices.register);
router.post('/refresh', authServices.refreshToken);

module.exports = router;