const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const connection = require("./db");
const validatePassword=require("../lib/passwordUtils").validPassword


const model = connection.models.User; /* if made 2 collections like User1 and User2 then console.log(connection.models) = {User1: Model { User1 }, User2: Model { User2 } } */
// console.log(model)

const customFields = {
  usernameField: "usernm",
  passwordField: "pw",
};

function verifyCallback(username, password, done) {
  /* done is a function in which the results of authentication are passed */
  model.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false); /* done func is returned with params null (no errors) and false (no user is found) */
      } 

      const isValid = validatePassword(password, user.hash, user.salt);
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err));
}

const strategy = new localStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => done(null, user.id));
/* on successfull login, passport grabs the user data from UsersDb (it got saved in db after registering) and attaches its id with req.session 

before login, req.session=
Session {
  cookie: {
    path: '/',
    _expires: 2023-05-25T20:36:18.383Z,
    originalMaxAge: 60000,
    httpOnly: true
  }
}

after login, req.session=
Session {
  cookie: {
    path: '/',
    _expires: 2023-05-25T20:55:19.803Z,
    originalMaxAge: 60000,
    httpOnly: true       
  },
  passport: { user: "646fc64a10be6e6caee33f13" }  
} 

req.isAuthenticated() in background, checks if req.session.passport.user exists or not
*/


passport.deserializeUser((userId, done) => {
  model
    .findById(userId)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});
/* req.session is created by express-session but req.user is only created by passport. To populate req.user, deserializer picks the id from req.session.passport i.e passport: { user: '646fc64a10be6e6caee33f13' } and finds that id in Usersdb 

before login, req.user= undefined

after login, req.user=
{
  _id: new ObjectId("646fc64a10be6e6caee33f13"),
  username: 'ayu',
  hash: '81838fded98a92702dd29f2a9e87f74e94bb5a74e9ca337c32ed5af287358b7618c6cf6c6e9a101770e1aad85ad3de7ea00fbf9a6cea304fd7d7d984babfb004', 
  salt: 'd8c5c10acd8f0a940e98877c38587e7af4a5d4f2f99004f5a2e0a7977ae2f8b8',  __v: 0
} */


/* on logout:-
req.user=underfined
req.session=
Session {
  cookie: {
    path: '/',
    _expires: 2023-05-25T20:55:19.803Z,
    originalMaxAge: 60000,
    httpOnly: true       
  },
  passport: {}  
} */


module.exports=passport