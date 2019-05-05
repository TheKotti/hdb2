const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { User } = require('../db/userDb.js');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async function(username, password, cb) {
      try {
        const user = await User.getUser(username, password);
        if (user.length === 0) {
          return cb(null, false, { message: 'Incorrect username or password' });
        }
        return cb(null, {
          User: user
        });
      } catch (err) {
        return cb(err);
      }
    }
  )
);

/* passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
    },
    function(jwtPayload, cb) {
      cb(null, {
        user: jwtPayload.user,
        dep: jwtPayload.dep,
        id: jwtPayload.id,
      });
    }
  )
); */

/* authorize = async (req, res, next) => {
  res.locals.user = req.user;

  // Editing, approving and hiding references requires
  // the user to be the portfolioManager for the reference.
  if (
    req.originalUrl === '/api/reference/edit' ||
    req.originalUrl === '/api/reference/approve' ||
    req.originalUrl === '/api/reference/hide'
  ) {
    let data = await User.checkUserRights(req, res.locals.user);
    if (Object.keys(data).length === 0) {
      res.locals.hasRights = false;
      next();
    } else {
      res.locals.hasRights = true;
      next();
    }
  } else {
    // Adding new references doesn't require any additional roles.
    // Just a valid JWT. When getting references, user department
    // is taken from the token and inserted into the query to
    // return the correct references.
    next();
  }
}; */
