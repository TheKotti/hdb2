const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/', async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info,
        user: user,
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      // Also need user roles in token.. add later
      const token = jwt.sign(
        { user: user.User },'your_jwt_secret',
        {
          expiresIn: '2h',
        }
      );
      return res.json({ token });
    });
  })(req, res);
});

exports.router = router;
