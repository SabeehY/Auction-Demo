import passport from 'passport';
import User from 'models/User';

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default function login(req) {
  return new Promise((resolve, reject) => {
    const userData = {
      username: req.body.username,
      company: req.body.company,
      email: req.body.email,
      phone: req.body.phone
    };
    const newUser = new User(userData);
    User.register(
      newUser,
      '123456', // <--- Default password for each user
      (err) => {
        if (err) return reject(err);
        req.login(newUser, {session: true}, (err) => {
          if (err) return reject(err);
          resolve(newUser);
        });
      }
    );
  });
}
