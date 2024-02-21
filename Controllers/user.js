import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/user.js';
import Review from '../Models/review.js';
import Order from '../Models/order.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.status(200).json({ user });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const register = async (req, res) => {
  const { username, password, confirmed_password } = req.body;

  try {
    const password_requirements = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!password_requirements.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one letter and one number, and be at least 8 characters long' });
    }

    if (password !== confirmed_password ) {
      return res.status(400).json({ message: 'Passwords do not match!' });
    }

    const hashed_password  = await bcrypt.hash(password, 12);
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already in use!' });
    }

    if (existingUser?.email) {
      return res.status(400).json({ message: 'Email already in use!' });
    }

    if (existingUser?.phone) {
      return res.status(400).json({ message: 'Phone already in use!' });
    }
    
    const new_user = new User({ ...req.body, password: hashed_password });

    // console.log("this is file in user register:", req.file);

    if (req.file) {
      new_user.image = req.file.path;
    }
    
    const user = await new_user.save({ runValidators: true });

    res.status(201).json({ message: 'User created successfully!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const secret_key = process.env.JWT_SECRET;

    if (!secret_key) {
      throw new Error('JWT secret key not configured.');
    }
    const user = await User.findOne({ $or: [{username}, {email}] }); //$or is to find object where one of the properties in array matches ones in DB

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username, email or password!' });
    }

    const token = jwt.sign({ user_id: user._id }, secret_key, { expiresIn: '90d' });
    
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.RUNNING_ON !== 'localhost', //it will work on http when on localhost, otherwise it only works on https for security
      sameSite: 'strict', //strictly on same site to avoid fraud for users
      maxAge: 90 * 24 * 60 * 60 * 1000, //90 days expiry
    });

    res.status(200).json({ message: 'Logged in Successfully!'});

  } catch (error) {
    console.error(error);
    res.status(500).json(error.message)
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let updated_user = {...req.body}

    const user_to_update = await User.findById(id);
    // console.log("this is user to update in user update:", user_to_update);

    if (!user_to_update) {
      return res.status(404).json({ error: 'User not found!' });
    }

    if (updated_user.password) {
      const password_requirements = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
      if (!password_requirements.test(updated_user.password)) {
        return res.status(400).json({ message: 'Password must contain at least one letter and one number, and be at least 8 characters long' });
      }
      if (!await bcrypt.compare(updated_user.old_password, user_to_update.password)) {
        return res.status(400).json({ error: 'wrong password!' })
      }
      const hashed_password  = await bcrypt.hash(updated_user.password, 12);
      updated_user.password = hashed_password;
    }

    if (req.file) {
      updated_user.image = req.file.path;
    }

    if (updated_user.orders?.length > 0) {
      let found_all_orders_flag = true;
      let wrong_orders_input = [];
      const {orders} = updated_user;
  
      for (let i=0; i < orders?.length; i++) {
        let order = await Order.findById(orders[i]);
        if (!order) {
          wrong_orders_input.push(orders[i])
          found_all_orders_flag = false;
        }
      }
      if (!found_all_orders_flag) {
        return res.status(404).json({error: `orders with ids ${wrong_orders_input} not found`})
      }
    }

    if (updated_user.reviews?.length > 0) {
      let found_all_reviews_flag = true;
      let wrong_reviews_input = [];
      const {reviews} = updated_user;
  
      for (let i=0; i < reviews?.length; i++) {
        let review = await Review.findById(reviews[i]);
        if (!review) {
          wrong_reviews_input.push(reviews[i])
          found_all_reviews_flag = false;
        }
      }
      if (!found_all_reviews_flag) {
        return res.status(404).json({error: `reviews with ids ${wrong_reviews_input} not found`})
      }
    }

    const user = await User.findOneAndUpdate({ _id: id }, updated_user, { runValidators: true });

    if (!user) {
      return res.status(404).json({ error: 'User not updated!' });
    }

    res.status(200).json({ message: 'User was updated successfully!', user });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const user = await User.deleteOne({_id: id});

    if (user.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.status(200).json({ message: 'User was deleted successfully!' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};