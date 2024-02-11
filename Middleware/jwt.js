import Jwt from 'jsonwebtoken';
import crypto from 'crypto';

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const secret_key = crypto.randomBytes(32).toString('hex');

  if (!token) {
    return res.redirect('/login');
  }

  Jwt.verify(token, secret_key, (err, decoded_token) => {
    if (err) {
      console.log(err.message);
      return res.redirect('/login')
    }
    console.log('this is decoded token in jwt middleware',decoded_token); //remove after dev
    next();
  });
};

export default requireAuth;