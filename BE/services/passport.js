const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./../model/userModel')
const secret = require('./../secret')




passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

passport.use(
  new GoogleStrategy({
    clientID: secret.googleClientID,
    clientSecret: secret.googleClientSecret,
    callbackURL: '/auth/google/callback', 
  }, (accessToken,refeshToken,profile, done) => {
    // var check = profile.emails[0].value.indexOf('@student.tdtu.edu.vn');
    // if(check == -1){
    //   console.log('Không tồn tại chuỗi' );
    //   return done(null, false);
    // }
    if (profile.id) {
      User.findOne({googleId: profile.id})
        .then((existingUser) => {
          if (existingUser) {
            const abc ='';
            // If have an user, it will direct to dec
            done(null, existingUser);
            // done (null, abc)
          } else {
            new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.name.familyName + ' ' + profile.name.givenName,
              role: 'student',
              image: profile._json.picture,
              class: 'none',
              falculty: 'none',
            })
              .save()
              .then(user => {
                done(null, user)
              }).catch(error => done(error, false, { message: 'Error saving user' }));
          }
        })
        .catch(error => done(error, false, { message: 'Error finding user' }));
    }
  })
);