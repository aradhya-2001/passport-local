const router = require("express").Router();
const connection = require("../config/db");
const generatePassword = require("../lib/passwordUtils").genPassword;
const passport = require("../config/passport");
const isAuth = require("./auth").isAuth;

const model = connection.models.User; /* if made 2 collections like User1 and User2 then console.log(connection.models) = {User1: Model { User1 }, User2: Model { User2 } } */

router.post("/login",passport.authenticate("local", { // passport.authenticate() calls the verifyCallback() func
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);
/* long version of above line:- 
router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login-failure");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log(req.user);

      return res.redirect("/login-success");
    });
  })(req, res, next);
}); */

router.post("/register", (req, res, next) => {
  const saltHash = generatePassword(req.body.pw);
  const newUser = new model({
    username: req.body.usernm,
    hash: saltHash.hash,
    salt: saltHash.salt,
  });
  newUser.save().then((xyz) => { // console.log(xyz) logs the data just saved in our db
    res.redirect("/login");
  });
  //console.log(req.user);
});

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="usernm">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="/register">\
                    Enter Username:<br><input type="text" name="usernm">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/protected-route", isAuth, (req, res) => {
  res.send(
    '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/protected-route");
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
