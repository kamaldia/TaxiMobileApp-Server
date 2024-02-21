import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../Models/admin.js';

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Admin not found!' });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found!' });
    }

    res.status(200).json({ admin });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const register = async (req, res) => {
  const { username, password, confirmed_password, email } = req.body;
  console.log('all body info', req.body)
  try {
    const password_requirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!password_requirements.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol, and be at least 8 characters long' });
    }
    if (password !== confirmed_password ) {
      return res.status(400).json({ message: 'Passwords do not match!' });
    }
    const hashed_password  = await bcrypt.hash(password, 12);
    const existingAdmin = await Admin.findOne({ username });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already in use!' });
    }

    const admin = await Admin.create({
      username,
      password: hashed_password,
      email,
    }, { runValidators: true });

    res.status(201).json({ message: 'Admin created successfully!', admin });
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const secret_key = process.env.ADMIN_JWT_SECRET;
    if (!secret_key) {
      throw new Error('JWT secret key not configured.');
    }
    const admin = await Admin.findOne({ $or: [{username}, {email}] }); //$or is to find object where one of the properties in array matches ones in DB

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid username, email or password!' });
    }

    const token = jwt.sign({ admin_id: admin._id }, secret_key, { expiresIn: '1d' });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.RUNNING_ON !== 'localhost', //it will work on http when on localhost, otherwise it only works on https for security
      sameSite: 'strict', //strictly on same site to avoid fraud for users
      maxAge: 24 * 60 * 60 * 1000, //one day expiry
    });

    res.status(200).json({ message: 'Logged in Successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json(error.message)
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    let updated_admin = {...req.body};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Admin not found!' });
    }

    const admin_to_update = await Admin.findById(id);

    if (updated_admin.password) {
      const password_requirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      if (!password_requirements.test(updated_admin.password)) {
        return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol, and be at least 8 characters long' });
      }
      if (!await bcrypt.compare(updated_admin.old_password, admin_to_update.password)) {
        return res.status(400).json({ error: 'wrong password!' })
      }
      const hashed_password  = await bcrypt.hash(updated_admin.password, 12);
      updated_admin.password = hashed_password;
    }
    const admin = await Admin.findOneAndUpdate({ _id: id }, updated_admin, { runValidators: true });

    if (!admin) {
      return res.status(404).json({ error: 'couldnt update admin' });
    }

    res.status(200).json({ message: 'Admin was updated successfully!', admin });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Admin not found!' });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found!' });
    }

    res.status(200).json({ message: 'Admin was deleted successfully!' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};