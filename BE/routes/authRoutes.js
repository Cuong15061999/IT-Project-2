var express = require('express');
var router = express.Router();
var authServices = require('../services/authServices');
const passport = require('passport');

/* GET home page. */
const authMiddleware = require('../services/middlewares/authMiddlewares');
const isAuth = authMiddleware.isAuth;

router.get('/', isAuth, (req, res) => {
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


router.get('/google/callback',passport.authenticate('google',{
  failureRedirect : '/denied',
}),function(req, res){
  req.session.User = {
    id: req.user._id,
    fullname: req.user.name,
    role: req.user.role,
    image: req.user.image,
  }
  console.log.apply(req.session.User);
  res.redirect('/');
}
);
module.exports = router;