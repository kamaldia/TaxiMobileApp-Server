import Jwt from 'jsonwebtoken';
// import {generateOTPWithTimer, sendOTPByEmail} from '../Functions/otp.js';

// export const requireOTP = (req, res, next) => {
//   const otp = generateOTPWithTimer();
// }

export const userAuth = (req, res, next) => {
  const token = req.cookies.jwt; //see how to make cookie strict
  const secret_key = process.env.JWT_SECRET;

  if (!token) {
    return res.redirect('/login');
  }

  Jwt.verify(token, secret_key, (err, decoded_token) => {
    if (err) {
      console.log(err.message);
      return res.redirect('/login')
    }
    // console.log('this is decoded token in jwt middleware', decoded_token);
    next();
  });
};

export const driverAuth = (req, res, next) => {
  const token = req.cookies.jwt; //must be strict
  const secret_key = process.env.DRIVER_JWT_SECRET;

  if (!token) {
    return res.redirect('/login');
  }

  Jwt.verify(token, secret_key, (err, decoded_token) => {
    if (err) {
      console.log(err.message);
      return res.redirect('/login')
    }
    // console.log('this is decoded token in jwt middleware', decoded_token);
    next();
  });
};


export const adminAuth = (req, res, next) => {
  const token = req.cookies.jwt; //see how to make cookie strict
  const admin_secret_key = process.env.ADMIN_JWT_SECRET;

  if (!token) {
    return res.redirect('/login');
  }

  Jwt.verify(token, admin_secret_key, (err, decoded_token) => {
    if (err) {
      console.log(err.message);
      return res.redirect('/login')
    }
    // console.log('this is decoded token in jwt middleware', decoded_token);
    next();
  });
};