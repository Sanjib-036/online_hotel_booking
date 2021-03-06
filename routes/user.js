var express = require('express');
var router = express.Router();
var csrf = require('csurf');
const { body, validationResult } = require('express-validator');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/profile', isLoggedIn, function(req,res,next){
  res.render('profile');
});

router.get('/logout', isLoggedIn, function(req,res,next){
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req,res,next){
  next();
});

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('signInUp', {
    layout: false,
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length>0
  });
});

router.post(
  '/signup',
  body('email').isEmail().notEmpty(),
  body('password').notEmpty().length({min:4}),
  
  passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true,
  })
);


router.get('/signin', function(req,res,next){
  var messages = req.flash('error');
  res.render('signInUp',
  {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors:messages.length>0
  });
});

router.post(
  '/signin',
  passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true,
  })
);


module.exports = router;



function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
