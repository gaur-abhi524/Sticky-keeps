const router = require("express").Router();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const passport = require("passport");

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//  Function for resolving same username conflict

let generateUniqueAccountName = async (proposedName) => {
  const func=await User.findOne({username: proposedName},(err,account) => {
    if(!err){
      if (account) {
        proposedName += Math.floor((Math.random() * 100) + 1);
        return generateUniqueAccountName(proposedName);
      }
      return ;
    }
      else{
        console.log(err);
      }
    });
    return proposedName;
};

const successLoginUrl = "https://vigilant-joliot-b731fa.netlify.app//login/success";
const failureLoginUrl = "https://vigilant-joliot-b731fa.netlify.app//login/failure";

//   Google Login strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GCLIENT_ID,
      clientSecret: process.env.GCLIENT_SECRET,
      // callbackURL: "http://localhost:8080/api/auth/google/sticky-keeps",
      callbackURL: "https://sticky-keeps.herokuapp.com/api/auth/google/sticky-keeps",
    },
    async (accessToken, refreshToken, profile, done) => {
      let newname = await generateUniqueAccountName(profile.displayName);
      User.findOne({
        'googleId': profile.id 
      }, function(err, user) {
        console.log(profile);
          if (err) {
              return done(err);
          }
          if (!user) {
              user = new User({
                  email: profile.emails[0].value,
                  username: newname,
                  googleId: profile.id
              });
              user.save(function(err) {
                  if (err) console.log(err);
                  return done(err, user);
              });
          } else {
              return done(err, user);
          }
      });
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/sticky-keeps",
  passport.authenticate("google", {     
    failureRedirect: failureLoginUrl ,
  }),(req,res) => {
    // res.json(req.user);
    res.redirect(successLoginUrl);
  }
);

//Local strategy

//REGISTER
router.post("/register", async (req, res) => {
  const cors = {
    origin: "https://vigilant-joliot-b731fa.netlify.app/"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  Users = new User({ email: req.body.email, username: req.body.username });
  // console.log(req.body); 
  User.register(Users, req.body.password, (err, user) => {
    if (err) {
      return res.status(500).json({ success : false, message : err });
    } else {
      passport.authenticate("local")(req, res, () => {
        console.log(user);
        return res.status(200).json(user)
      });
    }
  });
});

//LOGIN

router.post('/login', function(req, res, next) {
  const cors = {
    origin: "https://vigilant-joliot-b731fa.netlify.app/"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.status(404).json({ success : false, message : info.message });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(user);
      return res.status(200).json(user);
    });
  })(req, res, next);
});

//LOGOUT

router.get('/logout', function (req, res){
  const cors = {
    origin: "https://vigilant-joliot-b731fa.netlify.app/"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  req.logOut();
  res.clearCookie('connect.sid');
  req.session.destroy(function (err) {
    res
        .status(200)
        .json({ success: true, message: 'User logged out successfully' })
  });
});

//Check if user is authenticated

const checkUserStatus = (req,res,next) => {
  if(req.isAuthenticated()){
    next();
  }else{
    res.status(401).send("You must login first");
  }
}

router.get("/user",checkUserStatus,(req,res) => {
  const cors = {
    origin: "https://vigilant-joliot-b731fa.netlify.app/"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  res.json(req.user)
});

module.exports = router;